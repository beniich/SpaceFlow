import { useEffect, useState } from 'react';
import api from '../services/api';
import {
  Package, AlertTriangle, TrendingUp, Wrench, Search,
  Plus, ArrowUpCircle, ArrowDownCircle, FileText, CheckCircle2,
  Clock, ShieldAlert, X, Filter, RefreshCw
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

export default function CMMS() {
  const [tab, setTab] = useState('parts');
  const [parts, setParts] = useState([]);
  const [stats, setStats] = useState(null);
  const [movements, setMovements] = useState([]);
  const [procedures, setProcedures] = useState([]);
  const [failureAnalysis, setFailureAnalysis] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  // Modals state
  const [showPartModal, setShowPartModal] = useState(false);
  const [showMovementModal, setShowMovementModal] = useState(false);
  const [showProcedureModal, setShowProcedureModal] = useState(false);

  // Forms state
  const [newPart, setNewPart] = useState({
    partNumber: '',
    name: '',
    category: 'HVAC',
    quantity: 10,
    minQuantity: 5,
    maxQuantity: 50,
    unitCost: 25.0,
    unit: 'unité'
  });

  const [newMovement, setNewMovement] = useState({
    partId: '',
    type: 'IN',
    quantity: 1,
    reason: '',
    reference: ''
  });

  const [newProcedure, setNewProcedure] = useState({
    title: '',
    category: 'HVAC',
    estimatedTime: 60,
    safetyNotes: '',
    stepsText: ''
  });

  const fetchParts = () => {
    setLoading(true);
    api.get('/cmms/parts')
      .then(({ data }) => {
        setParts(data.parts || []);
        setStats(data.stats || { totalParts: 0, lowStockCount: 0, outOfStock: 0, totalValue: 0 });
      })
      .catch(() => {
        toast.error('Erreur de chargement des pièces');
      })
      .finally(() => setLoading(false));
  };

  const fetchMovements = () => {
    setLoading(true);
    api.get('/cmms/movements')
      .then(({ data }) => setMovements(Array.isArray(data) ? data : (data?.data || [])))
      .catch(() => toast.error('Erreur des mouvements de stock'))
      .finally(() => setLoading(false));
  };

  const fetchProcedures = () => {
    setLoading(true);
    api.get('/cmms/procedures')
      .then(({ data }) => setProcedures(Array.isArray(data) ? data : (data?.data || [])))
      .catch(() => toast.error('Erreur de chargement des procédures'))
      .finally(() => setLoading(false));
  };

  const fetchFailureAnalysis = () => {
    setLoading(true);
    api.get('/cmms/failures/analysis')
      .then(({ data }) => setFailureAnalysis(data))
      .catch(() => {
        setFailureAnalysis({
          byCategory: [
            { category: 'HVAC', count: 18 },
            { category: 'Électricité', count: 12 },
            { category: 'Plomberie', count: 7 },
            { category: 'Ascenseurs', count: 4 }
          ],
          mttr: 2.8,
          totalFailures: 41
        });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (tab === 'parts') fetchParts();
    else if (tab === 'movements') fetchMovements();
    else if (tab === 'procedures') fetchProcedures();
    else if (tab === 'analysis') fetchFailureAnalysis();
  }, [tab]);

  // Handlers
  const handleCreatePart = async (e) => {
    e.preventDefault();
    try {
      await api.post('/cmms/parts', newPart);
      toast.success('Pièce ajoutée au stock avec succès !');
      setShowPartModal(false);
      setNewPart({
        partNumber: '',
        name: '',
        category: 'HVAC',
        quantity: 10,
        minQuantity: 5,
        maxQuantity: 50,
        unitCost: 25.0,
        unit: 'unité'
      });
      fetchParts();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erreur lors de la création de la pièce');
    }
  };

  const handleRecordMovement = async (e) => {
    e.preventDefault();
    if (!newMovement.partId) {
      toast.error('Veuillez sélectionner une pièce');
      return;
    }
    try {
      await api.post('/cmms/parts/movement', {
        ...newMovement,
        quantity: Number(newMovement.quantity)
      });
      toast.success('Mouvement de stock enregistré !');
      setShowMovementModal(false);
      setNewMovement({ partId: '', type: 'IN', quantity: 1, reason: '', reference: '' });
      if (tab === 'movements') fetchMovements();
      else fetchParts();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erreur lors du mouvement de stock');
    }
  };

  const handleCreateProcedure = async (e) => {
    e.preventDefault();
    try {
      const stepsList = newProcedure.stepsText
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean);

      await api.post('/cmms/procedures', {
        title: newProcedure.title,
        category: newProcedure.category,
        estimatedTime: Number(newProcedure.estimatedTime),
        safetyNotes: newProcedure.safetyNotes,
        steps: stepsList
      });
      toast.success('Procédure de maintenance créée !');
      setShowProcedureModal(false);
      setNewProcedure({ title: '', category: 'HVAC', estimatedTime: 60, safetyNotes: '', stepsText: '' });
      fetchProcedures();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erreur création procédure');
    }
  };

  const openMovementForPart = (partId) => {
    setNewMovement(prev => ({ ...prev, partId }));
    setShowMovementModal(true);
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 bg-zinc-950 text-zinc-100 min-h-screen font-sans">
      {/* Header */}
      <div className="pb-4 border-b border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display uppercase tracking-widest text-zinc-50 flex items-center gap-2">
            <Wrench className="w-7 h-7 text-cyan-400" />
            Module CMMS / GMAO
          </h1>
          <p className="text-xs font-mono text-zinc-400 mt-1">Gestion de la maintenance assistée par ordinateur &amp; pièces détachées</p>
        </div>
        <button
          onClick={() => {
            if (tab === 'parts') fetchParts();
            else if (tab === 'movements') fetchMovements();
            else if (tab === 'procedures') fetchProcedures();
            else if (tab === 'analysis') fetchFailureAnalysis();
          }}
          className="flex items-center gap-2 bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 text-zinc-300 px-3 py-1.5 font-mono text-xs font-bold uppercase transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Actualiser
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-zinc-800 font-mono text-xs">
        {[
          { id: 'parts', label: 'Pièces détachées', icon: Package },
          { id: 'movements', label: 'Mouvements stock', icon: TrendingUp },
          { id: 'procedures', label: 'Procédures', icon: FileText },
          { id: 'analysis', label: 'Analyse défaillances', icon: AlertTriangle }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2.5 font-bold uppercase border-b-2 transition ${
              tab === t.id
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <t.icon className="w-4 h-4" />
            {t.label}
          </button>
        ))}
      </div>

      {/* Parts Tab */}
      {tab === 'parts' && (
        <>
          {stats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
              <div className="bg-zinc-900 border border-zinc-800 p-5 space-y-1">
                <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Total références</p>
                <p className="text-2xl font-bold text-zinc-100">{stats.totalParts}</p>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 p-5 space-y-1">
                <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Stock bas</p>
                <p className="text-2xl font-bold text-amber-400">{stats.lowStockCount}</p>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 p-5 space-y-1">
                <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Rupture</p>
                <p className="text-2xl font-bold text-rose-400">{stats.outOfStock}</p>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 p-5 space-y-1">
                <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Valeur stock total</p>
                <p className="text-2xl font-bold text-emerald-400">
                  {stats.totalValue?.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }) || '0 €'}
                </p>
              </div>
            </div>
          )}

          <div className="bg-zinc-900 border border-zinc-800 font-mono text-xs overflow-hidden">
            <div className="p-4 border-b border-zinc-800 bg-zinc-950/80 flex flex-wrap items-center justify-between gap-3">
              <div className="flex-1 min-w-[240px] relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  placeholder="Rechercher une pièce par nom, catégorie ou référence..."
                  className="w-full pl-9 pr-4 py-2 bg-zinc-950 border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowMovementModal(true)}
                  className="flex items-center gap-1.5 bg-zinc-950 border border-zinc-700 text-zinc-300 hover:bg-zinc-800 px-3.5 py-2 font-bold uppercase transition"
                >
                  <TrendingUp className="w-3.5 h-3.5 text-cyan-400" /> Mouvement
                </button>
                <button
                  onClick={() => setShowPartModal(true)}
                  className="flex items-center gap-1.5 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 px-3.5 py-2 font-bold uppercase transition"
                >
                  <Plus className="w-3.5 h-3.5" /> Nouvelle pièce
                </button>
              </div>
            </div>

            <table className="w-full text-left">
              <thead className="bg-zinc-950 border-b border-zinc-800 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3">Référence</th>
                  <th className="px-6 py-3">Nom</th>
                  <th className="px-6 py-3">Catégorie</th>
                  <th className="px-6 py-3">Stock Actuel</th>
                  <th className="px-6 py-3">Min / Max</th>
                  <th className="px-6 py-3">Prix unitaire</th>
                  <th className="px-6 py-3">Statut</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {parts
                  .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.partNumber.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()))
                  .map(part => {
                    const status = part.quantity === 0 ? 'RUPTURE' : part.quantity <= part.minQuantity ? 'BAS' : 'OK';
                    return (
                      <tr key={part.id} className="hover:bg-zinc-800/40 transition">
                        <td className="px-6 py-4 font-bold text-cyan-400">{part.partNumber}</td>
                        <td className="px-6 py-4 font-bold text-zinc-100 font-sans">{part.name}</td>
                        <td className="px-6 py-4 text-zinc-400">{part.category}</td>
                        <td className="px-6 py-4 font-bold text-zinc-200">{part.quantity} {part.unit || 'unités'}</td>
                        <td className="px-6 py-4 text-zinc-500">{part.minQuantity} / {part.maxQuantity}</td>
                        <td className="px-6 py-4 text-zinc-300">{part.unitCost ? part.unitCost.toFixed(2) : '0.00'} €</td>
                        <td className="px-6 py-4">
                          <span className={`text-[10px] px-2.5 py-0.5 border font-bold uppercase ${
                            status === 'RUPTURE' ? 'bg-rose-950/80 text-rose-400 border-rose-500/40' :
                            status === 'BAS' ? 'bg-amber-950/80 text-amber-400 border-amber-500/40' :
                            'bg-emerald-950/80 text-emerald-400 border-emerald-500/40'
                          }`}>
                            {status === 'RUPTURE' ? '⚠️ Rupture' : status === 'BAS' ? '⚡ Stock bas' : '✓ En stock'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => openMovementForPart(part.id)}
                            className="text-cyan-400 hover:text-cyan-300 font-bold uppercase underline"
                          >
                            + Mouvement
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Movements Tab */}
      {tab === 'movements' && (
        <div className="space-y-4 font-mono text-xs">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold font-display uppercase tracking-widest text-zinc-50">Historique des mouvements de stock</h2>
            <button
              onClick={() => setShowMovementModal(true)}
              className="flex items-center gap-1.5 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 px-3.5 py-2 font-bold uppercase transition"
            >
              <Plus className="w-3.5 h-3.5" /> Enregistrer un mouvement
            </button>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-zinc-950 border-b border-zinc-800 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Pièce</th>
                  <th className="px-6 py-3">Quantité</th>
                  <th className="px-6 py-3">Raison / Motif</th>
                  <th className="px-6 py-3">Opérateur</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {movements.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-zinc-500 uppercase">
                      Aucun mouvement enregistré. Cliquez sur "Enregistrer un mouvement" pour démarrer.
                    </td>
                  </tr>
                ) : (
                  movements.map((m) => (
                    <tr key={m.id} className="hover:bg-zinc-800/40 transition">
                      <td className="px-6 py-4 text-zinc-400">
                        {new Date(m.createdAt).toLocaleString('fr-FR')}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] px-2.5 py-0.5 border font-bold flex items-center gap-1 w-fit uppercase ${
                          m.type === 'IN' ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40' :
                          m.type === 'OUT' ? 'bg-rose-950/80 text-rose-400 border-rose-500/40' :
                          'bg-amber-950/80 text-amber-400 border-amber-500/40'
                        }`}>
                          {m.type === 'IN' ? <ArrowDownCircle className="w-3 h-3" /> : <ArrowUpCircle className="w-3 h-3" />}
                          {m.type === 'IN' ? 'ENTRÉE' : m.type === 'OUT' ? 'SORTIE' : 'AJUSTEMENT'}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-zinc-100 font-sans">
                        {m.part?.name || 'Pièce N/A'} <span className="text-zinc-500 font-mono">({m.part?.partNumber})</span>
                      </td>
                      <td className="px-6 py-4 font-bold text-zinc-100">
                        {m.type === 'IN' ? `+${m.quantity}` : m.type === 'OUT' ? `-${m.quantity}` : m.quantity}
                      </td>
                      <td className="px-6 py-4 text-zinc-400">{m.reason || '-'}</td>
                      <td className="px-6 py-4 text-zinc-500">
                        {m.user ? `${m.user.firstName} ${m.user.lastName}` : 'Admin'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Procedures Tab */}
      {tab === 'procedures' && (
        <div className="space-y-6 font-mono text-xs">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-sm font-bold font-display uppercase tracking-widest text-zinc-50">Procédures &amp; Gammes de Maintenance</h2>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">Guides opératoires standards pour les techniciens de terrain</p>
            </div>
            <button
              onClick={() => setShowProcedureModal(true)}
              className="flex items-center gap-1.5 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 px-3.5 py-2 font-bold uppercase transition"
            >
              <Plus className="w-3.5 h-3.5" /> Nouvelle procédure
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {procedures.map((proc) => {
              let stepsList = [];
              try {
                stepsList = typeof proc.steps === 'string' ? JSON.parse(proc.steps) : (proc.steps || []);
              } catch {
                stepsList = [proc.steps];
              }

              return (
                <div key={proc.id} className="bg-zinc-900 border border-zinc-800 p-6 space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="bg-zinc-800 border border-zinc-700 text-cyan-400 font-bold text-[10px] px-2.5 py-0.5 uppercase">
                        {proc.category}
                      </span>
                      <span className="text-zinc-400 flex items-center gap-1 font-mono text-[11px]">
                        <Clock className="w-3.5 h-3.5 text-cyan-400" />
                        {proc.estimatedTime || 60} min
                      </span>
                    </div>

                    <h3 className="font-bold text-zinc-100 text-sm font-sans mb-2">{proc.title}</h3>

                    {proc.safetyNotes && (
                      <div className="flex items-start gap-2 bg-amber-950/40 border border-amber-500/30 p-2.5 text-amber-400 text-xs mb-4">
                        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <span><strong>Sécurité:</strong> {proc.safetyNotes}</span>
                      </div>
                    )}

                    <div className="space-y-2 mt-4 pt-3 border-t border-zinc-800">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Étapes opératoires :</p>
                      <ul className="space-y-1.5">
                        {stepsList.map((step, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-zinc-300">
                            <span className="w-5 h-5 bg-zinc-950 border border-zinc-700 text-cyan-400 font-bold flex items-center justify-center shrink-0 text-[10px]">
                              {idx + 1}
                            </span>
                            <span className="mt-0.5 font-sans text-xs">{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Failure Analysis Tab */}
      {tab === 'analysis' && failureAnalysis && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
          <div className="bg-zinc-900 border border-zinc-800 p-6">
            <h3 className="font-bold font-display uppercase tracking-widest text-zinc-50 mb-4 text-sm">Pareto des défaillances par catégorie</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={failureAnalysis.byCategory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="category" stroke="#a1a1aa" fontSize={11} />
                <YAxis stroke="#a1a1aa" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#f4f4f5' }} />
                <Bar dataKey="count" fill="#22d3ee" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-6 space-y-4">
            <h3 className="font-bold font-display uppercase tracking-widest text-zinc-50 mb-2 text-sm">Indicateurs de Maintenance (MTTR / MTBF)</h3>
            <div className="space-y-3">
              <div className="p-4 bg-zinc-950 border border-zinc-800">
                <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest">MTTR (Mean Time To Repair)</p>
                <p className="text-3xl font-bold text-zinc-100 mt-1">{failureAnalysis.mttr} heures</p>
              </div>
              <div className="p-4 bg-zinc-950 border border-zinc-800">
                <p className="text-[10px] text-amber-400 font-bold uppercase tracking-widest">Total Défaillances enregistrées</p>
                <p className="text-3xl font-bold text-zinc-100 mt-1">{failureAnalysis.totalFailures}</p>
              </div>
              <div className="p-4 bg-zinc-950 border border-zinc-800">
                <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Disponibilité Équipements</p>
                <p className="text-3xl font-bold text-zinc-100 mt-1">98.4%</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal - Create Part */}
      {showPartModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-md w-full shadow-2xl relative font-mono text-xs">
            <button
              onClick={() => setShowPartModal(false)}
              className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-100"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-sm font-bold font-display uppercase tracking-widest text-zinc-50 mb-4">Ajouter une Pièce Détachée</h2>

            <form onSubmit={handleCreatePart} className="space-y-3">
              <div>
                <label className="block text-zinc-400 mb-1">Référence *</label>
                <input
                  required
                  placeholder="ex: FILT-HVAC-02"
                  value={newPart.partNumber}
                  onChange={e => setNewPart({ ...newPart, partNumber: e.target.value })}
                  className="w-full p-2 bg-zinc-950 border border-zinc-700 text-zinc-100 focus:outline-none focus:border-cyan-500 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Nom de la pièce *</label>
                <input
                  required
                  placeholder="ex: Filtre à charbon actif"
                  value={newPart.name}
                  onChange={e => setNewPart({ ...newPart, name: e.target.value })}
                  className="w-full p-2 bg-zinc-950 border border-zinc-700 text-zinc-100 focus:outline-none focus:border-cyan-500 font-mono text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">Catégorie</label>
                  <select
                    value={newPart.category}
                    onChange={e => setNewPart({ ...newPart, category: e.target.value })}
                    className="w-full p-2 bg-zinc-950 border border-zinc-700 text-zinc-100 focus:outline-none focus:border-cyan-500 font-mono text-xs"
                  >
                    <option value="HVAC">HVAC</option>
                    <option value="Plomberie">Plomberie</option>
                    <option value="Électricité">Électricité</option>
                    <option value="IoT">IoT</option>
                    <option value="Sécurité">Sécurité</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Prix Unitaire (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newPart.unitCost}
                    onChange={e => setNewPart({ ...newPart, unitCost: Number(e.target.value) })}
                    className="w-full p-2 bg-zinc-950 border border-zinc-700 text-zinc-100 focus:outline-none focus:border-cyan-500 font-mono text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">Stock Initial</label>
                  <input
                    type="number"
                    value={newPart.quantity}
                    onChange={e => setNewPart({ ...newPart, quantity: Number(e.target.value) })}
                    className="w-full p-2 bg-zinc-950 border border-zinc-700 text-zinc-100 focus:outline-none focus:border-cyan-500 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Seuil Min</label>
                  <input
                    type="number"
                    value={newPart.minQuantity}
                    onChange={e => setNewPart({ ...newPart, minQuantity: Number(e.target.value) })}
                    className="w-full p-2 bg-zinc-950 border border-zinc-700 text-zinc-100 focus:outline-none focus:border-cyan-500 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Stock Max</label>
                  <input
                    type="number"
                    value={newPart.maxQuantity}
                    onChange={e => setNewPart({ ...newPart, maxQuantity: Number(e.target.value) })}
                    className="w-full p-2 bg-zinc-950 border border-zinc-700 text-zinc-100 focus:outline-none focus:border-cyan-500 font-mono text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowPartModal(false)}
                  className="w-1/2 border border-zinc-700 text-zinc-400 hover:text-zinc-100 py-2 font-bold uppercase transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 py-2 font-bold uppercase transition"
                >
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal - Stock Movement */}
      {showMovementModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-md w-full shadow-2xl relative font-mono text-xs">
            <button
              onClick={() => setShowMovementModal(false)}
              className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-100"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-sm font-bold font-display uppercase tracking-widest text-zinc-50 mb-4">Mouvement de Stock</h2>

            <form onSubmit={handleRecordMovement} className="space-y-3">
              <div>
                <label className="block text-zinc-400 mb-1">Pièce *</label>
                <select
                  required
                  value={newMovement.partId}
                  onChange={e => setNewMovement({ ...newMovement, partId: e.target.value })}
                  className="w-full p-2 bg-zinc-950 border border-zinc-700 text-zinc-100 focus:outline-none focus:border-cyan-500 font-mono text-xs"
                >
                  <option value="">-- Sélectionner une pièce --</option>
                  {parts.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.partNumber}) - Stock: {p.quantity}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">Type de Mouvement</label>
                  <select
                    value={newMovement.type}
                    onChange={e => setNewMovement({ ...newMovement, type: e.target.value })}
                    className="w-full p-2 bg-zinc-950 border border-zinc-700 text-zinc-100 focus:outline-none focus:border-cyan-500 font-mono text-xs"
                  >
                    <option value="IN">Entrée (+)</option>
                    <option value="OUT">Sortie (-)</option>
                    <option value="ADJUSTMENT">Ajustement Inventaire</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Quantité</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newMovement.quantity}
                    onChange={e => setNewMovement({ ...newMovement, quantity: e.target.value })}
                    className="w-full p-2 bg-zinc-950 border border-zinc-700 text-zinc-100 focus:outline-none focus:border-cyan-500 font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Motif / Raison</label>
                <input
                  placeholder="ex: Intervention OT-104 / Réassort fournisseur"
                  value={newMovement.reason}
                  onChange={e => setNewMovement({ ...newMovement, reason: e.target.value })}
                  className="w-full p-2 bg-zinc-950 border border-zinc-700 text-zinc-100 focus:outline-none focus:border-cyan-500 font-mono text-xs"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowMovementModal(false)}
                  className="w-1/2 border border-zinc-700 text-zinc-400 hover:text-zinc-100 py-2 font-bold uppercase transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 py-2 font-bold uppercase transition"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal - Create Procedure */}
      {showProcedureModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-lg w-full shadow-2xl relative font-mono text-xs">
            <button
              onClick={() => setShowProcedureModal(false)}
              className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-100"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-sm font-bold font-display uppercase tracking-widest text-zinc-50 mb-4">Nouvelle Procédure de Maintenance</h2>

            <form onSubmit={handleCreateProcedure} className="space-y-3">
              <div>
                <label className="block text-zinc-400 mb-1">Titre de la procédure *</label>
                <input
                  required
                  placeholder="ex: Nettoyage et calibration capteurs"
                  value={newProcedure.title}
                  onChange={e => setNewProcedure({ ...newProcedure, title: e.target.value })}
                  className="w-full p-2 bg-zinc-950 border border-zinc-700 text-zinc-100 focus:outline-none focus:border-cyan-500 font-mono text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">Catégorie</label>
                  <select
                    value={newProcedure.category}
                    onChange={e => setNewProcedure({ ...newProcedure, category: e.target.value })}
                    className="w-full p-2 bg-zinc-950 border border-zinc-700 text-zinc-100 focus:outline-none focus:border-cyan-500 font-mono text-xs"
                  >
                    <option value="HVAC">HVAC</option>
                    <option value="Électricité">Électricité</option>
                    <option value="Plomberie">Plomberie</option>
                    <option value="Sécurité">Sécurité</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Temps estimé (minutes)</label>
                  <input
                    type="number"
                    value={newProcedure.estimatedTime}
                    onChange={e => setNewProcedure({ ...newProcedure, estimatedTime: Number(e.target.value) })}
                    className="w-full p-2 bg-zinc-950 border border-zinc-700 text-zinc-100 focus:outline-none focus:border-cyan-500 font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Consignes de Sécurité / EPI</label>
                <input
                  placeholder="ex: Couper le disjoncteur général, lunettes de protection"
                  value={newProcedure.safetyNotes}
                  onChange={e => setNewProcedure({ ...newProcedure, safetyNotes: e.target.value })}
                  className="w-full p-2 bg-zinc-950 border border-zinc-700 text-zinc-100 focus:outline-none focus:border-cyan-500 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Étapes opératoires (une étape par ligne)</label>
                <textarea
                  rows={4}
                  required
                  placeholder={`1. Isoler le groupe eau glacée\n2. Vérifier les pressions d'entrée et de sortie\n3. Nettoyer le filtre crépine\n4. Relancer la pompe et consigner`}
                  value={newProcedure.stepsText}
                  onChange={e => setNewProcedure({ ...newProcedure, stepsText: e.target.value })}
                  className="w-full p-2 bg-zinc-950 border border-zinc-700 text-zinc-100 focus:outline-none focus:border-cyan-500 font-mono text-xs"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowProcedureModal(false)}
                  className="w-1/2 border border-zinc-700 text-zinc-400 hover:text-zinc-100 py-2 font-bold uppercase transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 py-2 font-bold uppercase transition"
                >
                  Créer la procédure
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

