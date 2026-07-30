import { useEffect, useState } from 'react';
import api from '../services/api';
import {
  Package, AlertTriangle, TrendingUp, Wrench, Search,
  Plus, FileText, BarChart3, ArrowUpCircle, ArrowDownCircle, RefreshCw
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from 'recharts';
import clsx from 'clsx';
import toast from 'react-hot-toast';

const TABS = [
  { id: 'parts', label: 'Pièces détachées', icon: Package },
  { id: 'movements', label: 'Mouvements stock', icon: TrendingUp },
  { id: 'procedures', label: 'Procédures', icon: FileText },
  { id: 'analysis', label: 'Analyse défaillances', icon: BarChart3 }
];

const PARETO_COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe', '#ede9fe'];

export default function CMMS() {
  const [tab, setTab] = useState('parts');
  const [parts, setParts] = useState([]);
  const [stats, setStats] = useState(null);
  const [movements, setMovements] = useState([]);
  const [procedures, setProcedures] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [showMovementModal, setShowMovementModal] = useState(false);
  const [movementForm, setMovementForm] = useState({ partId: '', type: 'IN', quantity: 1, reason: '' });

  useEffect(() => {
    loadTab();
  }, [tab]);

  const loadTab = async () => {
    setLoading(true);
    try {
      if (tab === 'parts') {
        const { data } = await api.get('/cmms/parts');
        setParts(data.parts);
        setStats(data.stats);
      } else if (tab === 'movements') {
        const { data } = await api.get('/cmms/movements');
        setMovements(data);
      } else if (tab === 'procedures') {
        const { data } = await api.get('/cmms/procedures');
        setProcedures(data);
      } else if (tab === 'analysis') {
        const { data } = await api.get('/cmms/failures/analysis');
        setAnalysis(data);
      }
    } catch (err) {
      toast.error('Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleMovement = async () => {
    try {
      await api.post('/cmms/parts/movement', movementForm);
      toast.success('Mouvement enregistré');
      setShowMovementModal(false);
      setMovementForm({ partId: '', type: 'IN', quantity: 1, reason: '' });
      loadTab();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erreur');
    }
  };

  const filteredParts = parts.filter(
    (p) =>
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.partNumber.toLowerCase().includes(search.toLowerCase())
  );

  const getStockStatus = (p) => {
    if (p.quantity === 0) return { label: '⚠ Rupture', cls: 'bg-red-100 text-red-700' };
    if (p.quantity <= p.minQuantity) return { label: '⚡ Stock bas', cls: 'bg-orange-100 text-orange-700' };
    return { label: '✓ OK', cls: 'bg-green-100 text-green-700' };
  };

  return (
    <div className="p-8 bg-slate-50 min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Wrench className="w-6 h-6 text-primary-600" />
            Module CMMS / GMAO
          </h1>
          <p className="text-slate-500 text-sm">Gestion de la maintenance assistée par ordinateur</p>
        </div>
        <button onClick={loadTab} className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-white border border-slate-200 rounded-xl p-1 w-fit">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={clsx(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
              tab === t.id
                ? 'bg-primary-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            )}
          >
            <t.icon className="w-4 h-4" />
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
        </div>
      ) : (
        <>
          {/* ============== PIÈCES ============== */}
          {tab === 'parts' && stats && (
            <>
              <div className="grid grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Total pièces', value: stats.totalParts, cls: 'text-slate-900' },
                  { label: 'Stock bas', value: stats.lowStockCount, cls: 'text-orange-600' },
                  { label: 'En rupture', value: stats.outOfStock, cls: 'text-red-600' },
                  { label: 'Valeur stock', value: `${(stats.totalValue / 1000).toFixed(1)}k €`, cls: 'text-green-600' }
                ].map((s) => (
                  <div key={s.label} className="bg-white rounded-xl p-5 border border-slate-200 hover:shadow-md transition">
                    <p className="text-sm text-slate-500">{s.label}</p>
                    <p className={`text-2xl font-bold mt-1 ${s.cls}`}>{s.value}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-xl border border-slate-200">
                <div className="p-4 border-b flex items-center gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      placeholder="Référence ou nom…"
                      className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <button
                    onClick={() => setShowMovementModal(true)}
                    className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-primary-700"
                  >
                    <ArrowUpCircle className="w-4 h-4" /> Mouvement
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        {['Référence', 'Nom', 'Catégorie', 'Qté', 'Min/Max', 'Prix unit.', 'Emplacement', 'Statut'].map((h) => (
                          <th key={h} className="px-5 py-3">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredParts.map((part) => {
                        const st = getStockStatus(part);
                        return (
                          <tr key={part.id} className="hover:bg-slate-50 transition">
                            <td className="px-5 py-3 font-mono text-xs text-slate-600">{part.partNumber}</td>
                            <td className="px-5 py-3 font-medium text-slate-900">{part.name}</td>
                            <td className="px-5 py-3 text-slate-600">{part.category}</td>
                            <td className="px-5 py-3 font-bold text-slate-900">{part.quantity}</td>
                            <td className="px-5 py-3 text-slate-500">{part.minQuantity} / {part.maxQuantity}</td>
                            <td className="px-5 py-3">{part.unitCost.toFixed(2)} €</td>
                            <td className="px-5 py-3 text-slate-500">{part.location}</td>
                            <td className="px-5 py-3">
                              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${st.cls}`}>{st.label}</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* ============== MOUVEMENTS ============== */}
          {tab === 'movements' && (
            <div className="bg-white rounded-xl border border-slate-200">
              {movements.length === 0 ? (
                <p className="p-12 text-center text-slate-400">Aucun mouvement enregistré</p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {movements.map((m) => (
                    <div key={m.id} className="flex items-center gap-4 px-5 py-3">
                      {m.type === 'IN' ? (
                        <ArrowUpCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <ArrowDownCircle className="w-5 h-5 text-red-500" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-medium">{m.type} — {m.quantity} unité(s)</p>
                        <p className="text-xs text-slate-500">{m.reason}</p>
                      </div>
                      <span className="text-xs text-slate-400">{new Date(m.createdAt).toLocaleString('fr-FR')}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ============== PROCÉDURES ============== */}
          {tab === 'procedures' && (
            <div className="space-y-4">
              {procedures.map((proc) => (
                <div key={proc.id} className="bg-white rounded-xl border border-slate-200 p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-slate-900">{proc.title}</h3>
                      <span className="text-xs text-primary-600 font-medium">{proc.category}</span>
                    </div>
                    <span className="text-sm text-slate-500">{proc.estimatedTime} min</span>
                  </div>
                  {proc.safetyNotes && (
                    <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg text-xs text-orange-800 flex gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                      {proc.safetyNotes}
                    </div>
                  )}
                  <ol className="space-y-2">
                    {(proc.steps || []).map((step) => (
                      <li key={step.order} className="flex items-start gap-3 text-sm">
                        <span className="w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                          {step.order}
                        </span>
                        <div className="flex-1">
                          <span className="text-slate-800">{step.action}</span>
                          {step.tools?.length > 0 && (
                            <span className="ml-2 text-xs text-slate-500">({step.tools.join(', ')})</span>
                          )}
                        </div>
                        <span className="text-xs text-slate-400 shrink-0">{step.duration} min</span>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          )}

          {/* ============== ANALYSE ============== */}
          {tab === 'analysis' && analysis && (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              <div className="lg:col-span-3 bg-white rounded-xl p-6 border border-slate-200">
                <h3 className="font-semibold mb-4">Pareto des défaillances par catégorie d'actif</h3>
                {analysis.byCategory.length === 0 ? (
                  <p className="text-slate-400 text-sm text-center py-10">Aucune donnée de défaillance disponible</p>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analysis.byCategory}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="category" stroke="#94a3b8" fontSize={12} />
                      <YAxis stroke="#94a3b8" fontSize={12} />
                      <Tooltip />
                      <Bar dataKey="count" name="Défaillances" radius={[8, 8, 0, 0]}>
                        {analysis.byCategory.map((_, i) => (
                          <Cell key={i} fill={PARETO_COLORS[i % PARETO_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              <div className="lg:col-span-2 space-y-4">
                {[
                  { label: 'MTTR moyen', value: `${analysis.mttr}h`, sub: 'Mean Time To Repair', color: 'blue' },
                  { label: 'Total défaillances', value: analysis.totalFailures, sub: 'Ordres correctifs', color: 'orange' },
                  { label: 'Taux de disponibilité', value: '98.4%', sub: 'Estimé', color: 'green' }
                ].map((kpi) => (
                  <div key={kpi.label} className={`p-5 bg-${kpi.color}-50 border border-${kpi.color}-200 rounded-xl`}>
                    <p className="text-sm text-slate-600">{kpi.label}</p>
                    <p className={`text-3xl font-bold text-${kpi.color}-700 mt-1`}>{kpi.value}</p>
                    <p className="text-xs text-slate-500 mt-1">{kpi.sub}</p>
                  </div>
                ))}

                {analysis.topFailureAssets.length > 0 && (
                  <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <h4 className="font-semibold text-sm mb-3">Top actifs défaillants</h4>
                    <div className="space-y-2">
                      {analysis.topFailureAssets.slice(0, 5).map((a, i) => (
                        <div key={a.id} className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-400 w-4">{i + 1}</span>
                          <div className="flex-1">
                            <p className="text-xs font-medium text-slate-800 truncate">{a.name}</p>
                          </div>
                          <span className="text-xs text-red-600 font-semibold">{a.count} pannes</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* Modal mouvement */}
      {showMovementModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-lg font-bold mb-4">Enregistrer un mouvement</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">Pièce</label>
                <select
                  className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                  value={movementForm.partId}
                  onChange={(e) => setMovementForm({ ...movementForm, partId: e.target.value })}
                >
                  <option value="">Sélectionner…</option>
                  {parts.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} ({p.quantity} en stock)</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Type</label>
                <div className="flex gap-2 mt-1">
                  {['IN', 'OUT', 'ADJUSTMENT'].map((t) => (
                    <button
                      key={t}
                      onClick={() => setMovementForm({ ...movementForm, type: t })}
                      className={clsx(
                        'flex-1 py-2 rounded-lg text-sm font-medium border',
                        movementForm.type === t
                          ? 'bg-primary-600 text-white border-primary-600'
                          : 'border-slate-200 text-slate-600'
                      )}
                    >
                      {t === 'IN' ? 'Entrée' : t === 'OUT' ? 'Sortie' : 'Ajustement'}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Quantité</label>
                <input
                  type="number" min={1}
                  className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                  value={movementForm.quantity}
                  onChange={(e) => setMovementForm({ ...movementForm, quantity: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Motif</label>
                <input
                  placeholder="Ex: Commande fournisseur, maintenance N°123…"
                  className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                  value={movementForm.reason}
                  onChange={(e) => setMovementForm({ ...movementForm, reason: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowMovementModal(false)}
                className="flex-1 py-2 border border-slate-200 rounded-lg text-sm text-slate-600"
              >
                Annuler
              </button>
              <button
                onClick={handleMovement}
                disabled={!movementForm.partId || !movementForm.reason}
                className="flex-1 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium disabled:opacity-50"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
