const { Queue } = require('bullmq');
const { connection } = require('../config/redis');

const bimQueue = new Queue('bim-processing', { connection });

async function addBIMProcessJob(jobData) {
  return await bimQueue.add('process-ifc', jobData, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000
    }
  });
}

module.exports = {
  bimQueue,
  addBIMProcessJob
};
