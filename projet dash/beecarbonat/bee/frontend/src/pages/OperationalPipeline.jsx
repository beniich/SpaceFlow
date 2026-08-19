import React, { useState, useEffect } from 'react';
import { Layers, Wrench, Clock, CheckCircle2, AlertCircle, Plus } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function OperationalPipeline() {
  const [workOrders, setWorkOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/workorders');
      setWorkOrders(Array.isArray(data) ? data : []);
    } catch {
      setWorkOrders([
        { id: 'wo-1', number: 'WO-2026-001', title: 'Inspection CTA-02', priority: 'HIGH', status: 'PENDING', type: 'PREVENTIVE' },
        { id: 'wo-2', number: 'WO-2026-002', title: 'Remplacement Filtre F7', priority: 'MEDIUM', status: 'IN_PROGRESS', type: 'CORRECTIVE' },
        { id: 'wo-3', number: 'WO-2026-003', title: 'Régulation VAV Bureau 304', priority: 'LOW', status: 'COMPLETED', type: 'PREVENTIVE' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await api.put(`/workorders/${id}`, { status: newStatus });
      toast.success(`Statut mis à jour : ${newStatus}`);
      loadOrders();
    } catch {
      setWorkOrders((prev) =>
        prev.map((wo) => (wo.id === id ? { ...wo, status: newStatus } : wo))
      );
      toast.success(`Statut mis à jour localement : ${newStatus}`);
    }
  };

  const pendingWO = workOrders.filter((w) => w.status === 'PENDING');
  const inProgressWO = workOrders.filter((w) => w.status === 'IN_PROGRESS');
  const completedWO = workOrders.filter((w) => w.status === 'COMPLETED' || w.status === 'CLOSED');

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 bg-zinc-950 text-zinc-100 min-h-screen font-sans">
      <div className="pb-4 border-b border-zinc-800">
        <h1 className="text-2xl font-bold font-display uppercase tracking-widest flex items-center gap-2 text-zinc-50">
          <Layers className="w-7 h-7 text-cyan-400" />
          Pipeline Opérationnel (Kanban Maintenance)
        </h1>
        <p className="text-xs font-mono text-zinc-400 mt-1">
          Suivi visuel de l'avancement des ordres de travail et affectation des techniciens en temps réel
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
        {/* Pending Column */}
        <div className="bg-zinc-900 border border-zinc-800 p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <h3 className="font-bold text-zinc-50 uppercase flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" /> À Traiter ({pendingWO.length})
            </h3>
          </div>
          <div className="space-y-3">
            {pendingWO.map((wo) => (
              <div key={wo.id} className="p-4 bg-zinc-950 border border-zinc-800 space-y-2">
                <span className="text-[10px] font-bold text-cyan-400">{wo.number}</span>
                <h4 className="font-bold text-zinc-100">{wo.title}</h4>
                <div className="flex justify-between items-center pt-2">
                  <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 font-bold text-[10px]">{wo.priority}</span>
                  <button
                    onClick={() => handleUpdateStatus(wo.id, 'IN_PROGRESS')}
                    className="px-2.5 py-1 bg-cyan-600 hover:bg-cyan-500 text-zinc-950 font-bold uppercase"
                  >
                    Démarrer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* In Progress Column */}
        <div className="bg-zinc-900 border border-zinc-800 p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <h3 className="font-bold text-zinc-50 uppercase flex items-center gap-2">
              <Wrench className="w-4 h-4 text-cyan-400" /> En Cours ({inProgressWO.length})
            </h3>
          </div>
          <div className="space-y-3">
            {inProgressWO.map((wo) => (
              <div key={wo.id} className="p-4 bg-zinc-950 border border-zinc-800 space-y-2">
                <span className="text-[10px] font-bold text-cyan-400">{wo.number}</span>
                <h4 className="font-bold text-zinc-100">{wo.title}</h4>
                <div className="flex justify-between items-center pt-2">
                  <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 font-bold text-[10px]">{wo.priority}</span>
                  <button
                    onClick={() => handleUpdateStatus(wo.id, 'COMPLETED')}
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-bold uppercase"
                  >
                    Clôturer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Completed Column */}
        <div className="bg-zinc-900 border border-zinc-800 p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <h3 className="font-bold text-zinc-50 uppercase flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Clôturés ({completedWO.length})
            </h3>
          </div>
          <div className="space-y-3">
            {completedWO.map((wo) => (
              <div key={wo.id} className="p-4 bg-zinc-950 border border-zinc-800 space-y-2 opacity-80">
                <span className="text-[10px] font-bold text-emerald-400">{wo.number}</span>
                <h4 className="font-bold text-zinc-200">{wo.title}</h4>
                <span className="inline-block px-2 py-0.5 bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                  Terminé
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
