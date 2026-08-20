/**
 * Jest configuration for CAFM backend
 */
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/controllers/*.js',
    'src/middleware/*.js',
    '!src/controllers/bim.controller.js',
    '!src/controllers/digitaltwin.controller.js',
  ],
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  setupFilesAfterEnv: ['./src/__tests__/setup.js'],
  verbose: true,
  testTimeout: 15000,
};
