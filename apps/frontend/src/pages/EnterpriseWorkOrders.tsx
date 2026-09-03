import React, { useState } from 'react';
import { WorkOrderRegistryView } from '../components/WorkOrderRegistryView';
import { WorkOrderModal } from '../components/WorkOrderModal';
import { WorkOrder, PMSchedule, WOStatus } from '../types/workOrder';

// Mock data matching the screenshot
const MOCK_PM_SCHEDULES: PMSchedule[] = [
  {
    id: 'pm-1',
    code: 'PM-HVAC-1',
    title: 'Monthly HVAC Insp.',
    frequency: 'MONTHLY',
    isActive: true,
    targetAssetId: 'a1',
    targetAssetName: 'HVAC',
    nextDueDate: '2026-09-10',
    standardProcedureSteps: []
  },
  {
    id: 'pm-2',
    code: 'PM-FIRE-1',
    title: 'Quarterly Fire Test',
    frequency: 'QUARTERLY',
    isActive: true,
    targetAssetId: 'a2',
    targetAssetName: 'Fire System',
    nextDueDate: '2026-10-01',
    standardProcedureSteps: []
  },
  {
    id: 'pm-3',
    code: 'PM-GEN-1',
    title: 'Weekly Generator Run',
    frequency: 'WEEKLY',
    isActive: true,
    targetAssetId: 'a3',
    targetAssetName: 'Generator',
    nextDueDate: '2026-09-07',
    standardProcedureSteps: []
  },
  {
    id: 'pm-4',
    code: 'PM-THERMO-1',
    title: 'Annual Thermography',
    frequency: 'ANNUAL',
    isActive: true,
    targetAssetId: 'a4',
    targetAssetName: 'Electrical Panels',
    nextDueDate: '2026-12-01',
    standardProcedureSteps: []
  }
];

const MOCK_WORK_ORDERS: WorkOrder[] = [
  {
    id: 'wo-1',
    woNumber: 'WO-2026-0842',
    title: 'Elevator Traction Harmonic Vibration Check',
    description: 'Check vibrations on main centrifugal chiller.',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    category: 'PREVENTIVE',
    buildingId: 'b1',
    buildingName: 'Spider Cybernetics Tower A',
    floorZone: 'Fl. 33 Penthouse',
    assetId: 'a1',
    assetName: 'Main Centrifugal Chiller Alpha #1',
    createdAt: '2026-09-01',
    dueDate: '2026-09-03',
    steps: [
      { id: 's1', order: 1, title: 'Consigner l\'équipement', isCompleted: true },
      { id: 's2', order: 2, title: 'Mesure des harmoniques', isCompleted: true },
      { id: 's3', order: 3, title: 'Remplacement des filtres', isCompleted: false },
      { id: 's4', order: 4, title: 'Vérification du fluide', isCompleted: false },
      { id: 's5', order: 5, title: 'Déconsignation et test', isCompleted: false }
    ],
    spareParts: [
      { id: 'p1', partId: 'pt1', partName: 'Filtre Haute Pression', partReference: 'FHP-01', quantityRequested: 2, unitCost: 45, isIssued: false },
      { id: 'p2', partId: 'pt2', partName: 'Graisse Lithium', partReference: 'GL-100', quantityRequested: 1, unitCost: 15, isIssued: true }
    ],
    auditLog: []
  },
  {
    id: 'wo-2',
    woNumber: 'WO-2026-0877',
    title: 'jlojgougouo',
    description: 'Test wo',
    status: 'OPEN',
    priority: 'HIGH',
    category: 'CORRECTIVE',
    buildingId: 'b1',
    buildingName: 'Spider Cybernetics Tower A',
    floorZone: 'Floor 1',
    assetId: 'a1',
    assetName: 'Main Centrifugal Chiller Alpha #1',
    createdAt: '2026-09-02',
    dueDate: '2026-09-05',
    steps: [],
    spareParts: [],
    auditLog: []
  }
];

export default function EnterpriseWorkOrders() {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(MOCK_WORK_ORDERS);
  const [selectedWO, setSelectedWO] = useState<WorkOrder | null>(null);

  const handleUpdateStatus = (newStatus: WOStatus) => {
    if (selectedWO) {
      const updated = { ...selectedWO, status: newStatus };
      setSelectedWO(updated);
      setWorkOrders(workOrders.map(wo => wo.id === selectedWO.id ? updated : wo));
    }
  };

  const handleToggleTaskStep = (stepId: string) => {
    if (selectedWO) {
      const updatedSteps = selectedWO.steps.map(s => 
        s.id === stepId ? { ...s, isCompleted: !s.isCompleted } : s
      );
      const updated = { ...selectedWO, steps: updatedSteps };
      setSelectedWO(updated);
      setWorkOrders(workOrders.map(wo => wo.id === selectedWO.id ? updated : wo));
    }
  };

  const handleSave = (updatedFields: Partial<WorkOrder>) => {
    if (selectedWO) {
      const updated = { ...selectedWO, ...updatedFields };
      setSelectedWO(null);
      setWorkOrders(workOrders.map(wo => wo.id === selectedWO.id ? updated : wo));
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-4 sm:p-6 text-slate-200 font-sans">
      <WorkOrderRegistryView
        workOrders={workOrders}
        pmSchedules={MOCK_PM_SCHEDULES}
        onSelectWO={(wo) => setSelectedWO(wo)}
        onCreateWO={() => console.log('Create WO')}
        onRefresh={() => console.log('Refresh')}
        indexedDbCount={workOrders.length}
      />

      {selectedWO && (
        <WorkOrderModal
          workOrder={selectedWO}
          isOpen={true}
          onClose={() => setSelectedWO(null)}
          onUpdateStatus={handleUpdateStatus}
          onToggleTaskStep={handleToggleTaskStep}
          onSave={handleSave}
          onExportPdf={() => console.log('Export PDF')}
        />
      )}
    </div>
  );
}
