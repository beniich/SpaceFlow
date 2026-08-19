const { Worker } = require('bullmq');
const { connection } = require('../config/redis');

// Worker pour traiter les synchronisations ERP asynchrones
const erpWorker = new Worker('erp-sync', async (job) => {
  console.log(`Processing ERP sync job ${job.id} for connection:`, job.data.connectionId);
  
  // Implémentation factice pour la résilience
  // Normalement, appeler erpService.executeSync(job.data)
  
  return { success: true, processed: 0 };
}, { connection });

erpWorker.on('completed', (job) => {
  console.log(`ERP sync job ${job.id} completed!`);
});

erpWorker.on('failed', (job, err) => {
  console.error(`ERP sync job ${job.id} failed with error:`, err);
});

module.exports = erpWorker;
