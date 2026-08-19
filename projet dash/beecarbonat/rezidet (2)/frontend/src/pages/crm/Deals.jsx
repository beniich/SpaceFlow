import React, { useState } from 'react';
import { Target, Plus, Search, DollarSign, Calendar, User as UserIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { usePipeline, useUpdateDealStage, useCreateDeal } from '../../features/crm/hooks/useCrmQueries';
import { useContacts } from '../../features/crm/hooks/useCrmQueries';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const formatCurrency = (val) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(val);

function SortableDealCard({ deal }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: deal.id,
    data: { deal }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-zinc-800 p-3 rounded-xl border border-zinc-700 cursor-grab active:cursor-grabbing hover:border-zinc-600 transition-colors ${
        isDragging ? 'shadow-2xl ring-2 ring-brand-orange/50' : 'shadow-sm'
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-sans font-bold text-sm text-zinc-100">{deal.name}</h4>
      </div>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">
          {formatCurrency(deal.amount)}
        </span>
      </div>
      <div className="space-y-1">
        {deal.contact && (
          <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-400">
            <UserIcon className="w-3 h-3" />
            <span className="truncate">{deal.contact.firstName} {deal.contact.lastName}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-500">
          <Calendar className="w-3 h-3" />
          {format(new Date(deal.expectedCloseDate), 'dd MMM yyyy', { locale: fr })}
        </div>
      </div>
    </div>
  );
}

function Column({ stage, title, color, deals, amount }) {
  return (
    <div className="flex-shrink-0 w-80 flex flex-col bg-zinc-900/50 border border-zinc-800/50 rounded-2xl overflow-hidden h-[calc(100vh-12rem)]">
      <div className="p-4 border-b border-zinc-800/50 flex justify-between items-center bg-zinc-900">
        <div>
          <h3 className="font-sans font-bold text-zinc-100 flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full bg-${color}-500`} />
            {title}
            <span className="text-xs font-mono text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-full">
              {deals.length}
            </span>
          </h3>
          <p className="text-xs font-mono text-zinc-400 mt-1">{formatCurrency(amount)}</p>
        </div>
      </div>
      
      <div className="flex-1 p-3 overflow-y-auto space-y-3">
        <SortableContext id={stage} items={deals.map(d => d.id)} strategy={verticalListSortingStrategy}>
          {deals.map(deal => (
            <SortableDealCard key={deal.id} deal={deal} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}

export default function CRMDeals() {
  const { data: pipelineData, isLoading } = usePipeline();
  const { mutate: updateStage } = useUpdateDealStage();
  const { mutate: createDeal, isPending: isCreating } = useCreateDeal();
  const { data: contactsData } = useContacts({ limit: 100 });
  
  const [activeDeal, setActiveDeal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', amount: 0, status: 'PIPELINE', expectedCloseDate: '', contactId: '' });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = (event) => {
    const { active } = event;
    setActiveDeal(active.data.current.deal);
  };

  const handleDragEnd = (event) => {
    setActiveDeal(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;
    
    // Si on lâche sur une colonne ou sur un item d'une colonne
    const targetStage = over.data?.current?.sortable?.containerId || over.id;
    const sourceStage = active.data?.current?.sortable?.containerId;

    if (sourceStage && targetStage && sourceStage !== targetStage) {
      updateStage({ id: activeId, stage: targetStage });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createDeal(
      {
        ...formData,
        amount: parseFloat(formData.amount),
        expectedCloseDate: new Date(formData.expectedCloseDate).toISOString()
      },
      {
        onSuccess: () => {
          setIsModalOpen(false);
          setFormData({ name: '', amount: 0, status: 'PIPELINE', expectedCloseDate: '', contactId: '' });
        }
      }
    );
  };

  if (isLoading) return <div className="p-8 text-zinc-400 font-mono animate-pulse">Chargement du pipeline...</div>;

  const pipeline = pipelineData?.pipeline || [];
  const summary = pipelineData?.summary || {};

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto text-zinc-100 min-h-screen font-sans flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-800 mb-6">
        <div>
          <h1 className="text-3xl font-display font-bold uppercase tracking-wider flex items-center gap-2">
            <Target className="w-8 h-8 text-brand-orange" />
            Pipeline Commercial
          </h1>
          <p className="text-xs font-mono text-zinc-400 mt-1">Gérez vos opportunités en temps réel</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block mr-4">
            <div className="text-xs font-mono text-zinc-500">Pipeline Pondéré</div>
            <div className="text-lg font-display font-bold text-brand-orange">
              {formatCurrency(summary.pipelineValue || 0)}
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-brand-orange hover:bg-orange-600 text-white font-mono text-sm rounded-xl transition-colors shadow-lg shadow-brand-orange/20"
          >
            <Plus className="w-4 h-4" /> Nouvelle Opp.
          </button>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4 flex-1">
          {pipeline.map(col => (
            <Column
              key={col.stage}
              stage={col.stage}
              title={col.label}
              color={col.color}
              deals={col.deals}
              amount={col.total}
            />
          ))}
        </div>

        <DragOverlay>
          {activeDeal ? (
            <div className="opacity-80 rotate-2 scale-105 transition-transform">
              <SortableDealCard deal={activeDeal} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* MODAL CREATION DEAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
              <h2 className="font-sans font-bold text-zinc-100">Nouvelle Opportunité</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-zinc-300">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Nom de l'opportunité</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:border-brand-orange focus:outline-none" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Montant (€)</label>
                  <input required type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:border-brand-orange focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Fermeture prévue</label>
                  <input required type="date" value={formData.expectedCloseDate} onChange={e => setFormData({...formData, expectedCloseDate: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:border-brand-orange focus:outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Contact / Client</label>
                <select required value={formData.contactId} onChange={e => setFormData({...formData, contactId: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:border-brand-orange focus:outline-none">
                  <option value="">Sélectionner un contact</option>
                  {contactsData?.contacts?.map(c => (
                    <option key={c.id} value={c.id}>{c.firstName} {c.lastName} {c.company ? `(${c.company})` : ''}</option>
                  ))}
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-xs font-mono text-zinc-400 hover:text-zinc-200">Annuler</button>
                <button disabled={isCreating} type="submit" className="px-4 py-2 bg-brand-orange hover:bg-orange-600 text-white font-mono text-xs rounded-lg disabled:opacity-50">
                  {isCreating ? 'Création...' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
