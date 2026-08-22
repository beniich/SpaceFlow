import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Activity, Zap, CheckCircle2, AlertTriangle, Bell, Search, Settings, 
  Server, Box, Layers, Leaf, Map, Grid, RefreshCcw, ArrowUpRight, 
  Cpu, Wifi, ShieldCheck, Terminal, Play, Pause, Trash2, Filter,
  Wrench, Clock, Users, ChevronRight, Check, AlertCircle, Eye,
  Sliders, Plus, X, Building2, Flame, Droplets, Gauge, Lock, SunMedium
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import clsx from 'clsx';
import toast from 'react-hot-toast';
import TicketSummaryDashboard from './TicketSummaryDashboard';
import { useLanguage } from '../context/LanguageContext';

// Initial Mock Facility Data & Metrics
const INITIAL_FACILITIES = [
  { id: 'fac-1', name: 'Alpha Tower - Main Campus', location: 'Paris HQ', status: 'Optimal', healthScore: 96 },
  { id: 'fac-2', name: 'Beta Hub - Innovation Center', location: 'Lyon Facility', status: 'Warning', healthScore: 88 },
  { id: 'fac-3', name: 'Gamma Logistics Complex', location: 'Marseille Port', status: 'Optimal', healthScore: 98 },
];

const TIME_SERIES = {
  '24h': [
    { time: '00:00', load: 380, health: 98, workOrders: 12 },
    { time: '04:00', load: 340, health: 98, workOrders: 10 },
    { time: '08:00', load: 620, health: 95, workOrders: 18 },
    { time: '12:00', load: 840, health: 94, workOrders: 24 },
    { time: '16:00', load: 790, health: 96, workOrders: 20 },
    { time: '20:00', load: 550, health: 97, workOrders: 15 },
    { time: '24:00', load: 410, health: 98, workOrders: 13 },
  ],
  '7d': [
    { time: 'Mon', load: 710, health: 96, workOrders: 22 },
    { time: 'Tue', load: 750, health: 95, workOrders: 25 },
    { time: 'Wed', load: 820, health: 93, workOrders: 28 },
    { time: 'Thu', load: 790, health: 96, workOrders: 21 },
    { time: 'Fri', load: 740, health: 97, workOrders: 19 },
    { time: 'Sat', load: 450, health: 99, workOrders: 8 },
    { time: 'Sun', load: 410, health: 99, workOrders: 6 },
  ],
  '30d': [
    { time: 'Week 1', load: 4800, health: 96, workOrders: 95 },
    { time: 'Week 2', load: 5100, health: 95, workOrders: 110 },
    { time: 'Week 3', load: 4950, health: 97, workOrders: 88 },
    { time: 'Week 4', load: 4700, health: 98, workOrders: 78 },
  ]
};

const INITIAL_SYSTEM_HEALTH = [
  {
    id: 'sys-hvac',
    name: 'HVAC & Climate Control',
    category: 'Environment',
    healthScore: 92,
    status: 'Warning',
    icon: WindIcon,
    metrics: { temp: '21.8°C', pressure: '1.2 bar', airflow: '415 CFM', activeUnits: '14/15' },
    lastMaintenance: '2 days ago',
    alertMessage: 'Air Filter Differential Pressure High in AHU-03'
  },
  {
    id: 'sys-elec',
    name: 'Electrical Grid & Backup',
    category: 'Power',
    healthScore: 98,
    status: 'Optimal',
    icon: Zap,
    metrics: { voltage: '400.2 V', powerFactor: '0.98', currentLoad: '68%', generatorStatus: 'Standby' },
    lastMaintenance: '12 days ago',
    alertMessage: null
  },
  {
    id: 'sys-plumb',
    name: 'Plumbing & Hydraulic System',
    category: 'Utilities',
    healthScore: 95,
    status: 'Optimal',
    icon: Droplets,
    metrics: { mainPressure: '4.2 bar', flowRate: '18.4 L/min', waterQuality: '99.2%', tankLevel: '88%' },
    lastMaintenance: '5 days ago',
    alertMessage: null
  },
  {
    id: 'sys-fire',
    name: 'Fire & Life Safety',
    category: 'Safety',
    healthScore: 100,
    status: 'Optimal',
    icon: Flame,
    metrics: { detectorsActive: '142/142', sprinklerPressure: '8.5 bar', lastSelfTest: 'Passed Today' },
    lastMaintenance: 'Yesterday',
    alertMessage: null
  },
  {
    id: 'sys-elev',
    name: 'Elevators & Escalators',
    category: 'Mobility',
    healthScore: 85,
    status: 'Maintenance',
    icon: Gauge,
    metrics: { activeCabs: '5/6', avgWaitTime: '18s', dailyTrips: '1,420' },
    lastMaintenance: 'In Progress',
    alertMessage: 'Elevator B2 down for routine cable inspection'
  },
  {
    id: 'sys-sec',
    name: 'Access Control & Security',
    category: 'Security',
    healthScore: 99,
    status: 'Optimal',
    icon: Lock,
    metrics: { doorsSecured: '84/84', cctvFeeds: '32/32 Online', badgedUsersToday: '842' },
    lastMaintenance: '8 days ago',
    alertMessage: null
  },
  {
    id: 'sys-iot',
    name: 'IoT Sensor Mesh Network',
    category: 'Telemetry',
    healthScore: 96,
    status: 'Optimal',
    icon: Wifi,
    metrics: { onlineNodes: '248/250', signalQuality: '-64 dBm', telemetryRate: '100 Hz' },
    lastMaintenance: '1 day ago',
    alertMessage: 'Node #104 battery low (12%)'
  },
  {
    id: 'sys-light',
    name: 'Smart Lighting & Automation',
    category: 'Energy',
    healthScore: 97,
    status: 'Optimal',
    icon: SunMedium,
    metrics: { luxLevel: '450 lx', energySavings: '24%', activeSchedules: '12 Eco Zones' },
    lastMaintenance: '14 days ago',
    alertMessage: null
  }
];

