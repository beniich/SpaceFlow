import { pgTable, text, timestamp, integer, boolean, numeric, jsonb } from 'drizzle-orm/pg-core';

export const workOrders = pgTable('cmms_work_orders', {
  id: text('id').primaryKey(),
  woNumber: text('wo_number').notNull().unique(), // e.g. "WO-2026-0842"
  title: text('title').notNull(),
  status: text('status').notNull().default('OPEN'),
  priority: text('priority').notNull().default('MEDIUM'),
  category: text('category').notNull().default('PREVENTIVE'),
  
  buildingId: text('building_id'),
  buildingName: text('building_name'),
  floorZone: text('floor_zone'),
  assetId: text('asset_id'),
  assetName: text('asset_name'),

  dueDate: timestamp('due_date'),
  completedStepsCount: integer('completed_steps_count').default(0),
  totalStepsCount: integer('total_steps_count').default(5),
  
  steps: jsonb('steps').$type<any[]>(),
  spareParts: jsonb('spare_parts').$type<any[]>(),
  auditLog: jsonb('audit_log').$type<any[]>(),
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
