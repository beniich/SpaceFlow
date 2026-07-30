import { useEffect, useState } from 'react';
import api from '../services/api';
import { Plus, GripVertical, TrendingUp, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import toast from 'react-hot-toast';

const STAGE_COLORS = {
  PIPELINE: 'border-slate-400 bg-slate-50',
  QUALIFIED: 'border-blue-400 bg-blue-50',
  PROPOSAL: 'border-yellow-400 bg-yellow-50',
  NEGOTIATION: 'border-orange-400 bg-orange-50',
  WON: 'border-green-400 bg-green-50',
  LOST: 'border-red-400 bg-red-50'
};

export default function Deals() {
  const [pipeline, setPipeline] = useState([]);
  const [draggedDeal, setDraggedDeal] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    loadPipeline();
    loadContacts();
  }, []);

  const loadPipeline = async () => {
    const { data } = await api.get('/deals/pipeline');
    setPipeline(data.pipeline);
  };

  const loadContacts = async () => {
    const { data } = await api.get('/contacts');
    setContacts(data.contacts || []);
  };

  const handleDrop = async (e, newStage) => {
    e.preventDefault();
    if (!draggedDeal || draggedDeal.status === newStage) return;
    
    try {
      await api.patch(`/deals/${draggedDeal.id}/stage`, { status: newStage });
      toast.success(`Deal déplacé vers ${newStage}`);
      loadPipeline();
    } catch (err) {
      toast.error('Erreur');
    }
    setDraggedDeal(null);
  };

  return (
    <div className="p-8 h-[calc(100vh-64px)] flex flex-col">
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold">Pipeline commercial</h1>
          <p className="text-slate-500">Glissez-déposez les deals entre les étapes</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
          >
            <Plus className="w-4 h-4" /> Nouveau deal
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4 flex-1">
        {pipeline.map((stage) => (
          <div
            key={stage.stage}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, stage.stage)}
            className={`min-w-[300px] flex flex-col rounded-xl border-2 ${STAGE_COLORS[stage.stage]}`}
          >
            <div className="p-3 border-b border-inherit bg-white/50 font-semibold flex justify-between items-center">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-current"></span>
                {stage.label}
              </span>
              <span className="text-xs bg-white px-2 py-1 rounded-full shadow-sm">
                {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(stage.total)}
              </span>
            </div>
            
            <div className="p-2 flex-1 overflow-y-auto space-y-2">
              {stage.deals.map((deal) => (
                <div
                  key={deal.id}
                  draggable
                  onDragStart={() => setDraggedDeal(deal)}
                  className="bg-white p-3 rounded-lg shadow-sm border hover:shadow-md cursor-grab active:cursor-grabbing"
                >
                  <div className="font-medium mb-1">{deal.name}</div>
                  <div className="text-sm text-slate-500 mb-3">{deal.contact?.company || deal.contact?.lastName}</div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-primary-700">
                      {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: deal.currency }).format(deal.amount)}
                    </span>
                    <span className="text-xs text-slate-400">
                      {format(new Date(deal.expectedCloseDate), 'MMM yyyy', { locale: fr })}
                    </span>
                  </div>
                </div>
              ))}
              {stage.deals.length === 0 && (
                <div className="text-center p-4 text-sm text-slate-400 border-2 border-dashed border-inherit rounded-lg">
                  Glisser un deal ici
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <DealModal 
          contacts={contacts} 
          onClose={() => setShowModal(false)} 
          onSuccess={loadPipeline} 
        />
      )}
    </div>
  );
}

function DealModal({ contacts, onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: '', contactId: '', amount: 0, expectedCloseDate: '', status: 'PIPELINE'
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/deals', form);
      toast.success('Deal créé');
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erreur');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full">
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">Nouveau Deal</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="text-sm font-medium">Nom de l'opportunité</label>
              <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full mt-1 px-3 py-2 border rounded-lg" />
            </div>
            
            <div>
              <label className="text-sm font-medium">Contact associé</label>
              <select required value={form.contactId} onChange={e => setForm({...form, contactId: e.target.value})} className="w-full mt-1 px-3 py-2 border rounded-lg">
                <option value="">Sélectionner un contact</option>
                {contacts.map(c => (
                  <option key={c.id} value={c.id}>{c.firstName} {c.lastName} {c.company ? `(${c.company})` : ''}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Montant (€)</label>
                <input type="number" required value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} className="w-full mt-1 px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="text-sm font-medium">Date de clôture estimée</label>
                <input type="date" required value={form.expectedCloseDate} onChange={e => setForm({...form, expectedCloseDate: e.target.value})} className="w-full mt-1 px-3 py-2 border rounded-lg" />
              </div>
            </div>
          </div>
          <div className="p-6 border-t flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 hover:bg-slate-100 rounded-lg">Annuler</button>
            <button type="submit" disabled={saving} className="px-4 py-2 bg-primary-600 text-white rounded-lg disabled:opacity-50">
              {saving ? 'Création...' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
