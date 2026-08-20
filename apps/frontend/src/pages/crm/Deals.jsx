import React, { useState, useEffect, useRef } from 'react';
import crmApi from '../../services/crmApi';
import { Target, Plus, Search, Filter, MoreVertical, Edit2, Trash2, Calendar, DollarSign, User as UserIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function CRMDeals() {
  const [pipeline, setPipeline] = useState([]);
  const [stages, setStages] = useState({});
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState([]); // Pour le select de creation de deal
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '', amount: 0, status: 'PIPELINE', expectedCloseDate: '', contactId: ''
  });

  const fetchPipeline = async () => {
    setLoading(true);
    try {
      const res = await crmApi.get('/deals/pipeline');
      setPipeline(res.data.pipeline);
      setStages(res.data.stages);
      setSummary(res.data.summary);
    } catch (error) {
      toast.error('Erreur lors du chargement du pipeline');
    } finally {
      setLoading(false);
    }
  };

  const fetchContacts = async () => {
    try {
      const res = await crmApi.get('/contacts?limit=100');
      setContacts(res.data.contacts);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPipeline();
    fetchContacts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDeal) {
        await crmApi.put(`/deals/${editingDeal.id}`, formData);
        toast.success('Deal mis a jour');
      } else {
        await crmApi.post('/deals', {
          ...formData,
          amount: parseFloat(formData.amount),
          expectedCloseDate: new Date(formData.expectedCloseDate).toISOString()
        });
        toast.success('Deal cree');
      }
      setIsModalOpen(false);
      setEditingDeal(null);
      setFormData({ name: '', amount: 0, status: 'PIPELINE', expectedCloseDate: '', contactId: '' });
      fetchPipeline();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erreur de sauvegarde');
    }
  };

  const openEdit = (deal) => {
    setEditingDeal(deal);
    setFormData({
      name: deal.name,
      amount: deal.amount,
      status: deal.status,
      contactId: deal.contactId,
      expectedCloseDate: deal.expectedCloseDate ? new Date(deal.expectedCloseDate).toISOString().split('T')[0] : ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce deal ?')) return;
    try {
      await crmApi.delete(`/deals/${id}`);
      toast.success('Deal supprime');
      fetchPipeline();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  // Drag and Drop Logic
  const dragItem = useRef();
  const dragNode = useRef();

  const handleDragStart = (e, deal, sourceStage) => {
    dragItem.current = { deal, sourceStage };
    dragNode.current = e.target;
    dragNode.current.addEventListener('dragend', handleDragEnd);
    setTimeout(() => { e.target.style.opacity = '0.5'; }, 0);
  };

  const handleDragEnd = () => {
    if (dragNode.current) {
      dragNode.current.style.opacity = '1';
      dragNode.current.removeEventListener('dragend', handleDragEnd);
    }
    dragItem.current = null;
    dragNode.current = null;
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, targetStage) => {
    e.preventDefault();
    if (!dragItem.current) return;

    const { deal, sourceStage } = dragItem.current;
    if (sourceStage === targetStage) return;

    // Mise a jour optimiste UI
    const updatedPipeline = pipeline.map(stage => {
      if (stage.stage === sourceStage) {
        return { ...stage, deals: stage.deals.filter(d => d.id !== deal.id), total: stage.total - deal.amount };
      }
      if (stage.stage === targetStage) {
        return { ...stage, deals: [...stage.deals, { ...deal, status: targetStage }], total: stage.total + deal.amount };
      }
      return stage;
    });
    setPipeline(updatedPipeline);

    try {
      await crmApi.patch(`/deals/${deal.id}/stage`, { stage: targetStage });
      fetchPipeline(); // Resync pour avoir les bonnes probabilites et stats
    } catch (error) {
      toast.error('Erreur lors du changement de statut');
      fetchPipeline(); // Rollback UI
    }
  };

  const formatCurrency = (val) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(val);

  const getStageColorClass = (color) => {
    const map = {
      slate: 'bg-slate-100 border-slate-300 text-slate-700',
      blue: 'bg-blue-100 border-blue-300 text-blue-700',
      yellow: 'bg-yellow-100 border-yellow-300 text-yellow-700',
      orange: 'bg-orange-100 border-orange-300 text-orange-700',
      green: 'bg-emerald-100 border-emerald-300 text-emerald-700',
      red: 'bg-red-100 border-red-300 text-red-700'
    };
    return map[color] || map.slate;
  };

  return (
    <div className="p-8 h-full flex flex-col mx-auto w-full max-w-[1600px] overflow-hidden relative z-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center">
            <Target className="mr-3 text-indigo-600" />
            Pipeline (Deals)
          </h1>
          <p className="text-slate-500 text-sm mt-1">Glissez-deposez vos deals pour les faire avancer.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-[#18181b]/80 backdrop-blur-md rounded-lg shadow-sm border border-zinc-800 px-4 py-2 flex items-center gap-4 mr-2 text-sm">
            <div><span className="text-zinc-500 mr-2">Pipeline Total:</span><span className="font-bold text-white">{formatCurrency(summary.pipelineValue || 0)}</span></div>
            <div className="w-px h-4 bg-zinc-700"></div>
            <div><span className="text-emerald-400 mr-2">Gagnes:</span><span className="font-bold text-emerald-400">{formatCurrency(summary.wonTotal || 0)}</span></div>
          </div>
          <button 
            onClick={() => {
              setEditingDeal(null);
              setFormData({ name: '', amount: 0, status: 'PIPELINE', expectedCloseDate: '', contactId: '' });
              setIsModalOpen(true);
            }}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-500 transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)]"
          >
            <Plus size={18} className="mr-2" />
            Nouveau Deal
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 flex gap-4 overflow-x-auto pb-4 items-start">
        {loading ? (
          <div className="w-full flex justify-center py-20 text-slate-400">Chargement du pipeline...</div>
        ) : (
          pipeline.map((stageData) => (
            <div 
              key={stageData.stage}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stageData.stage)}
              className="flex-shrink-0 w-80 flex flex-col max-h-full bg-[#18181b]/60 backdrop-blur-md rounded-xl border border-zinc-800/60 shadow-xl overflow-hidden"
            >
              {/* Stage Header */}
              <div className="p-4 border-b border-zinc-800/50 bg-zinc-900/30">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-bold text-white">{stageData.label}</h3>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">
                    {stageData.deals.length}
                  </span>
                </div>
                <div className="text-sm font-medium text-zinc-400">
                  {formatCurrency(stageData.total)}
                </div>
              </div>

              {/* Deals List */}
              <div className="p-3 flex-1 overflow-y-auto space-y-3">
                {stageData.deals.map((deal) => (
                  <div 
                    key={deal.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, deal, stageData.stage)}
                    className="bg-[#18181b]/80 border border-zinc-700/50 p-4 rounded-lg cursor-grab hover:border-indigo-500/30 hover:shadow-[0_0_15px_rgba(99,102,241,0.1)] transition-all group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-white leading-tight">{deal.name}</h4>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEdit(deal)} className="p-1 text-zinc-500 hover:text-indigo-400"><Edit2 size={14}/></button>
                        <button onClick={() => handleDelete(deal.id)} className="p-1 text-zinc-500 hover:text-red-400"><Trash2 size={14}/></button>
                      </div>
                    </div>
                    
                    <div className="text-lg font-bold text-indigo-400 mb-3">
                      {formatCurrency(deal.amount)}
                    </div>
                    
                    <div className="space-y-1.5">
                      <div className="flex items-center text-xs text-zinc-400">
                        <UserIcon size={12} className="mr-2 text-zinc-500" />
                        <span className="truncate">{deal.contact?.firstName} {deal.contact?.lastName}</span>
                      </div>
                      <div className="flex items-center text-xs text-zinc-400">
                        <Calendar size={12} className="mr-2 text-zinc-500" />
                        {deal.expectedCloseDate ? format(new Date(deal.expectedCloseDate), 'dd MMM yyyy', { locale: fr }) : '-'}
                      </div>
                    </div>
                  </div>
                ))}
                
                {stageData.deals.length === 0 && (
                  <div className="h-24 border-2 border-dashed border-zinc-800 rounded-lg flex items-center justify-center text-zinc-600 text-sm p-4 text-center">
                    Deposez des deals ici
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {/* Colonnes Gagne/Perdu Rapides */}
        {!loading && (
          <div className="flex-shrink-0 w-16 flex flex-col gap-4">
            <div 
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, 'WON')}
              className="h-32 bg-emerald-500/10 border-2 border-dashed border-emerald-500/30 rounded-xl flex items-center justify-center text-emerald-400 hover:bg-emerald-500/20 transition-colors"
              title="Deposer pour Gagner"
            >
              <DollarSign size={24} />
            </div>
            <div 
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, 'LOST')}
              className="h-32 bg-red-500/10 border-2 border-dashed border-red-500/30 rounded-xl flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-colors"
              title="Deposer pour Perdre"
            >
              <Trash2 size={24} />
            </div>
          </div>
        )}
      </div>

      {/* Modal CRUD */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#18181b] border border-zinc-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
              <h2 className="text-xl font-bold text-white">
                {editingDeal ? 'Modifier le deal' : 'Nouveau deal'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-zinc-400">Nom de l'opportunite *</label>
                <input required type="text" className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none" 
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-zinc-400">Montant (EUR) *</label>
                <input required type="number" step="0.01" min="0" className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none" 
                  value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-zinc-400">Contact lie *</label>
                <select required className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.contactId} onChange={e => setFormData({...formData, contactId: e.target.value})}>
                  <option value="">Selectionner un contact...</option>
                  {contacts.map(c => (
                    <option key={c.id} value={c.id}>{c.firstName} {c.lastName} {c.company ? `(${c.company})` : ''}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-400">Statut initial</label>
                  <select className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                    {Object.entries(stages).filter(([k]) => !['WON', 'LOST'].includes(k)).map(([key, info]) => (
                      <option key={key} value={key}>{info.label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-400">Date de cloture prevue *</label>
                  <input required type="date" className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none" 
                    value={formData.expectedCloseDate} onChange={e => setFormData({...formData, expectedCloseDate: e.target.value})} />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-zinc-800">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-zinc-800 text-zinc-300 font-medium rounded-lg hover:bg-zinc-700 transition-colors">
                  Annuler
                </button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-500 transition-colors shadow-[0_0_10px_rgba(99,102,241,0.3)]">
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
