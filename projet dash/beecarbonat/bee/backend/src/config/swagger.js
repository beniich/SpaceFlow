const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'CAFM Pro API',
      version: '2.1.0',
      description: 'API REST pour la plateforme CAFM (Computer-Aided Facility Management). Authentification JWT requise.',
      contact: {
        name: 'Équipe CAFM Pro',
        email: 'dev@cafm.com',
        url: 'https://cafm.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      { url: 'http://localhost:5000', description: 'Développement local' },
      { url: 'https://api.cafm.app', description: 'Production' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT obtenu via POST /api/auth/login'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            email: { type: 'string', format: 'email' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            role: {
              type: 'string',
              enum: ['OWNER', 'ADMIN', 'MANAGER', 'TECHNICIAN', 'VIEWER']
            },
            isActive: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'admin@cafm.com' },
            password: { type: 'string', format: 'password', minLength: 8, example: 'admin123' }
          }
        },
        LoginResponse: {
          type: 'object',
          properties: {
            user: { $ref: '#/components/schemas/User' },
            token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
          }
        },
        Asset: {
          type: 'object',
          required: ['name', 'category', 'serialNumber', 'purchaseDate', 'buildingId'],
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string', example: 'HVAC Zone A' },
            category: {
              type: 'string',
              enum: ['HVAC', 'Electrical', 'Furniture', 'IT', 'Security', 'Plumbing', 'Lighting']
            },
            serialNumber: { type: 'string' },
            manufacturer: { type: 'string', nullable: true },
            model: { type: 'string', nullable: true },
            purchaseDate: { type: 'string', format: 'date' },
            purchasePrice: { type: 'number', minimum: 0 },
            warrantyEnd: { type: 'string', format: 'date', nullable: true },
            location: { type: 'string' },
            status: {
              type: 'string',
              enum: ['OPERATIONAL', 'MAINTENANCE', 'BREAKDOWN', 'RETIRED'],
              default: 'OPERATIONAL'
            },
            healthScore: { type: 'integer', minimum: 0, maximum: 100 },
            buildingId: { type: 'string', format: 'uuid' }
          }
        },
        AssetInput: {
          type: 'object',
          required: ['name', 'category', 'serialNumber', 'purchaseDate', 'buildingId'],
          properties: {
            name: { type: 'string', minLength: 1 },
            category: { type: 'string' },
            serialNumber: { type: 'string' },
            manufacturer: { type: 'string' },
            model: { type: 'string' },
            purchaseDate: { type: 'string', format: 'date' },
            purchasePrice: { type: 'number', minimum: 0 },
            warrantyEnd: { type: 'string', format: 'date' },
            location: { type: 'string' },
            status: {
              type: 'string',
              enum: ['OPERATIONAL', 'MAINTENANCE', 'BREAKDOWN', 'RETIRED']
            },
            buildingId: { type: 'string', format: 'uuid' }
          }
        },
        WorkOrder: {
          type: 'object',
          required: ['title', 'type', 'priority', 'assetId', 'scheduledAt'],
          properties: {
            id: { type: 'string', format: 'uuid' },
            title: { type: 'string' },
            description: { type: 'string', nullable: true },
            type: {
              type: 'string',
              enum: ['PREVENTIVE', 'PREDICTIVE', 'CORRECTIVE']
            },
            priority: {
              type: 'string',
              enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
            },
            status: {
              type: 'string',
              enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
              default: 'PENDING'
            },
            estimatedCost: { type: 'number' },
            actualCost: { type: 'number', nullable: true },
            scheduledAt: { type: 'string', format: 'date-time' },
            completedAt: { type: 'string', format: 'date-time', nullable: true },
            assetId: { type: 'string', format: 'uuid' },
            assignedToId: { type: 'string', format: 'uuid', nullable: true }
          }
        },
        WorkOrderInput: {
          type: 'object',
          required: ['title', 'type', 'priority', 'assetId', 'scheduledAt'],
          properties: {
            title: { type: 'string', minLength: 1 },
            description: { type: 'string' },
            type: { type: 'string', enum: ['PREVENTIVE', 'PREDICTIVE', 'CORRECTIVE'] },
            priority: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] },
            status: { type: 'string', enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] },
            estimatedCost: { type: 'number', minimum: 0 },
            scheduledAt: { type: 'string', format: 'date-time' },
            assetId: { type: 'string', format: 'uuid' },
            assignedToId: { type: 'string', format: 'uuid' }
          }
        },
        Contact: {
          type: 'object',
          required: ['firstName', 'lastName'],
          properties: {
            id: { type: 'string', format: 'uuid' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            email: { type: 'string', format: 'email', nullable: true },
            phone: { type: 'string', nullable: true },
            company: { type: 'string', nullable: true },
            jobTitle: { type: 'string', nullable: true },
            type: {
              type: 'string',
              enum: ['LEAD', 'PROSPECT', 'CUSTOMER', 'PARTNER', 'VENDOR']
            },
            source: { type: 'string', nullable: true },
            status: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        ContactInput: {
          type: 'object',
          required: ['firstName', 'lastName'],
          properties: {
            firstName: { type: 'string', minLength: 1 },
            lastName: { type: 'string', minLength: 1 },
            email: { type: 'string', format: 'email' },
            phone: { type: 'string' },
            company: { type: 'string' },
            jobTitle: { type: 'string' },
            type: { type: 'string', enum: ['LEAD', 'PROSPECT', 'CUSTOMER', 'PARTNER', 'VENDOR'] },
            source: { type: 'string' },
            city: { type: 'string' },
            country: { type: 'string' }
          }
        },
        Deal: {
          type: 'object',
          required: ['name', 'amount', 'contactId', 'expectedCloseDate'],
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            amount: { type: 'number', minimum: 0 },
            currency: { type: 'string', default: 'EUR' },
            status: {
              type: 'string',
              enum: ['PIPELINE', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST']
            },
            probability: { type: 'integer', minimum: 0, maximum: 100 },
            expectedCloseDate: { type: 'string', format: 'date' },
            closedAt: { type: 'string', format: 'date-time', nullable: true },
            contactId: { type: 'string', format: 'uuid' }
          }
        },
        DealInput: {
          type: 'object',
          required: ['name', 'amount', 'contactId', 'expectedCloseDate'],
          properties: {
            name: { type: 'string', minLength: 1 },
            amount: { type: 'number', minimum: 0 },
            currency: { type: 'string' },
            status: { type: 'string', enum: ['PIPELINE', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST'] },
            expectedCloseDate: { type: 'string', format: 'date' },
            contactId: { type: 'string', format: 'uuid' },
            description: { type: 'string' },
            source: { type: 'string' }
          }
        },
        Building: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            address: { type: 'string' },
            city: { type: 'string' },
            country: { type: 'string' },
            totalArea: { type: 'number', description: 'Surface en m²' },
            floors: { type: 'integer' },
            yearBuilt: { type: 'integer' }
          }
        },
        Pagination: {
          type: 'object',
          properties: {
            total: { type: 'integer', example: 142 },
            page: { type: 'integer', example: 1 },
            limit: { type: 'integer', example: 25 },
            pages: { type: 'integer', example: 6 }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Ressource non trouvée' },
            details: { type: 'object', nullable: true }
          }
        },
        ValidationError: {
          type: 'object',
          properties: {
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  type: { type: 'string', example: 'field' },
                  value: { type: 'string', example: 'invalid-email' },
                  msg: { type: 'string', example: 'Email invalide' },
                  path: { type: 'string', example: 'email' },
                  location: { type: 'string', example: 'body' }
                }
              }
            }
          }
        }
      },
      responses: {
        Unauthorized: {
          description: 'Token manquant, invalide ou expiré',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
              example: { error: 'Token invalide' }
            }
          }
        },
        Forbidden: {
          description: 'Permissions insuffisantes pour cette opération',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' }
            }
          }
        },
        NotFound: {
          description: 'Ressource non trouvée',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' }
            }
          }
        },
        BadRequest: {
          description: 'Requête invalide',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' }
            }
          }
        },
        ValidationError: {
          description: 'Erreur de validation des données',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ValidationError' }
            }
          }
        },
        ServerError: {
          description: 'Erreur serveur interne',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' }
            }
          }
        }
      }
    },
    security: [{ bearerAuth: [] }],
    tags: [
      { name: 'Auth', description: 'Authentification et gestion de session' },
      { name: 'Dashboard', description: 'KPIs et analytiques temps réel' },
      { name: 'Assets', description: 'Gestion des actifs physiques' },
      { name: 'Work Orders', description: 'Ordres de travail et interventions' },
      { name: 'Contacts', description: 'CRM - Gestion des contacts' },
      { name: 'Deals', description: 'CRM - Pipeline commercial' },
      { name: 'CMMS', description: 'Gestion de maintenance (pièces, procédures)' },
      { name: 'Spaces', description: 'Espaces physiques et occupation' },
      { name: 'Buildings', description: 'Bâtiments et infrastructure' },
      { name: 'Leases', description: 'Baux et contrats de location' },
      { name: 'Notifications', description: 'Notifications temps réel (SSE)' },
      { name: 'AI', description: 'Assistant IA (GPT-4)' },
      { name: 'Analytics', description: 'Rapports et statistiques' }
    ]
  },
  apis: [
    './src/routes/*.js',
    './src/controllers/*.js'
  ]
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = swaggerSpec;
