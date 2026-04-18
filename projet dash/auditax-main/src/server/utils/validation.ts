import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const validate = (schema: z.ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation Failed',
        details: error.issues.map((e: any) => ({ path: e.path, message: e.message }))
      });
    }
    next(error);
  }
};

// --- SCHEMAS ---

export const IncidentSchema = z.object({
  title: z.string().min(5),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  nodeId: z.string().uuid().optional(),
});

export const TaskSchema = z.object({
  title: z.string().min(3),
  description: z.string(),
  assigneeId: z.string().uuid().optional(),
  dueDate: z.string().datetime().optional().transform(val => val ? new Date(val) : undefined),
});

export const NodeSchema = z.object({
  name: z.string().min(2),
  region: z.string(),
  type: z.enum(['VIRTUAL_MACHINE', 'DATABASE', 'KUBERNETES_CLUSTER', 'API_GATEWAY', 'FIREWALL']),
  ipAddress: z.string().optional(),
});

export const NodeStatusSchema = z.object({
  status: z.enum(['HEALTHY', 'DEGRADED', 'DOWN', 'MAINTENANCE']),
});

export const PolicySchema = z.object({
  title: z.string().min(5),
  framework: z.string(),
  content: z.string(),
});
