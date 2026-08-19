/**
 * Queue BIM — Import de maquettes IFC
 * BullMQ + progression temps réel via Socket.IO
 */
const { Queue, Worker } = require('bullmq');
const prisma = require('../config/database');
const ifcParser = require('../integrations/bim/ifc.parser');

// ─── Config Redis ────────────────────────────────────────────────────────────
const redisConnection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || undefined,
};

// ─── Queue ───────────────────────────────────────────────────────────────────
const bimQueue = new Queue('bim-import', {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 2,
    backoff: { type: 'fixed', delay: 5000 },
    removeOnComplete: { count: 50 },
    removeOnFail: { count: 100 },
  },
});

// ─── Worker ──────────────────────────────────────────────────────────────────
const bimWorker = new Worker(
  'bim-import',
  async (job) => {
    const { jobId, tenantId, buildingId, fileBuffer, fileName } = job.data;

    // 1. Mark job as processing
    await prisma.bIMImportJob.update({
      where: { id: jobId },
      data: { status: 'PROCESSING', startedAt: new Date(), progress: 5 },
    });
    await job.updateProgress(5);

    // 2. Parse IFC file
    const parsed = await ifcParser.parseIFC(
      Buffer.from(fileBuffer),
      fileName
    );
    await job.updateProgress(40);

    // 3. Create BIMModel record
    const model = await prisma.bIMModel.create({
      data: {
        tenantId,
        buildingId,
        name: parsed.name,
        fileUrl: job.data.fileUrl || '',
        version: 1,
      },
    });
    await job.updateProgress(50);

    // 4. Batch insert BIMElements + BIMProperties
    const errors = [];
    let parsedCount = 0;
    const BATCH_SIZE = 20;

    for (let i = 0; i < parsed.elements.length; i += BATCH_SIZE) {
      const batch = parsed.elements.slice(i, i + BATCH_SIZE);

      await Promise.allSettled(
        batch.map(async (el) => {
          try {
            const element = await prisma.bIMElement.create({
              data: {
                modelId: model.id,
                ifcId: el.ifcId,
                name: el.name,
                type: el.type,
                spaceId: el.spaceId,
                properties: {
                  create: el.properties.map((p) => ({
                    set: p.set,
                    name: p.name,
                    value: p.value,
                  })),
                },
              },
            });
            parsedCount++;
            return element;
          } catch (err) {
            errors.push({ element: el.ifcId, error: err.message });
          }
        })
      );

      // Update progress (50% → 95%)
      const progress = 50 + Math.round((i / parsed.elements.length) * 45);
      await prisma.bIMImportJob.update({
        where: { id: jobId },
        data: { progress, parsedElements: parsedCount },
      });
      await job.updateProgress(progress);
    }

    // 5. Finalize
    await prisma.bIMImportJob.update({
      where: { id: jobId },
      data: {
        status: errors.length > 0 && parsedCount === 0 ? 'FAILED' : 'DONE',
        progress: 100,
        totalElements: parsed.elements.length,
        parsedElements: parsedCount,
        modelId: model.id,
        errors: errors.length > 0 ? errors : null,
        completedAt: new Date(),
      },
    });
    await job.updateProgress(100);

    return { modelId: model.id, total: parsed.elements.length, parsed: parsedCount, errors };
  },
  {
    connection: redisConnection,
    concurrency: 2, // Max 2 imports IFC simultanés (CPU-bound)
  }
);

bimWorker.on('completed', (job, result) => {
  console.log(`[BIM] Import ${job.id} complete — ${result.parsed}/${result.total} elements`);
});

bimWorker.on('failed', (job, err) => {
  console.error(`[BIM] Import ${job?.id} failed: ${err.message}`);
  // Mark job as FAILED in DB
  if (job?.data?.jobId) {
    prisma.bIMImportJob
      .update({
        where: { id: job.data.jobId },
        data: { status: 'FAILED', errors: [{ fatal: err.message }] },
      })
      .catch(() => {});
  }
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Enqueue un import IFC
 * Crée d'abord le BIMImportJob en base, puis envoie dans la queue
 */
async function enqueueBIMImport({ tenantId, buildingId, fileBuffer, fileUrl, fileName, fileSize }) {
  // Create tracking record
  const importJob = await prisma.bIMImportJob.create({
    data: {
      tenantId,
      buildingId,
      fileName,
      fileSize,
      fileUrl,
      status: 'PENDING',
    },
  });

  // Enqueue worker job
  await bimQueue.add(
    'ifc-parse',
    { jobId: importJob.id, tenantId, buildingId, fileBuffer, fileUrl, fileName },
    { jobId: `bim-${importJob.id}` }
  );

  return importJob;
}

module.exports = { bimQueue, bimWorker, enqueueBIMImport };
