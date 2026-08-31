const { z } = require('zod');

const createWorkOrderSchema = z.object({
  title: z.string().min(1, 'Titre requis').max(200),
  description: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT', 'CRITICAL']).default('MEDIUM'),
  status: z.enum(['DRAFT', 'OPEN', 'ASSIGNED', 'IN_PROGRESS', 'PENDING_APPROVAL', 'COMPLETED', 'CLOSED', 'CANCELLED']).default('OPEN'),
  type: z.enum(['PREVENTIVE', 'CORRECTIVE', 'INSPECTION', 'EMERGENCY']).default('CORRECTIVE'),
  assetId: z.string().uuid().optional().nullable(),
  spaceId: z.string().uuid().optional().nullable(),
  assignedToId: z.string().uuid().optional().nullable(),
  dueDate: z.string().datetime().optional().nullable(),
  estimatedHours: z.number().nonnegative().optional().nullable(),
  checklist: z.array(z.object({
    task: z.string().min(1),
    completed: z.boolean().default(false)
  })).optional()
});

const updateWorkOrderSchema = createWorkOrderSchema.partial();

const changeWorkOrderStatusSchema = z.object({
  status: z.enum(['DRAFT', 'OPEN', 'ASSIGNED', 'IN_PROGRESS', 'PENDING_APPROVAL', 'COMPLETED', 'CLOSED', 'CANCELLED']),
  resolutionNotes: z.string().optional()
});

module.exports = {
  createWorkOrderSchema,
  updateWorkOrderSchema,
  changeWorkOrderStatusSchema
};
