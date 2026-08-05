import { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { invoiceService } from '../../services/invoiceService';
import toast from 'react-hot-toast';
import api from '../../services/api';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateInvoiceModal({ onClose, onSuccess }: Props) {
  const [members, setMembers] = useState<any[]>([]);
  const [memberId, setMemberId] = useState('');
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  });
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState([
    { description: 'Loyer mensuel', quantity: 1, unitPrice: 100 }
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/members', { params: { limit: 200 } }).then(({ data }) => {
      const list = data.members || [];
      setMembers(list);
      if (list.length > 0) setMemberId(list[0].id);
    }).catch(() => {});
  }, []);

  const updateItem = (i: number, field: string, value: any) => {
    const copy = [...items];
    copy[i] = { ...copy[i], [field]: value };
    setItems(copy);
  };

  const totalCents = items.reduce(
    (sum, item) => sum + Math.round(item.quantity * item.unitPrice * 100),
    0
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberId || !items.length) {
      toast.error('Member et au moins un item requis');
      return;
    }
    setLoading(true);
    try {
      await invoiceService.create({
        memberId,
        dueDate,
        notes: notes || undefined,
        items: items.map(item => ({
          description: item.description,
          quantity: item.quantity,
          unitPriceCents: Math.round(item.unitPrice * 100)
        }))
      });
      toast.success('✅ Facture créée');
      onSuccess();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-xl font-bold">Nouvelle facture</h2>
          <button type="button" onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Member *</label>
              <select
                required
                value={memberId}
                onChange={e => setMemberId(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value="">Sélectionner...</option>
                {members.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.companyName || `${m.firstName} ${m.lastName}`}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Échéance</label>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Lignes de facture</label>
              <button
                type="button"
                onClick={() => setItems([...items, { description: '', quantity: 1, unitPrice: 0 }])}
                className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Ajouter
              </button>
            </div>
            <div className="space-y-2">
              <div className="grid grid-cols-12 gap-2 text-xs text-slate-500 font-medium">
                <div className="col-span-6">Description</div>
                <div className="col-span-2">Qté</div>
                <div className="col-span-3">Prix (€)</div>
                <div className="col-span-1"></div>
              </div>
              {items.map((item, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 items-center">
                  <input
                    placeholder="Description"
                    value={item.description}
                    onChange={e => updateItem(i, 'description', e.target.value)}
                    className="col-span-6 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    required
                  />
                  <input
                    type="number" min="1"
                    value={item.quantity}
                    onChange={e => updateItem(i, 'quantity', parseInt(e.target.value) || 1)}
                    className="col-span-2 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                  <input
                    type="number" step="0.01" min="0"
                    value={item.unitPrice}
                    onChange={e => updateItem(i, 'unitPrice', parseFloat(e.target.value) || 0)}
                    className="col-span-3 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                  <button
                    type="button"
                    onClick={() => setItems(items.filter((_, j) => j !== i))}
                    disabled={items.length === 1}
                    className="col-span-1 p-2 text-red-500 hover:bg-red-50 rounded disabled:opacity-30"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-slate-50 rounded-lg flex justify-between items-center">
              <span className="text-sm font-medium text-slate-600">Total HT (sans TVA)</span>
              <span className="text-xl font-bold">{(totalCents / 100).toFixed(2)}€</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={2}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Notes optionnelles..."
            />
          </div>
        </div>

        <div className="p-6 border-t flex gap-2">
          <button type="button" onClick={onClose} className="flex-1 border border-slate-200 rounded-xl py-2 font-medium text-slate-700 hover:bg-slate-50 transition">
            Annuler
          </button>
          <button type="submit" disabled={loading} className="flex-1 bg-indigo-600 text-white rounded-xl py-2 font-medium hover:bg-indigo-700 transition disabled:opacity-50">
            {loading ? 'Création...' : 'Créer la facture'}
          </button>
        </div>
      </form>
    </div>
  );
}