const INITIAL_WORK_ORDERS = [
  {
    id: 'WO-8492',
    title: 'AHU-03 Air Filter Replacement & Airflow Calibration',
    system: 'HVAC & Climate Control',
    location: 'Alpha Tower - Floor 4 East Wing',
    priority: 'Critical',
    assignedTo: 'Jean Dupont (HVAC Tech)',
    status: 'In Progress',
    dueDate: 'Today, 16:00',
    progress: 65
  },
  {
    id: 'WO-8488',
    title: 'Elevator B2 Bi-Monthly Inspection & Tensioning',
    system: 'Elevators & Escalators',
    location: 'Alpha Tower - Service Shaft B',
    priority: 'High',
    assignedTo: 'Marek Kovacs (KONE Service)',
    status: 'In Progress',
    dueDate: 'Today, 18:00',
    progress: 40
  },
  {
    id: 'WO-8475',
    title: 'Server Room 2 Secondary UPS Battery Health Testing',
    system: 'Electrical Grid',
    location: 'Alpha Tower - Basement Tech Room',
    priority: 'High',
    assignedTo: 'Sarah Connor (Power Specialist)',
    status: 'Pending Parts',
    dueDate: 'Tomorrow, 10:00',
    progress: 15
  },
  {
    id: 'WO-8462',
    title: 'Zone 3 Water Pressure Valve Recalibration',
    system: 'Plumbing System',
    location: 'Beta Hub - Level 2 Bathrooms',
    priority: 'Medium',
    assignedTo: 'Lucas Martin (Plumber)',
    status: 'Scheduled',
    dueDate: 'Aug 23, 09:00',
    progress: 0
  },
  {
    id: 'WO-8451',
    title: 'Lobby Smart Light Sensor Node #104 Battery Replacement',
    system: 'IoT Sensor Mesh Network',
    location: 'Alpha Tower - Main Entrance',
    priority: 'Low',
    assignedTo: 'Tarik Ben (Facilities Tech)',
    status: 'Scheduled',
    dueDate: 'Aug 24, 14:00',
    progress: 0
  }
];

const INITIAL_ALERTS = [
  {
    id: 'ALT-101',
    timestamp: '10:42:15',
    title: 'Air Filter Differential Pressure High',
    system: 'HVAC & Climate Control',
    location: 'Floor 4 East Wing (AHU-03)',
    severity: 'Critical',
    acknowledged: false,
    resolved: false,
    description: 'Static pressure exceeded 250 Pa threshold. Recommended filter swap.'
  },
  {
    id: 'ALT-102',
    timestamp: '10:15:00',
    title: 'Elevator B2 Door Sensor Misalignment',
    system: 'Elevators & Escalators',
    location: 'Elevator Shaft B',
    severity: 'Warning',
    acknowledged: true,
    resolved: false,
    description: 'Door optical sensor triggered retry 3 times in 10 minutes.'
  },
  {
    id: 'ALT-103',
    timestamp: '09:30:40',
    title: 'IoT Sensor Mesh Node #104 Low Battery',
    system: 'IoT Sensor Network',
    location: 'Main Lobby',
    severity: 'Info',
    acknowledged: true,
    resolved: false,
    description: 'Battery dropped below 15%. Voltage reading 2.7V.'
  },
  {
    id: 'ALT-104',
    timestamp: '08:05:12',
    title: 'Phase B Voltage Fluctuation Auto-Stabilized',
    system: 'Electrical Grid',
    location: 'Main Substation A',
    severity: 'Info',
    acknowledged: true,
    resolved: true,
    description: 'Voltage fluctuated ±4%. Automatic tap changer corrected state.'
  }
];

