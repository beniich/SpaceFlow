import React, { useState } from 'react';
import { 
  Milestone, Flag, Shield, Code, Target, Map, Globe,
  CheckCircle2, ArrowRight, Zap, Play, Layers, Sparkles,
  AlertTriangle, Check, BookOpen, Clock, Activity, HelpCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Roadmap() {
  const [activeHorizon, setActiveHorizon] = useState(1);
  const [completedItems, setCompletedItems] = useState({
    // Horizon 1 Items
    'rls-tenant': true,
    'canonical-asset': true,
    'wo-pipeline': true,
    'mobile-terrain': false,
    'contract-model': false,
    'sensor-acq': false,
    'pdf-invoice': false,
    'esg-intensity': false,
    'pdf-report': false,
    'erp-connector': false,
    'ifc-parser': false,

    // Horizon 2 Items
    'sw-cache': false,
    'dexie-idb': false,
    'offline-flow': false,
    'bim-annotation': false,
    'bim-view-sync': false,
    'openapi-zod': false,
    'api-rate-limit': false,

    // Horizon 3 Items
    'fm-assistant': false,
    'rag-pgvector': false,
    'iot-mqtt': false,
    'mktplace-sandbox': false,
    'twin-3d-nav': false,

    // Horizon 4 Items
    'nocode-triggers': false,
    'sectoral-retail': false,
    'sectoral-health': false,
    'soc2-iso': false,
  });

  // Toggle item completion and update simulation metrics
  const toggleItem = (id, itemName) => {
    setCompletedItems((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      const actionText = updated[id] ? "validé" : "marqué comme en attente";
      toast.success(`Jalon "${itemName}" ${actionText}`);
      return updated;
    });
  };

  // Strategic Metrics
  const commonCommitments = [
    { name: "Multi-tenancy strict", desc: "Isolation RLS + Prisma extensions", kpi: "Audit sécurité trimestriel", active: true },
    { name: "API-first", desc: "Backend exposé, frontend comme consommateur", kpi: "100% des features via API", active: true },
    { name: "EU-data residency", desc: "Hébergement Frankfurt/Amsterdam, pas de transfert", kpi: "Certif SOC2 / ISO 27001 under 18m", active: true },
  ];

  // Horizons details
  const horizons = [
    {
      id: 1,
      title: "Horizon 1 — Fondations",
      timeline: "0-12 mois",
      color: "border-emerald-500 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20",
      accentColor: "#10b981",
      objective: "Produit CAFM opérationnel avec un différenciateur net, 3 à 5 premiers clients payants.",
      themes: [
        {
          title: "Thème 1.1 — Cœur Métier CAFM (M1-M6)",
          items: [
            { id: 'rls-tenant', label: "Modèle Tenant strict avec RLS Postgres", desc: "Prisma extensions & isolation par tenant" },
            { id: 'canonical-asset', label: "Schéma asset canonique (COBie Lite, IFC minimal)", desc: "Hiérarchique multi-niveaux bâtiment/local" },
            { id: 'wo-pipeline', label: "Work Orders & Plans 2D", desc: "Filtrage statut, priorité, assignee & calques annotables" },
            { id: 'mobile-terrain', label: "Mobile-first & Mode Terrain", desc: "Interface signature, photo, offline terrain" },
            { id: 'contract-model', label: "Contrats de Maintenance & Garanties", desc: "Liaisons contrats ↔ assets ↔ WO" },
          ]
        },
        {
          title: "Thème 1.2 — Différenciateur ESG (M4-M10)",
          items: [
            { id: 'sensor-acq', label: "Acquisition de Données Environnementales", desc: "Compteurs (eau, électricité) rattachés" },
            { id: 'pdf-invoice', label: "Parser PDF Factures Énergétiques", desc: "Extraction automatique en Scope 1/2/3" },
            { id: 'esg-intensity', label: "Energy Intensity (kWh/m²/an)", desc: "Premier Dashboard ESG & intensité par portefeuille" },
            { id: 'pdf-report', label: "Rapport Audit-Ready (SHA-256)", desc: "Empreinte, intensité, signé cryptographiquement" },
          ]
        },
        {
          title: "Thème 1.3 — Intégrations Critiques (M6-M12)",
          items: [
            { id: 'erp-connector', label: "Connecteurs ERP (Odoo, SAP)", desc: "BullMQ queues, retry exponentiel et circuit breaker" },
            { id: 'ifc-parser', label: "IFC Parser Worker", desc: "Extraction GUID, propriétés et métadonnées" },
          ]
        }
      ],
      deliverables: [
        { name: "Plateforme multi-tenant", target: "3-5 clients pilotes", metric: "En cours" },
        { name: "Dashboard ESG auditable", target: "1 export validé cabinet", metric: "Planifié" },
        { name: "Connecteurs ERP essentiels", target: "Odoo + SAP fonctionnels", metric: "Planifié" },
        { name: "Import IFC basique", target: "Démo en < 30s", metric: "Prêt" },
        { name: "Flux de trésorerie positif", target: "Avant le mois 12", metric: "Modélisé" },
      ]
    },
    {
      id: 2,
      title: "Horizon 2 — Différenciation",
      timeline: "12-24 mois",
      color: "border-cyan-500 text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20",
      accentColor: "#00dbe7",
      objective: "Faire de beecarbonit la référence absolue terrain + BIM + ESG.",
      themes: [
        {
          title: "Thème 2.1 — Mode Offline Robuste (M13-M18)",
          items: [
            { id: 'sw-cache', label: "Service Worker (Workbox CacheFirst)", desc: "Mise en cache des ressources statiques et assets" },
            { id: 'dexie-idb', label: "IndexedDB (Dexie.js) Local Database", desc: "Outbox actions en attente, drafts, cached_assets" },
            { id: 'offline-flow', label: "Synchronisation auto au retour réseau", desc: "Gestion des conflits (last-write-wins / merge)" },
          ]
        },
        {
          title: "Thème 2.2 — BIM Ops (M15-M22)",
          items: [
            { id: 'bim-annotation', label: "Annotations persistantes liées à l'IFC", desc: "Historique 4D et évolution temporelle de l'asset" },
            { id: 'bim-view-sync', label: "Lien plans 2D ↔ 3D Interactif", desc: "Placement géométrique et spatial des interventions" },
          ]
        },
        {
          title: "Thème 2.3 — API Publique (M18-M22)",
          items: [
            { id: 'openapi-zod', label: "OpenAPI 3.1 & Génération schémas Zod", desc: "Documentation Scalar interactive et webhooks" },
            { id: 'api-rate-limit', label: "Tiers d'accès et Rate Limiting", desc: "Authentification OAuth2 client_credentials" },
          ]
        }
      ],
      deliverables: [
        { name: "PWA offline-first", target: "80% flux terrain offline", metric: "En préparation" },
        { name: "BIM Ops avec annotations", target: "50+ annotations persistantes", metric: "Planifié" },
        { name: "API publique v1", target: "100k appels/jour, <300ms", metric: "Conçu" },
        { name: "ESG Dashboard enrichi", target: "Scope 1/2/3 complet", metric: "Planifié" },
      ]
    },
    {
      id: 3,
      title: "Horizon 3 — Leadership",
      timeline: "24-36 mois",
      color: "border-purple-500 text-purple-400 bg-purple-500/10 hover:bg-purple-500/20",
      accentColor: "#a855f7",
      objective: "Passer du produit aux données à l'intelligence opérative intégrée.",
      themes: [
        {
          title: "Thème 3.1 — IA Générative Opérationnelle (M25-M32)",
          items: [
            { id: 'fm-assistant', label: "Assistant Facility Manager (LLM)", desc: "Résumé de WO, RAG sur doc technique, suggestions" },
            { id: 'rag-pgvector', label: "RAG pgvector + Embeddings", desc: "Pipeline vectoriel sur documentation technique historique" },
            { id: 'iot-mqtt', label: "Acquisition de Données IoT (MQTT, BACnet)", desc: "Ingestion temps réel, corrélation capteur ↔ asset" },
          ]
        },
        {
          title: "Thème 3.2 — Marketplace (M28-M36)",
          items: [
            { id: 'mktplace-sandbox', label: "Sandbox d'applications sécurisée", desc: "Listing public, connecteurs tiers, commissions" },
          ]
        },
        {
          title: "Thème 3.3 — Jumeau Numérique Opérationnel (M30-M36)",
          items: [
            { id: 'twin-3d-nav', label: "Navigation 3D temps réel", desc: "Données capteurs en surcouche, scénarios what-if ESG" },
          ]
        }
      ],
      deliverables: [
        { name: "Assistant IA en production", target: "60% FMs l'utilisent quotidiennement", metric: "Concept" },
        { name: "Marketplace v1", target: "20+ extensions tierces", metric: "Planifié" },
        { name: "Jumeau numérique", target: "3+ sites en live", metric: "Planifié" },
      ]
    },
    {
      id: 4,
      title: "Horizon 4 — Plateforme",
      timeline: "36+ mois",
      color: "border-amber-500 text-amber-400 bg-amber-500/10 hover:bg-amber-500/20",
      accentColor: "#f59e0b",
      objective: "Devenir l'infrastructure de référence sur laquelle les FMs construisent leurs applications.",
      themes: [
        {
          title: "Thème 4.1 — Workflow Engine No-Code (M37-M48)",
          items: [
            { id: 'nocode-triggers', label: "Moteur de déclencheurs no-code visuel", desc: "Règles, conditions logiques et actions d'API" },
          ]
        },
        {
          title: "Thème 4.2 — Référentiels Sectoriels (M40-M54)",
          items: [
            { id: 'sectoral-retail', label: "Modèles Retail & Logistique", desc: "Turnover magasin, audits qualité, baux commerciaux" },
            { id: 'sectoral-health', label: "Packs Santé & Éducation", desc: "Habilitations, conformité ARS, sécurité incendie ERP" },
          ]
        },
        {
          title: "Thème 4.3 — Multi-Mondial & Conformité Globale (M48+)",
          items: [
            { id: 'soc2-iso', label: "Certifications SOC 2 Type II & ISO 27001", desc: "Multi-régions, multi-langues et baux multi-devises" },
          ]
        }
      ],
      deliverables: [
        { name: "Workflow engine no-code", target: "100+ workflows custom en prod", metric: "Recherche" },
        { name: "5+ Référentiels sectoriels", target: "30%+ clients sur vertical packagée", metric: "Planifié" },
        { name: "Conformité globale", target: "SOC 2 + ISO 27001 + multi-régions", metric: "Planifié" },
      ]
    }
  ];

  // Calculate dynamic statistics based on user checkbox clicks
  const calculateStatsForHorizon = (horizonId) => {
    const horizon = horizons.find((h) => h.id === horizonId);
    if (!horizon) return { pct: 0, completed: 0, total: 0 };
    
    let total = 0;
    let completed = 0;
    horizon.themes.forEach((t) => {
      t.items.forEach((item) => {
        total++;
        if (completedItems[item.id]) completed++;
      });
    });

    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { pct, completed, total };
  };

  const currentHorizonStats = calculateStatsForHorizon(activeHorizon);

  // Table of targeted global metrics
  const strategicMetrics = [
    { name: "ARR Cible (Revenu Récurrent)", h1: "100k €", h2: "1M €", h3: "3-5M €", h4: "10-20M €", icon: Milestone },
    { name: "Clients Actifs", h1: "3-5 Pilotes", h2: "30-50 Clients", h3: "200-400 Clients", h4: "1000+ Clients", icon: Target },
    { name: "Score NPS", h1: "> 30", h2: "> 40", h3: "> 50", h4: "> 55", icon: Activity },
    { name: "Taux de Churn Annuel", h1: "< 15%", h2: "< 8%", h3: "< 6%", h4: "< 5%", icon: AlertTriangle },
    { name: "Time-to-Value", h1: "30 jours", h2: "14 jours", h3: "7 jours", h4: "3 jours", icon: Clock },
    { name: "Part ARPU provenant de l'ESG", h1: "10%", h2: "25%", h3: "40%", h4: "35% (Plateforme)", icon: Zap },
  ];

  // Operational trade-offs
  const tradeOffs = [
    { question: "Lancement SaaS vs On-Premises", response: "SaaS-only par défaut jusqu'à une demande Enterprise structurée." },
    { question: "Internationalisation (i18n)", response: "Support bilingue FR/EN dès l'Horizon 1 pour les clients pilotes multinationaux." },
    { question: "Application Mobile Native vs PWA", response: "Focus exclusif sur la PWA robuste (Horizon 2). Natif uniquement si besoin spécifique terrain." },
    { question: "Modèle de Vente", response: "Vente directe (Horizons 1-2), puis développement indirect via partenaires et intégrateurs (Horizon 3+)." },
    { question: "Résidence des Données", response: "Restreint à l'Union Européenne (Frankfurt/Amsterdam) pour les Horizons 1 à 3." },
  ];

  // Alert/Watch Points by Horizon
  const watchPoints = [
    { 
      horizon: 1, 
      level: "CRITICAL", 
      title: "Multi-tenant & Isolation", 
      desc: "L'université de l'erreur en construction de plateforme multi-tenant. Prévoir 30% du temps sur la dette technique préventive pour éviter les fuites de données." 
    },
    { 
      horizon: 2, 
      level: "WARNING", 
      title: "Choix de la Stack Offline", 
      desc: "Workbox vs Dexie.js vs PWA strict. Valider sur des POC terrains complexes en sous-sol (0 connectivité) pour garantir une synchronisation sans heurt." 
    },
    { 
      horizon: 3, 
      level: "WARNING", 
      title: "Risques de l'IA Générative", 
      desc: "Un diagnostic erroné sur la sécurité d'un équipement technique peut engager la responsabilité civile de la plateforme. Humain dans la boucle obligatoire." 
    },
    { 
      horizon: 4, 
      level: "INFO", 
      title: "Moteur de Workflow", 
      desc: "La complexité d'un moteur de workflow configurable no-code à grande échelle est vaste. Nécessite une architecture dédiée isolée dans la sandbox." 
    }
  ];

  const activeHorizonData = horizons.find(h => h.id === activeHorizon);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 bg-zinc-950 text-zinc-100 min-h-screen font-sans">
      
      {/* Header Panel */}
      <div className="pb-6 border-b border-zinc-800/80 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-display uppercase tracking-widest text-zinc-50 flex items-center gap-3">
            <Map className="w-8 h-8 text-brand-orange" />
            Roadmap Stratégique &amp; Pipeline
          </h1>
          <p className="text-zinc-400 text-xs mt-1 max-w-2xl font-mono">
            Planification opérationnelle de la plateforme <span className="text-brand-orange font-bold">beecarbonit</span>. 
            Suivez, simulez et pilotez l'avancement des fonctionnalités clés de notre architecture de gestion technique et ESG.
          </p>
        </div>
        <div className="flex bg-zinc-900 border border-zinc-800 p-1.5 rounded-sm shrink-0">
          <span className="text-[10px] uppercase font-mono tracking-wider px-3 py-1 bg-brand-orange/10 text-brand-orange border border-brand-orange/20 rounded-sm">
            Status: Audit Ready V1
          </span>
        </div>
      </div>

      {/* Strategic Commitments Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {commonCommitments.map((com, idx) => (
          <div key={idx} className="bg-zinc-900/60 border border-zinc-800/60 p-4 rounded-sm flex items-start gap-3">
            <div className="p-2 bg-brand-cyan/10 text-brand-cyan rounded-sm shrink-0 mt-0.5">
              <Shield className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <span className="font-mono text-[9px] uppercase tracking-wider text-zinc-400">Transverse / {com.name}</span>
              <p className="text-xs font-bold text-zinc-100">{com.desc}</p>
              <p className="text-[11px] text-zinc-500 font-mono">KPI: {com.kpi}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Horizon Selectors Tabs */}
      <div className="space-y-4">
        <div className="flex border-b border-zinc-800/80 gap-3 overflow-x-auto pb-px">
          {horizons.map((h) => {
            const isActive = activeHorizon === h.id;
            const stats = calculateStatsForHorizon(h.id);
            return (
              <button
                key={h.id}
                onClick={() => setActiveHorizon(h.id)}
                className={`pb-3 px-1 font-mono text-xs uppercase tracking-wider flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
                  isActive
                    ? 'border-brand-orange text-brand-orange font-bold'
                    : 'border-transparent text-zinc-400 hover:text-zinc-100 hover:border-zinc-800'
                }`}
              >
                <span>{h.title}</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-zinc-800 text-zinc-400 rounded-sm font-semibold">
                  {stats.pct}%
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Horizon Dashboard Card */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-sm relative overflow-hidden">
          {/* Subtle Accent Glow */}
          <div 
            className="absolute top-0 right-0 w-64 h-64 opacity-5 blur-[120px] rounded-full pointer-events-none"
            style={{ backgroundColor: activeHorizonData.accentColor }}
          />

          <div className="flex flex-col lg:flex-row justify-between gap-6 relative z-10">
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-brand-orange font-bold tracking-widest uppercase">
                  Horizon {activeHorizonData.id} • {activeHorizonData.timeline}
                </span>
              </div>
              <h2 className="text-xl font-bold font-display uppercase tracking-wider text-zinc-50">
                {activeHorizonData.title}
              </h2>
              <p className="text-sm text-zinc-300 max-w-3xl">
                {activeHorizonData.objective}
              </p>
            </div>

            {/* Simulated Readiness Gauge */}
            <div className="lg:w-64 bg-zinc-950 border border-zinc-800/60 p-4 rounded-sm flex flex-col justify-between space-y-3 text-center shrink-0">
              <span className="font-mono text-[9px] uppercase tracking-wider text-zinc-400">Simulateur de validation</span>
              <div className="space-y-1">
                <div className="text-3xl font-mono font-bold" style={{ color: activeHorizonData.accentColor }}>
                  {currentHorizonStats.pct}%
                </div>
                <div className="w-full bg-zinc-900 h-1 rounded-full overflow-hidden">
                  <div 
                    className="h-full transition-all duration-500"
                    style={{ 
                      width: `${currentHorizonStats.pct}%`, 
                      backgroundColor: activeHorizonData.accentColor 
                    }}
                  />
                </div>
              </div>
              <p className="text-[10px] text-zinc-500 font-mono">
                {currentHorizonStats.completed} / {currentHorizonStats.total} jalons validés
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Themes, Checklist, and Deliverables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Checklist and Themes column */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="font-mono text-xs font-bold text-brand-orange uppercase tracking-widest flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Suivi des Jalons Techniques (Cliquer pour valider)
          </h3>

          <div className="space-y-6">
            {activeHorizonData.themes.map((theme, tIdx) => (
              <div key={tIdx} className="bg-zinc-900 border border-zinc-800 p-5 space-y-4 rounded-sm">
                <h4 className="font-mono text-xs font-bold text-zinc-200 border-b border-zinc-800 pb-2">
                  {theme.title}
                </h4>
                
                <div className="space-y-3">
                  {theme.items.map((item) => {
                    const isChecked = !!completedItems[item.id];
                    return (
                      <div 
                        key={item.id}
                        onClick={() => toggleItem(item.id, item.label)}
                        className={`flex items-start gap-3 p-3 bg-zinc-950 border transition-all duration-200 cursor-pointer rounded-sm ${
                          isChecked 
                            ? 'border-brand-orange/30 bg-brand-orange/[0.01]' 
                            : 'border-zinc-850 hover:border-zinc-700'
                        }`}
                      >
                        <div className={`mt-0.5 w-4.5 h-4.5 flex items-center justify-center border rounded-sm transition ${
                          isChecked 
                            ? 'bg-brand-orange text-black border-brand-orange shadow-[0_0_8px_rgba(243,128,32,0.4)]' 
                            : 'border-zinc-700 hover:border-zinc-500'
                        }`}>
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <div className="space-y-0.5 select-none">
                          <p className={`text-xs font-mono font-bold transition ${isChecked ? 'text-zinc-100' : 'text-zinc-300'}`}>
                            {item.label}
                          </p>
                          <p className="text-[10px] text-zinc-500 font-sans">{item.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Deliverables and Metrics Column */}
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 p-5 space-y-4 rounded-sm">
            <h3 className="font-mono text-xs font-bold text-brand-orange uppercase tracking-widest flex items-center gap-2">
              <Milestone className="w-4 h-4" />
              Livrables Cibles Horizon {activeHorizonData.id}
            </h3>
            <p className="text-zinc-500 text-[11px]">
              Objectifs quantitatifs d'audit et KPIs d'ingénierie requis pour boucler l'Horizon {activeHorizonData.id}.
            </p>

            <div className="space-y-3 font-mono text-xs">
              {activeHorizonData.deliverables.map((del, dIdx) => (
                <div key={dIdx} className="p-3 bg-zinc-950 border border-zinc-800 flex flex-col gap-2 rounded-sm">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-zinc-100">{del.name}</span>
                    <span className="text-[9px] px-1.5 py-0.5 bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20 uppercase rounded-sm">
                      {del.metric}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] text-zinc-400">
                    <span>Objectif:</span>
                    <span className="text-brand-orange font-semibold">{del.target}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Watch-Out Alerts */}
          <div className="space-y-3">
            <h3 className="font-mono text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
              Points de Vigilance &amp; Risques
            </h3>
            {watchPoints.filter(w => w.horizon === activeHorizon).map((wp, idx) => (
              <div key={idx} className="bg-zinc-900 border-l-2 border-l-amber-500 border-zinc-800 p-4 space-y-1 rounded-sm">
                <div className="flex items-center gap-1.5 text-amber-400 font-mono text-[10px] font-bold uppercase">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Risque {wp.level}</span>
                </div>
                <h4 className="text-xs font-bold font-mono text-zinc-200">{wp.title}</h4>
                <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">{wp.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Corporate KPIs and Targets Table */}
      <div className="bg-zinc-900 border border-zinc-800 p-6 space-y-4 rounded-sm">
        <div className="border-b border-zinc-800 pb-3">
          <h3 className="font-mono text-xs font-bold text-brand-orange uppercase tracking-widest flex items-center gap-2">
            <Activity className="w-4 h-4 animate-pulse" />
            Tableau de Bord de Croissance Inter-Horizons
          </h3>
          <p className="text-zinc-500 text-[11px] mt-1">
            Indicateurs financiers (ARR), churn, NPS et efficacité opérationnelle cibles définis pour le passage à l'échelle.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 text-[10px] uppercase">
                <th className="py-3 px-4">Métriques de Performance</th>
                <th className="py-3 px-4 text-emerald-400">H1 (Fondations)</th>
                <th className="py-3 px-4 text-brand-cyan">H2 (Différenciation)</th>
                <th className="py-3 px-4 text-purple-400">H3 (Leadership)</th>
                <th className="py-3 px-4 text-amber-400">H4 (Plateforme)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {strategicMetrics.map((met, idx) => {
                const IconComp = met.icon;
                return (
                  <tr key={idx} className="hover:bg-zinc-950/40 transition">
                    <td className="py-3.5 px-4 font-sans font-bold text-zinc-300 flex items-center gap-2">
                      <IconComp className="w-4 h-4 text-zinc-500" />
                      {met.name}
                    </td>
                    <td className="py-3.5 px-4 text-zinc-300 font-bold">{met.h1}</td>
                    <td className="py-3.5 px-4 text-zinc-300 font-bold">{met.h2}</td>
                    <td className="py-3.5 px-4 text-zinc-300 font-bold">{met.h3}</td>
                    <td className="py-3.5 px-4 text-zinc-300 font-bold">{met.h4}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Gestion des Arbitrages Accordion Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Arbitrages Panel */}
        <div className="bg-zinc-900 border border-zinc-800 p-5 space-y-4 rounded-sm">
          <h3 className="font-mono text-xs font-bold text-brand-orange uppercase tracking-widest flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Gestion des Arbitrages Stratégiques
          </h3>
          <p className="text-zinc-500 text-[11px]">
            Décisions d'architecture métier prises pour optimiser le temps de mise sur le marché et l'ARPU.
          </p>

          <div className="space-y-3">
            {tradeOffs.map((trade, idx) => (
              <div key={idx} className="p-3 bg-zinc-950 border border-zinc-850 rounded-sm space-y-1">
                <span className="text-[10px] font-mono text-brand-cyan font-bold">{trade.question}</span>
                <p className="text-xs text-zinc-300 font-sans">{trade.response}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Immédiates Panel */}
        <div className="bg-zinc-900 border border-zinc-800 p-5 space-y-4 rounded-sm flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-mono text-xs font-bold text-brand-orange uppercase tracking-widest flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Prochaines Actions Immédiates (30 jours)
            </h3>
            <p className="text-zinc-500 text-[11px]">
              Tâches immédiates requises pour aligner les équipes de développement et commerciales.
            </p>

            <ul className="space-y-3 text-xs font-mono">
              {[
                "Valider la promesse différenciatrice : atelier produit avec 5 prospects cibles, test du pitch ESG-first.",
                "Identifier 1 ICP précis : nommer 1 vertical d'attaque (foncière tertiaire 50-500 sites).",
                "POC démontrable : 1 site pilote avec dashboard ESG basique, prêt en 6 semaines.",
                "Carte des premiers intégrateurs : lister 5 intégrateurs BIM/FM européens pour pousser en white-label.",
                "Recruter 1 Head of Sales avec réseau solide dans l'immobilier d'entreprise.",
                "Cadrage juridique : DPA modèles, contrat d'API publique, conditions de la future marketplace."
              ].map((item, idx) => (
                <li key={idx} className="flex gap-2.5 items-start">
                  <span className="w-4.5 h-4.5 rounded-full bg-brand-orange/10 text-brand-orange border border-brand-orange/20 flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-zinc-300 font-sans leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-4 border-t border-zinc-800/40 mt-4">
            <button 
              onClick={() => toast.success("Plan opérationnel prêt pour synchronisation Jira/Linear.")}
              className="w-full py-2.5 bg-brand-orange hover:bg-[#e27010] text-black font-mono font-bold uppercase tracking-wider text-xs rounded-sm transition"
            >
              Synchroniser le Plan Opérationnel
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
