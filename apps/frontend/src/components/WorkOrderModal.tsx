// components/WorkOrderModal.tsx
import React, { useState } from 'react';
import { 
  Wrench, 
  Download, 
  X, 
  FileText, 
  CheckSquare, 
  Layers, 
  Activity, 
  History, 
  Building2, 
  MapPin, 
  Cpu, 
  CheckCircle2 
} from 'lucide-react';
import { WorkOrder, WOStatus } from '../types/workOrder';

interface WorkOrderModalProps {
  workOrder: WorkOrder;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (newStatus: WOStatus) => void;
  onToggleTaskStep: (stepId: string) => void;
  onSave: (updated: Partial<WorkOrder>) => void;
  onExportPdf: () => void;
}

export const WorkOrderModal: React.FC<WorkOrderModalProps> = ({
  workOrder,
  isOpen,
  onClose,
  onUpdateStatus,
  onToggleTaskStep,
  onSave,
  onExportPdf
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'general' | 'procedure' | 'parts' | 'closure' | 'audit'>('general');
  const [formData, setFormData] = useState({
    title: workOrder.title,
    priority: workOrder.priority,
    category: workOrder.category,
    dueDate: workOrder.dueDate,
    buildingName: workOrder.buildingName,
    floorZone: workOrder.floorZone,
    assetName: workOrder.assetName
  });

  const statuses: { key: WOStatus; label: string; stepNum: number }[] = [
    { key: 'OPEN', label: '1. OUVERT', stepNum: 1 },
    { key: 'IN_PROGRESS', label: '2. EN COURS', stepNum: 2 },
    { key: 'ON_HOLD', label: '3. EN ATTENTE', stepNum: 3 },
    { key: 'RESOLVED', label: '4. RÉSOLU', stepNum: 4 },
    { key: 'CLOSED', label: '5. CLÔTURÉ', stepNum: 5 }
  ];

  // Calcul progression étapes (ex: 2/5 -> 40%)
  const totalSteps = workOrder.steps.length || 5;
  const completedSteps = workOrder.steps.filter(s => s.isCompleted).length || 2;
  const progressPercent = Math.round((completedSteps / totalSteps) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* 1. Modal Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-amber-500/20 border border-amber-500/40 rounded-xl text-amber-400">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-mono font-bold">
                  {workOrder.woNumber}
                </span>
                <h2 className="text-sm font-black text-white uppercase tracking-wide">
                  PROCÉDURE & MODIFICATION DE TICKET
                </h2>
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-mono">
                  {workOrder.priority}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-1">
                {workOrder.buildingName} • {workOrder.floorZone} • {workOrder.assetName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={onExportPdf}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold font-mono flex items-center gap-1.5 border border-slate-700 transition"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>PDF</span>
            </button>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 2. Lifecycle Status Pipeline & Progress Tracker */}
        <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Status Stepper */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-mono text-slate-400 mr-1 font-bold">STATUT:</span>
            {statuses.map((s) => {
              const isActive = workOrder.status === s.key;
              return (
                <button
                  key={s.key}
                  onClick={() => onUpdateStatus(s.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition ${
                    isActive 
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20' 
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {s.label}
                </button>
              );
            })}
          </div>

          {/* Procedure Progress Indicator */}
          <div className="bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 flex items-center gap-3">
            <div>
              <div className="text-[9px] uppercase font-mono text-slate-400">PROGRESSION PROCÉDURE</div>
              <div className="text-xs font-mono font-bold text-amber-400">
                {completedSteps}/{totalSteps} étapes ({progressPercent}%)
              </div>
            </div>
            <div className="w-20 bg-slate-800 h-2 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* 3. Tab Bar Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950 px-4 gap-4 text-xs font-mono font-bold">
          <button
            onClick={() => setActiveTab('general')}
            className={`py-3 border-b-2 flex items-center gap-1.5 ${
              activeTab === 'general' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>1. Général</span>
          </button>
          <button
            onClick={() => setActiveTab('procedure')}
            className={`py-3 border-b-2 flex items-center gap-1.5 ${
              activeTab === 'procedure' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>2. Procédure ({completedSteps}/{totalSteps})</span>
          </button>
          <button
            onClick={() => setActiveTab('parts')}
            className={`py-3 border-b-2 flex items-center gap-1.5 ${
              activeTab === 'parts' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>3. Pièces ({workOrder.spareParts.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('closure')}
            className={`py-3 border-b-2 flex items-center gap-1.5 ${
              activeTab === 'closure' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>4. Clôture</span>
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`py-3 border-b-2 flex items-center gap-1.5 ${
              activeTab === 'audit' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>5. Audit</span>
          </button>
        </div>

        {/* 4. Tab Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-grow">
          {activeTab === 'general' && (
            <div className="space-y-4">
              {/* Short Description */}
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">
                  Titre du Ticket / Description Courte *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Remplacement garniture mécanique pompe #2"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-xs focus:border-amber-500 outline-none"
                />
              </div>

              {/* 3 Columns Form Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">Niveau de Priorité</label>
                  <select 
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-xs"
                  >
                    <option value="LOW">Faible (Low)</option>
                    <option value="MEDIUM">Moyenne (Medium)</option>
                    <option value="HIGH">Haute (High)</option>
                    <option value="CRITICAL">Critique (Urgent)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">Catégorie GMAO</label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-xs"
                  >
                    <option value="PREVENTIVE">Maintenance Préventive (PM)</option>
                    <option value="CORRECTIVE">Maintenance Corrective (Curatif)</option>
                    <option value="INSPECTION">Visite Réglementaire & Sécurité</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">Échéance SLA Cible</label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-xs"
                  />
                </div>
              </div>

              {/* Location & Asset Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">Bâtiment / Site</label>
                  <input
                    type="text"
                    value={formData.buildingName}
                    disabled
                    className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-slate-400 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">Étage / Zone</label>
                  <input
                    type="text"
                    value={formData.floorZone}
                    disabled
                    className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-slate-400 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">Équipement Technique</label>
                  <input
                    type="text"
                    value={formData.assetName}
                    disabled
                    className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-cyan-400 font-mono text-xs font-bold"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'procedure' && (
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold text-slate-300 uppercase">
                Checklist d'intervention technique
              </h4>
              <div className="space-y-2">
                {workOrder.steps.map((step) => (
                  <div 
                    key={step.id}
                    onClick={() => onToggleTaskStep(step.id)}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                      step.isCompleted ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded flex items-center justify-center border ${
                        step.isCompleted ? 'bg-emerald-500 border-emerald-400 text-slate-950' : 'border-slate-700'
                      }`}>
                        {step.isCompleted && <CheckCircle2 className="w-4 h-4" />}
                      </div>
                      <span className="text-xs font-mono">{step.title}</span>
                    </div>
                    {step.completedAt && (
                      <span className="text-[10px] text-slate-500 font-mono">Fait à {step.completedAt}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 5. Footer Actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-500">
            Traçabilité ISO 55001 & GMAO Enterprise Active
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold font-mono transition"
            >
              Annuler
            </button>
            <button
              onClick={() => onSave(formData)}
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold font-mono shadow-lg shadow-amber-500/20 transition cursor-pointer"
            >
              Enregistrer les Modifications
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
