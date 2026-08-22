import React, { useState, useMemo } from 'react';
import { 
  Ticket, AlertTriangle, Clock, CheckCircle2, UserCheck, Wrench, ShieldAlert,
  Search, Filter, ArrowUpRight, ChevronRight, AlertCircle, RefreshCw, Layers,
  Building2, Plus, Eye, Send, FileText, Check, X, Shield, Activity, Flame, Sparkles
} from 'lucide-react';
import clsx from 'clsx';
import toast from 'react-hot-toast';
import { useLanguage } from '../context/LanguageContext';
import { useSiteConfig } from '../context/SiteConfigContext';
import DynamicFormIndications from './DynamicFormIndications';

// Enum definitions matching Prisma schema
const STATUSES = [
  { key: 'SUBMITTED', labelKey: 'status_submitted', defaultLabel: 'Soumis', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
  { key: 'TRIAGED', labelKey: 'status_triaged', defaultLabel: 'Validé FM', color: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
  { key: 'ASSIGNED', labelKey: 'status_assigned', defaultLabel: 'Assigné', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' },
  { key: 'IN_PROGRESS', labelKey: 'status_in_progress', defaultLabel: 'En cours', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
  { key: 'TECH_CLOSED', labelKey: 'status_tech_closed', defaultLabel: 'Clôture Tech', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' },
  { key: 'QAP_PASSED', labelKey: 'status_qap_passed', defaultLabel: 'Validé QA', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
  { key: 'CLOSED', labelKey: 'status_closed', defaultLabel: 'Clôturé', color: 'bg-slate-800 text-slate-400 border-slate-700' }
];

const SEVERITIES = [
  { key: 'EMERGENCY', labelKey: 'sev_emergency', defaultLabel: 'Danger Immédiat', color: 'text-rose-500 bg-rose-500/20 border-rose-500/40 animate-pulse', priorityNum: 1 },
  { key: 'CRITICAL', labelKey: 'sev_critical', defaultLabel: 'Critique', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30', priorityNum: 2 },
  { key: 'HIGH', labelKey: 'sev_high', defaultLabel: 'Haute', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30', priorityNum: 3 },
  { key: 'MEDIUM', labelKey: 'sev_medium', defaultLabel: 'Moyenne', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30', priorityNum: 4 },
  { key: 'LOW', labelKey: 'sev_low', defaultLabel: 'Basse', color: 'text-slate-400 bg-slate-800 border-slate-700', priorityNum: 5 }
];

const INITIAL_TICKETS = [
  {
    id: 'tkt-1',
    reference: 'TKT-2026-00101',
    title: 'AHU-03 High Pressure Differential Warning',
    category: 'HVAC',
    severity: 'CRITICAL',
    status: 'IN_PROGRESS',
    building: 'Alpha Tower',
    floor: 'Floor 4',
    locationDetails: 'AHU Room East Wing',
    submittedBy: 'System IoT Sensor',
    assignedTo: 'Jean Dupont (HVAC Lead)',
    createdAt: '2026-08-21 08:30',
    slaDueMinutes: 45,
    description: 'Filter differential pressure reached 280 Pa (Threshold 250 Pa). Airflow reduced by 18%.'
  },
  {
    id: 'tkt-2',
    reference: 'TKT-2026-00102',
    title: 'Main Substation Phase B Voltage Fluctuation',
    category: 'ELECTRICAL',
    severity: 'EMERGENCY',
    status: 'ASSIGNED',
    building: 'Alpha Tower',
    floor: 'Basement 2',
    locationDetails: 'Electrical Vault A',
    submittedBy: 'Sarah Connor',
    assignedTo: 'Marek Kovacs (Power Tech)',
    createdAt: '2026-08-21 09:12',
    slaDueMinutes: 15,
    description: 'Voltage drop detected on Phase B (-7.2%). Backup generator pre-warm cycle initiated.'
  },
  {
    id: 'tkt-3',
    reference: 'TKT-2026-00103',
    title: 'Elevator B2 Door Optical Sensor Misalignment',
    category: 'ACCESS',
    severity: 'HIGH',
    status: 'TRIAGED',
    building: 'Alpha Tower',
    floor: 'Floor 1 Lobby',
    locationDetails: 'Shaft B',
    submittedBy: 'Lucas Martin',
    assignedTo: 'Pending Dispatch',
    createdAt: '2026-08-21 09:45',
    slaDueMinutes: 120,
    description: 'Door optical safety curtain retried 4 times. Elevator temporarily held at floor 1.'
  },
  {
    id: 'tkt-4',
    reference: 'TKT-2026-00104',
    title: 'Restroom Water Pipe Leak in Zone B',
    category: 'PLUMBING',
    severity: 'HIGH',
    status: 'SUBMITTED',
    building: 'Beta Hub',
    floor: 'Floor 2',
    locationDetails: 'Executive Restroom',
    submittedBy: 'Sophie Bernard',
    assignedTo: 'Unassigned',
    createdAt: '2026-08-21 10:05',
    slaDueMinutes: 90,
    description: 'Slow leak underneath sink 3 causing water pooling on tile floor.'
  },
  {
    id: 'tkt-5',
    reference: 'TKT-2026-00105',
    title: 'Conference Room 302 HVAC Temperature High (26.5°C)',
    category: 'TEMPERATURE',
    severity: 'MEDIUM',
    status: 'IN_PROGRESS',
    building: 'Beta Hub',
    floor: 'Floor 3',
    locationDetails: 'Conf Room 302',
    submittedBy: 'Marc Antoine',
    assignedTo: 'Tarik Ben (Facilities)',
    createdAt: '2026-08-21 07:15',
    slaDueMinutes: 180,
    description: 'Chilled water valve actuator jammed at 20% position.'
  },
  {
    id: 'tkt-6',
    reference: 'TKT-2026-00106',
    title: 'Lobby Smart Light Sensor #104 Offline',
    category: 'LIGHTING',
    severity: 'LOW',
    status: 'SUBMITTED',
    building: 'Alpha Tower',
    floor: 'Lobby',
    locationDetails: 'Main Entrance',
    submittedBy: 'Mesh Telemetry',
    assignedTo: 'Unassigned',
    createdAt: '2026-08-21 06:00',
    slaDueMinutes: 480,
    description: 'Battery dropped below threshold (11%). Device heartbeat missed.'
  },
  {
    id: 'tkt-7',
    reference: 'TKT-2026-00107',
    title: 'Fire Alarm Panel Zone 4 Self-Test Completed',
    category: 'SAFETY',
    severity: 'LOW',
    status: 'TECH_CLOSED',
    building: 'Gamma Logistics',
    floor: 'Warehouse',
    locationDetails: 'Panel FA-01',
    submittedBy: 'Auto Routine',
    assignedTo: 'Safety Inspector',
    createdAt: '2026-08-20 18:00',
    slaDueMinutes: 0,
    description: 'Routine self-test passed without faults. Pending QA closure validation.'
  },
  {
    id: 'tkt-8',
    reference: 'TKT-2026-00108',
    title: 'Server Room 2 UPS Battery Test',
    category: 'ELECTRICAL',
    severity: 'HIGH',
    status: 'QAP_PASSED',
    building: 'Alpha Tower',
    floor: 'Basement 1',
    locationDetails: 'UPS Bay 2',
    submittedBy: 'Alexandre Roux',
    assignedTo: 'Sarah Connor',
    createdAt: '2026-08-20 14:00',
    slaDueMinutes: 0,
    description: 'Impedance test completed. 2 battery cells replaced.'
  }
];

export default function TicketSummaryDashboard() {
  const { t } = useLanguage();
  const { sites } = useSiteConfig();
  const [tickets, setTickets] = useState(INITIAL_TICKETS);
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicketModal, setSelectedTicketModal] = useState(null);
  const [showCreateTicketModal, setShowCreateTicketModal] = useState(false);
  const [newTicketForm, setNewTicketForm] = useState({
    title: '',
    siteId: '',
    category: 'HVAC',
    severity: 'MEDIUM',
    description: ''
  });
  const [customFormValues, setCustomFormValues] = useState({});
  const [viewMode, setViewMode] = useState('MATRIX'); // 'MATRIX' | 'LIST' | 'KANBAN'

  // Calculated matrix counts: matrix[status][severity]
  const matrixData = useMemo(() => {
    const matrix = {};
    STATUSES.forEach(s => {
      matrix[s.key] = {};
      SEVERITIES.forEach(sev => {
        matrix[s.key][sev.key] = 0;
      });
    });

    tickets.forEach(t => {
      if (matrix[t.status] && matrix[t.status][t.severity] !== undefined) {
        matrix[t.status][t.severity]++;
      }
    });

    return matrix;
  }, [tickets]);

  // Aggregate Metrics
  const openTickets = useMemo(() => tickets.filter(t => t.status !== 'CLOSED'), [tickets]);
  const criticalCount = useMemo(() => openTickets.filter(t => t.severity === 'CRITICAL' || t.severity === 'EMERGENCY').length, [openTickets]);
  const slaRiskCount = useMemo(() => openTickets.filter(t => t.slaDueMinutes > 0 && t.slaDueMinutes <= 60).length, [openTickets]);

  // Filtered ticket list
  const filteredTickets = useMemo(() => {
    return tickets.filter(t => {
      if (selectedStatus !== 'ALL' && t.status !== selectedStatus) return false;
      if (selectedSeverity !== 'ALL' && t.severity !== selectedSeverity) return false;
      if (selectedCategory !== 'ALL' && t.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          t.reference.toLowerCase().includes(q) ||
          t.title.toLowerCase().includes(q) ||
          t.building.toLowerCase().includes(q) ||
          t.assignedTo.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [tickets, selectedStatus, selectedSeverity, selectedCategory, searchQuery]);

  // Quick Action Handler to change status
  const handleUpdateTicketStatus = (ticketId, newStatus) => {
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: newStatus } : t));
    toast.success(`Statut du ticket mis à jour : ${newStatus}`);
    if (selectedTicketModal && selectedTicketModal.id === ticketId) {
      setSelectedTicketModal(prev => ({ ...prev, status: newStatus }));
    }
  };

  return (
    <div className="w-full bg-[#090A0F] text-slate-100 p-4 sm:p-6 rounded-2xl font-sans space-y-6">
      
      {/* ================= HEADER & OVERVIEW BAR ================= */}
      <div className="bg-[#12141D] border border-slate-800 p-5 rounded-2xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
            <Ticket className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              {t('ticket_board_title', 'Tableau de Bord des Réclamations & Tickets Ouverts')}
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              {t('ticket_board_subtitle', 'Synthèse d\'avancement par Statut et Sévérité pour Facility Managers')}
            </p>
          </div>
        </div>

        {/* View mode switcher & actions */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end">
          <div className="bg-[#090A0F] border border-slate-800 rounded-xl p-1 flex items-center text-xs font-mono">
            <button
              onClick={() => setViewMode('MATRIX')}
              className={clsx(
                "px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5",
                viewMode === 'MATRIX' ? "bg-cyan-500 text-slate-950 shadow" : "text-slate-400 hover:text-white"
              )}
            >
              <Layers className="w-3.5 h-3.5" /> {t('matrix_synthesis', 'Matrice Synthèse')}
            </button>
            <button
              onClick={() => setViewMode('LIST')}
              className={clsx(
                "px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5",
                viewMode === 'LIST' ? "bg-cyan-500 text-slate-950 shadow" : "text-slate-400 hover:text-white"
              )}
            >
              <FileText className="w-3.5 h-3.5" /> {t('grid_list', 'Liste Détaillée')} ({filteredTickets.length})
            </button>
          </div>

          <button
            onClick={() => setShowCreateTicketModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)] cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Déclarer une Réclamation
          </button>

          <button 
            onClick={() => {
              setTickets([...INITIAL_TICKETS]);
              toast.success('Données réactualisées');
            }}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-all cursor-pointer"
            title={t('refresh', 'Rafraîchir')}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ================= KPI STATS CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Open Tickets */}
        <div className="bg-[#12141D] border border-slate-800 hover:border-cyan-500/40 p-5 rounded-2xl flex flex-col justify-between gap-3 shadow-lg transition-all">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 uppercase tracking-wider">
            <span>{t('dash_open_tickets', 'Tickets Ouverts')}</span>
            <Ticket className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white">{openTickets.length}</span>
            <span className="text-xs font-mono text-cyan-400">{t('total_requests', 'Total en cours')}</span>
          </div>
          <div className="text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800/80">
            {tickets.filter(t => t.status === 'SUBMITTED').length} {t('status_submitted', 'Nouveaux en attente de triage')}
          </div>
        </div>

        {/* Emergencies & Critical */}
        <div className="bg-[#12141D] border border-rose-500/30 bg-rose-500/5 p-5 rounded-2xl flex flex-col justify-between gap-3 shadow-lg transition-all">
          <div className="flex items-center justify-between text-xs font-mono text-rose-400 uppercase tracking-wider">
            <span>{t('emergencies_critical', 'Urgences & Critiques')}</span>
            <ShieldAlert className="w-4 h-4 text-rose-400 animate-pulse" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-rose-400">{criticalCount}</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-500/20 text-rose-300 border border-rose-500/40">
              P1 / P2
            </span>
          </div>
          <div className="text-[11px] font-mono text-rose-300/80 pt-2 border-t border-rose-500/20">
            SLA &lt; 30 min
          </div>
        </div>

        {/* SLA Breach Risk */}
        <div className="bg-[#12141D] border border-amber-500/30 bg-amber-500/5 p-5 rounded-2xl flex flex-col justify-between gap-3 shadow-lg transition-all">
          <div className="flex items-center justify-between text-xs font-mono text-amber-400 uppercase tracking-wider">
            <span>{t('sla_breach_risk', 'Risque Dépassement SLA')}</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-amber-400">{slaRiskCount}</span>
            <span className="text-xs font-mono text-amber-400">&lt; 60 min</span>
          </div>
          <div className="text-[11px] font-mono text-amber-300/80 pt-2 border-t border-amber-500/20">
            Escalation Active
          </div>
        </div>

        {/* Resolution Rate */}
        <div className="bg-[#12141D] border border-emerald-500/30 bg-emerald-500/5 p-5 rounded-2xl flex flex-col justify-between gap-3 shadow-lg transition-all">
          <div className="flex items-center justify-between text-xs font-mono text-emerald-400 uppercase tracking-wider">
            <span>{t('sla_resolution_rate', 'Taux de Résolution SLA')}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-emerald-400">96.4%</span>
            <span className="text-xs font-mono text-emerald-400">+1.2%</span>
          </div>
          <div className="text-[11px] font-mono text-slate-400 pt-2 border-t border-emerald-500/20">
            MTTR: 2.1h
          </div>
        </div>

      </div>

      {/* ================= SUMMARY MATRIX GRID (STATUT x SÉVÉRITÉ) ================= */}
      {viewMode === 'MATRIX' && (
        <section className="bg-[#12141D] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              <h2 className="text-base font-bold text-white tracking-tight">
                {t('matrix_title', 'Matrice Synthétique des Réclamations (Statut x Sévérité)')}
              </h2>
            </div>
            <p className="text-xs font-mono text-slate-400">
              {t('click_cell_filter', 'Cliquez sur une cellule pour filtrer la vue détaillée')}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-800 text-xs font-mono text-slate-400">
                  <th className="p-3 bg-[#090A0F] rounded-tl-xl font-bold uppercase tracking-wider">
                    {t('severity_status', 'Sévérité \\ Statut')}
                  </th>
                  {STATUSES.map(s => (
                    <th key={s.key} className="p-3 text-center font-bold">
                      <span className={clsx("px-2 py-1 rounded text-[10px] uppercase border", s.color)}>
                        {t(s.labelKey, s.defaultLabel)}
                      </span>
                    </th>
                  ))}
                  <th className="p-3 text-center font-bold text-white uppercase bg-[#090A0F] rounded-tr-xl">
                    {t('total', 'Total')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs font-mono">
                {SEVERITIES.map(sev => {
                  // Total for this severity
                  const rowTotal = STATUSES.reduce((acc, st) => acc + (matrixData[st.key][sev.key] || 0), 0);

                  return (
                    <tr key={sev.key} className="hover:bg-slate-800/30 transition-colors">
                      {/* Severity Header */}
                      <td className="p-3 font-bold bg-[#090A0F]/60">
                        <span className={clsx("px-2.5 py-1 rounded-md border text-[11px] font-semibold inline-flex items-center gap-1.5", sev.color)}>
                          {sev.key === 'EMERGENCY' && <Flame className="w-3.5 h-3.5" />}
                          {t(sev.labelKey, sev.defaultLabel)}
                        </span>
                      </td>

                      {/* Status Cells */}
                      {STATUSES.map(st => {
                        const count = matrixData[st.key][sev.key] || 0;
                        const isSelectedCell = selectedStatus === st.key && selectedSeverity === sev.key;

                        return (
                          <td 
                            key={st.key}
                            onClick={() => {
                              if (isSelectedCell) {
                                setSelectedStatus('ALL');
                                setSelectedSeverity('ALL');
                              } else {
                                setSelectedStatus(st.key);
                                setSelectedSeverity(sev.key);
                                setViewMode('LIST');
                              }
                            }}
                            className={clsx(
                              "p-3 text-center transition-all cursor-pointer font-bold text-sm",
                              count > 0 ? "text-white hover:bg-cyan-500/20" : "text-slate-600 hover:bg-slate-800/50",
                              isSelectedCell && "ring-2 ring-cyan-400 bg-cyan-500/30"
                            )}
                          >
                            <div className="flex items-center justify-center">
                              {count > 0 ? (
                                <span className={clsx(
                                  "w-8 h-8 rounded-xl flex items-center justify-center font-extrabold border shadow-inner",
                                  sev.key === 'EMERGENCY' || sev.key === 'CRITICAL' ? "bg-rose-500/20 text-rose-300 border-rose-500/40" :
                                  sev.key === 'HIGH' ? "bg-amber-500/20 text-amber-300 border-amber-500/40" :
                                  "bg-slate-800 text-cyan-300 border-slate-700"
                                )}>
                                  {count}
                                </span>
                              ) : (
                                <span className="text-slate-700">-</span>
                              )}
                            </div>
                          </td>
                        );
                      })}

                      {/* Row Total */}
                      <td className="p-3 text-center font-extrabold text-slate-200 bg-[#090A0F]/60">
                        {rowTotal}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ================= FILTERS & SEARCH BAR ================= */}
      <div className="bg-[#12141D] border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Rechercher ticket, réf, bâtiment..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#090A0F] border border-slate-800 text-xs text-white pl-9 pr-3 py-2 rounded-xl focus:border-cyan-500 focus:outline-none font-mono"
            />
          </div>

          {/* Filter Status */}
          <select 
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-[#090A0F] border border-slate-800 text-xs text-slate-300 px-3 py-2 rounded-xl focus:border-cyan-500 focus:outline-none font-mono cursor-pointer"
          >
            <option value="ALL">Tous les Statuts</option>
            {STATUSES.map(s => (
              <option key={s.key} value={s.key}>{s.label}</option>
            ))}
          </select>

          {/* Filter Severity */}
          <select 
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="bg-[#090A0F] border border-slate-800 text-xs text-slate-300 px-3 py-2 rounded-xl focus:border-cyan-500 focus:outline-none font-mono cursor-pointer"
          >
            <option value="ALL">Toutes Sévérités</option>
            {SEVERITIES.map(s => (
              <option key={s.key} value={s.key}>{s.label}</option>
            ))}
          </select>

          {/* Filter Category */}
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#090A0F] border border-slate-800 text-xs text-slate-300 px-3 py-2 rounded-xl focus:border-cyan-500 focus:outline-none font-mono cursor-pointer"
          >
            <option value="ALL">Toutes Catégories</option>
            <option value="HVAC">CVC / Climatisation</option>
            <option value="ELECTRICAL">Électricité</option>
            <option value="PLUMBING">Plomberie</option>
            <option value="ACCESS">Contrôle d'accès / Ascenseur</option>
            <option value="SAFETY">Sécurité incendie</option>
            <option value="LIGHTING">Éclairage</option>
          </select>
        </div>

        {(selectedStatus !== 'ALL' || selectedSeverity !== 'ALL' || selectedCategory !== 'ALL' || searchQuery) && (
          <button
            onClick={() => {
              setSelectedStatus('ALL');
              setSelectedSeverity('ALL');
              setSelectedCategory('ALL');
              setSearchQuery('');
            }}
            className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" /> Réinitialiser les filtres
          </button>
        )}
      </div>

      {/* ================= DETAILED TICKETS LIST ================= */}
      <section className="bg-[#12141D] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            Liste des Réclamations Ouvertes ({filteredTickets.length})
          </h3>
          <span className="text-xs font-mono text-slate-400">
            Trié par urgence &amp; délai SLA
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {filteredTickets.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs font-mono">
              Aucune réclamation correspondant aux critères de recherche.
            </div>
          ) : (
            filteredTickets.map(tkt => {
              const statusObj = STATUSES.find(s => s.key === tkt.status) || STATUSES[0];
              const sevObj = SEVERITIES.find(s => s.key === tkt.severity) || SEVERITIES[3];

              return (
                <div 
                  key={tkt.id}
                  className="bg-[#090A0F] border border-slate-800/80 hover:border-cyan-500/50 p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all shadow-sm group"
                >
                  <div className="flex items-start gap-3 flex-1">
                    <div className={clsx(
                      "p-2.5 rounded-xl border shrink-0 text-xs font-bold font-mono",
                      sevObj.color
                    )}>
                      {tkt.reference}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={clsx("px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border", statusObj.color)}>
                          {statusObj.label}
                        </span>
                        <span className={clsx("px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border", sevObj.color)}>
                          {sevObj.label}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                          [{tkt.category}]
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">
                        {tkt.title}
                      </h4>

                      <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-slate-400">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-slate-500" /> {tkt.building} - {tkt.floor} ({tkt.locationDetails})
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <UserCheck className="w-3 h-3 text-slate-500" /> Assigné: <strong className="text-slate-200">{tkt.assignedTo}</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & SLA Timer */}
                  <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-4 pt-3 md:pt-0 border-t md:border-t-0 border-slate-800">
                    {tkt.slaDueMinutes > 0 ? (
                      <div className="text-right font-mono">
                        <span className="text-[10px] text-slate-500 uppercase block">Échéance SLA</span>
                        <span className={clsx(
                          "text-xs font-bold",
                          tkt.slaDueMinutes <= 30 ? "text-rose-400 animate-pulse" : "text-amber-400"
                        )}>
                          {tkt.slaDueMinutes} min restantes
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> SLA Respecté
                      </span>
                    )}

                    <button
                      onClick={() => setSelectedTicketModal(tkt)}
                      className="px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500 text-cyan-400 hover:text-slate-950 font-mono text-xs font-bold rounded-lg border border-cyan-500/30 transition-all cursor-pointer flex items-center gap-1 shrink-0"
                    >
                      <Eye className="w-3.5 h-3.5" /> Inspecter
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* ================= MODAL: TICKET INSPECTION & QUICK WORKFLOW ================= */}
      {selectedTicketModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#12141D] border border-slate-800 rounded-2xl w-full max-w-2xl p-6 flex flex-col gap-5 shadow-2xl animate-in fade-in zoom-in duration-200">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-xl font-mono text-xs font-bold">
                  {selectedTicketModal.reference}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{selectedTicketModal.title}</h3>
                  <span className="text-xs font-mono text-slate-400">Catégorie: {selectedTicketModal.category}</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedTicketModal(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
              <div className="bg-[#090A0F] border border-slate-800 p-3 rounded-xl">
                <span className="text-[10px] text-slate-500 uppercase">Sévérité</span>
                <div className="font-bold text-rose-400 mt-1">{selectedTicketModal.severity}</div>
              </div>
              <div className="bg-[#090A0F] border border-slate-800 p-3 rounded-xl">
                <span className="text-[10px] text-slate-500 uppercase">Localisation</span>
                <div className="font-bold text-white mt-1">{selectedTicketModal.building} ({selectedTicketModal.floor})</div>
              </div>
              <div className="bg-[#090A0F] border border-slate-800 p-3 rounded-xl col-span-2 sm:col-span-1">
                <span className="text-[10px] text-slate-500 uppercase">Demandeur</span>
                <div className="font-bold text-cyan-400 mt-1">{selectedTicketModal.submittedBy}</div>
              </div>
            </div>

            <div className="bg-[#090A0F] border border-slate-800 p-3.5 rounded-xl space-y-1 font-mono text-xs">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Description du Problème</span>
              <p className="text-slate-300 leading-relaxed">{selectedTicketModal.description}</p>
            </div>

            {/* Change Status Workflow Buttons */}
            <div className="space-y-2">
              <span className="text-xs font-mono text-slate-400 uppercase font-bold">Changer le statut du ticket</span>
              <div className="flex flex-wrap gap-2">
                {STATUSES.map(st => (
                  <button
                    key={st.key}
                    onClick={() => handleUpdateTicketStatus(selectedTicketModal.id, st.key)}
                    className={clsx(
                      "px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all cursor-pointer",
                      selectedTicketModal.status === st.key ? "bg-cyan-500 text-slate-950 border-cyan-400 shadow-md" : "bg-[#090A0F] text-slate-300 border-slate-800 hover:border-slate-700"
                    )}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setSelectedTicketModal(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Fermer
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ================= MODAL: CREATE TICKET / CLAIM ================= */}
      {showCreateTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0D0E12] border border-slate-800 w-full max-w-lg rounded-2xl p-6 flex flex-col gap-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-cyan-400" /> Déclarer un Ticket / Réclamation
              </h3>
              <button onClick={() => setShowCreateTicketModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const selectedSite = sites.find(s => s.id === newTicketForm.siteId);
                const newTkt = {
                  id: `TKT-${Date.now().toString().slice(-4)}`,
                  reference: `REC-2026-${Math.floor(100 + Math.random() * 900)}`,
                  title: newTicketForm.title || 'Nouvelle Réclamation Occupant',
                  category: newTicketForm.category || 'HVAC',
                  status: 'SUBMITTED',
                  severity: newTicketForm.severity || 'MEDIUM',
                  building: selectedSite ? selectedSite.name : 'Paris HQ - Bâtiment Alpha',
                  floor: 'L1',
                  submittedBy: 'Superadmin / Occupant',
                  assignedTo: 'Équipe FM',
                  description: newTicketForm.description || 'Problème déclaré via formulaire.',
                  slaDueMinutes: 120,
                  createdAt: new Date().toISOString()
                };
                setTickets(prev => [newTkt, ...prev]);
                setShowCreateTicketModal(false);
                setNewTicketForm({ title: '', siteId: '', category: 'HVAC', severity: 'MEDIUM', description: '' });
                setCustomFormValues({});
                toast.success('Réclamation enregistrée avec succès !');
              }}
              className="space-y-4 font-mono text-xs"
            >
              {/* Superadmin Indications & Form Custom Fields */}
              <DynamicFormIndications
                customValues={customFormValues}
                onChangeCustomValue={(id, val) => setCustomFormValues(prev => ({ ...prev, [id]: val }))}
              />

              <div>
                <label className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Site / Bâtiment Concerné</label>
                <select
                  required
                  value={newTicketForm.siteId}
                  onChange={(e) => setNewTicketForm({ ...newTicketForm, siteId: e.target.value })}
                  className="w-full bg-[#08080A] border border-slate-800 p-2.5 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="">Sélectionner l'adresse du site...</option>
                  {sites.map(s => (
                    <option key={s.id} value={s.id}>{s.name} — {s.streetAddress}, {s.city}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Objet de la Réclamation</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Dysfonctionnement climatisation bureau 204"
                  value={newTicketForm.title}
                  onChange={(e) => setNewTicketForm({ ...newTicketForm, title: e.target.value })}
                  className="w-full bg-[#08080A] border border-slate-800 p-2.5 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Catégorie</label>
                  <select
                    value={newTicketForm.category}
                    onChange={(e) => setNewTicketForm({ ...newTicketForm, category: e.target.value })}
                    className="w-full bg-[#08080A] border border-slate-800 p-2.5 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="HVAC">CVC / HVAC</option>
                    <option value="PLUMBING">Plomberie</option>
                    <option value="ELECTRICAL">Électricité</option>
                    <option value="ACCESS">Accès &amp; Sécurité</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Sévérité</label>
                  <select
                    value={newTicketForm.severity}
                    onChange={(e) => setNewTicketForm({ ...newTicketForm, severity: e.target.value })}
                    className="w-full bg-[#08080A] border border-slate-800 p-2.5 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="LOW">Faible (LOW)</option>
                    <option value="MEDIUM">Moyenne (MEDIUM)</option>
                    <option value="HIGH">Élevée (HIGH)</option>
                    <option value="CRITICAL">Critique (CRITICAL)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Description Détaillée</label>
                <textarea
                  rows={3}
                  value={newTicketForm.description}
                  onChange={(e) => setNewTicketForm({ ...newTicketForm, description: e.target.value })}
                  placeholder="Expliquez la gêne ou le problème constaté..."
                  className="w-full bg-[#08080A] border border-slate-800 p-2.5 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Soumettre le Ticket
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateTicketModal(false)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
