const { z } = require('zod');

const createAssetSchema = z.object({
  name: z.string().min(1, 'Nom requis').max(200),
  category: z.string().optional(),
  type: z.string().optional(),
  criticality: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).default('MEDIUM'),
  status: z.enum(['ACTIVE', 'INACTIVE', 'MAINTENANCE', 'DECOMMISSIONED']).default('ACTIVE'),
  serialNumber: z.string().max(100).optional(),
  model: z.string().max(100).optional(),
  manufacturer: z.string().max(100).optional(),
  location: z.string().max(255).optional(),
  spaceId: z.string().uuid().optional().nullable(),
  buildingId: z.string().uuid().optional().nullable(),
  installationDate: z.string().datetime().optional().nullable(),
  warrantyExpiry: z.string().datetime().optional().nullable(),
  purchaseCost: z.number().nonnegative().optional().nullable(),
  metadata: z.record(z.any()).optional()
});

const updateAssetSchema = createAssetSchema.partial();

module.exports = {
  createAssetSchema,
  updateAssetSchema
};
