const logger = {
  info: (message, meta) => {
    console.log(`[INFO] ${message}`, meta ? meta : '');
  },
  warn: (message, meta) => {
    console.warn(`[WARN] ${message}`, meta ? meta : '');
  },
  error: (message, meta) => {
    console.error(`[ERROR] ${message}`, meta ? meta : '');
  },
  debug: (message, meta) => {
    console.debug(`[DEBUG] ${message}`, meta ? meta : '');
  }
};

module.exports = { logger };
