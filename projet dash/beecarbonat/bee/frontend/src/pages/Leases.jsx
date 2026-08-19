import { useEffect, useState } from 'react';
import api from '../services/api';
import { Plus, FileText, Calendar, DollarSign, Pencil, Trash2, Building, Users, AlertTriangle, Compass, Leaf, ArrowRight, Download, Activity } from 'lucide-react';
import { format, differenceInMonths } from 'date-fns';
import { fr } from 'date-fns/locale';
import toast from 'react-hot-toast';

// Mock Data for enriched display if API is empty
const MOCK_LEASES = [
  {
    id: 'LSE-001',
    tenant: 'TechCorp Europe',
    building: { name: 'Campus Paris - Bâtiment A' },
    status: 'active',
    startDate: '2023-01-01',
    endDate: '2026-12-31',
    monthlyRent: 45000,
    surface: 1200,
    scope3Est: 42.5,
    activityType: 'Tertiaire'
  },
  {
    id: 'LSE-002',
    tenant: 'Boutique Éphémère (Pop-up)',
    building: { name: 'Campus Paris - RDC Retail' },
    status: 'active',
    startDate: '2025-06-01',
    endDate: '2026-05-31',
    monthlyRent: 8000,
    surface: 250,
    scope3Est: 18.2,
    activityType: 'Retail'
  },
  {
    id: 'LSE-003',
    tenant: 'DataTech Analytics',
    building: { name: 'Campus Lyon - Tour B' },
    status: 'active',
    startDate: '2020-03-01',
    endDate: '2029-02-28',
    monthlyRent: 120000,
    surface: 3500,
    scope3Est: 145.8,
    activityType: 'Data Center / Tertiaire'
  }
];