const getRubricsData = (t) => [
  {
    categoryKey: 'cat_roadmap_ops',
    category: t('cat_roadmap_ops', 'Opérations & Maintenance'),
    description: t('cat_roadmap_ops_desc', 'Pilotage opérationnel, actifs, espaces, bons de travail & réclamations'),
    items: [
      { nameKey: 'nav_assets', name: t('nav_assets', 'Assets'), link: '/assets', icon: 'inventory_2', descKey: 'rub_assets_desc', desc: t('rub_assets_desc', 'Gestion du parc d\'équipements & données COBie'), statusKey: 'status_active', status: t('status_active', 'Actif') },
      { nameKey: 'nav_qr_scanner', name: t('nav_qr_scanner', 'QR Code Scanner'), link: '/scanner', icon: 'qr_code_scanner', descKey: 'rub_scanner_desc', desc: t('rub_scanner_desc', 'Scan instantané des tags QR équipements'), statusKey: 'status_active', status: t('status_active', 'Actif') },
      { nameKey: 'nav_spaces', name: t('nav_spaces', 'Spaces'), link: '/spaces', icon: 'domain', descKey: 'rub_spaces_desc', desc: t('rub_spaces_desc', 'Arborescence spatiale site, bâtiment, étage & local'), statusKey: 'status_active', status: t('status_active', 'Actif') },
      { nameKey: 'nav_work_orders', name: t('nav_work_orders', 'Work Orders'), link: '/work-orders', icon: 'assignment', descKey: 'rub_work_orders_desc', desc: t('rub_work_orders_desc', 'Bons de travail, ordres de service & clôtures'), statusKey: 'status_active', status: t('status_active', 'Actif') },
      { nameKey: 'nav_tickets', name: t('nav_tickets', 'Tickets & Réclamations'), link: '/dashboard', icon: 'grid_view', descKey: 'rub_tickets_desc', desc: t('rub_tickets_desc', 'Matrice de synthèse des réclamations par statut/sévérité'), statusKey: 'status_active', status: t('status_active', 'Actif') },
      { nameKey: 'nav_maintenance', name: t('nav_maintenance', 'Maintenance'), link: '/maintenance', icon: 'build', descKey: 'rub_maintenance_desc', desc: t('rub_maintenance_desc', 'Maintenance préventive, récurrente & prédictive'), statusKey: 'status_active', status: t('status_active', 'Actif') },
      { nameKey: 'nav_team_ops', name: t('nav_team_ops', 'Team Operations'), link: '/team', icon: 'group', descKey: 'rub_team_desc', desc: t('rub_team_desc', 'Équipes techniques, techniciens & affectations'), statusKey: 'status_active', status: t('status_active', 'Actif') },
    ]
  },
  {
    categoryKey: 'cat_strategic_pillars',
    category: t('cat_strategic_pillars', '5 Strategic Pillars'),
    description: t('cat_strategic_pillars_desc', 'Piliers d\'innovation technique, ESG, BIM, Jumeau Numérique & IA'),
    items: [
      { nameKey: 'nav_fieldtech', name: t('nav_fieldtech', 'FieldTech Mobile & OT'), link: '/intervention', icon: 'smartphone', descKey: 'rub_fieldtech_desc', desc: t('rub_fieldtech_desc', 'Application terrain mobile, signatures & photos'), statusKey: 'status_pillar_1', status: t('status_pillar_1', 'Pilier 1') },
      { nameKey: 'nav_energy', name: t('nav_energy', 'Energy & ESG Copilot'), link: '/energy', icon: 'eco', descKey: 'rub_energy_desc', desc: t('rub_energy_desc', 'Analyse énergétique, bilan carbone & intensité kWh/m²'), statusKey: 'status_pillar_2', status: t('status_pillar_2', 'Pilier 2') },
      { nameKey: 'nav_bim', name: t('nav_bim', 'BIM & 3D Viewer'), link: '/bim', icon: 'view_in_3d', descKey: 'rub_bim_desc', desc: t('rub_bim_desc', 'Visionneuse 3D IFC & calques techniques bâtiment'), statusKey: 'status_pillar_3', status: t('status_pillar_3', 'Pilier 3') },
      { nameKey: 'nav_digital_twin', name: t('nav_digital_twin', 'Digital Twin'), link: '/digital-twin', icon: 'view_in_ar', descKey: 'rub_digital_twin_desc', desc: t('rub_digital_twin_desc', 'Jumeau numérique interactif & capteurs IoT'), statusKey: 'status_pillar_4', status: t('status_pillar_4', 'Pilier 4') },
      { nameKey: 'nav_predictive_ai', name: t('nav_predictive_ai', 'Predictive AI & Health'), link: '/predictive-maintenance', icon: 'psychology', descKey: 'rub_predictive_ai_desc', desc: t('rub_predictive_ai_desc', 'Santé d\'équipements, prédiction de pannes & IA'), statusKey: 'status_pillar_5', status: t('status_pillar_5', 'Pilier 5') },
      { nameKey: 'nav_tenants', name: t('nav_tenants', 'Occupants & Tenant Care'), link: '/tenants', icon: 'person_pin', descKey: 'rub_tenants_desc', desc: t('rub_tenants_desc', 'Portail occupants, satisfaction & baux'), statusKey: 'status_active', status: t('status_active', 'Actif') },
    ]
  },
  {
    categoryKey: 'cat_modules_system',
    category: t('cat_modules_system', 'Modules & System'),
    description: t('cat_modules_system_desc', 'Intégrations SI, analytique, assistant IA, conformité & sécurité'),
    items: [
      { nameKey: 'nav_cmms', name: t('nav_cmms', 'CMMS / BEECARBONAT'), link: '/cmms', icon: 'precision_manufacturing', descKey: 'rub_cmms_desc', desc: t('rub_cmms_desc', 'Plateforme GMAO avancée & décarbonation'), statusKey: 'status_module', status: t('status_module', 'Module') },
      { nameKey: 'nav_erp', name: t('nav_erp', 'ERP Integration'), link: '/erp', icon: 'hub', descKey: 'rub_erp_desc', desc: t('rub_erp_desc', 'Connecteurs SAP, Odoo & pipelines de données'), statusKey: 'status_module', status: t('status_module', 'Module') },
      { nameKey: 'nav_analytics', name: t('nav_analytics', 'Analytics'), link: '/analytics', icon: 'analytics', descKey: 'rub_analytics_desc', desc: t('rub_analytics_desc', 'KPIs, rapports de performance & analyse MTTR'), statusKey: 'status_module', status: t('status_module', 'Module') },
      { nameKey: 'nav_leases', name: t('nav_leases', 'Leases & Contracts'), link: '/leases', icon: 'description', descKey: 'rub_leases_desc', desc: t('rub_leases_desc', 'Gestion des baux, contrats de maintenance & garanties'), statusKey: 'status_module', status: t('status_module', 'Module') },
      { nameKey: 'nav_exports', name: t('nav_exports', 'PDF Exports & Reports'), link: '/exports', icon: 'picture_as_pdf', descKey: 'rub_exports_desc', desc: t('rub_exports_desc', 'Génération de rapports d\'audit signés'), statusKey: 'status_module', status: t('status_module', 'Module') },
      { nameKey: 'nav_notifications', name: t('nav_notifications', 'Notifications & Alerts'), link: '/notifications', icon: 'notifications', descKey: 'rub_notifications_desc', desc: t('rub_notifications_desc', 'Alertes en temps réel & seuils télémétriques'), statusKey: 'status_module', status: t('status_module', 'Module') },
      { nameKey: 'nav_ai_assistant', name: t('nav_ai_assistant', 'Generative AI Assistant'), link: '/ai', icon: 'smart_toy', descKey: 'rub_ai_assistant_desc', desc: t('rub_ai_assistant_desc', 'Assistant conversationnel spécialisé Facility Management'), statusKey: 'status_copilot', status: t('status_copilot', 'IA Copilot') },
      { nameKey: 'nav_workflow_builder', name: t('nav_workflow_builder', 'Workflow Builder (No-Code)'), link: '/settings', icon: 'account_tree', descKey: 'rub_workflow_desc', desc: t('rub_workflow_desc', 'Automatisations & règles métiers configurables'), statusKey: 'status_system', status: t('status_system', 'Système') },
      { nameKey: 'nav_marketplace', name: t('nav_marketplace', 'Marketplace Extensions'), link: '/settings', icon: 'store', descKey: 'rub_marketplace_desc', desc: t('rub_marketplace_desc', 'Extensions & connecteurs tiers'), statusKey: 'status_system', status: t('status_system', 'Système') },
      { nameKey: 'nav_sectoral_packs', name: t('nav_sectoral_packs', 'Packs Sectoriels'), link: '/pricing', icon: 'category', descKey: 'rub_sectoral_desc', desc: t('rub_sectoral_desc', 'Packs adaptés Santé, Retail, Tertiaire & Logistique'), statusKey: 'status_system', status: t('status_system', 'Système') },
      { nameKey: 'nav_plans_billing', name: t('nav_plans_billing', 'Plans & Billing'), link: '/pricing', icon: 'credit_card', descKey: 'rub_plans_desc', desc: t('rub_plans_desc', 'Abonnements, abonnements multi-sites & facturation'), statusKey: 'status_system', status: t('status_system', 'Système') },
      { nameKey: 'nav_security', name: t('nav_security', 'Security & Access'), link: '/security', icon: 'shield', descKey: 'rub_security_desc', desc: t('rub_security_desc', 'Gestion des rôles RLS, sécurité & traçabilité'), statusKey: 'status_security', status: t('status_security', 'Sécurité') },
      { nameKey: 'nav_settings', name: t('nav_settings', 'System Configuration'), link: '/settings', icon: 'settings', descKey: 'rub_settings_desc', desc: t('rub_settings_desc', 'Paramètres système, utilisateurs & préférences'), statusKey: 'status_admin', status: t('status_admin', 'Admin') },
    ]
  }
];

function WindIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12.8 19.6A2 2 0 1 0 14 16H2"/>
      <path d="M17.5 8a2.5 2.5 0 1 1 2 4H2"/>
      <path d="M9.8 4.4A2 2 0 1 1 11 8H2"/>
    </svg>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [selectedFacility, setSelectedFacility] = useState('fac-1');
  const [dashboardTab, setDashboardTab] = useState('TICKETS'); // 'TICKETS' | 'OVERVIEW'
  const [timeRange, setTimeRange] = useState('24h');
  const [systems, setSystems] = useState(INITIAL_SYSTEM_HEALTH);
  const [workOrders, setWorkOrders] = useState(INITIAL_WORK_ORDERS);
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [alertFilter, setAlertFilter] = useState('ALL');
  const [woFilter, setWoFilter] = useState('ALL');
  const [isLiveTelemetry, setIsLiveTelemetry] = useState(true);
  
  // Modals state
  const [selectedSystemDetail, setSelectedSystemDetail] = useState(null);
  const [isNewWoModalOpen, setIsNewWoModalOpen] = useState(false);
  const [newWoForm, setNewWoForm] = useState({
    title: '',
    system: 'HVAC & Climate Control',
    location: '',
    priority: 'Medium',
    assignedTo: 'Tarik Ben (Facilities Tech)'
  });

  // Calculate high level KPI aggregations
  const totalWorkOrders = workOrders.length;
  const criticalWorkOrders = workOrders.filter(w => w.priority === 'Critical').length;
  const highWorkOrders = workOrders.filter(w => w.priority === 'High').length;
  const unackAlerts = alerts.filter(a => !a.acknowledged && !a.resolved).length;
  const activeAlertsCount = alerts.filter(a => !a.resolved).length;
  
  const avgHealthScore = Math.round(
    systems.reduce((acc, s) => acc + s.healthScore, 0) / systems.length
  );

  // Live Telemetry simulation effect
  useEffect(() => {
    if (!isLiveTelemetry) return;
    const timer = setInterval(() => {
      // Small random fluctuation in HVAC pressure/temp
      setSystems(prevSystems => 
        prevSystems.map(sys => {
          if (sys.id === 'sys-hvac') {
            const currentTemp = parseFloat(sys.metrics.temp);
            const newTemp = (currentTemp + (Math.random() * 0.4 - 0.2)).toFixed(1);
            return {
              ...sys,
              metrics: { ...sys.metrics, temp: `${newTemp}°C` }
            };
          }
          return sys;
        })
      );
    }, 4000);

    return () => clearInterval(timer);
  }, [isLiveTelemetry]);

  // Alert Actions
  const handleAcknowledgeAlert = (alertId) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, acknowledged: true } : a));
    toast.success('Alert acknowledged');
  };

  const handleResolveAlert = (alertId) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, acknowledged: true, resolved: true } : a));
    toast.success('Alert marked as resolved');
  };

  const handleAcknowledgeAll = () => {
    setAlerts(prev => prev.map(a => ({ ...a, acknowledged: true })));
    toast.success('All active alerts acknowledged');
  };

  // Work Order Creation
  const handleCreateWorkOrder = (e) => {
    e.preventDefault();
    if (!newWoForm.title.trim()) {
      toast.error('Please enter a work order title');
      return;
    }
    const newWo = {
      id: `WO-${Math.floor(1000 + Math.random() * 9000)}`,
      title: newWoForm.title,
      system: newWoForm.system,
      location: newWoForm.location || 'Main Building',
      priority: newWoForm.priority,
      assignedTo: newWoForm.assignedTo,
      status: 'In Progress',
      dueDate: 'Today, 18:00',
      progress: 10
    };
    setWorkOrders([newWo, ...workOrders]);
    setIsNewWoModalOpen(false);
    setNewWoForm({
      title: '',
      system: 'HVAC & Climate Control',
      location: '',
      priority: 'Medium',
      assignedTo: 'Tarik Ben (Facilities Tech)'
    });
    toast.success(`Work Order ${newWo.id} created successfully!`);
  };

  // Status Change for Work Order
  const handleUpdateWoStatus = (woId, newStatus) => {
    setWorkOrders(prev => prev.map(wo => {
      if (wo.id === woId) {
        const updatedProgress = newStatus === 'Completed' ? 100 : newStatus === 'In Progress' ? 50 : wo.progress;
        return { ...wo, status: newStatus, progress: updatedProgress };
      }
      return wo;
    }));
    toast.success(`Work order updated to ${newStatus}`);
  };

  const currentFacility = INITIAL_FACILITIES.find(f => f.id === selectedFacility) || INITIAL_FACILITIES[0];
  
  const filteredAlerts = alerts.filter(a => {
    if (alertFilter === 'UNACKNOWLEDGED') return !a.acknowledged && !a.resolved;
    if (alertFilter === 'CRITICAL') return a.severity === 'Critical' && !a.resolved;
    if (alertFilter === 'ACTIVE') return !a.resolved;
    return true;
  });

  const filteredWorkOrders = workOrders.filter(w => {
    if (woFilter === 'CRITICAL') return w.priority === 'Critical' || w.priority === 'High';
    if (woFilter === 'IN_PROGRESS') return w.status === 'In Progress';
    return true;
  });

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 font-sans transition-colors duration-200">
      <div className="max-w-[1700px] mx-auto flex flex-col gap-6">
        
        {/* ================= HEADER & CONTROLS ================= */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white dark:bg-[#12141D] border border-slate-200 dark:border-slate-800 p-4 sm:p-5 rounded-2xl shadow-sm dark:shadow-xl transition-colors">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#FF5500]/10 border border-[#FF5500]/30 rounded-xl text-[#FF5500]">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                  {t('dash_facility_status', 'Tableau de bord de Statut & Réclamations')}
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  {t('dash_subtitle', 'Suivi des Réclamations par Statut/Sévérité & Diagnostic Télémétrie')}
                </p>
              </div>
            </div>

            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 hidden md:block" />

            {/* View Switcher Pills */}
            <div className="bg-slate-100 dark:bg-[#090A0F] border border-slate-200 dark:border-slate-800 p-1 rounded-xl flex items-center font-mono text-xs">
              <button
                onClick={() => setDashboardTab('TICKETS')}
                className={clsx(
                  "px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-2 cursor-pointer",
                  dashboardTab === 'TICKETS' ? "bg-[#FF5500] text-white shadow-md" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                <Grid className="w-4 h-4" /> {t('dash_grid_tickets', 'Grille Réclamations')}
              </button>
              <button
                onClick={() => setDashboardTab('RUBRICS')}
                className={clsx(
                  "px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-2 cursor-pointer",
                  dashboardTab === 'RUBRICS' ? "bg-[#FF5500] text-white shadow-md" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                <Layers className="w-4 h-4" /> {t('dash_rubrics', 'Rubriques CAFM')}
              </button>
              <button
                onClick={() => setDashboardTab('OVERVIEW')}
                className={clsx(
                  "px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-2 cursor-pointer",
                  dashboardTab === 'OVERVIEW' ? "bg-[#FF5500] text-white shadow-md" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                <Activity className="w-4 h-4" /> {t('dash_telemetry', 'Télémétrie Facility')}
              </button>
            </div>

            {/* Facility Selector */}
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-[#090A0F] border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-xl">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Site / Bâtiment:</span>
              <select 
                value={selectedFacility}
                onChange={(e) => setSelectedFacility(e.target.value)}
                className="bg-transparent text-xs font-semibold text-[#0F172A] dark:text-cyan-400 focus:outline-none cursor-pointer"
              >
                {INITIAL_FACILITIES.map(fac => (
                  <option key={fac.id} value={fac.id} className="bg-white dark:bg-[#12141D] text-slate-900 dark:text-slate-200">
                    {fac.name} ({fac.location})
                  </option>
                ))}
              </select>
            </div>

            {/* Status Indicator Pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-bold">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Santé du Système: {avgHealthScore}% ({currentFacility.status})</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end">
            {/* Live Telemetry Toggle */}
            <button
              onClick={() => {
                setIsLiveTelemetry(!isLiveTelemetry);
                toast(isLiveTelemetry ? 'Live telemetry stream paused' : 'Live telemetry stream active');
              }}
              className={clsx(
                "flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono border transition-all cursor-pointer",
                isLiveTelemetry 
                  ? "bg-cyan-500/10 border-cyan-500/40 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.15)]"
                  : "bg-slate-800/50 border-slate-700 text-slate-400"
              )}
            >
              <Activity className={clsx("w-4 h-4", isLiveTelemetry && "animate-spin")} />
              <span>{isLiveTelemetry ? 'Live Telemetry ON' : 'Telemetry Paused'}</span>
            </button>

            {/* Create Work Order Modal Trigger */}
            <button
              onClick={() => setIsNewWoModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Work Order</span>
            </button>
          </div>
        </header>

        {/* ================= VIEW 1: TICKETS SUMMARY GRID ================= */}
        {dashboardTab === 'TICKETS' && (
          <TicketSummaryDashboard />
        )}

        {/* ================= VIEW 2: RUBRICS & STRATEGIC ROADMAP ================= */}
        {dashboardTab === 'RUBRICS' && (
          <div className="flex flex-col gap-6">
            <div className="bg-white dark:bg-[#12141D] border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Layers className="w-5 h-5 text-[#FF5500]" />
                    {t('dash_rubrics', 'Rubriques CAFM & Opérations')}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">
                    {t('dash_rubrics_subtitle', 'Accès direct aux catégories opérationnelles du système CAFM BEECARBONAT')}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-8">
                {getRubricsData(t).map((cat, idx) => (
                  <div key={idx} className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
                      <span className="p-1.5 rounded-lg bg-[#FF5500]/10 text-[#FF5500] font-mono font-bold text-xs">
                        0{idx + 1}
                      </span>
                      <div>
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase font-mono tracking-wider">
                          {cat.category}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{cat.description}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                      {cat.items.map((item, itemIdx) => (
                        <div
                          key={itemIdx}
                          onClick={() => navigate(item.link)}
                          className="group bg-slate-50 dark:bg-[#090A0F] border border-slate-200/80 dark:border-slate-800/80 hover:border-[#FF5500] dark:hover:border-[#FF5500] p-4 rounded-xl flex flex-col justify-between gap-3 transition-all cursor-pointer shadow-sm hover:shadow-md"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="p-2 rounded-lg bg-white dark:bg-[#12141D] text-[#FF5500] border border-slate-200 dark:border-slate-800 group-hover:scale-105 transition-transform">
                              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                            </div>
                            <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#FF5500]/10 text-[#FF5500] border border-[#FF5500]/20 font-bold">
                              {item.status}
                            </span>
                          </div>

                          <div>
                            <h4 className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-[#FF5500] transition-colors flex items-center justify-between">
                              <span>{item.name}</span>
                              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                            </h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                              {item.desc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= VIEW 3: TELEMETRY OVERVIEW ================= */}
        {dashboardTab === 'OVERVIEW' && (
          <>
            {/* ================= KEY METRICS GRID (ROW 1) ================= */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Active Work Orders */}
          <div className="bg-[#12141D] border border-slate-800 hover:border-cyan-500/40 p-5 rounded-2xl flex flex-col justify-between gap-4 transition-all group relative overflow-hidden shadow-lg">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Active Work Orders</span>
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Wrench className="w-4 h-4" />
              </div>
            </div>
            
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-extrabold text-white tracking-tight">{totalWorkOrders}</div>
              <div className="flex items-center gap-1 text-xs font-mono text-cyan-400">
                <span>96.2% SLA</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-[11px] font-mono">
              <span className="text-amber-400 font-semibold">{criticalWorkOrders} Critical / {highWorkOrders} High</span>
              <span className="text-slate-400">Avg Response: 2.4h</span>
            </div>
          </div>

          {/* Card 2: Active Facility Alerts */}
          <div className="bg-[#12141D] border border-slate-800 hover:border-amber-500/40 p-5 rounded-2xl flex flex-col justify-between gap-4 transition-all group relative overflow-hidden shadow-lg">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Active Alerts</span>
              <div className={clsx(
                "p-2 rounded-xl border",
                unackAlerts > 0 ? "bg-amber-500/20 text-amber-400 border-amber-500/40 animate-pulse" : "bg-slate-800 text-slate-400 border-slate-700"
              )}>
                <Bell className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-extrabold text-white tracking-tight">{activeAlertsCount}</div>
              {unackAlerts > 0 ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/20 text-amber-400 border border-amber-500/40">
                  {unackAlerts} Unacknowledged
                </span>
              ) : (
                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Cleared
                </span>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-[11px] font-mono">
              <span className="text-slate-400">Last incident: 2h ago</span>
              {unackAlerts > 0 && (
                <button 
                  onClick={handleAcknowledgeAll}
                  className="text-amber-400 hover:underline font-bold cursor-pointer"
                >
                  Ack All
                </button>
              )}
            </div>
          </div>

          {/* Card 3: Overall System Health Status */}
          <div className="bg-[#12141D] border border-slate-800 hover:border-emerald-500/40 p-5 rounded-2xl flex flex-col justify-between gap-4 transition-all group relative overflow-hidden shadow-lg">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Overall System Health</span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-extrabold text-emerald-400 tracking-tight">{avgHealthScore}%</div>
              <span className="text-xs font-mono text-slate-400">7/8 Systems Optimal</span>
            </div>

            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-400 h-full rounded-full transition-all duration-500" 
                style={{ width: `${avgHealthScore}%` }} 
              />
            </div>
          </div>

          {/* Card 4: Energy & Power Load */}
          <div className="bg-[#12141D] border border-slate-800 hover:border-blue-500/40 p-5 rounded-2xl flex flex-col justify-between gap-4 transition-all group relative overflow-hidden shadow-lg">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Power Demand Load</span>
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Zap className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-extrabold text-white tracking-tight">415 <span className="text-xs font-normal text-slate-400">kW</span></div>
              <span className="text-xs font-mono text-emerald-400">-4.2% vs Baseline</span>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-400">
              <span>Power Factor: 0.98</span>
              <span>HVAC: 58% Load</span>
            </div>
          </div>

        </div>

        {/* ================= SYSTEM HEALTH STATUS GRID (ROW 2) ================= */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Server className="w-5 h-5 text-cyan-400" />
              <h2 className="text-base font-bold text-white tracking-tight">System Health &amp; Subsystem Diagnostics</h2>
            </div>
            <span className="text-xs font-mono text-slate-400">Click system card for live diagnostic details</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {systems.map((sys) => {
              const IconComp = sys.icon;
              const isWarning = sys.status === 'Warning';
              const isMaintenance = sys.status === 'Maintenance';

              return (
                <div 
                  key={sys.id}
                  onClick={() => setSelectedSystemDetail(sys)}
                  className={clsx(
                    "bg-[#12141D] border p-4 rounded-2xl flex flex-col justify-between gap-3 cursor-pointer transition-all hover:scale-[1.01] shadow-md",
                    isWarning ? "border-amber-500/40 hover:border-amber-500 bg-amber-500/5" :
                    isMaintenance ? "border-blue-500/40 hover:border-blue-500 bg-blue-500/5" :
                    "border-slate-800 hover:border-cyan-500/50"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={clsx(
                        "p-2 rounded-xl border text-slate-200",
                        isWarning ? "bg-amber-500/20 border-amber-500/30 text-amber-400" :
                        isMaintenance ? "bg-blue-500/20 border-blue-500/30 text-blue-400" :
                        "bg-slate-800 border-slate-700 text-cyan-400"
                      )}>
                        <IconComp className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-white">{sys.name}</h3>
                        <span className="text-[10px] font-mono text-slate-400">{sys.category}</span>
                      </div>
                    </div>

                    <span className={clsx(
                      "px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border",
                      isWarning ? "bg-amber-500/10 text-amber-400 border-amber-500/30" :
                      isMaintenance ? "bg-blue-500/10 text-blue-400 border-blue-500/30" :
                      "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    )}>
                      {sys.status}
                    </span>
                  </div>

                  {/* Health Score Gauge Bar */}
                  <div className="flex flex-col gap-1 my-1">
                    <div className="flex justify-between items-center text-[10px] font-mono">
                      <span className="text-slate-400">Health Index</span>
                      <span className={clsx(
                        "font-bold",
                        sys.healthScore >= 95 ? "text-emerald-400" : sys.healthScore >= 88 ? "text-amber-400" : "text-rose-400"
                      )}>
                        {sys.healthScore}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={clsx(
                          "h-full rounded-full transition-all duration-300",
                          sys.healthScore >= 95 ? "bg-emerald-400" : sys.healthScore >= 88 ? "bg-amber-400" : "bg-rose-400"
                        )}
                        style={{ width: `${sys.healthScore}%` }}
                      />
                    </div>
                  </div>

                  {/* Sample Metric Highlights */}
                  <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-slate-800/60 text-[10px] font-mono text-slate-300">
                    {Object.entries(sys.metrics).slice(0, 2).map(([k, v]) => (
                      <div key={k} className="bg-[#090A0F] px-2 py-1 rounded border border-slate-800 truncate">
                        <span className="text-slate-500 uppercase">{k}: </span>
                        <span className="font-semibold text-white">{v}</span>
                      </div>
                    ))}
                  </div>

                  {sys.alertMessage && (
                    <div className="text-[10px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded-lg flex items-center gap-1 truncate">
                      <AlertTriangle className="w-3 h-3 shrink-0" />
                      <span className="truncate">{sys.alertMessage}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ================= ACTIVE WORK ORDERS & RECENT ALERTS (ROW 3) ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Active Work Orders Table / List (7 cols) */}
          <div className="lg:col-span-7 bg-[#12141D] border border-slate-800 rounded-2xl p-5 flex flex-col gap-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-cyan-400" />
                <h2 className="text-sm font-bold text-white tracking-tight">Active Maintenance Work Orders</h2>
              </div>

              {/* Work Order Filter tabs */}
              <div className="flex items-center bg-[#090A0F] border border-slate-800 rounded-xl p-1 text-[11px] font-mono">
                <button
                  onClick={() => setWoFilter('ALL')}
                  className={clsx("px-2.5 py-1 rounded-lg font-semibold transition-all", woFilter === 'ALL' ? "bg-cyan-500 text-slate-950" : "text-slate-400 hover:text-white")}
                >
                  All ({workOrders.length})
                </button>
                <button
                  onClick={() => setWoFilter('CRITICAL')}
                  className={clsx("px-2.5 py-1 rounded-lg font-semibold transition-all", woFilter === 'CRITICAL' ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white")}
                >
                  Critical ({criticalWorkOrders + highWorkOrders})
                </button>
                <button
                  onClick={() => setWoFilter('IN_PROGRESS')}
                  className={clsx("px-2.5 py-1 rounded-lg font-semibold transition-all", woFilter === 'IN_PROGRESS' ? "bg-blue-500 text-slate-950" : "text-slate-400 hover:text-white")}
                >
                  In Progress
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-3 max-h-[420px] overflow-y-auto pr-1">
              {filteredWorkOrders.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs font-mono">No work orders matching selected filter</div>
              ) : (
                filteredWorkOrders.map((wo) => (
                  <div 
                    key={wo.id}
                    className="bg-[#090A0F] border border-slate-800 hover:border-slate-700 p-3.5 rounded-xl flex flex-col gap-2 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-cyan-400">{wo.id}</span>
                        <span className={clsx(
                          "px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase",
                          wo.priority === 'Critical' ? "bg-rose-500/20 text-rose-400 border border-rose-500/30" :
                          wo.priority === 'High' ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" :
                          "bg-slate-800 text-slate-300"
                        )}>
                          {wo.priority}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">[{wo.system}]</span>
                      </div>

                      {/* Action Dropdown / Button */}
                      <select
                        value={wo.status}
                        onChange={(e) => handleUpdateWoStatus(wo.id, e.target.value)}
                        className="bg-[#12141D] border border-slate-700 text-slate-200 text-[10px] font-mono px-2 py-1 rounded-lg focus:outline-none focus:border-cyan-500 cursor-pointer"
                      >
                        <option value="In Progress">In Progress</option>
                        <option value="Pending Parts">Pending Parts</option>
                        <option value="Scheduled">Scheduled</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>

                    <h4 className="text-xs font-bold text-white leading-snug">{wo.title}</h4>

                    <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2 pt-1 font-mono">
                      <span>Location: <strong className="text-slate-200">{wo.location}</strong></span>
                      <span>Assigned: <strong className="text-slate-200">{wo.assignedTo}</strong></span>
                    </div>

                    {/* Progress Bar */}
                    <div className="flex items-center gap-3 pt-1">
                      <div className="flex-1 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-cyan-400 h-full rounded-full transition-all" 
                          style={{ width: `${wo.progress}%` }} 
                        />
                      </div>
                      <span className="text-[10px] font-mono text-cyan-400 font-bold shrink-0">{wo.progress}%</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Alerts & Incident Stream (5 cols) */}
          <div className="lg:col-span-5 bg-[#12141D] border border-slate-800 rounded-2xl p-5 flex flex-col gap-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <h2 className="text-sm font-bold text-white tracking-tight">Facility Incident &amp; Alert Stream</h2>
              </div>

              <div className="flex items-center gap-1.5">
                <select
                  value={alertFilter}
                  onChange={(e) => setAlertFilter(e.target.value)}
                  className="bg-[#090A0F] border border-slate-800 text-slate-300 text-[10px] font-mono px-2 py-1 rounded-lg focus:outline-none"
                >
                  <option value="ALL">All Alerts</option>
                  <option value="ACTIVE">Unresolved</option>
                  <option value="UNACKNOWLEDGED">Unacknowledged</option>
                  <option value="CRITICAL">Critical Only</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-3 max-h-[420px] overflow-y-auto pr-1">
              {filteredAlerts.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs font-mono">No active alerts matching filter</div>
              ) : (
                filteredAlerts.map((alt) => (
                  <div 
                    key={alt.id}
                    className={clsx(
                      "bg-[#090A0F] border p-3.5 rounded-xl flex flex-col gap-2 transition-all",
                      alt.resolved ? "border-slate-800 opacity-60" :
                      alt.severity === 'Critical' ? "border-rose-500/40 bg-rose-500/5" :
                      alt.severity === 'Warning' ? "border-amber-500/40 bg-amber-500/5" :
                      "border-slate-800"
                    )}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500">[{alt.timestamp}]</span>
                        <span className={clsx(
                          "px-2 py-0.5 rounded font-bold uppercase",
                          alt.severity === 'Critical' ? "bg-rose-500/20 text-rose-400" :
                          alt.severity === 'Warning' ? "bg-amber-500/20 text-amber-400" :
                          "bg-blue-500/20 text-blue-400"
                        )}>
                          {alt.severity}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {!alt.acknowledged && !alt.resolved && (
                          <button
                            onClick={() => handleAcknowledgeAlert(alt.id)}
                            className="px-2 py-0.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/40 rounded text-[10px] font-bold cursor-pointer transition-all"
                          >
                            Acknowledge
                          </button>
                        )}
                        {!alt.resolved ? (
                          <button
                            onClick={() => handleResolveAlert(alt.id)}
                            className="px-2 py-0.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 rounded text-[10px] font-bold cursor-pointer transition-all"
                          >
                            Resolve
                          </button>
                        ) : (
                          <span className="text-emerald-400 font-bold flex items-center gap-1">
                            <Check className="w-3 h-3" /> Resolved
                          </span>
                        )}
                      </div>
                    </div>

                    <h4 className="text-xs font-bold text-white">{alt.title}</h4>
                    <p className="text-[11px] text-slate-300 leading-normal">{alt.description}</p>

                    <div className="text-[10px] font-mono text-slate-400 border-t border-slate-800/80 pt-1.5 flex justify-between">
                      <span>Location: {alt.location}</span>
                      <span>System: {alt.system}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* ================= TELEMETRY TIME-SERIES CHART (ROW 4) ================= */}
        <section className="bg-[#12141D] border border-slate-800 rounded-2xl p-5 flex flex-col gap-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              <h2 className="text-sm font-bold text-white tracking-tight">Historical Power Load &amp; Facility Health Dynamics</h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Power Load (kW)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Health Index (%)
                </span>
              </div>

              <div className="flex items-center bg-[#090A0F] border border-slate-800 rounded-xl p-1 text-[11px] font-mono">
                {['24h', '7d', '30d'].map((r) => (
                  <button
                    key={r}
                    onClick={() => setTimeRange(r)}
                    className={clsx(
                      "px-3 py-1 rounded-lg font-semibold transition-all",
                      timeRange === r ? "bg-cyan-500 text-slate-950 font-bold" : "text-slate-400 hover:text-white"
                    )}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TIME_SERIES[timeRange]} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorHealth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} fontFamily="monospace" />
                <YAxis stroke="#64748b" fontSize={11} fontFamily="monospace" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#090A0F', 
                    borderColor: '#334155', 
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    color: '#f8fafc'
                  }} 
                />
                <Area type="monotone" dataKey="load" name="Power Demand (kW)" stroke="#06b6d4" strokeWidth={2.5} fillOpacity={1} fill="url(#colorLoad)" />
                <Area type="monotone" dataKey="health" name="System Health Index (%)" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorHealth)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>
        </>
        )}

      </div>

      {/* ================= MODAL: SYSTEM DETAIL DIAGNOSTICS ================= */}
      {selectedSystemDetail && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#12141D] border border-slate-800 rounded-2xl w-full max-w-2xl p-6 flex flex-col gap-5 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-xl">
                  {React.createElement(selectedSystemDetail.icon, { className: "w-5 h-5" })}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedSystemDetail.name}</h3>
                  <span className="text-xs font-mono text-slate-400">{selectedSystemDetail.category} Subsystem</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedSystemDetail(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#090A0F] border border-slate-800 p-3 rounded-xl font-mono">
                <span className="text-[10px] text-slate-400 uppercase">Health Score</span>
                <div className="text-xl font-bold text-emerald-400">{selectedSystemDetail.healthScore}%</div>
              </div>
              <div className="bg-[#090A0F] border border-slate-800 p-3 rounded-xl font-mono">
                <span className="text-[10px] text-slate-400 uppercase">Status</span>
                <div className="text-sm font-bold text-cyan-400 mt-1">{selectedSystemDetail.status}</div>
              </div>
              <div className="bg-[#090A0F] border border-slate-800 p-3 rounded-xl font-mono col-span-2">
                <span className="text-[10px] text-slate-400 uppercase">Last Inspection</span>
                <div className="text-sm font-bold text-slate-200 mt-1">{selectedSystemDetail.lastMaintenance}</div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <h4 className="text-xs font-mono text-slate-400 uppercase font-bold">Telemetry Metrics</h4>
              <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                {Object.entries(selectedSystemDetail.metrics).map(([k, v]) => (
                  <div key={k} className="bg-[#090A0F] border border-slate-800/80 p-2.5 rounded-lg flex justify-between">
                    <span className="text-slate-400 capitalize">{k}:</span>
                    <span className="font-bold text-white">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {selectedSystemDetail.alertMessage && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs font-mono flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{selectedSystemDetail.alertMessage}</span>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2 border-t border-slate-800">
              <button 
                onClick={() => {
                  toast.success(`Diagnostic routine executed for ${selectedSystemDetail.name}`);
                  setSelectedSystemDetail(null);
                }}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Run Diagnostic Test
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: CREATE WORK ORDER ================= */}
      {isNewWoModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#12141D] border border-slate-800 rounded-2xl w-full max-w-lg p-6 flex flex-col gap-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Wrench className="w-4 h-4 text-cyan-400" />
                Create Maintenance Work Order
              </h3>
              <button 
                onClick={() => setIsNewWoModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateWorkOrder} className="flex flex-col gap-4 text-xs font-mono">
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-300 font-bold">Work Order Title</label>
                <input 
                  type="text" 
                  placeholder="e.g., Replace AHU filter in Zone B" 
                  value={newWoForm.title}
                  onChange={(e) => setNewWoForm({ ...newWoForm, title: e.target.value })}
                  className="bg-[#090A0F] border border-slate-800 text-slate-100 p-2.5 rounded-xl focus:border-cyan-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-300 font-bold">Target System</label>
                  <select
                    value={newWoForm.system}
                    onChange={(e) => setNewWoForm({ ...newWoForm, system: e.target.value })}
                    className="bg-[#090A0F] border border-slate-800 text-slate-100 p-2.5 rounded-xl focus:border-cyan-500 focus:outline-none"
                  >
                    {systems.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-300 font-bold">Priority</label>
                  <select
                    value={newWoForm.priority}
                    onChange={(e) => setNewWoForm({ ...newWoForm, priority: e.target.value })}
                    className="bg-[#090A0F] border border-slate-800 text-slate-100 p-2.5 rounded-xl focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-300 font-bold">Location / Zone</label>
                <input 
                  type="text" 
                  placeholder="e.g., Floor 3 East Corridor" 
                  value={newWoForm.location}
                  onChange={(e) => setNewWoForm({ ...newWoForm, location: e.target.value })}
                  className="bg-[#090A0F] border border-slate-800 text-slate-100 p-2.5 rounded-xl focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-300 font-bold">Assigned Technician</label>
                <select
                  value={newWoForm.assignedTo}
                  onChange={(e) => setNewWoForm({ ...newWoForm, assignedTo: e.target.value })}
                  className="bg-[#090A0F] border border-slate-800 text-slate-100 p-2.5 rounded-xl focus:border-cyan-500 focus:outline-none"
                >
                  <option value="Tarik Ben (Facilities Tech)">Tarik Ben (Facilities Tech)</option>
                  <option value="Jean Dupont (HVAC Tech)">Jean Dupont (HVAC Tech)</option>
                  <option value="Sarah Connor (Power Specialist)">Sarah Connor (Power Specialist)</option>
                  <option value="Lucas Martin (Plumber)">Lucas Martin (Plumber)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button 
                  type="button"
                  onClick={() => setIsNewWoModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl transition-all cursor-pointer"
                >
                  Create Work Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
