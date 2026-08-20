import { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import {
  Zap, Plus, Trash2, Play, CheckCircle2, XCircle, ChevronDown,
  ChevronRight, Settings, Clock, AlertTriangle, Wrench, Bell, Mail, Globe
} from 'lucide-react';

const TRIGGER_TYPES = [
  { value: 'IOT_ANOMALY', label: '📡 Anomalie IoT capteur', desc: 'Quand un capteur dépasse un seuil' },
  { value: 'WORK_ORDER_CREATED', label: '🔧 Ordre de travail créé', desc: 'À la création d\'un OT' },
  { value: 'WORK_ORDER_COMPLETED', label: '✅ Ordre de travail terminé', desc: 'À la clôture d\'un OT' },
  { value: 'ASSET_STATUS_CHANGE', label: '⚙️ Changement statut actif', desc: 'Quand un équipement change d\'état' },
  { value: 'SCHEDULE', label: '🕐 Planification récurrente', desc: 'Exécution programmée (CRON)' },
];

const ACTION_TYPES = [
  { value: 'NOTIFY', label: 'Notification In-App', icon: Bell, color: 'text-blue-400' },
  { value: 'SEND_EMAIL', label: 'Envoyer un Email', icon: Mail, color: 'text-green-400' },
  { value: 'CREATE_WO', label: 'Créer un Ordre de Travail', icon: Wrench, color: 'text-amber-400' },
  { value: 'UPDATE_STATUS', label: 'Modifier le Statut', icon: Settings, color: 'text-purple-400' },
  { value: 'CALL_API', label: 'Appel Webhook Externe', icon: Globe, color: 'text-cyan-400' },
];

const CONDITION_OPERATORS = [
  { value: 'gt', label: '> (Supérieur à)' },
  { value: 'gte', label: '>= (Supérieur ou égal)' },
  { value: 'lt', label: '< (Inférieur à)' },
  { value: 'lte', label: '<= (Inférieur ou égal)' },
  { value: 'eq', label: '= (Égal à)' },
  { value: 'neq', label: '≠ (Différent de)' },
  { value: 'contains', label: 'Contient' },
];

function ActionConfigurator({ action, onChange }) {
  const update = (field, val) => onChange({ ...action, config: { ...action.config, [field]: val } });

  switch (action.type) {
    case 'NOTIFY':
      return (
        <div className="space-y-2">
          <input placeholder="Titre de la notification" value={action.config?.title || ''} onChange={e => update('title', e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-cyan-500" />
          <input placeholder="Corps du message (ex: {{type}} sur {{assetId}})" value={action.config?.body || ''} onChange={e => update('body', e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-cyan-500" />
        </div>
      );
    case 'CREATE_WO':
      return (
        <div className="space-y-2">
          <input placeholder="Titre de l'OT (ex: Anomalie {{type}} détectée)" value={action.config?.title || ''} onChange={e => update('title', e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-cyan-500" />
          <select value={action.config?.priority || 'HIGH'} onChange={e => update('priority', e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-cyan-500">
            {['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      );
    case 'CALL_API':
      return (
        <input placeholder="URL Webhook cible (ex: https://hooks.slack.com/...)" value={action.config?.url || ''} onChange={e => update('url', e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-700 px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-cyan-500" />
      );
    case 'SEND_EMAIL':
      return (
        <div className="space-y-2">
          <input placeholder="Destinataire (email)" value={action.config?.to || ''} onChange={e => update('to', e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-cyan-500" />
          <input placeholder="Objet" value={action.config?.subject || ''} onChange={e => update('subject', e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-cyan-500" />
        </div>
      );
    default:
      return <p className="text-xs text-zinc-500 italic">Sélectionnez un type d'action pour configurer.</p>;
  }
}

export default function WorkflowBuilder() {
  const [workflows, setWorkflows] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(false);

  // New workflow form state
  const [form, setForm] = useState({
    name: '',
    description: '',
    triggerType: 'IOT_ANOMALY',
    conditions: [{ field: 'value', operator: 'gt', value: '25' }],
    actions: [{ type: 'NOTIFY', order: 1, config: { title: 'Anomalie détectée', body: 'Valeur : {{value}}' } }]
  });

  useEffect(() => { loadWorkflows(); }, []);

  const loadWorkflows = async () => {
    try {
      const { data } = await api.get('/workflows');
      setWorkflows(data.workflows || []);
    } catch {
      // Afficher des workflows de démo si l'API n'est pas accessible
      setWorkflows([
        {
          id: 'demo-1', name: 'Alerte Température Critique', active: true,
          triggerType: 'IOT_ANOMALY', createdAt: new Date().toISOString(),
          conditions: [{ field: 'value', operator: 'gt', value: '25' }],
          actions: [{ type: 'NOTIFY', order: 1, config: { title: 'Alerte capteur', body: 'Valeur: {{value}}' } }]
        }
      ]);
    }
  };

  const toggleActive = async (id, currentStatus) => {
    try {
      await api.patch(`/workflows/${id}`, { active: !currentStatus });
      setWorkflows(prev => prev.map(w => w.id === id ? { ...w, active: !currentStatus } : w));
      toast.success(`Workflow ${!currentStatus ? 'activé' : 'désactivé'}`);
    } catch {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const deleteWorkflow = async (id) => {
    if (!confirm('Supprimer ce workflow ?')) return;
    try {
      await api.delete(`/workflows/${id}`);
      setWorkflows(prev => prev.filter(w => w.id !== id));
      toast.success('Workflow supprimé');
    } catch {
      toast.error('Erreur lors de la suppression');
    }
  };

  const testWorkflow = async (id) => {
    toast.loading('Exécution du test...');
    try {
      await api.post(`/workflows/${id}/test`, { triggerData: { value: 27, type: 'temperature', assetId: null } });
      toast.dismiss();
      toast.success('Workflow testé avec succès !');
    } catch {
      toast.dismiss();
      toast.error('Erreur durant le test (simulation)');
    }
  };

  const addCondition = () => {
    setForm(f => ({ ...f, conditions: [...f.conditions, { field: 'value', operator: 'gt', value: '' }] }));
  };

  const addAction = () => {
    setForm(f => ({ ...f, actions: [...f.actions, { type: 'NOTIFY', order: f.actions.length + 1, config: {} }] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/workflows', form);
      setWorkflows(prev => [data.workflow, ...prev]);
      toast.success('Workflow créé avec succès !');
      setShowForm(false);
      setForm({ name: '', description: '', triggerType: 'IOT_ANOMALY', conditions: [], actions: [] });
    } catch (err) {
      toast.error('Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 min-h-screen bg-zinc-950 text-zinc-100 font-sans space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-widest text-zinc-50 flex items-center gap-2">
            <Zap className="w-7 h-7 text-amber-400" />
            Workflow Builder — Automatisation No-Code
          </h1>
          <p className="text-xs font-mono text-zinc-400 mt-1">
            Créez des règles d'automatisation conditionnelles connectées à vos équipements et capteurs IoT
          </p>
        </div>
        <button onClick={() => setShowForm(v => !v)}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-mono text-xs font-bold uppercase transition">
          <Plus className="w-4 h-4" /> {showForm ? 'Annuler' : 'Nouveau Workflow'}
        </button>
      </div>

      {/* Creation Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 p-6 space-y-6">
          <h2 className="font-bold font-mono text-sm text-zinc-200 uppercase tracking-wider border-b border-zinc-800 pb-3">
            Configuration du Workflow
          </h2>

          {/* Infos générales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-1.5">Nom du Workflow *</label>
              <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Ex: Alerte température critique"
                className="w-full bg-zinc-950 border border-zinc-700 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-amber-500" />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-1.5">Déclencheur (Trigger) *</label>
              <select value={form.triggerType} onChange={e => setForm(f => ({ ...f, triggerType: e.target.value }))}
                className="w-full bg-zinc-950 border border-zinc-700 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-amber-500">
                {TRIGGER_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
          </div>

          {/* Conditions */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[10px] font-mono text-zinc-500 uppercase font-bold">Conditions (SI...)</h3>
              <button type="button" onClick={addCondition}
                className="text-[10px] font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1">
                <Plus className="w-3 h-3" /> Ajouter
              </button>
            </div>
            <div className="space-y-2">
              {form.conditions.map((cond, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input value={cond.field} onChange={e => {
                    const c = [...form.conditions]; c[idx] = { ...c[idx], field: e.target.value };
                    setForm(f => ({ ...f, conditions: c }));
                  }} placeholder="Champ (ex: value)" className="flex-1 bg-zinc-950 border border-zinc-700 px-2 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-amber-500" />
                  <select value={cond.operator} onChange={e => {
                    const c = [...form.conditions]; c[idx] = { ...c[idx], operator: e.target.value };
                    setForm(f => ({ ...f, conditions: c }));
                  }} className="flex-1 bg-zinc-950 border border-zinc-700 px-2 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-amber-500">
                    {CONDITION_OPERATORS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                  <input value={cond.value} onChange={e => {
                    const c = [...form.conditions]; c[idx] = { ...c[idx], value: e.target.value };
                    setForm(f => ({ ...f, conditions: c }));
                  }} placeholder="Valeur (ex: 25)" className="w-24 bg-zinc-950 border border-zinc-700 px-2 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-amber-500" />
                  <button type="button" onClick={() => setForm(f => ({ ...f, conditions: f.conditions.filter((_, i) => i !== idx) }))}
                    className="p-1.5 text-zinc-600 hover:text-red-400 transition">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[10px] font-mono text-zinc-500 uppercase font-bold">Actions (ALORS...)</h3>
              <button type="button" onClick={addAction}
                className="text-[10px] font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1">
                <Plus className="w-3 h-3" /> Ajouter
              </button>
            </div>
            <div className="space-y-3">
              {form.actions.map((action, idx) => {
                const at = ACTION_TYPES.find(a => a.value === action.type);
                return (
                  <div key={idx} className="border border-zinc-800 bg-zinc-950 p-3 space-y-2">
                    <div className="flex gap-2 items-center">
                      <span className="text-[10px] font-mono text-zinc-600 uppercase w-6">{idx + 1}.</span>
                      <select value={action.type} onChange={e => {
                        const a = [...form.actions]; a[idx] = { ...a[idx], type: e.target.value, config: {} };
                        setForm(f => ({ ...f, actions: a }));
                      }} className="flex-1 bg-zinc-900 border border-zinc-700 px-2 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-amber-500">
                        {ACTION_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                      </select>
                      {at && <at.icon className={`w-4 h-4 ${at.color} shrink-0`} />}
                      <button type="button" onClick={() => setForm(f => ({ ...f, actions: f.actions.filter((_, i) => i !== idx) }))}
                        className="p-1 text-zinc-600 hover:text-red-400 transition">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <ActionConfigurator action={action} onChange={updated => {
                      const a = [...form.actions]; a[idx] = updated;
                      setForm(f => ({ ...f, actions: a }));
                    }} />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3 pt-2 border-t border-zinc-800">
            <button type="submit" disabled={loading}
              className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold font-mono text-xs uppercase transition disabled:opacity-50">
              {loading ? 'Création...' : 'Créer le Workflow'}
            </button>
            <button type="button" onClick={() => setShowForm(false)}
              className="px-5 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-mono text-xs uppercase transition">
              Annuler
            </button>
          </div>
        </form>
      )}

      {/* Workflows List */}
      <div className="space-y-3">
        {workflows.length === 0 ? (
          <div className="text-center py-16 text-zinc-600 font-mono text-sm">
            <Zap className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>Aucun workflow défini.</p>
            <p className="text-xs mt-1">Créez votre première règle d'automatisation ci-dessus.</p>
          </div>
        ) : (
          workflows.map(wf => {
            const trigger = TRIGGER_TYPES.find(t => t.value === wf.triggerType);
            const isExpanded = expandedId === wf.id;
            return (
              <div key={wf.id} className={`border transition ${wf.active ? 'border-zinc-700 bg-zinc-900' : 'border-zinc-800 bg-zinc-950 opacity-60'}`}>
                <div className="flex items-center gap-3 p-4">
                  <button onClick={() => setExpandedId(isExpanded ? null : wf.id)}
                    className="text-zinc-500 hover:text-zinc-300 transition">
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-zinc-100 truncate">{wf.name}</p>
                    <p className="text-[11px] font-mono text-zinc-500 mt-0.5">{trigger?.label || wf.triggerType} • {wf.actions?.length || 0} action(s)</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[10px] font-mono px-2 py-0.5 border ${wf.active ? 'border-emerald-500/40 text-emerald-400 bg-emerald-950/30' : 'border-zinc-700 text-zinc-500'}`}>
                      {wf.active ? 'ACTIF' : 'INACTIF'}
                    </span>
                    <button onClick={() => testWorkflow(wf.id)} title="Tester"
                      className="p-1.5 text-zinc-500 hover:text-amber-400 transition">
                      <Play className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => toggleActive(wf.id, wf.active)} title={wf.active ? 'Désactiver' : 'Activer'}
                      className={`p-1.5 transition ${wf.active ? 'text-emerald-400 hover:text-zinc-400' : 'text-zinc-500 hover:text-emerald-400'}`}>
                      {wf.active ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                    </button>
                    <button onClick={() => deleteWorkflow(wf.id)} title="Supprimer"
                      className="p-1.5 text-zinc-600 hover:text-red-400 transition">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-zinc-800 pt-4 grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                    <div>
                      <p className="text-[10px] text-zinc-500 uppercase mb-2 font-bold">Conditions (SI...)</p>
                      {wf.conditions?.length > 0 ? wf.conditions.map((c, i) => (
                        <p key={i} className="text-zinc-300 py-1 border-b border-zinc-800">
                          <span className="text-zinc-500">{c.field}</span> <span className="text-amber-400">{c.operator}</span> <span className="text-cyan-400">{c.value}</span>
                        </p>
                      )) : <p className="text-zinc-600 italic">Aucune condition (toujours déclenché)</p>}
                    </div>
                    <div>
                      <p className="text-[10px] text-zinc-500 uppercase mb-2 font-bold">Actions (ALORS...)</p>
                      {wf.actions?.map((a, i) => {
                        const at = ACTION_TYPES.find(t => t.value === a.type);
                        return (
                          <div key={i} className="flex items-center gap-2 py-1 border-b border-zinc-800">
                            {at && <at.icon className={`w-3.5 h-3.5 ${at.color}`} />}
                            <span className="text-zinc-300">{at?.label || a.type}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