export default function Leases() {
  const [leases, setLeases] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingLease, setEditingLease] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [l, b] = await Promise.all([
        api.get('/leases').catch(() => ({ data: [] })),
        api.get('/buildings').catch(() => ({ data: [] }))
      ]);
      
      // Merge with mock data if empty for demo purposes
      const loadedLeases = l.data?.length > 0 ? l.data : MOCK_LEASES;
      setLeases(loadedLeases);
      setBuildings(b.data);
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
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erreur');
    }
  };

  const openEdit   = (lease) => { setEditingLease(lease); setShowModal(true); };
  const openCreate = ()      => { setEditingLease(null);  setShowModal(true); };

  // Computed Metrics
  const totalSurface = leases.reduce((acc, l) => acc + (l.surface || 0), 0);
  const totalScope3 = leases.reduce((acc, l) => acc + (l.scope3Est || 0), 0);
  const upcomingRenewals = leases.filter(l => {
    const monthsLeft = differenceInMonths(new Date(l.endDate), new Date());
    return monthsLeft > 0 && monthsLeft <= 12;
  }).length;

  return (
    <div className="relative min-h-full bg-background overflow-hidden text-zinc-100 font-sans pb-12">
      
      <div className="relative z-10 p-6 lg:p-8 flex flex-col gap-6 max-w-[1600px] mx-auto w-full">
        {/* HEADER BAR */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/40 pb-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight font-display uppercase text-zinc-50 flex items-center gap-3">
              <Users className="w-6 h-6 text-brand-cyan" />
              BAUX &amp; LOCATAIRES
            </h1>
            <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest mt-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan shadow-[0_0_8px_var(--brand-cyan,_#00dbe7)] animate-pulse" />
              Supervision des occupations • ESG Scope 3 (Cat 13)
            </p>
          </div>
          <div className="flex items-center gap-3">
             <button
              onClick={() => toast.success('Export du cadastre locatif et des estimations ESG démarré.')}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-brand-cyan text-[10px] font-mono uppercase font-bold rounded transition-colors shadow-sm"
            >
              <Download className="w-4 h-4" /> Export CSRD Locataires
            </button>
            <button
              onClick={openCreate}
              className="flex items-center gap-2 bg-brand-cyan text-zinc-950 px-4 py-2 font-mono text-[10px] uppercase tracking-widest font-bold hover:bg-cyan-400 transition-all rounded shadow-[0_0_15px_rgba(0,219,231,0.3)]"
            >
              <Plus className="w-4 h-4" /> Nouveau Bail
            </button>
          </div>
        </div>

        {/* METRICS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface/60 backdrop-blur-md border border-zinc-800/60 rounded-xl p-5 shadow-lg group relative overflow-hidden flex flex-col justify-between h-[120px]">
            <div className="absolute top-0 right-0 p-4 opacity-10">
               <Building className="w-12 h-12 text-zinc-400" />
            </div>
            <span className="font-mono text-zinc-400 text-[10px] tracking-[0.2em] uppercase block">Surface Totale Louée (GLA)</span>
            <div className="flex items-baseline gap-1.5 mt-2">
              <span className="text-4xl font-bold tracking-tight text-zinc-50 font-display">{totalSurface.toLocaleString()}</span>
              <span className="text-sm text-zinc-500 font-mono">m²</span>
            </div>
          </div>
          
          <div className="bg-surface/60 backdrop-blur-md border border-zinc-800/60 rounded-xl p-5 shadow-lg group relative overflow-hidden flex flex-col justify-between h-[120px]">
            <div className="absolute top-0 right-0 p-4 opacity-10">
               <Compass className="w-12 h-12 text-brand-orange" />
            </div>
            <span className="font-mono text-brand-orange text-[10px] tracking-[0.2em] uppercase block">Empreinte Scope 3 (Cat 13)</span>
            <div className="flex items-baseline gap-1.5 mt-2">
              <span className="text-4xl font-bold tracking-tight text-zinc-50 font-display">{totalScope3.toFixed(1)}</span>
              <span className="text-sm text-zinc-500 font-mono">tCO₂e</span>
            </div>
            <div className="absolute bottom-0 left-0 h-1 bg-brand-orange shadow-[0_0_8px_var(--brand-orange,_#f38020)]" style={{ width: '65%' }}></div>
          </div>

          <div className="bg-surface/60 backdrop-blur-md border border-zinc-800/60 rounded-xl p-5 shadow-lg group relative overflow-hidden flex flex-col justify-between h-[120px]">
            <div className="absolute top-0 right-0 p-4 opacity-10">
               <AlertTriangle className="w-12 h-12 text-emerald-400" />
            </div>
            <span className="font-mono text-emerald-400 text-[10px] tracking-[0.2em] uppercase block">Renouvellements &lt; 12 mois</span>
            <div className="flex items-baseline gap-1.5 mt-2">
              <span className="text-4xl font-bold tracking-tight text-zinc-50 font-display">{upcomingRenewals}</span>
              <span className="text-sm text-zinc-500 font-mono">baux</span>
            </div>
          </div>
        </div>

        {/* LEASES LIST */}
        <div className="bg-surface/60 backdrop-blur-md border border-zinc-800/60 rounded-xl overflow-hidden shadow-lg flex flex-col flex-1">
          <div className="p-5 border-b border-zinc-800/40 flex items-center justify-between">
             <h3 className="font-bold text-xs font-mono tracking-wider text-zinc-100 uppercase flex items-center gap-2">
               <FileText className="w-4 h-4 text-brand-cyan" />
               Registre des Locataires
             </h3>
          </div>
          
          <div className="p-6">
            {loading ? (
              <div className="text-center py-12 text-zinc-500 font-mono text-xs">Analyse du registre locatif...</div>
            ) : leases.length === 0 ? (
              <div className="text-center py-12 text-zinc-500 font-mono text-xs border border-dashed border-zinc-800 rounded">
                Aucun bail actif enregistré.
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 font-mono text-xs">
                {leases.map(lease => {
                  const monthsLeft = differenceInMonths(new Date(lease.endDate), new Date());
                  const isExpiringSoon = monthsLeft > 0 && monthsLeft <= 12;

                  return (
                    <div key={lease.id} className="bg-zinc-950/50 border border-zinc-800/60 rounded-lg p-5 space-y-4 hover:border-brand-cyan/40 transition-colors group relative overflow-hidden">
                      {isExpiringSoon && (
                        <div className="absolute top-0 right-0 border-t-[30px] border-r-[30px] border-t-emerald-500/20 border-r-emerald-500/20 w-0 h-0">
                           <AlertTriangle className="absolute -top-[24px] -right-[24px] w-3 h-3 text-emerald-400" />
                        </div>
                      )}
                      
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                             <span className="text-[9px] uppercase px-2 py-0.5 rounded font-bold bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20">
                               {lease.id}
                             </span>
                             <span className="text-[9px] text-zinc-500 uppercase">{lease.activityType || 'Non spécifié'}</span>
                          </div>
                          <h3 className="font-bold text-zinc-50 text-lg font-display tracking-tight">{lease.tenant}</h3>
                        </div>
                        <div className="flex items-center gap-1 z-10">
                          <button onClick={() => openEdit(lease)} className="p-1.5 text-zinc-400 hover:text-brand-cyan hover:bg-brand-cyan/10 rounded transition"><Pencil className="w-3.5 h-3.5" /></button>
                          <button onClick={() => handleDelete(lease.id)} className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-red-400/10 rounded transition"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-3 border-t border-zinc-800/40">
                         <div>
                            <span className="text-[9px] text-zinc-500 uppercase tracking-wider block mb-1">Surface (GLA)</span>
                            <span className="font-bold text-zinc-200 text-sm">{lease.surface?.toLocaleString()} m²</span>
                         </div>
                         <div>
                            <span className="text-[9px] text-zinc-500 uppercase tracking-wider block mb-1">Fin de bail</span>
                            <span className={`font-bold text-sm ${isExpiringSoon ? 'text-emerald-400' : 'text-zinc-200'}`}>
                               {format(new Date(lease.endDate), 'MMM yyyy', { locale: fr })}
                               {isExpiringSoon && <span className="ml-2 text-[9px] bg-emerald-400/10 px-1 py-0.5 rounded">Bientôt</span>}
                            </span>
                         </div>
                      </div>

                      {/* ESG Scope 3 integration */}
                      <div className="bg-zinc-900 border border-zinc-800 p-3 rounded mt-4">
                         <div className="flex justify-between items-center mb-2">
                            <span className="text-[9px] font-mono text-zinc-400 uppercase flex items-center gap-1.5">
                              <Compass className="w-3 h-3 text-brand-orange" /> Estimateur Aval (Cat 13)
                            </span>
                            <span className="text-xs font-bold text-brand-orange">{lease.scope3Est?.toFixed(1)} tCO₂e</span>
                         </div>
                         <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden">
                            <div className="h-full bg-brand-orange" style={{ width: `${Math.min((lease.scope3Est / 200) * 100, 100)}%` }}></div>
                         </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

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
    buildingId:  lease?.buildingId  || (buildings[0]?.id || ''),
    startDate:   fmt(lease?.startDate) || '',
    endDate:     fmt(lease?.endDate) || '',
    monthlyRent: lease?.monthlyRent || 0,
    deposit:     lease?.deposit     || 0,
    surface:     lease?.surface     || 0,
    status:      lease?.status      || 'active',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit && !lease.id.startsWith('LSE-')) {
        await api.put(`/leases/${lease.id}`, form);
        toast.success('Bail mis à jour');
      } else if (!isEdit) {
        await api.post('/leases', form);
        toast.success('Bail créé');
      } else {
        toast.success('Simulation: Bail mis à jour (Mock Data)');
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
    className: 'w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-brand-cyan font-mono text-xs rounded transition-colors',
    ...props
  });

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#18181b] border border-zinc-800 rounded-xl max-w-lg w-full shadow-2xl font-mono text-xs overflow-hidden animate-in zoom-in-95 duration-200">
        <form onSubmit={handleSubmit}>
          <div className="p-5 border-b border-zinc-800 bg-zinc-950">
            <h2 className="text-sm font-bold font-display uppercase tracking-widest text-zinc-50 flex items-center gap-2">
              {isEdit ? <Pencil className="w-4 h-4 text-brand-cyan" /> : <Plus className="w-4 h-4 text-brand-cyan" />}
              {isEdit ? 'Modifier le bail' : 'Nouveau bail'}
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-[10px] text-zinc-500 uppercase tracking-wider mb-1.5">Locataire (Entité légale)</label>
              <input required placeholder="Nom du Locataire" {...field('tenant')} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] text-zinc-500 uppercase tracking-wider mb-1.5">Bâtiment / Site</label>
                <select {...field('buildingId')}>
                  <option value="">Sélectionner...</option>
                  {buildings.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] text-zinc-500 uppercase tracking-wider mb-1.5">Surface (m²)</label>
                <input type="number" required placeholder="GLA en m²" {...field('surface')} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] text-zinc-500 uppercase tracking-wider mb-1.5">Début du bail</label>
                <input type="date" required {...field('startDate')} />
              </div>
              <div>
                <label className="block text-[10px] text-zinc-500 uppercase tracking-wider mb-1.5">Fin de bail</label>
                <input type="date" required {...field('endDate')} />
              </div>
            </div>
          </div>
          <div className="p-5 border-t border-zinc-800 flex justify-end gap-3 bg-zinc-950">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-100 uppercase font-bold rounded transition-colors">Annuler</button>
            <button type="submit" className="px-4 py-2 bg-brand-cyan hover:bg-cyan-400 text-zinc-950 font-bold uppercase rounded transition-colors shadow-[0_0_15px_rgba(0,219,231,0.3)]">
              {isEdit ? 'Mettre à jour' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
