import { useEffect, useState } from 'react';
import api from '../services/api';
import { Plus, FileText, Calendar, DollarSign, Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import toast from 'react-hot-toast';

export default function Leases() {
  const [leases, setLeases] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingLease, setEditingLease] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [l, b, s] = await Promise.all([
        api.get('/leases'),
        api.get('/buildings'),
        api.get('/leases/stats')
      ]);
      setLeases(l.data);
      setBuildings(b.data);
      setStats(s.data);
    } catch (err) {
      toast.error('Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce bail ?')) return;
    try {
      await api.delete(`/leases/${id}`);
      toast.success('Bail supprimé');
      setLeases(prev => prev.filter(l => l.id !== id));
      loadData(); // Recharger les stats
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erreur');
    }
  };

  const openEdit   = (lease) => { setEditingLease(lease); setShowModal(true); };
  const openCreate = ()      => { setEditingLease(null);  setShowModal(true); };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 bg-zinc-950 text-zinc-100 min-h-screen font-sans">
      <div className="pb-4 border-b border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display uppercase tracking-widest text-zinc-50 flex items-center gap-2">
            <FileText className="w-7 h-7 text-cyan-400" />
            Baux &amp; Contrats
          </h1>
          <p className="text-xs font-mono text-zinc-400 mt-1">{leases.length} baux enregistrés</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-mono text-xs font-bold uppercase transition shadow-sm px-4 py-2"
        >
          <Plus className="w-4 h-4" /> Nouveau bail
        </button>
      </div>

      {/* STATS */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
            <div className="text-xs font-mono text-zinc-400 mb-1 uppercase tracking-wider">Loyer Mensuel Global</div>
            <div className="text-2xl font-display font-bold text-cyan-400">
              {stats.totalMonthlyRent.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
            </div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
            <div className="text-xs font-mono text-zinc-400 mb-1 uppercase tracking-wider">Baux Actifs</div>
            <div className="text-2xl font-display font-bold text-emerald-400">
              {stats.activeCount}
            </div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
            <div className="text-xs font-mono text-zinc-400 mb-1 uppercase tracking-wider">Expirant &lt; 90 jours</div>
            <div className="text-2xl font-display font-bold text-brand-orange">
              {stats.expiringSoon}
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-zinc-500 font-mono text-xs">Chargement des baux...</div>
      ) : leases.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 p-12 text-center text-zinc-500 font-mono text-xs uppercase">
          <FileText className="w-12 h-12 mx-auto mb-2 opacity-30 text-cyan-400" />
          <p>Aucun bail. Créez-en un pour commencer.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
          {leases.map(lease => (
            <div key={lease.id} className="bg-zinc-900 border border-zinc-800 p-5 space-y-3 hover:border-zinc-700 transition">
              <div className="flex items-start justify-between">
                <h3 className="font-bold text-zinc-100 text-sm font-sans">{lease.tenant}</h3>
                <div className="flex items-center gap-1">
                  <button onClick={() => openEdit(lease)} className="p-1 text-zinc-400 hover:text-cyan-400 transition"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDelete(lease.id)} className="p-1 text-zinc-400 hover:text-rose-400 transition"><Trash2 className="w-3.5 h-3.5" /></button>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 border ml-1 ${
                    lease.status === 'active' ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40' : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                  }`}>
                    {lease.status}
                  </span>
                </div>
              </div>
              <p className="text-xs text-zinc-400 font-mono">
                📍 {lease.building?.name || 'Bâtiment Non Défini'}
              </p>
              <div className="space-y-2 text-xs pt-2 border-t border-zinc-800">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  <span className="text-zinc-200 font-bold">{lease.monthlyRent.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}/mois</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-400">
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  <span>{format(new Date(lease.startDate), 'dd MMM yyyy', { locale: fr })} → {format(new Date(lease.endDate), 'dd MMM yyyy', { locale: fr })}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <LeaseModal
          buildings={buildings}
          lease={editingLease}
          onClose={() => { setShowModal(false); setEditingLease(null); }}
          onSuccess={loadData}
        />
      )}
    </div>
  );
}

function LeaseModal({ buildings, lease, onClose, onSuccess }) {
  const isEdit = !!lease;
  const fmt = (d) => d ? new Date(d).toISOString().slice(0, 10) : '';

  const [form, setForm] = useState({
    tenant:      lease?.tenant      || '',
    buildingId:  lease?.buildingId  || buildings[0]?.id || '',
    startDate:   fmt(lease?.startDate),
    endDate:     fmt(lease?.endDate),
    monthlyRent: lease?.monthlyRent || 0,
    deposit:     lease?.deposit     || 0,
    status:      lease?.status      || 'active',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await api.put(`/leases/${lease.id}`, form);
        toast.success('Bail mis à jour');
      } else {
        await api.post('/leases', form);
        toast.success('Bail créé');
      }
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erreur');
    }
  };

  const field = (key, props) => ({
    value: form[key],
    onChange: (e) => setForm({ ...form, [key]: e.target.value }),
    className: 'w-full px-3 py-2 bg-zinc-950 border border-zinc-700 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-cyan-500 font-mono text-xs',
    ...props
  });

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-lg w-full shadow-2xl font-mono text-xs">
        <form onSubmit={handleSubmit}>
          <div className="p-5 border-b border-zinc-800 bg-zinc-950/80">
            <h2 className="text-sm font-bold font-display uppercase tracking-widest text-zinc-50">{isEdit ? 'Modifier le bail' : 'Nouveau bail'}</h2>
          </div>
          <div className="p-6 space-y-3">
            <div>
              <label className="block text-zinc-400 mb-1">Locataire</label>
              <input required placeholder="Nom du Locataire" {...field('tenant')} />
            </div>
            <div>
              <label className="block text-zinc-400 mb-1">Bâtiment</label>
              <select {...field('buildingId')}>
                {buildings.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            {isEdit && (
              <div>
                <label className="block text-zinc-400 mb-1">Statut</label>
                <select {...field('status')}>
                  <option value="active">Actif</option>
                  <option value="expired">Expiré</option>
                  <option value="terminated">Résilié</option>
                </select>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-zinc-400 mb-1">Début</label>
                <input type="date" required {...field('startDate')} />
              </div>
              <div>
                <label className="block text-zinc-400 mb-1">Fin</label>
                <input type="date" required {...field('endDate')} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-zinc-400 mb-1">Loyer (€/mois)</label>
                <input type="number" placeholder="Loyer mensuel" {...field('monthlyRent')} />
              </div>
              <div>
                <label className="block text-zinc-400 mb-1">Dépôt (€)</label>
                <input type="number" placeholder="Dépôt de garantie" {...field('deposit')} />
              </div>
            </div>
          </div>
          <div className="p-5 border-t border-zinc-800 flex justify-end gap-2 bg-zinc-950/80">
            <button type="button" onClick={onClose} className="px-4 py-2 text-zinc-400 hover:text-zinc-100 uppercase transition">Annuler</button>
            <button type="submit" className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold uppercase transition">
              {isEdit ? 'Enregistrer' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
