const app = require('../backend/src/server.js');

// Point d'entrée pour les environnements Serverless (Vercel)
// Vercel exécutera l'application Express en tant que Serverless Function.
module.exports = app;
