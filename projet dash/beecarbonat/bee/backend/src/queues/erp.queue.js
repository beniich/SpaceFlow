const { Queue } = require('bullmq');
const { connection } = require('../config/redis');

const erpQueue = new Queue('erp-sync', { connection });

async function addERPSyncJob(jobData) {
  return await erpQueue.add('sync', jobData, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000
    }
  });
}

module.exports = {
  erpQueue,
  addERPSyncJob
};
