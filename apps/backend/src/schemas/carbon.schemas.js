const { z } = require('zod');

const carbonEmissionSchema = z.object({
  scope: z.enum(['SCOPE_1', 'SCOPE_2', 'SCOPE_3']),
  category: z.string().min(1, 'Catégorie requise'),
  source: z.string().min(1, 'Source requise'),
  quantity: z.number().positive('La quantité doit être strictement positive'),
  unit: z.enum(['kWh', 'm3', 'kg', 'liters', 'km', 'tonnes']),
  emissionFactor: z.number().nonnegative('Le facteur d\'émission doit être positif ou nul'),
  periodStart: z.string().datetime(),
  periodEnd: z.string().datetime(),
  buildingId: z.string().uuid().optional().nullable(),
  metadata: z.record(z.any()).optional()
});

const calculateCarbonBatchSchema = z.object({
  emissions: z.array(carbonEmissionSchema).min(1, 'Au moins une émission doit être fournie')
});

module.exports = {
  carbonEmissionSchema,
  calculateCarbonBatchSchema
};
