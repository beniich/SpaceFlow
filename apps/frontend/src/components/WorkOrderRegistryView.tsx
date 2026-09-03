// components/WorkOrderRegistryView.tsx
import React, { useState } from 'react';
import { 
  ClipboardList, 
  RotateCw, 
  LayoutGrid, 
  List, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  Database,
  FileText,
  Clock,
  Wrench
} from 'lucide-react';
import { WorkOrder, PMSchedule } from '../types/workOrder';

interface WorkOrderRegistryProps {
  workOrders: WorkOrder[];
  pmSchedules: PMSchedule[];
  onSelectWO: (wo: WorkOrder) => void;
  onCreateWO: () => void;
  onRefresh: () => void;
  indexedDbCount: number;
}

export const WorkOrderRegistryView: React.FC<WorkOrderRegistryProps> = ({
  workOrders,
  pmSchedules,
  onSelectWO,
  onCreateWO,
  onRefresh,
  indexedDbCount
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const getStatusBadge = (status: WorkOrder['status']) => {
    switch (status) {
      case 'OPEN':
        return <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">OPEN</span>;
      case 'IN_PROGRESS':
        return <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">IN PROGRESS</span>;
      case 'RESOLVED':
        return <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">RESOLVED</span>;
      default:
        return <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-slate-700 text-slate-300">{status}</span>;
    }
  };

  const getPriorityBadge = (priority: WorkOrder['priority']) => {
    switch (priority) {
      case 'CRITICAL':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">CRITICAL</span>;
      case 'HIGH':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">HIGH</span>;
      case 'MEDIUM':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">MEDIUM</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-500/20 text-slate-400">LOW</span>;
    }
  };

  return (
    <div className="space-y-4 font-sans">
      {/* 1. Top Bar Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-start gap-3.5">
          <div className="p-3 bg-amber-500 rounded-xl text-slate-950 font-bold shadow-md shadow-amber-500/20">
            <ClipboardList className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-base font-black tracking-wider uppercase text-white">
                ENTERPRISE WORK ORDER MANAGEMENT
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">
                MAXIMO CMMS ENGINE
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <Database className="w-3 h-3" /> IndexedDB Sync ({indexedDbCount} OTs)
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Work Tasks, Preventative Maintenance (PM) Generation, and Resource Balancing
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          <button 
            onClick={onRefresh}
            className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition border border-slate-700"
            title="Rafraîchir"
          >
            <RotateCw className="w-4 h-4" />
          </button>
          
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg ${viewMode === 'grid' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg ${viewMode === 'list' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <div className="w-[1px] h-6 bg-slate-800 mx-1" />

          <button 
            onClick={onCreateWO}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ CREATE WO</span>
          </button>
        </div>
      </div>

      {/* 2. Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Sidebar: PM Schedules & Job Plans */}
        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-xs font-black tracking-wider uppercase text-white flex items-center gap-2">
              PM SCHEDULES & JOB PLANS
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">⚙</span>
          </div>

          <div className="space-y-2">
            {pmSchedules.map((pm) => (
              <div 
                key={pm.id}
                className="p-3 bg-slate-950/80 hover:bg-slate-800/60 border border-slate-800 rounded-xl transition cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="text-xs font-mono text-slate-300 truncate">{pm.title}</span>
                </div>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  ACTIVE
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Main Table: Work Task Execution Registry */}
        <div className="lg:col-span-9 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-xs font-black tracking-wider uppercase text-white">
              WORK TASK EXECUTION REGISTRY
            </h3>
            <span className="text-xs font-mono text-slate-400">{workOrders.length} tickets</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950/60 text-slate-400 uppercase text-[11px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">WO NUMBER</th>
                  <th className="py-3 px-4">DESCRIPTION</th>
                  <th className="py-3 px-4">PRIORITY</th>
                  <th className="py-3 px-4">STATUS</th>
                  <th className="py-3 px-4">ASSET</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {workOrders.map((wo) => (
                  <tr 
                    key={wo.id}
                    onClick={() => onSelectWO(wo)}
                    className="hover:bg-slate-800/40 transition cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 font-bold text-amber-400 font-mono">
                      {wo.woNumber}
                    </td>
                    <td className="py-3.5 px-4 text-slate-200 font-sans font-medium">
                      {wo.title}
                    </td>
                    <td className="py-3.5 px-4">
                      {getPriorityBadge(wo.priority)}
                    </td>
                    <td className="py-3.5 px-4">
                      {getStatusBadge(wo.status)}
                    </td>
                    <td className="py-3.5 px-4 text-cyan-400 truncate max-w-[200px]">
                      {wo.assetName}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
