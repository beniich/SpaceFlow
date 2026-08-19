const { Worker } = require('bullmq');
const { connection } = require('../config/redis');
const bimService = require('../integrations/bim/bim.service');

// Worker pour traiter le parsing des fichiers IFC
const bimWorker = new Worker('bim-processing', async (job) => {
  const { buildingId, tenantId, fileKey, originalName } = job.data;
  console.log(`Processing BIM job ${job.id} for file:`, originalName);
  
  // Dans un vrai environnement S3, on téléchargerait le fichier depuis S3 avec s3Config.getObject
  // Pour le POC, on va supposer que bimService s'en charge, mais ici nous simulons ou appelons le service
  
  // TODO: Implémenter le vrai stream depuis S3 dans ifcParser
  // await bimService.processIFCFromS3(buildingId, tenantId, fileKey, originalName);
  
  return { success: true, processed: originalName };
}, { connection });

bimWorker.on('completed', (job) => {
  console.log(`BIM job ${job.id} completed!`);
});

bimWorker.on('failed', (job, err) => {
  console.error(`BIM job ${job.id} failed with error:`, err);
});

module.exports = bimWorker;
