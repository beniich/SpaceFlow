// types/workOrder.ts

export type WOStatus = 'OPEN' | 'IN_PROGRESS' | 'ON_HOLD' | 'RESOLVED' | 'CLOSED';
export type WOPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type WOCategory = 'PREVENTIVE' | 'CORRECTIVE' | 'INSPECTION' | 'REGULATORY' | 'EMERGENCY';

export interface TaskStep {
  id: string;
  order: number;
  title: string;
  description?: string;
  isCompleted: boolean;
  completedAt?: string;
  completedBy?: string;
  notes?: string;
}

export interface SparePartLine {
  id: string;
  partId: string;
  partName: string;
  partReference: string;
  quantityRequested: number;
  unitCost: number;
  isIssued: boolean;
}

export interface PMSchedule {
  id: string;
  code: string;
  title: string;
  frequency: 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'ANNUAL';
  isActive: boolean;
  targetAssetId: string;
  targetAssetName: string;
  nextDueDate: string;
  standardProcedureSteps: string[];
}

export interface WorkOrder {
  id: string;
  woNumber: string; // Ex: "WO-2026-0842"
  title: string;
  description: string;
  status: WOStatus;
  priority: WOPriority;
  category: WOCategory;
  
  // Localisation & Équipement
  buildingId: string;
  buildingName: string;
  floorZone: string;
  assetId: string;
  assetName: string;

  // SLA & Dates
  createdAt: string;
  dueDate: string;
  startedAt?: string;
  completedAt?: string;

  // Procédure technique
  steps: TaskStep[];
  spareParts: SparePartLine[];

  // Clôture & Signature
  closureNotes?: string;
  technicianSignature?: string;
  resolutionTimeMinutes?: number;

  // Audit trail
  auditLog: {
    timestamp: string;
    userId: string;
    action: string;
    details: string;
  }[];
}
