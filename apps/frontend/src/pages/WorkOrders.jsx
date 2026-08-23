import React, { useState } from 'react';
import { 
  Plus, Maximize2, User, CheckCircle2, QrCode, PenTool, LayoutList, 
  Trello, MoreVertical, Search, Filter, AlertCircle, Clock, 
  Calendar, Check, X, ShieldAlert, ArrowRight, Camera, Sparkles,
  FileCheck2, Download
} from 'lucide-react';
import clsx from 'clsx';
import toast from 'react-hot-toast';
import { useLanguage } from '../context/LanguageContext';
import { useSiteConfig } from '../context/SiteConfigContext';
import DynamicFormIndications from '../components/DynamicFormIndications';

const initialWOs = [
  { 
    id: 'WO-2026-089', 
    title: 'Air Handling Unit Filter Replacement', 
    asset: 'CTA-02', 
    priority: 'CRITICAL', 
    assigned: 'Jean Dupont', 
    avatar: 'JD', 
    date: '2026-08-21', 
    status: 'PENDING',
    location: 'Bâtiment Alpha • L4 • Room 402',
    description: 'Differential pressure sensor triggered filter saturation alarm (DP > 280 Pa).'
  },
  { 
    id: 'WO-2026-090', 
    title: 'Chiller Leak & Vibration Inspection', 
    asset: 'CHLR-02', 
    priority: 'NORMAL', 
    assigned: 'Tarik B.', 
    avatar: 'TB', 
    date: '2026-08-22', 
    status: 'IN_PROGRESS',
    location: 'Bâtiment Alpha • Roof Level • Zone MEP',
    description: 'Quarterly refrigerant circuit inspection and vibration harmonics analysis.'
  },
  { 
    id: 'WO-2026-091', 
    title: 'Lighting Node Update Level 4', 
    asset: 'LGT-L4', 
    priority: 'LOW', 
    assigned: 'Jean Dupont', 
    avatar: 'JD', 
    date: '2026-08-25', 
    status: 'COMPLETED',
    location: 'Bâtiment Alpha • L4 • Open Space 4A',
    description: 'DALI firmware patch and daylight harvesting threshold calibration.'
  },
  { 
    id: 'WO-2026-092', 
    title: 'HVAC Calibration & VAV Balancing', 
    asset: 'HVAC-01', 
    priority: 'CRITICAL', 
    assigned: 'Sarah Connor', 
    avatar: 'SC', 
    date: '2026-08-21', 
    status: 'PENDING',
    location: 'Bâtiment Alpha • L4 • Server Room 1',
    description: 'Airflow velocity fluctuation causing hotspot in server rack corridor 3.'
  },
  { 
    id: 'WO-2026-093', 
    title: 'Primary Electric Substation Relay Test', 
    asset: 'ELEC-SUB-01', 
    priority: 'NORMAL', 
    assigned: 'Tarik B.', 
    avatar: 'TB', 
    date: '2026-08-24', 
    status: 'IN_PROGRESS',
    location: 'Bâtiment Alpha • Basement B1 • Substation',
    description: 'High-voltage protection relay tripping dry-run verification.'
  },
];

