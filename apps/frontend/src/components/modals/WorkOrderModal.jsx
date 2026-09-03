import React, { useState, useEffect } from 'react';
import { X, Wrench, Building2, User, AlertTriangle, Calendar, ShieldCheck, CheckCircle2, Download, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

export default function WorkOrderModal({
  open,
  isOpen,
  onClose,
  onSubmit,
  onSuccess,
  workOrder,
  preselectedAsset
}) {
  const isVisible = open !== undefined ? open : isOpen;
  
  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [category, setCategory] = useState('PREVENTIVE');
  const [status, setStatus] = useState('PENDING');
  const [assetId, setAssetId] = useState('');
  const [buildingId, setBuildingId] = useState('');
  const [assignedToId, setAssignedToId] = useState('');
  const [technicianName, setTechnicianName] = useState('Alexandre Mercer');
  const [scheduledAt, setScheduledAt] = useState('');
  const [estimatedCost, setEstimatedCost] = useState(0);

  // Advanced Form State
  const [procedureSteps, setProcedureSteps] = useState([]);
  const [partsUsed, setPartsUsed] = useState([]);
  const [auditLog, setAuditLog] = useState([]);
  const [rootCause, setRootCause] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [actualDuration, setActualDuration] = useState(0);

  const [assets, setAssets] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [technicians, setTechnicians] = useState([]);

  useEffect(() => {
    if (isVisible) {
      loadData();
      initForm();
      setActiveTab('general');
    }
  }, [isVisible, workOrder, preselectedAsset]);

  const initForm = () => {
    if (workOrder) {
      setTitle(workOrder.title || '');
      setDescription(workOrder.description || '');
      setPriority(workOrder.priority || 'MEDIUM');
      setCategory(workOrder.type || workOrder.category || 'PREVENTIVE');
      setStatus(workOrder.status || 'PENDING');
      setAssetId(workOrder.assetId || '');
      setBuildingId(workOrder.buildingId || '');
      setAssignedToId(workOrder.assigneeId || workOrder.assignedToId || '');
      setTechnicianName(workOrder.assignee?.fullName || workOrder.assignedTechnician?.name || 'Alexandre Mercer');
      setScheduledAt(workOrder.scheduledAt ? new Date(workOrder.scheduledAt).toISOString().slice(0, 16) : '');
      setEstimatedCost(workOrder.estimatedCost || 0);

      const parsedSteps = workOrder.procedureSteps ? (typeof workOrder.procedureSteps === 'string' ? JSON.parse(workOrder.procedureSteps) : workOrder.procedureSteps) : [];
      setProcedureSteps(parsedSteps);
      
      const parsedParts = workOrder.partsUsed ? (typeof workOrder.partsUsed === 'string' ? JSON.parse(workOrder.partsUsed) : workOrder.partsUsed) : [];
      setPartsUsed(parsedParts);

      const parsedAudit = workOrder.auditLog ? (typeof workOrder.auditLog === 'string' ? JSON.parse(workOrder.auditLog) : workOrder.auditLog) : [];
      setAuditLog(parsedAudit);

      setRootCause(workOrder.rootCause || '');
      setResolutionNotes(workOrder.resolutionNotes || '');
      setActualDuration(workOrder.actualDuration || 0);
    } else if (preselectedAsset) {
      setTitle(`Diagnostic Inspection: ${preselectedAsset.name || preselectedAsset.code}`);
      setDescription(`Initiated maintenance inspection for asset ${preselectedAsset.code || ''} (${preselectedAsset.name || ''}) on ${preselectedAsset.floor || 'Floor 1'}.`);
      setPriority('MEDIUM');
      setCategory('PREVENTIVE');
      setStatus('PENDING');
      setAssetId(preselectedAsset.id || '');
      setBuildingId(preselectedAsset.buildingId || '');
      setAssignedToId('');
      setTechnicianName('Alexandre Mercer');
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(9, 0, 0, 0);
      setScheduledAt(tomorrow.toISOString().slice(0, 16));
      setEstimatedCost(0);
      setProcedureSteps([]);
      setPartsUsed([]);
      setAuditLog([]);
      setRootCause('');
      setResolutionNotes('');
      setActualDuration(0);
    } else {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(9, 0, 0, 0);
      setTitle('');
      setDescription('');
      setPriority('MEDIUM');
      setCategory('PREVENTIVE');
      setStatus('PENDING');
      setAssetId('');
      setBuildingId('');
      setAssignedToId('');
      setTechnicianName('Alexandre Mercer');
      setScheduledAt(tomorrow.toISOString().slice(0, 16));
      setEstimatedCost(0);
      setProcedureSteps([]);
      setPartsUsed([]);
      setAuditLog([]);
      setRootCause('');
      setResolutionNotes('');
      setActualDuration(0);
    }
  };

  const loadData = async () => {
    try {
      const [assetsRes, usersRes, buildingsRes] = await Promise.allSettled([
        api.get('/assets?limit=200'),
        api.get('/users?role=TECHNICIAN'),
        api.get('/buildings')
      ]);

      if (assetsRes.status === 'fulfilled' && assetsRes.value?.data) setAssets(assetsRes.value.data);
      if (usersRes.status === 'fulfilled' && usersRes.value?.data) setTechnicians(usersRes.value.data);
      if (buildingsRes.status === 'fulfilled' && buildingsRes.value?.data) setBuildings(buildingsRes.value.data);
    } catch (err) {
      console.warn('Could not load modal options', err);
    }
  };

  const handleDownloadPDF = async () => {
    if (!workOrder?.id) return;
    try {
      setDownloading(true);
      const res = await api.get(`/export/workorder/${workOrder.id}/pdf`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `WO-${workOrder.id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      toast.success('PDF téléchargé avec succès');
    } catch (err) {
      toast.error('Erreur lors du téléchargement du PDF');
    } finally {
      setDownloading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Veuillez saisir un titre');
      return;
    }

    setSaving(true);
    const selectedAsset = assets.find(a => a.id === assetId) || preselectedAsset;
    const selectedBld = buildings.find(b => b.id === buildingId);
    const selectedTech = technicians.find(t => t.id === assignedToId);

    const payload = {
      title: title.trim(),
      description: description.trim(),
      type: category.toUpperCase(),
      priority: priority.toUpperCase(),
      status: status.toUpperCase(),
      assetId: assetId || selectedAsset?.id || null,
      buildingId: buildingId || selectedBld?.id || null,
      assigneeId: assignedToId || null,
      scheduledAt: scheduledAt ? new Date(scheduledAt).toISOString() : new Date().toISOString(),
      estimatedCost: Number(estimatedCost) || 0,
      procedureSteps: JSON.stringify(procedureSteps),
      partsUsed: JSON.stringify(partsUsed),
      rootCause,
      resolutionNotes,
      actualDuration: Number(actualDuration) || 0,
      totalCost: partsUsed.reduce((acc, curr) => acc + (curr.quantity * curr.unitCost), 0)
    };

    try {
      if (workOrder?.id) {
        if (workOrder.status !== status.toUpperCase()) {
          await api.put(`/workorders/${workOrder.id}/status`, { 
            status: status.toUpperCase(), 
            rootCause, 
            resolutionNotes, 
            actualDuration: Number(actualDuration) || 0 
          });
        }
        await api.put(`/workorders/${workOrder.id}`, payload);
        toast.success('Ordre de travail mis à jour');
      } else {
        await api.post('/workorders', payload);
        toast.success('Ordre de travail créé');
      }
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col h-[85vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                {workOrder ? `WO: ${workOrder.id.substring(0,8)}` : 'Nouvel Ordre de Travail'}
                {workOrder && (
                  <span className="px-2 py-0.5 rounded-full bg-slate-800 text-xs font-mono text-slate-300">
                    {status}
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">Spider CAFM - SRE Operations</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {workOrder && (
              <button
                type="button"
                onClick={handleDownloadPDF}
                disabled={downloading}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-lg transition-colors border border-slate-700"
              >
                <Download className="w-4 h-4" />
                {downloading ? 'Export...' : 'PDF'}
              </button>
            )}
            <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Tabs */}
          <div className="w-48 border-r border-[#222222] bg-[#000000] flex flex-col p-2 space-y-1">
            {[
              { id: 'general', label: 'Général', icon: <Wrench className="w-4 h-4" /> },
              { id: 'procedure', label: 'Procédure', icon: <ShieldCheck className="w-4 h-4" /> },
              { id: 'parts', label: 'Pièces', icon: <Building2 className="w-4 h-4" /> },
              { id: 'closure', label: 'Clôture', icon: <CheckCircle2 className="w-4 h-4" /> },
              { id: 'history', label: 'Historique', icon: <Calendar className="w-4 h-4" /> },
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${activeTab === tab.id ? 'bg-[#161616] text-[#ededed] border border-[#333333]' : 'text-[#707070] hover:text-[#ededed] hover:bg-[#0a0a0a]'}`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Form Content */}
          <form id="wo-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 bg-[#0a0a0a]">
            {activeTab === 'general' && (
              <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                <div>
                  <label className="block text-xs text-[#707070] font-mono mb-1.5 uppercase tracking-wider">Titre de l'intervention *</label>
                  <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-[#000000] border border-[#222222] rounded-lg px-4 py-2.5 text-[#ededed] placeholder-[#555555] focus:outline-none focus:border-[#ededed] transition-all font-sans text-sm" placeholder="Ex: Inspection pompe CVC" />
                </div>
                <div>
                  <label className="block text-xs text-[#707070] font-mono mb-1.5 uppercase tracking-wider">Description</label>
                  <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-[#000000] border border-[#222222] rounded-lg px-4 py-2.5 text-[#ededed] focus:outline-none focus:border-[#ededed] text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-[#707070] font-mono mb-1.5 uppercase tracking-wider">Priorité</label>
                    <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full bg-[#000000] border border-[#222222] rounded-lg px-4 py-2.5 text-[#ededed] focus:outline-none focus:border-[#ededed] text-sm">
                      <option value="LOW">Basse</option>
                      <option value="MEDIUM">Moyenne</option>
                      <option value="HIGH">Haute</option>
                      <option value="CRITICAL">Critique</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-[#707070] font-mono mb-1.5 uppercase tracking-wider">Type / Catégorie</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-[#000000] border border-[#222222] rounded-lg px-4 py-2.5 text-[#ededed] focus:outline-none focus:border-[#ededed] text-sm">
                      <option value="PREVENTIVE">Préventif</option>
                      <option value="CORRECTIVE">Correctif</option>
                      <option value="PREDICTIVE">Prédictif</option>
                      <option value="EMERGENCY">Urgence</option>
                      <option value="ESG_AUDIT">Audit ESG</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-[#707070] font-mono mb-1.5 uppercase tracking-wider">Statut</label>
                    <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full bg-[#000000] border border-[#222222] rounded-lg px-4 py-2.5 text-[#ededed] focus:outline-none focus:border-[#ededed] text-sm">
                      <option value="PENDING">En attente</option>
                      <option value="IN_PROGRESS">En cours</option>
                      <option value="COMPLETED">Complété</option>
                      <option value="CANCELLED">Annulé</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 font-mono mb-1.5 uppercase tracking-wider">Date Programmée</label>
                    <input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-500 text-sm [color-scheme:dark]" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 font-mono mb-1.5 uppercase tracking-wider">Équipement</label>
                    <select value={assetId} onChange={(e) => setAssetId(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-500 text-sm">
                      <option value="">Sélectionner...</option>
                      {assets.map(a => <option key={a.id} value={a.id}>{a.name} ({a.type})</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 font-mono mb-1.5 uppercase tracking-wider">Technicien Assigné</label>
                    <select value={assignedToId} onChange={(e) => setAssignedToId(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-500 text-sm">
                      <option value="">Sélectionner...</option>
                      {technicians.map(t => <option key={t.id} value={t.id}>{t.fullName || t.email}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'procedure' && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white tracking-widest uppercase">Étapes de procédure</h4>
                  <button type="button" onClick={() => setProcedureSteps([...procedureSteps, { title: '', description: '', isDone: false }])} className="flex items-center gap-1.5 text-xs text-amber-500 hover:text-amber-400">
                    <Plus className="w-3.5 h-3.5" /> Ajouter une étape
                  </button>
                </div>
                {procedureSteps.length === 0 ? (
                  <div className="text-center py-8 border border-dashed border-slate-800 rounded-xl text-slate-500 text-sm">Aucune étape définie.</div>
                ) : (
                  <div className="space-y-3">
                    {procedureSteps.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-slate-950 border border-slate-800 rounded-xl">
                        <input type="checkbox" checked={step.isDone} onChange={(e) => {
                          const newSteps = [...procedureSteps];
                          newSteps[idx].isDone = e.target.checked;
                          if (e.target.checked) {
                            newSteps[idx].validatedAt = new Date().toISOString();
                          }
                          setProcedureSteps(newSteps);
                        }} className="mt-1 w-4 h-4 rounded border-slate-700 bg-slate-800 text-amber-500 focus:ring-amber-500/20" />
                        <div className="flex-1 space-y-2">
                          <input type="text" placeholder="Titre de l'étape" value={step.title} onChange={(e) => {
                            const newSteps = [...procedureSteps];
                            newSteps[idx].title = e.target.value;
                            setProcedureSteps(newSteps);
                          }} className="w-full bg-transparent text-sm text-white focus:outline-none border-b border-transparent focus:border-slate-700 pb-1" />
                          <input type="text" placeholder="Détails (optionnel)" value={step.description} onChange={(e) => {
                            const newSteps = [...procedureSteps];
                            newSteps[idx].description = e.target.value;
                            setProcedureSteps(newSteps);
                          }} className="w-full bg-transparent text-xs text-slate-400 focus:outline-none border-b border-transparent focus:border-slate-700 pb-1" />
                        </div>
                        <button type="button" onClick={() => {
                          const newSteps = [...procedureSteps];
                          newSteps.splice(idx, 1);
                          setProcedureSteps(newSteps);
                        }} className="text-slate-500 hover:text-rose-500 p-1">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'parts' && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white tracking-widest uppercase">Pièces utilisées</h4>
                  <button type="button" onClick={() => setPartsUsed([...partsUsed, { name: '', partNumber: '', quantity: 1, unitCost: 0 }])} className="flex items-center gap-1.5 text-xs text-amber-500 hover:text-amber-400">
                    <Plus className="w-3.5 h-3.5" /> Ajouter une pièce
                  </button>
                </div>
                {partsUsed.length === 0 ? (
                  <div className="text-center py-8 border border-dashed border-slate-800 rounded-xl text-slate-500 text-sm">Aucune pièce utilisée.</div>
                ) : (
                  <div className="space-y-3">
                    {partsUsed.map((part, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-slate-950 border border-slate-800 rounded-xl text-sm">
                        <input type="text" placeholder="Nom pièce" value={part.name} onChange={(e) => {
                          const newParts = [...partsUsed];
                          newParts[idx].name = e.target.value;
                          setPartsUsed(newParts);
                        }} className="flex-1 bg-transparent text-white focus:outline-none" />
                        <input type="text" placeholder="Réf" value={part.partNumber} onChange={(e) => {
                          const newParts = [...partsUsed];
                          newParts[idx].partNumber = e.target.value;
                          setPartsUsed(newParts);
                        }} className="w-24 bg-transparent text-slate-400 focus:outline-none" />
                        <input type="number" min="1" placeholder="Qté" value={part.quantity} onChange={(e) => {
                          const newParts = [...partsUsed];
                          newParts[idx].quantity = Number(e.target.value);
                          setPartsUsed(newParts);
                        }} className="w-16 bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white text-center focus:outline-none" />
                        <div className="flex items-center gap-1">
                          <input type="number" min="0" step="0.01" placeholder="Coût" value={part.unitCost} onChange={(e) => {
                            const newParts = [...partsUsed];
                            newParts[idx].unitCost = Number(e.target.value);
                            setPartsUsed(newParts);
                          }} className="w-20 bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white focus:outline-none text-right" />
                          <span className="text-slate-500">€</span>
                        </div>
                        <button type="button" onClick={() => {
                          const newParts = [...partsUsed];
                          newParts.splice(idx, 1);
                          setPartsUsed(newParts);
                        }} className="text-slate-500 hover:text-rose-500 p-1">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <div className="flex justify-end p-2 text-sm font-bold text-slate-300">
                      Total : {partsUsed.reduce((acc, curr) => acc + (curr.quantity * curr.unitCost), 0).toFixed(2)} €
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'closure' && (
              <div className="space-y-5 animate-in fade-in duration-300">
                <div className="p-4 bg-[#111111] border border-[#222222] rounded-lg">
                  <h4 className="text-sm font-bold text-[#ededed] mb-2">Clôture d'intervention</h4>
                  <p className="text-xs text-[#707070]">Renseignez le diagnostic final et le temps effectif avant de passer le statut à "Complété".</p>
                </div>
                <div>
                  <label className="block text-xs text-[#707070] font-mono mb-1.5 uppercase tracking-wider">Cause Racine (Root Cause)</label>
                  <textarea rows={2} value={rootCause} onChange={(e) => setRootCause(e.target.value)} className="w-full bg-[#000000] border border-[#222222] rounded-lg px-4 py-2.5 text-[#ededed] focus:outline-none focus:border-[#ededed] text-sm" placeholder="Ex: Défaillance joint d'étanchéité suite usure thermique" />
                </div>
                <div>
                  <label className="block text-xs text-[#707070] font-mono mb-1.5 uppercase tracking-wider">Notes de Résolution</label>
                  <textarea rows={3} value={resolutionNotes} onChange={(e) => setResolutionNotes(e.target.value)} className="w-full bg-[#000000] border border-[#222222] rounded-lg px-4 py-2.5 text-[#ededed] focus:outline-none focus:border-[#ededed] text-sm" placeholder="Ex: Remplacement effectué, test pression OK. Recommandé monitoring vibrations." />
                </div>
                <div>
                  <label className="block text-xs text-[#707070] font-mono mb-1.5 uppercase tracking-wider">Durée effective (Minutes)</label>
                  <input type="number" min="0" value={actualDuration} onChange={(e) => setActualDuration(e.target.value)} className="w-full sm:w-1/3 bg-[#000000] border border-[#222222] rounded-lg px-4 py-2.5 text-[#ededed] focus:outline-none focus:border-[#ededed] text-sm" />
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <h4 className="text-sm font-bold text-[#ededed] tracking-widest uppercase mb-4">Journal d'audit</h4>
                {auditLog.length === 0 ? (
                  <div className="text-center py-8 text-[#707070] text-sm">Aucun historique disponible.</div>
                ) : (
                  <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[#222222] before:to-transparent">
                    {auditLog.map((log, idx) => (
                      <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full border border-[#333333] bg-[#161616] text-[#ededed] shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-lg border border-[#222222] bg-[#111111] shadow">
                          <div className="flex items-center justify-between space-x-2 mb-1">
                            <div className="font-bold text-[#ededed] text-sm">{log.action}</div>
                            <time className="font-mono text-[10px] text-[#707070]">
                              {new Date(log.timestamp).toLocaleString('fr-FR')}
                            </time>
                          </div>
                          <div className="text-[#a1a1a1] text-xs">{log.details}</div>
                          <div className="text-[#707070] text-[10px] mt-2 font-mono uppercase">Par : {log.user}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </form>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#222222] flex items-center justify-between bg-[#000000] shrink-0">
          <div className="text-[10px] text-[#707070] font-mono uppercase tracking-widest">
            {workOrder ? `ID: ${workOrder.id}` : 'Nouveau brouillon'}
          </div>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-xs font-bold text-[#a1a1a1] bg-[#161616] hover:bg-[#222222] hover:text-[#ededed] border border-[#222222] rounded-lg transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              form="wo-form"
              disabled={saving}
              className="px-5 py-2 text-xs font-bold text-[#000000] bg-[#ededed] hover:bg-[#ffffff] rounded-lg transition-colors disabled:opacity-50"
            >
              {saving ? 'Sauvegarde...' : 'Enregistrer & Dispatcher'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
