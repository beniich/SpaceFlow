import { useEffect, useState } from 'react';
import api from '../services/api';
import { Wrench, Clock, AlertCircle, CheckCircle, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

const STATUS = {
  PENDING: { label: 'En attente', color: 'bg-zinc-800 text-amber-400 border border-amber-500/30', icon: Clock },
  IN_PROGRESS: { label: 'En cours', color: 'bg-cyan-950/60 text-cyan-400 border border-cyan-500/30', icon: AlertCircle },
  COMPLETED: { label: 'Terminé', color: 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30', icon: CheckCircle }
};

export default function Maintenance() {
  const [wos, setWos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    api.get('/cmms/work-orders')
      .then(({ data }) => setWos(Array.isArray(data) ? data : (data?.data || [])))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'ALL' ? wos : wos.filter(w => w.status === filter);

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/cmms/work-orders/${id}`, { status });
      toast.success('Statut mis à jour');
      setWos(prev => prev.map(w => w.id === id ? { ...w, status } : w));
    } catch (err) {
      toast.error('Erreur');
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 bg-zinc-950 text-zinc-100 min-h-screen font-sans">
      <div className="pb-4 border-b border-zinc-800 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display uppercase tracking-widest flex items-center gap-2 text-zinc-50">
            <Wrench className="w-7 h-7 text-cyan-400" />
            Gestion de Maintenance
          </h1>
          <p className="text-xs font-mono text-zinc-400 mt-1">{wos.length} interventions planifiées et actives</p>
        </div>
      </div>

      <div className="flex gap-2 font-mono text-xs">
        {['ALL', 'PENDING', 'IN_PROGRESS', 'COMPLETED'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 uppercase tracking-wider font-bold transition border ${
              filter === f
                ? 'bg-cyan-500 text-zinc-950 border-cyan-400'
                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:bg-zinc-800 hover:text-zinc-200'
            }`}
          >
            {f === 'ALL' ? 'Toutes' : STATUS[f].label}
          </button>
        ))}
      </div>

      <div className="space-y-3 font-mono text-xs">
        {loading ? (
          <div className="text-center py-12 text-zinc-500">Chargement des données...</div>
        ) : filtered.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 p-12 text-center text-zinc-500 uppercase">
            Aucune intervention trouvée
          </div>
        ) : (
          filtered.map(wo => {
            const S = STATUS[wo.status] || STATUS.PENDING;
            return (
              <div key={wo.id} className="bg-zinc-900 border border-zinc-800 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-zinc-700 transition">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-zinc-100 text-sm font-sans">{wo.title}</h3>
                    <span className={`text-[10px] uppercase font-mono px-2 py-0.5 ${S.color}`}>{S.label}</span>
                  </div>
                  <p className="text-xs text-zinc-400 font-mono">{wo.asset?.name || 'Équipement non spécifié'} • {wo.type}</p>
                </div>
                <select
                  value={wo.status}
                  onChange={(e) => updateStatus(wo.id, e.target.value)}
                  className="px-3 py-1.5 bg-zinc-950 border border-zinc-700 text-zinc-200 text-xs font-mono focus:outline-none focus:border-cyan-500"
                >
                  {Object.entries(STATUS).map(([k, v]) => (
                    <option key={k} value={k}>{v.label}</option>
                  ))}
                </select>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