export default function WorkOrders() {
  const { t } = useLanguage();
  const { sites } = useSiteConfig();
  const [view, setView] = useState('list'); // 'list' | 'kanban'
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [workOrders, setWorkOrders] = useState(initialWOs);
  
  // Modals / Drawers
  const [quickCloseWO, setQuickCloseWO] = useState(null);
  const [showNewWOModal, setShowNewWOModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [signatureName, setSignatureName] = useState('');
  
  // New WO form
  const [newTitle, setNewTitle] = useState('');
  const [newSiteId, setNewSiteId] = useState('');
  const [newAsset, setNewAsset] = useState('CTA-02');
  const [newPriority, setNewPriority] = useState('NORMAL');
  const [newAssigned, setNewAssigned] = useState('Tarik B.');
  const [newDesc, setNewDesc] = useState('');
  const [customFormValues, setCustomFormValues] = useState({});

  const tabs = [
    { id: 'ALL', label: t('wo_status_all', 'Tous les Bons de Travail') },
    { id: 'PENDING', label: t('wo_status_pending', 'En attente') },
    { id: 'IN_PROGRESS', label: t('wo_status_in_progress', 'En cours') },
    { id: 'COMPLETED', label: t('wo_status_completed', 'Terminé') },
  ];

  const filteredWOs = workOrders.filter(w => {
    const matchesTab = activeTab === 'ALL' ? true : w.status === activeTab;
    const matchesSearch = w.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          w.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          w.asset.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getPriorityBadge = (prio) => {
    switch (prio) {
      case 'CRITICAL': 
        return 'bg-[#ef4444]/15 text-[#ef4444] border-[#ef4444]/40 shadow-[0_0_8px_rgba(239,68,68,0.2)]';
      case 'NORMAL': 
        return 'bg-zinc-800 text-zinc-300 border-zinc-700';
      case 'LOW': 
        return 'bg-[#3b82f6]/15 text-[#3b82f6] border-[#3b82f6]/40';
      default: 
        return 'bg-zinc-800 text-zinc-400 border-zinc-700';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING': 
        return 'text-zinc-400 bg-zinc-900/80 border-zinc-700';
      case 'IN_PROGRESS': 
        return 'text-[#F38020] bg-[#F38020]/15 border-[#F38020]/40 shadow-[0_0_8px_rgba(243,128,32,0.15)]';
      case 'COMPLETED': 
        return 'text-[#10B981] bg-[#10B981]/15 border-[#10B981]/40 shadow-[0_0_8px_rgba(16,185,129,0.15)]';
      default: 
        return 'text-zinc-400 bg-zinc-900/50 border-zinc-800';
    }
  };

  const handleCreateWO = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      toast.error('Veuillez saisir un titre');
      return;
    }
    const newEntry = {
      id: `WO-2026-${Math.floor(Math.random()*800)+100}`,
      title: newTitle,
      asset: newAsset,
      priority: newPriority,
      assigned: newAssigned,
      avatar: newAssigned.split(' ').map(n => n[0]).join(''),
      date: new Date().toISOString().split('T')[0],
      status: 'PENDING',
      location: 'Bâtiment Alpha • L4',
      description: newDesc || 'Standard maintenance intervention task.'
    };
    setWorkOrders([newEntry, ...workOrders]);
    setShowNewWOModal(false);
    setNewTitle('');
    setNewDesc('');
    toast.success(`Ordre de travail ${newEntry.id} créé !`);
  };

  const handleSignatureClose = () => {
    if (!signatureName.trim()) {
      toast.error('Veuillez signer électroniquement');
      return;
    }
    setWorkOrders(workOrders.map(w => w.id === quickCloseWO.id ? { ...w, status: 'COMPLETED' } : w));
    toast.success(`Work Order ${quickCloseWO.id} clôturé et signé par ${signatureName} !`);
    setQuickCloseWO(null);
    setSignatureName('');
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#08080A] text-zinc-100 p-4 sm:p-6 font-sans relative">
      <div className="max-w-[1600px] mx-auto flex flex-col gap-6">
        
        {/* Top Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold font-sans tracking-tight text-white flex items-center gap-2">
              {t('wo_title', 'Gestion des Bons de Travail')}
            </h1>
            <p className="text-xs font-mono text-zinc-400 mt-1">
              {t('wo_subtitle', 'GMAO Technique • Maintenance Corrective & Prédictive')}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowQRModal(true)}
              className="flex items-center gap-2 px-3 py-2 bg-[#131313] hover:bg-zinc-800 text-zinc-300 hover:text-[#00F0FF] border border-zinc-800 rounded-lg font-mono text-xs transition-colors"
            >
              <QrCode className="w-4 h-4" />
              <span>{t('asset_scan_qr', 'Scan QR Code')}</span>
            </button>
          </div>
        </header>

        {/* View Switcher & Filter Bar */}
        <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 bg-[#131313]/90 backdrop-blur-md border border-zinc-800/80 p-3 rounded-xl shadow-lg">
          {/* Tabs */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  "px-3.5 py-1.5 rounded-lg transition-colors border font-bold",
                  activeTab === tab.id
                    ? "bg-[#00F0FF]/15 text-[#00F0FF] border-[#00F0FF]/40 shadow-[0_0_10px_rgba(0,240,255,0.15)]"
                    : "bg-transparent text-zinc-400 hover:text-white border-transparent hover:bg-zinc-800/50"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Controls: Search & List/Kanban toggle */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search WO, Asset, Title..."
                className="w-full bg-[#08080A] border border-zinc-800 text-xs font-mono text-zinc-200 pl-9 pr-3 py-2 rounded-lg focus:outline-none focus:border-[#00F0FF] transition-colors"
              />
            </div>

            <div className="flex items-center bg-[#08080A] border border-zinc-800 rounded-lg p-0.5">
              <button 
                onClick={() => setView('list')} 
                className={clsx(
                  "p-1.5 rounded transition-colors", 
                  view === 'list' ? "bg-zinc-800 text-[#00F0FF] shadow" : "text-zinc-500 hover:text-zinc-300"
                )}
                title="List View"
              >
                <LayoutList className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setView('kanban')} 
                className={clsx(
                  "p-1.5 rounded transition-colors", 
                  view === 'kanban' ? "bg-zinc-800 text-[#00F0FF] shadow" : "text-zinc-500 hover:text-zinc-300"
                )}
                title="Kanban Board View"
              >
                <Trello className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* MAIN VIEW: LIST OR KANBAN */}
        {view === 'list' ? (
          <div className="bg-[#131313]/90 backdrop-blur-md border border-zinc-800/80 rounded-xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 bg-[#08080A]/60 font-mono text-[10px] text-zinc-400 uppercase tracking-wider">
                    <th className="py-3 px-4">WO ID</th>
                    <th className="py-3 px-4">Intervention Title</th>
                    <th className="py-3 px-4">Target Asset</th>
                    <th className="py-3 px-4">Priority</th>
                    <th className="py-3 px-4">Technician</th>
                    <th className="py-3 px-4">Due Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 font-mono text-xs">
                  {filteredWOs.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-zinc-500">
                        Aucun ordre de travail ne correspond aux filtres.
                      </td>
                    </tr>
                  ) : (
                    filteredWOs.map((wo) => (
                      <tr key={wo.id} className="hover:bg-white/5 transition-colors group">
                        <td className="py-3.5 px-4 font-bold text-[#00F0FF]">{wo.id}</td>
                        <td className="py-3.5 px-4 font-sans font-medium text-white max-w-[280px] truncate">
                          {wo.title}
                          <span className="block text-[10px] font-mono text-zinc-500 truncate">{wo.location}</span>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-zinc-300">
                          <span className="px-2 py-0.5 rounded bg-[#08080A] border border-zinc-800 text-[11px]">
                            {wo.asset}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={clsx("px-2.5 py-1 rounded text-[10px] font-bold border", getPriorityBadge(wo.priority))}>
                            {wo.priority}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] font-bold text-[#ffb787]">
                              {wo.avatar}
                            </div>
                            <span className="text-zinc-300 text-xs font-sans">{wo.assigned}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-zinc-400 text-xs">{wo.date}</td>
                        <td className="py-3.5 px-4">
                          <span className={clsx("px-2.5 py-1 rounded text-[10px] font-bold border", getStatusBadge(wo.status))}>
                            {wo.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {wo.status !== 'COMPLETED' ? (
                            <button
                              onClick={() => setQuickCloseWO(wo)}
                              className="px-2.5 py-1.5 rounded bg-[#10B981]/15 hover:bg-[#10B981]/30 text-[#10B981] border border-[#10B981]/40 font-mono text-[11px] font-bold transition-all inline-flex items-center gap-1.5 shadow-[0_0_8px_rgba(16,185,129,0.15)]"
                            >
                              <PenTool className="w-3 h-3" /> Quick Close
                            </button>
                          ) : (
                            <span className="text-[10px] text-[#10B981] font-mono flex items-center justify-end gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Clôturé
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* KANBAN BOARD VIEW */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['PENDING', 'IN_PROGRESS', 'COMPLETED'].map((columnStatus) => {
              const columnWOs = workOrders.filter(w => w.status === columnStatus);
              return (
                <div key={columnStatus} className="bg-[#131313]/90 border border-zinc-800/80 rounded-xl p-4 flex flex-col gap-4 shadow-lg">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                    <div className="flex items-center gap-2">
                      <span className={clsx(
                        "w-2.5 h-2.5 rounded-full",
                        columnStatus === 'PENDING' ? "bg-zinc-500" :
                        columnStatus === 'IN_PROGRESS' ? "bg-[#F38020] shadow-[0_0_6px_#F38020]" :
                        "bg-[#10B981] shadow-[0_0_6px_#10B981]"
                      )} />
                      <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-200">
                        {columnStatus.replace('_', ' ')}
                      </h3>
                    </div>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                      {columnWOs.length}
                    </span>
                  </div>

                  <div className="flex flex-col gap-3">
                    {columnWOs.map((wo) => (
                      <div 
                        key={wo.id}
                        className="bg-[#08080A] border border-zinc-800/80 hover:border-zinc-700 p-4 rounded-xl flex flex-col gap-3 transition-all group shadow"
                      >
                        <div className="flex items-start justify-between">
                          <span className="text-[11px] font-mono font-bold text-[#00F0FF]">{wo.id}</span>
                          <span className={clsx("px-2 py-0.5 rounded text-[9px] font-bold border", getPriorityBadge(wo.priority))}>
                            {wo.priority}
                          </span>
                        </div>

                        <h4 className="font-sans font-semibold text-sm text-white">{wo.title}</h4>
                        <p className="text-[11px] text-zinc-400 font-sans line-clamp-2">{wo.description}</p>

                        <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 border-t border-zinc-800/80 pt-2.5">
                          <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                            {wo.asset}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-zinc-300 font-sans">{wo.assigned}</span>
                          </div>
                        </div>

                        {columnStatus !== 'COMPLETED' && (
                          <div className="flex gap-2 pt-1">
                            {columnStatus === 'PENDING' && (
                              <button
                                onClick={() => {
                                  setWorkOrders(workOrders.map(w => w.id === wo.id ? { ...w, status: 'IN_PROGRESS' } : w));
                                  toast.success(`WO ${wo.id} basculé en cours !`);
                                }}
                                className="flex-1 py-1 bg-[#F38020]/15 hover:bg-[#F38020]/25 text-[#F38020] border border-[#F38020]/40 rounded text-[10px] font-mono font-bold transition-colors text-center"
                              >
                                Start Work
                              </button>
                            )}
                            <button
                              onClick={() => setQuickCloseWO(wo)}
                              className="flex-1 py-1 bg-[#10B981]/15 hover:bg-[#10B981]/25 text-[#10B981] border border-[#10B981]/40 rounded text-[10px] font-mono font-bold transition-colors text-center"
                            >
                              Quick Close
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* FLOATING ACTION BUTTON (FAB) : "NEW WORK ORDER" */}
      {/* ========================================================================= */}
      <button
        onClick={() => setShowNewWOModal(true)}
        className="fixed bottom-8 right-8 z-40 px-5 py-3.5 bg-[#00F0FF] hover:bg-[#00dbe7] text-black font-mono font-bold text-xs uppercase tracking-wider rounded-full shadow-[0_0_25px_rgba(0,240,255,0.45)] hover:shadow-[0_0_35px_rgba(0,240,255,0.6)] flex items-center gap-2.5 transition-all hover:scale-105"
      >
        <Plus className="w-5 h-5" />
        <span>New Work Order</span>
      </button>

      {/* ========================================================================= */}
      {/* MODAL: QUICK CLOSE SIGNATURE CAPTURE */}
      {/* ========================================================================= */}
      {quickCloseWO && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0D0E12] border border-zinc-800 w-full max-w-lg rounded-2xl p-6 flex flex-col gap-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-[#10B981] font-bold uppercase">Clôture Express &amp; Signature</span>
                <h3 className="text-lg font-bold text-white mt-0.5">{quickCloseWO.id}</h3>
              </div>
              <button onClick={() => setQuickCloseWO(null)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="p-3 bg-[#08080A] rounded-lg border border-zinc-800">
                <span className="text-zinc-500 block text-[10px]">Titre de la tâche:</span>
                <span className="text-white font-sans font-semibold">{quickCloseWO.title}</span>
              </div>

              {/* Signature Field */}
              <div>
                <label className="text-[10px] uppercase text-zinc-400 font-bold block mb-1.5">
                  Nom du technicien signataire
                </label>
                <input
                  type="text"
                  value={signatureName}
                  onChange={(e) => setSignatureName(e.target.value)}
                  placeholder="Ex: Tarik Benali (Tier 01 Operator)"
                  className="w-full bg-[#08080A] border border-zinc-800 text-xs font-mono text-zinc-200 p-2.5 rounded-lg focus:outline-none focus:border-[#10B981]"
                />
              </div>

              {/* Simulated Signature Pad Canvas */}
              <div>
                <label className="text-[10px] uppercase text-zinc-400 font-bold block mb-1.5">
                  Zone de signature tactile / cryptographique
                </label>
                <div className="h-28 bg-[#040405] rounded-lg border border-zinc-800/80 flex items-center justify-center relative group">
                  <div className="text-center text-zinc-600 font-mono text-[11px]">
                    <PenTool className="w-5 h-5 mx-auto mb-1 text-zinc-500" />
                    <span>Apposez votre griffe ou validez la conformité</span>
                  </div>
                  <div className="absolute bottom-2 right-2 text-[9px] text-[#10B981]">
                    SHA-256 Verified
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSignatureClose}
                className="flex-1 py-2.5 bg-[#10B981] hover:bg-[#059669] text-black font-mono font-bold text-xs rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-colors flex items-center justify-center gap-2"
              >
                <FileCheck2 className="w-4 h-4" /> Valider la clôture
              </button>
              <button
                onClick={() => setQuickCloseWO(null)}
                className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-xs rounded-lg transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CREATE NEW WORK ORDER */}
      {/* ========================================================================= */}
      {showNewWOModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0D0E12] border border-zinc-800 w-full max-w-lg rounded-2xl p-6 flex flex-col gap-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#00F0FF]" /> Créer un Ordre de Travail (GMAO)
              </h3>
              <button onClick={() => setShowNewWOModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateWO} className="space-y-4 font-mono text-xs max-h-[80vh] overflow-y-auto pr-1">
              {/* Superadmin Form Banners & Custom Indications */}
              <DynamicFormIndications
                customValues={customFormValues}
                onChangeCustomValue={(id, val) => setCustomFormValues(prev => ({ ...prev, [id]: val }))}
              />

              <div>
                <label className="text-[10px] uppercase text-zinc-400 font-bold block mb-1">Bâtiment / Site d'Intervention</label>
                <select
                  value={newSiteId}
                  onChange={(e) => setNewSiteId(e.target.value)}
                  className="w-full bg-[#08080A] border border-zinc-800 p-2.5 rounded-lg text-white focus:outline-none focus:border-[#00F0FF]"
                >
                  <option value="">Sélectionner un site enregistré...</option>
                  {sites.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.streetAddress}, {s.city})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase text-zinc-400 font-bold block mb-1">Titre de l'intervention</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex: Remplacement filtre CTA-02"
                  className="w-full bg-[#08080A] border border-zinc-800 p-2.5 rounded-lg text-white focus:outline-none focus:border-[#00F0FF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase text-zinc-400 font-bold block mb-1">Équipement Cible</label>
                  <select
                    value={newAsset}
                    onChange={(e) => setNewAsset(e.target.value)}
                    className="w-full bg-[#08080A] border border-zinc-800 p-2.5 rounded-lg text-white focus:outline-none focus:border-[#00F0FF]"
                  >
                    <option value="CTA-02">CTA-02 (Air Handling Unit)</option>
                    <option value="CHLR-02">CHLR-02 (Chiller)</option>
                    <option value="HVAC-01">HVAC-01 (Primary Loop)</option>
                    <option value="ELEC-SUB-01">ELEC-SUB-01 (Substation)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase text-zinc-400 font-bold block mb-1">Priorité</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                    className="w-full bg-[#08080A] border border-zinc-800 p-2.5 rounded-lg text-white focus:outline-none focus:border-[#00F0FF]"
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="NORMAL">NORMAL</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase text-zinc-400 font-bold block mb-1">Technicien Assigné</label>
                <select
                  value={newAssigned}
                  onChange={(e) => setNewAssigned(e.target.value)}
                  className="w-full bg-[#08080A] border border-zinc-800 p-2.5 rounded-lg text-white focus:outline-none focus:border-[#00F0FF]"
                >
                  <option value="Tarik B.">Tarik B. (Lead HVAC)</option>
                  <option value="Jean Dupont">Jean Dupont (Operations)</option>
                  <option value="Sarah Connor">Sarah Connor (Controls)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase text-zinc-400 font-bold block mb-1">Description technique</label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Détails techniques, symptômes constatés ou consignes de sécurité..."
                  className="w-full bg-[#08080A] border border-zinc-800 p-2.5 rounded-lg text-white focus:outline-none focus:border-[#00F0FF]"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#00F0FF] hover:bg-[#00dbe7] text-black font-mono font-bold text-xs rounded-lg shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-colors"
                >
                  Créer l'ordre de travail
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewWOModal(false)}
                  className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-xs rounded-lg transition-colors"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: QR CODE SCANNER SIMULATOR */}
      {/* ========================================================================= */}
      {showQRModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0D0E12] border border-zinc-800 w-full max-w-md rounded-2xl p-6 flex flex-col gap-4 shadow-2xl text-center">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <QrCode className="w-5 h-5 text-[#00F0FF]" /> Scanner QR Code Équipement
              </h3>
              <button onClick={() => setShowQRModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative h-64 bg-[#040405] rounded-xl border border-zinc-800 flex items-center justify-center overflow-hidden">
              <div className="w-48 h-48 border-2 border-dashed border-[#00F0FF]/60 rounded-xl flex items-center justify-center relative">
                <div className="absolute inset-x-0 top-0 h-0.5 bg-[#00F0FF] shadow-[0_0_10px_#00F0FF] animate-pulse"></div>
                <QrCode className="w-24 h-24 text-zinc-700" />
              </div>
            </div>

            <div className="text-xs font-mono text-zinc-400">
              Pointez la caméra vers le tag NFC / QR de l'équipement (ex: <span className="text-[#00F0FF]">CHLR-02</span>)
            </div>

            <button
              onClick={() => {
                setShowQRModal(false);
                setSearchQuery('CHLR-02');
                toast.success('Tag détecté : Chiller Unit CHLR-02');
              }}
              className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-[#00F0FF] font-mono text-xs font-bold rounded-lg border border-zinc-700 transition-colors"
            >
              Simuler détection "CHLR-02"
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
