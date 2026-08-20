import { useState, useEffect } from 'react';
import Modal from './Modal';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function WorkOrderModal({ open, onClose, workOrder, onSuccess }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    type: 'PREVENTIVE',
    priority: 'MEDIUM',
    status: 'PENDING',
    estimatedCost: 0,
    scheduledAt: '',
    assetId: '',
    assignedToId: ''
  });
  const [assets, setAssets] = useState([]);
  const [users, setUsers] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      loadData();
      if (workOrder) {
        setForm({
          title: workOrder.title || '',
          description: workOrder.description || '',
          type: workOrder.type || 'PREVENTIVE',
          priority: workOrder.priority || 'MEDIUM',
          status: workOrder.status || 'PENDING',
          estimatedCost: workOrder.estimatedCost || 0,
          scheduledAt: workOrder.scheduledAt?.slice(0, 16) || '',
          assetId: workOrder.assetId || '',
          assignedToId: workOrder.assignedToId || ''
        });
      } else {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(9, 0, 0, 0);
        setForm({
          title: '', description: '', type: 'PREVENTIVE',
          priority: 'MEDIUM', status: 'PENDING', estimatedCost: 0,
          scheduledAt: tomorrow.toISOString().slice(0, 16),
          assetId: '', assignedToId: ''
        });
      }
    }
  }, [open, workOrder]);

  const loadData = async () => {
    try {
      const [assetsRes, usersRes] = await Promise.all([
        api.get('/assets?limit=200'),
        api.get('/users?role=TECHNICIAN')
      ]);
      setAssets(assetsRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        scheduledAt: new Date(form.scheduledAt).toISOString()
      };
      if (workOrder) {
        await api.put(`/workorders/${workOrder.id}`, payload);
        toast.success('Ordre mis à jour');
      } else {
        await api.post('/workorders', payload);
        toast.success('Ordre créé');
      }
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erreur');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={workOrder ? 'Modifier l\'ordre' : 'Nouvel ordre de travail'}
      size="lg"
      footer={
        <>
          <button type="button" onClick={onClose} className="px-4 py-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg text-xs font-mono uppercase">
            Annuler
          </button>
          <button
            type="submit"
            form="wo-form"
            disabled={saving}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-mono font-bold text-xs uppercase rounded-lg disabled:opacity-50 transition"
          >
            {saving ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </>
      }
    >
      <form id="wo-form" onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block font-mono font-semibold text-zinc-300 mb-1">Titre *</label>
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Remplacement filtre HVAC"
            className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 text-zinc-100 placeholder-zinc-600 rounded-lg focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <label className="block font-mono font-semibold text-zinc-300 mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 text-zinc-100 placeholder-zinc-600 rounded-lg focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-mono font-semibold text-zinc-300 mb-1">Type *</label>
            <select
              required
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 text-zinc-100 rounded-lg focus:outline-none focus:border-cyan-500"
            >
              <option value="PREVENTIVE">Préventive</option>
              <option value="PREDICTIVE">Prédictive</option>
              <option value="CORRECTIVE">Corrective</option>
            </select>
          </div>
          <div>
            <label className="block font-mono font-semibold text-zinc-300 mb-1">Priorité *</label>
            <select
              required
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 text-zinc-100 rounded-lg focus:outline-none focus:border-cyan-500"
            >
              <option value="LOW">Basse</option>
              <option value="MEDIUM">Moyenne</option>
              <option value="HIGH">Haute</option>
              <option value="CRITICAL">Critique</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-mono font-semibold text-zinc-300 mb-1">Actif *</label>
            <select
              required
              value={form.assetId}
              onChange={(e) => setForm({ ...form, assetId: e.target.value })}
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 text-zinc-100 rounded-lg focus:outline-none focus:border-cyan-500"
            >
              <option value="">Sélectionner...</option>
              {assets.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-mono font-semibold text-zinc-300 mb-1">Assigné à</label>
            <select
              value={form.assignedToId}
              onChange={(e) => setForm({ ...form, assignedToId: e.target.value })}
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 text-zinc-100 rounded-lg focus:outline-none focus:border-cyan-500"
            >
              <option value="">Non assigné</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>{u.firstName} {u.lastName}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-mono font-semibold text-zinc-300 mb-1">Date prévue *</label>
            <input
              required
              type="datetime-local"
              value={form.scheduledAt}
              onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })}
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 text-zinc-100 rounded-lg focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div>
            <label className="block font-mono font-semibold text-zinc-300 mb-1">Coût estimé (€)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.estimatedCost}
              onChange={(e) => setForm({ ...form, estimatedCost: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 text-zinc-100 rounded-lg focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {workOrder && (
          <div>
            <label className="block font-mono font-semibold text-zinc-300 mb-1">Statut</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 text-zinc-100 rounded-lg focus:outline-none focus:border-cyan-500"
            >
              <option value="PENDING">En attente</option>
              <option value="IN_PROGRESS">En cours</option>
              <option value="COMPLETED">Terminé</option>
              <option value="CANCELLED">Annulé</option>
            </select>
          </div>
        )}
      </form>
    </Modal>
  );
}
