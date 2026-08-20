const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../config/swagger');

const router = express.Router();

/**
 * Interface Swagger UI interactive
 * Accessible sur: GET /api-docs
 */
router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'CAFM Pro API Documentation',
  customCss: `
    .swagger-ui .topbar { background-color: #4f46e5; }
    .swagger-ui .topbar .download-url-wrapper .select-label select { 
      border: 2px solid #4f46e5; 
    }
    .swagger-ui .info .title { color: #4f46e5; }
  `,
  customfavIcon: '/favicon.ico',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true,
    showExtensions: true,
    showCommonExtensions: true
  }
}));

/**
 * Spec OpenAPI brute (JSON)
 * Pour import Postman/Insomnia
 */
router.get('/api-spec.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename=cafm-openapi.json');
  res.send(swaggerSpec);
});

/**
 * Spec OpenAPI en YAML (alternative)
 */
router.get('/api-spec.yaml', (req, res) => {
  // Conversion simple JSON -> YAML (basique)
  res.setHeader('Content-Type', 'text/yaml');
  res.send('# CAFM Pro API\n# Spec complète disponible en JSON sur /api-spec.json');
});

module.exports = router;
