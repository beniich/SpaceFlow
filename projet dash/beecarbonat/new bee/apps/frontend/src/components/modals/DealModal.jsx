import { useState, useEffect } from 'react';
import Modal from './Modal';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function DealModal({ open, onClose, deal, onSuccess }) {
  const [form, setForm] = useState({
    name: '',
    amount: 0,
    contactId: '',
    status: 'PIPELINE',
    expectedCloseDate: '',
    description: '',
    source: ''
  });
  const [contacts, setContacts] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      loadContacts();
      if (deal) {
        setForm({
          name: deal.name || '',
          amount: deal.amount || 0,
          contactId: deal.contactId || '',
          status: deal.status || 'PIPELINE',
          expectedCloseDate: deal.expectedCloseDate?.split('T')[0] || '',
          description: deal.description || '',
          source: deal.source || ''
        });
      } else {
        const defaultDate = new Date();
        defaultDate.setMonth(defaultDate.getMonth() + 1);
        setForm({
          name: '', amount: 0, contactId: '', status: 'PIPELINE',
          expectedCloseDate: defaultDate.toISOString().split('T')[0],
          description: '', source: ''
        });
      }
    }
  }, [open, deal]);

  const loadContacts = async () => {
    try {
      const { data } = await api.get('/contacts?limit=100');
      setContacts(data.contacts || data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (deal) {
        await api.put(`/deals/${deal.id}`, form);
        toast.success('Deal mis à jour');
      } else {
        await api.post('/deals', form);
        toast.success('Deal créé');
      }
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erreur');
    } finally {
      setSaving(false);
    }
  };

  const statuses = [
    { value: 'PIPELINE', label: 'Pipeline' },
    { value: 'QUALIFIED', label: 'Qualifié' },
    { value: 'PROPOSAL', label: 'Proposition' },
    { value: 'NEGOTIATION', label: 'Négociation' },
    { value: 'WON', label: 'Gagné' },
    { value: 'LOST', label: 'Perdu' }
  ];

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={deal ? 'Modifier le deal' : 'Nouveau deal'}
      size="md"
      footer={
        <>
          <button type="button" onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">
            Annuler
          </button>
          <button
            type="submit"
            form="deal-form"
            disabled={saving}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            {saving ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </>
      }
    >
      <form id="deal-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Nom du deal *</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Contrat annuel ABC Corp"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Montant (€) *</label>
            <input
              required
              type="number"
              min="0"
              step="0.01"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Date prévue *</label>
            <input
              required
              type="date"
              value={form.expectedCloseDate}
              onChange={(e) => setForm({ ...form, expectedCloseDate: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Contact *</label>
          <select
            required
            value={form.contactId}
            onChange={(e) => setForm({ ...form, contactId: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Sélectionner un contact...</option>
            {contacts.map((c) => (
              <option key={c.id} value={c.id}>
                {c.firstName} {c.lastName} {c.company && `(${c.company})`}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Étape</label>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            {statuses.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            placeholder="Détails du deal, prochaines étapes..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Source</label>
          <input
            value={form.source}
            onChange={(e) => setForm({ ...form, source: e.target.value })}
            placeholder="Site web, recommandation, salon..."
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </form>
    </Modal>
  );
}
