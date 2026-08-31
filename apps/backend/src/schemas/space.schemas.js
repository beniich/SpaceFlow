const { z } = require('zod');

const createSpaceSchema = z.object({
  name: z.string().min(1, 'Nom du local requis').max(150),
  code: z.string().max(50).optional(),
  type: z.enum(['OFFICE', 'MEETING_ROOM', 'OPEN_SPACE', 'TECHNICAL_ROOM', 'WAREHOUSE', 'COMMON_AREA', 'RESTROOM']).default('OFFICE'),
  floor: z.number().int().optional(),
  surfaceArea: z.number().positive('La surface doit être positive').optional(),
  capacity: z.number().int().nonnegative().optional(),
  buildingId: z.string().uuid('ID de bâtiment invalide'),
  parentId: z.string().uuid().optional().nullable()
});

const updateSpaceSchema = createSpaceSchema.partial();

module.exports = {
  createSpaceSchema,
  updateSpaceSchema
};
