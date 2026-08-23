import React, { createContext, useContext, useState, useEffect } from 'react';

export const translations = {
  fr: {
    // Navigation Categories
    cat_roadmap_ops: 'Opérations & Maintenance',
    cat_roadmap_ops_desc: 'Pilotage opérationnel, actifs, espaces, bons de travail & réclamations',
    cat_strategic_pillars: 'Piliers Stratégiques Ops',
    cat_strategic_pillars_desc: 'Piliers d\'innovation technique, ESG, BIM, Jumeau Numérique & IA',
    cat_modules_system: 'Modules & Système',
    cat_modules_system_desc: 'Intégrations SI, analytique, assistant IA, conformité & sécurité',

    // Navigation Items
    nav_dashboard: 'Tableau de bord',
    nav_assets: 'Assets',
    nav_qr_scanner: 'QR Code Scanner',
    nav_spaces: 'Spaces',
    nav_work_orders: 'Work Orders',
    nav_tickets: 'Tickets & Réclamations',
    nav_maintenance: 'Maintenance',
    nav_team_ops: 'Team Operations',

    nav_fieldtech: 'FieldTech Mobile & OT',
    nav_energy: 'Energy & ESG Copilot',
    nav_bim: 'BIM & 3D Viewer',
    nav_digital_twin: 'Digital Twin',
    nav_predictive_ai: 'Predictive AI & Health',
    nav_tenants: 'Occupants & Tenant Care',

    nav_cmms: 'CMMS / BEECARBONAT',
    nav_erp: 'ERP Integration',
    nav_analytics: 'Analytics',
    nav_leases: 'Leases & Contracts',
    nav_exports: 'PDF Exports & Reports',
    nav_notifications: 'Notifications & Alerts',
    nav_ai_assistant: 'Generative AI Assistant',
    nav_workflow_builder: 'Workflow Builder (No-Code)',
    nav_marketplace: 'Marketplace Extensions',
    nav_sectoral_packs: 'Packs Sectoriels',
    nav_plans_billing: 'Plans & Billing',
    nav_security: 'Security & Access',
    nav_settings: 'System Configuration',
    nav_asset_detail: 'Détail Équipement',
    nav_more_modules: 'Autres Modules',

    // Header & Actions
    header_paris_hq: 'Paris HQ - Bâtiment Alpha',
    header_lyon_hub: 'Lyon - Hub Béta',
    header_berlin_campus: 'Berlin - Tech Campus',
    system_sync_online: 'Système Synchro: En ligne',
    system_sync_offline: 'Mode Hors Ligne',
    light_mode: 'Mode Clair',
    dark_mode: 'Mode Sombre',
    search_placeholder: 'Rechercher des rubriques, espaces ou équipements...',
    notifications: 'Notifications système',
    logout: 'Déconnexion',
    collapse_sidebar: 'Réduire la barre latérale',
    expand_sidebar: 'Agrandir la barre latérale',
    
    // Common Actions & Labels
    add: 'Ajouter',
    edit: 'Modifier',
    delete: 'Supprimer',
    save: 'Enregistrer',
    cancel: 'Annuler',
    filter: 'Filtrer',
    export: 'Exporter',
    status: 'Statut',
    priority: 'Priorité',
    building: 'Bâtiment',
    location: 'Emplacement',
    technician: 'Technicien',
    date: 'Date',
    category: 'Catégorie',
    actions: 'Actions',
    close: 'Fermer',
    confirm: 'Confirmer',
    refresh: 'Actualiser',
    search: 'Rechercher',
    loading: 'Chargement...',
    details: 'Détails',
    history: 'Historique',
    download: 'Télécharger',
    print: 'Imprimer',
    reset: 'Réinitialiser',
    apply: 'Appliquer',
    period: 'Période',
    
    // Dashboard & Ticket Matrix
    dash_facility_status: 'Tableau de bord de Statut & Réclamations',
    dash_subtitle: 'Suivi des Réclamations par Statut/Sévérité & Diagnostic Télémétrie',
    dash_grid_tickets: 'Grille Réclamations',
    dash_telemetry: 'Télémétrie Facility',
    dash_rubrics: 'Rubriques CAFM',
    dash_rubrics_subtitle: 'Accès direct aux catégories opérationnelles du système CAFM BEECARBONAT',
    dash_system_health: 'Santé du Système',
    dash_total_tickets: 'Total Réclamations',
    dash_open_tickets: 'Tickets Ouverts',
    dash_critical_tickets: 'Critiques',
    dash_resolved_tickets: 'Résolues',
    dash_recent_activity: 'Activité Récente',
    
    ticket_board_title: 'Tableau de Bord des Réclamations & Tickets Ouverts',
    ticket_board_subtitle: 'Synthèse d\'avancement par Statut et Sévérité pour Facility Managers',
    matrix_synthesis: 'Matrice Synthèse',
    grid_list: 'Liste Détaillée',
    emergencies_critical: 'Urgences & Critiques',
    sla_breach_risk: 'Risque Dépassement SLA',
    sla_resolution_rate: 'Taux de Résolution SLA',
    matrix_title: 'Matrice Synthétique des Réclamations (Statut x Sévérité)',
    severity_status: 'Sévérité \\ Statut',
    click_cell_filter: 'Cliquez sur une cellule pour filtrer la vue détaillée',
    total: 'Total',

    // Telemetry & Overview
    telemetry_title: 'KPIs & Diagnostic Télémétrie',
    telemetry_subtitle: 'Surveillance en temps réel des charges, de la santé globale du parc et de l\'état des sous-systèmes',
    energy_load_diag: 'Charge Énergétique & Diagnostic (24h)',
    kw_consumed: 'kW Consommés',
    global_health: 'Santé Globale (%)',
    subsystems_status: 'Statut des Sous-Systèmes',
    recent_alerts: 'Alertes Récentes',
    selected_building: 'Bâtiment sélectionné :',
    health_optimal: 'Optimale',
    health_warning: 'Attention',
    health_critical: 'Critique',

    // Rubric items descriptions
    rub_roadmap_desc: 'Feuille de route stratégique & jalons produit H1-H4',
    rub_assets_desc: 'Gestion du parc d\'équipements & données COBie',
    rub_scanner_desc: 'Scan instantané des tags QR équipements',
    rub_spaces_desc: 'Arborescence spatiale site, bâtiment, étage & local',
    rub_work_orders_desc: 'Bons de travail, ordres de service & clôtures',
    rub_tickets_desc: 'Matrice de synthèse des réclamations par statut/sévérité',
    rub_maintenance_desc: 'Maintenance préventive, récurrente & prédictive',
    rub_team_desc: 'Équipes techniques, techniciens & affectations',
    rub_fieldtech_desc: 'Application terrain mobile, signatures & photos',
    rub_energy_desc: 'Analyse énergétique, bilan carbone & intensité kWh/m²',
    rub_bim_desc: 'Visionneuse 3D IFC & calques techniques bâtiment',
    rub_digital_twin_desc: 'Jumeau numérique interactif & capteurs IoT',
    rub_predictive_ai_desc: 'Santé d\'équipements, prédiction de pannes & IA',
    rub_tenants_desc: 'Portail occupants, satisfaction & baux',
    rub_cmms_desc: 'Plateforme GMAO avancée & décarbonation',
    rub_erp_desc: 'Connecteurs SAP, Odoo & pipelines de données',
    rub_analytics_desc: 'KPIs, rapports de performance & analyse MTTR',
    rub_leases_desc: 'Gestion des baux, contrats de maintenance & garanties',
    rub_exports_desc: 'Génération de rapports d\'audit signés',
    rub_notifications_desc: 'Alertes en temps réel & seuils télémétriques',
    rub_ai_assistant_desc: 'Assistant conversationnel spécialisé Facility Management',
    rub_workflow_desc: 'Automatisations & règles métiers configurables',
    rub_marketplace_desc: 'Extensions & connecteurs tiers',
    rub_sectoral_desc: 'Packs adaptés Santé, Retail, Tertiaire & Logistique',
    rub_plans_desc: 'Abonnements, abonnements multi-sites & facturation',
    rub_security_desc: 'Gestion des rôles RLS, sécurité & traçabilité',
    rub_settings_desc: 'Paramètres système, utilisateurs & préférences',

    // Status tags
    status_active: 'Actif',
    status_pillar_1: 'Pilier 1',
    status_pillar_2: 'Pilier 2',
    status_pillar_3: 'Pilier 3',
    status_pillar_4: 'Pilier 4',
    status_pillar_5: 'Pilier 5',
    status_module: 'Module',
    status_copilot: 'IA Copilot',
    status_system: 'Système',
    status_security: 'Sécurité',
    status_admin: 'Admin',

    // Ticket Statuses
    status_submitted: 'Soumis',
    status_triaged: 'Validé FM',
    status_assigned: 'Assigné',
    status_in_progress: 'En cours',
    status_tech_closed: 'Clôture Tech',
    status_qap_passed: 'Validé QA',
    status_closed: 'Clôturé',

    // Severities
    sev_emergency: 'Danger Immédiat',
    sev_critical: 'Critique',
    sev_high: 'Haute',
    sev_medium: 'Moyenne',
    sev_low: 'Basse',

    // Assets Page
    asset_model_title: 'Modèle de Données Actifs',
    asset_canonical_structure: 'Structure Canonique (H1)',
    asset_cobie_compliance: 'Conformité stricte COBie Lite • Multi-niveaux (Site → Équipement)',
    asset_sync_bim: 'Sync. IFC / BIM',
    asset_scan_qr: 'Scanner QR',
    asset_close_scanner: 'Fermer Scanner',
    asset_add_new: 'Ajouter Actif',
    asset_hierarchical_ref: 'Référentiel Hiérarchique (Spatial & Technique)',
    asset_nomenclature: 'Nomenclature & Structure',
    asset_code_type: 'Code / Type',
    asset_standard: 'Standard (COBie / IFC)',
    asset_operational: 'OPÉRATIONNEL',
    asset_maintenance: 'MAINTENANCE',
    asset_defective: 'DÉFECTUEUX',
    asset_bim_data: 'Données BIM & COBie',
    asset_ifc_certified: 'Certifié IFC',
    asset_create_wo: 'Créer Work Order',
    asset_print_tag: 'Imprimer Tag QR',
    asset_edit: 'Modifier Actif',
    asset_select_prompt: 'Sélectionnez un équipement pour afficher les détails',

    // Work Orders Page
    wo_title: 'Gestion des Bons de Travail',
    wo_subtitle: 'Suivi opérationnel des interventions et maintenances',
    wo_new: 'Nouveau Bon de Travail',
    wo_search_ph: 'Rechercher par titre, code ou technicien...',
    wo_status_all: 'Tous les statuts',
    wo_status_pending: 'En attente',
    wo_status_in_progress: 'En cours',
    wo_status_completed: 'Terminé',
    wo_status_cancelled: 'Annulé',

    // Spaces Page
    spaces_title: 'Gestion des Bâtiments & Espaces',
    spaces_subtitle: 'Arborescence spatiale, occupation et cartographie',
    spaces_add_building: 'Ajouter Bâtiment',
    spaces_add_floor: 'Ajouter Étage',
    spaces_add_room: 'Ajouter Local',

    // Energy Page
    energy_title: 'Suivi Énergétique & Performance ESG',
    energy_subtitle: 'Analyse des consommations, empreinte carbone et efficacité',
    energy_kwh: 'Consommation (kWh)',
    energy_carbon: 'Émissions CO2 (tonnes)',
    energy_target: 'Objectif Réduction ESG',

    // Digital Twin / BIM Page
    twin_title: 'Jumeau Numérique & Modélisation BIM',
    twin_subtitle: 'Visualisation 3D, calques techniques et télémétrie temps réel',
    twin_layers: 'Calques Techniques',
    twin_hvac: 'CVC / Climatisation',
    twin_electrical: 'Électricité & Éclairage',
    twin_plumbing: 'Plomberie & Fluides',
    twin_fire: 'Sécurité Incendie',

    // Analytics Page
    analytics_title: 'Analytique & Indicateurs de Performance (KPI)',
    analytics_subtitle: 'Rapports prédictifs, coûts d\'exploitation et MTTR',
    analytics_mttr: 'Temps Moyen de Réparation (MTTR)',
    analytics_costs: 'Coûts de Maintenance',
    analytics_compliance: 'Taux de Conformité SLA',

    // Settings Page
    settings_title: 'Paramètres du Système CAFM',
    settings_subtitle: 'Configuration globale, intégrations et préférences',
    settings_general: 'Général',
    settings_notifications: 'Notifications',
    settings_security: 'Sécurité & Accès',
    settings_theme: 'Apparence & Thème',
    settings_language: 'Langue de l\'application',

    // Team Page
    team_title: 'Gestion des Équipes & Techniciens',
    team_subtitle: 'Gestion des rôles, affectations et disponibilités',
    team_add_member: 'Ajouter Membre',

    // AI Assistant
    ai_assistant_title: 'Assistant AI CAFM',
    ai_assistant_ph: 'Posez une question sur les équipements, pannes ou consommations...',
    ai_assistant_send: 'Envoyer',

    // Priorities
    priority_critical: 'Critique',
    priority_high: 'Haute',
    priority_medium: 'Moyenne',
    priority_low: 'Basse',

    // Languages
    lang_fr: 'Français',
    lang_en: 'English',
    lang_es: 'Español',
  },
  en: {
    // Navigation Categories
    cat_roadmap_ops: 'Operations & Maintenance',
    cat_roadmap_ops_desc: 'Operational management, assets, spaces, work orders & claims',
    cat_strategic_pillars: 'Strategic Ops Pillars',
    cat_strategic_pillars_desc: 'Technical innovation pillars, ESG, BIM, Digital Twin & AI',
    cat_modules_system: 'Modules & System',
    cat_modules_system_desc: 'IS integrations, analytics, AI assistant, compliance & security',

    // Navigation Items
    nav_dashboard: 'Dashboard',
    nav_assets: 'Assets',
    nav_qr_scanner: 'QR Code Scanner',
    nav_spaces: 'Spaces',
    nav_work_orders: 'Work Orders',
    nav_tickets: 'Tickets & Requests',
    nav_maintenance: 'Maintenance',
    nav_team_ops: 'Team Operations',

    nav_fieldtech: 'FieldTech Mobile & OT',
    nav_energy: 'Energy & ESG Copilot',
    nav_bim: 'BIM & 3D Viewer',
    nav_digital_twin: 'Digital Twin',
    nav_predictive_ai: 'Predictive AI & Health',
    nav_tenants: 'Occupants & Tenant Care',

    nav_cmms: 'CMMS / BEECARBONAT',
    nav_erp: 'ERP Integration',
    nav_analytics: 'Analytics',
    nav_leases: 'Leases & Contracts',
    nav_exports: 'PDF Exports & Reports',
    nav_notifications: 'Notifications & Alerts',
    nav_ai_assistant: 'Generative AI Assistant',
    nav_workflow_builder: 'Workflow Builder (No-Code)',
    nav_marketplace: 'Marketplace Extensions',
    nav_sectoral_packs: 'Sectoral Packs',
    nav_plans_billing: 'Plans & Billing',
    nav_security: 'Security & Access',
    nav_settings: 'System Configuration',
    nav_asset_detail: 'Asset Detail',
    nav_more_modules: 'More Modules',

    // Header & Actions
    header_paris_hq: 'Paris HQ - Alpha Building',
    header_lyon_hub: 'Lyon - Beta Hub',
    header_berlin_campus: 'Berlin - Tech Campus',
    system_sync_online: 'System Sync: Online',
    system_sync_offline: 'Offline Mode',
    light_mode: 'Light Mode',
    dark_mode: 'Dark Mode',
    search_placeholder: 'Search sections, spaces or equipment...',
    notifications: 'System notifications',
    logout: 'Logout',
    collapse_sidebar: 'Collapse sidebar',
    expand_sidebar: 'Expand sidebar',

    // Common Actions & Labels
    add: 'Add',
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save',
    cancel: 'Cancel',
    filter: 'Filter',
    export: 'Export',
    status: 'Status',
    priority: 'Priority',
    building: 'Building',
    location: 'Location',
    technician: 'Technician',
    date: 'Date',
    category: 'Category',
    actions: 'Actions',
    close: 'Close',
    confirm: 'Confirm',
    refresh: 'Refresh',
    search: 'Search',
    loading: 'Loading...',
    details: 'Details',
    history: 'History',
    download: 'Download',
    print: 'Print',
    reset: 'Reset',
    apply: 'Apply',
    period: 'Period',

    // Dashboard & Ticket Matrix
    dash_facility_status: 'Facility Status & Requests Dashboard',
    dash_subtitle: 'Ticket Tracking by Status/Severity & Telemetry Diagnostics',
    dash_grid_tickets: 'Tickets Grid',
    dash_telemetry: 'Facility Telemetry',
    dash_rubrics: 'CAFM Rubrics',
    dash_rubrics_subtitle: 'Direct access to the operational modules of the BEECARBONAT CAFM system',
    dash_system_health: 'System Health',
    dash_total_tickets: 'Total Requests',
    dash_open_tickets: 'Open Tickets',
    dash_critical_tickets: 'Critical',
    dash_resolved_tickets: 'Resolved',
    dash_recent_activity: 'Recent Activity',

    ticket_board_title: 'Service Requests & Open Tickets Dashboard',
    ticket_board_subtitle: 'Progress Overview by Status and Severity for Facility Managers',
    matrix_synthesis: 'Matrix Overview',
    grid_list: 'Detailed List',
    emergencies_critical: 'Emergencies & Critical',
    sla_breach_risk: 'SLA Breach Risk',
    sla_resolution_rate: 'SLA Resolution Rate',
    matrix_title: 'Synthetic Ticket Matrix (Status x Severity)',
    severity_status: 'Severity \\ Status',
    click_cell_filter: 'Click a cell to filter detailed view',
    total: 'Total',

    // Telemetry & Overview
    telemetry_title: 'KPIs & Telemetry Diagnostics',
    telemetry_subtitle: 'Real-time monitoring of loads, overall fleet health and subsystem status',
    energy_load_diag: 'Energy Load & Diagnostics (24h)',
    kw_consumed: 'kW Consumed',
    global_health: 'Overall Health (%)',
    subsystems_status: 'Subsystems Status',
    recent_alerts: 'Recent Alerts',
    selected_building: 'Selected building:',
    health_optimal: 'Optimal',
    health_warning: 'Warning',
    health_critical: 'Critical',

    // Rubric items descriptions
    rub_roadmap_desc: 'Strategic roadmap & product milestones H1-H4',
    rub_assets_desc: 'Equipment fleet management & COBie data',
    rub_scanner_desc: 'Instant scan of equipment QR tags',
    rub_spaces_desc: 'Spatial tree: site, building, floor & room',
    rub_work_orders_desc: 'Work orders, service orders & completions',
    rub_tickets_desc: 'Claims summary matrix by status/severity',
    rub_maintenance_desc: 'Preventive, recurring & predictive maintenance',
    rub_team_desc: 'Technical teams, technicians & assignments',
    rub_fieldtech_desc: 'Mobile field application, signatures & photos',
    rub_energy_desc: 'Energy analysis, carbon footprint & kWh/m² intensity',
    rub_bim_desc: '3D IFC viewer & technical building layers',
    rub_digital_twin_desc: 'Interactive digital twin & IoT sensors',
    rub_predictive_ai_desc: 'Equipment health, failure prediction & AI',
    rub_tenants_desc: 'Occupants portal, satisfaction & leases',
    rub_cmms_desc: 'Advanced CMMS platform & decarbonization',
    rub_erp_desc: 'SAP, Odoo connectors & data pipelines',
    rub_analytics_desc: 'KPIs, performance reports & MTTR analysis',
    rub_leases_desc: 'Lease management, maintenance contracts & warranties',
    rub_exports_desc: 'Generation of signed audit reports',
    rub_notifications_desc: 'Real-time alerts & telemetry thresholds',
    rub_ai_assistant_desc: 'Conversational assistant specialized in Facility Management',
    rub_workflow_desc: 'Automations & configurable business rules',
    rub_marketplace_desc: 'Extensions & third-party connectors',
    rub_sectoral_desc: 'Packs tailored for Healthcare, Retail, Commercial & Logistics',
    rub_plans_desc: 'Subscriptions, multi-site plans & billing',
    rub_security_desc: 'RLS role management, security & audit trail',
    rub_settings_desc: 'System settings, users & preferences',

    // Status tags
    status_active: 'Active',
    status_pillar_1: 'Pillar 1',
    status_pillar_2: 'Pillar 2',
    status_pillar_3: 'Pillar 3',
    status_pillar_4: 'Pillar 4',
    status_pillar_5: 'Pillar 5',
    status_module: 'Module',
    status_copilot: 'AI Copilot',
    status_system: 'System',
    status_security: 'Security',
    status_admin: 'Admin',

    // Ticket Statuses
    status_submitted: 'Submitted',
    status_triaged: 'Triaged FM',
    status_assigned: 'Assigned',
    status_in_progress: 'In Progress',
    status_tech_closed: 'Tech Closed',
    status_qap_passed: 'QA Passed',
    status_closed: 'Closed',

    // Severities
    sev_emergency: 'Immediate Danger',
    sev_critical: 'Critical',
    sev_high: 'High',
    sev_medium: 'Medium',
    sev_low: 'Low',

    // Assets Page
    asset_model_title: 'Asset Data Model',
    asset_canonical_structure: 'Canonical Structure (H1)',
    asset_cobie_compliance: 'Strict COBie Lite Compliance • Multi-level (Site → Equipment)',
    asset_sync_bim: 'Sync IFC / BIM',
    asset_scan_qr: 'Scan QR',
    asset_close_scanner: 'Close Scanner',
    asset_add_new: 'Add Asset',
    asset_hierarchical_ref: 'Hierarchical Registry (Spatial & Technical)',
    asset_nomenclature: 'Nomenclature & Structure',
    asset_code_type: 'Code / Type',
    asset_standard: 'Standard (COBie / IFC)',
    asset_operational: 'OPERATIONAL',
    asset_maintenance: 'MAINTENANCE',
    asset_defective: 'DEFECTIVE',
    asset_bim_data: 'BIM & COBie Data',
    asset_ifc_certified: 'IFC Certified',
    asset_create_wo: 'Create Work Order',
    asset_print_tag: 'Print QR Tag',
    asset_edit: 'Edit Asset',
    asset_select_prompt: 'Select an equipment to view details',

    // Work Orders Page
    wo_title: 'Work Orders Management',
    wo_subtitle: 'Operational tracking of interventions and maintenance',
    wo_new: 'New Work Order',
    wo_search_ph: 'Search by title, code or technician...',
    wo_status_all: 'All statuses',
    wo_status_pending: 'Pending',
    wo_status_in_progress: 'In progress',
    wo_status_completed: 'Completed',
    wo_status_cancelled: 'Cancelled',

    // Spaces Page
    spaces_title: 'Buildings & Spaces Management',
    spaces_subtitle: 'Spatial hierarchy, occupancy and mapping',
    spaces_add_building: 'Add Building',
    spaces_add_floor: 'Add Floor',
    spaces_add_room: 'Add Room',

    // Energy Page
    energy_title: 'Energy Tracking & ESG Performance',
    energy_subtitle: 'Consumption analysis, carbon footprint and efficiency',
    energy_kwh: 'Consumption (kWh)',
    energy_carbon: 'CO2 Emissions (tons)',
    energy_target: 'ESG Reduction Target',

    // Digital Twin / BIM Page
    twin_title: 'Digital Twin & BIM Modeling',
    twin_subtitle: '3D Visualization, technical layers and real-time telemetry',
    twin_layers: 'Technical Layers',
    twin_hvac: 'HVAC / Air Conditioning',
    twin_electrical: 'Electrical & Lighting',
    twin_plumbing: 'Plumbing & Fluids',
    twin_fire: 'Fire Safety',

    // Analytics Page
    analytics_title: 'Analytics & Key Performance Indicators (KPI)',
    analytics_subtitle: 'Predictive reports, operational costs and MTTR',
    analytics_mttr: 'Mean Time to Repair (MTTR)',
    analytics_costs: 'Maintenance Costs',
    analytics_compliance: 'SLA Compliance Rate',

    // Settings Page
    settings_title: 'CAFM System Settings',
    settings_subtitle: 'Global configuration, integrations and preferences',
    settings_general: 'General',
    settings_notifications: 'Notifications',
    settings_security: 'Security & Access',
    settings_theme: 'Appearance & Theme',
    settings_language: 'Application Language',

    // Team Page
    team_title: 'Teams & Technicians Management',
    team_subtitle: 'Roles, assignments and availability management',
    team_add_member: 'Add Member',

    // AI Assistant
    ai_assistant_title: 'CAFM AI Assistant',
    ai_assistant_ph: 'Ask a question about equipment, failures, or energy consumption...',
    ai_assistant_send: 'Send',

    // Priorities
    priority_critical: 'Critical',
    priority_high: 'High',
    priority_medium: 'Medium',
    priority_low: 'Low',

    // Languages
    lang_fr: 'Français',
    lang_en: 'English',
    lang_es: 'Español',
  },
  es: {
    // Navigation Categories
    cat_roadmap_ops: 'Operaciones & Mantenimiento',
    cat_roadmap_ops_desc: 'Gestión operativa, activos, espacios, órdenes de trabajo y reclamaciones',
    cat_strategic_pillars: 'Pilares Estratégicos Ops',
    cat_strategic_pillars_desc: 'Pilares de innovación técnica, ESG, BIM, Gemelo Digital e IA',
    cat_modules_system: 'Módulos & Sistema',
    cat_modules_system_desc: 'Integraciones SI, analítica, asistente IA, cumplimiento y seguridad',

    // Navigation Items
    nav_dashboard: 'Panel de Control',
    nav_assets: 'Assets',
    nav_qr_scanner: 'QR Code Scanner',
    nav_spaces: 'Spaces',
    nav_work_orders: 'Work Orders',
    nav_tickets: 'Tickets & Reclamaciones',
    nav_maintenance: 'Maintenance',
    nav_team_ops: 'Team Operations',

    nav_fieldtech: 'FieldTech Mobile & OT',
    nav_energy: 'Energy & ESG Copilot',
    nav_bim: 'BIM & 3D Viewer',
    nav_digital_twin: 'Digital Twin',
    nav_predictive_ai: 'Predictive AI & Health',
    nav_tenants: 'Occupants & Tenant Care',

    nav_cmms: 'CMMS / BEECARBONAT',
    nav_erp: 'ERP Integration',
    nav_analytics: 'Analytics',
    nav_leases: 'Leases & Contracts',
    nav_exports: 'PDF Exports & Reports',
    nav_notifications: 'Notifications & Alerts',
    nav_ai_assistant: 'Generative AI Assistant',
    nav_workflow_builder: 'Workflow Builder (No-Code)',
    nav_marketplace: 'Marketplace Extensions',
    nav_sectoral_packs: 'Packs Sectoriales',
    nav_plans_billing: 'Plans & Billing',
    nav_security: 'Security & Access',
    nav_settings: 'System Configuration',
    nav_asset_detail: 'Detalle del Activo',
    nav_more_modules: 'Más Módulos',

    // Header & Actions
    header_paris_hq: 'París HQ - Edificio Alfa',
    header_lyon_hub: 'Lyon - Hub Beta',
    header_berlin_campus: 'Berlín - Campus Tech',
    system_sync_online: 'Sincronización: En línea',
    system_sync_offline: 'Modo Sin Conexión',
    light_mode: 'Modo Claro',
    dark_mode: 'Modo Oscuro',
    search_placeholder: 'Buscar secciones, espacios o equipos...',
    notifications: 'Notificaciones del sistema',
    logout: 'Cerrar Sesión',
    collapse_sidebar: 'Contraer barra lateral',
    expand_sidebar: 'Expandir barra lateral',

    // Common Actions & Labels
    add: 'Añadir',
    edit: 'Editar',
    delete: 'Eliminar',
    save: 'Guardar',
    cancel: 'Cancelar',
    filter: 'Filtrar',
    export: 'Exportar',
    status: 'Estado',
    priority: 'Prioridad',
    building: 'Edificio',
    location: 'Ubicación',
    technician: 'Técnico',
    date: 'Fecha',
    category: 'Categoría',
    actions: 'Acciones',
    close: 'Cerrar',
    confirm: 'Confirmar',
    refresh: 'Actualizar',
    search: 'Buscar',
    loading: 'Cargando...',
    details: 'Detalles',
    history: 'Historial',
    download: 'Descargar',
    print: 'Imprimir',
    reset: 'Restablecer',
    apply: 'Aplicar',
    period: 'Período',

    // Dashboard & Ticket Matrix
    dash_facility_status: 'Panel de Estado del Centro y Reclamaciones',
    dash_subtitle: 'Seguimiento de Reclamaciones por Estado/Gravedad y Diagnóstico de Telemetría',
    dash_grid_tickets: 'Cuadrícula de Reclamaciones',
    dash_telemetry: 'Telemetría de Instalaciones',
    dash_rubrics: 'Secciones CAFM',
    dash_rubrics_subtitle: 'Acceso directo a las categorías operativas del sistema CAFM BEECARBONAT',
    dash_system_health: 'Salud del Sistema',
    dash_total_tickets: 'Total Reclamaciones',
    dash_open_tickets: 'Tickets Abiertos',
    dash_critical_tickets: 'Críticas',
    dash_resolved_tickets: 'Resueltas',
    dash_recent_activity: 'Actividad Reciente',

    ticket_board_title: 'Panel de Reclamaciones y Tickets Abiertos',
    ticket_board_subtitle: 'Resumen de Progreso por Estado y Gravedad para Facility Managers',
    matrix_synthesis: 'Matriz Resumen',
    grid_list: 'Lista Detallada',
    emergencies_critical: 'Urgencias y Críticas',
    sla_breach_risk: 'Riesgo Exceso SLA',
    sla_resolution_rate: 'Tasa de Resolución SLA',
    matrix_title: 'Matriz Sintética de Reclamaciones (Estado x Gravedad)',
    severity_status: 'Gravedad \\ Estado',
    click_cell_filter: 'Haga clic en una celda para filtrar la vista detallada',
    total: 'Total',

    // Telemetry & Overview
    telemetry_title: 'KPIs y Diagnóstico de Telemetría',
    telemetry_subtitle: 'Monitoreo en tiempo real de cargas, salud general de la flota y estado del subsistema',
    energy_load_diag: 'Carga Energética y Diagnósticos (24h)',
    kw_consumed: 'kW Consumidos',
    global_health: 'Salud General (%)',
    subsystems_status: 'Estado de los Subsistemas',
    recent_alerts: 'Alertas Recientes',
    selected_building: 'Edificio seleccionado :',
    health_optimal: 'Óptima',
    health_warning: 'Advertencia',
    health_critical: 'Crítica',

    // Rubric items descriptions
    rub_roadmap_desc: 'Hoja de ruta estratégica e hitos del producto H1-H4',
    rub_assets_desc: 'Gestión de la flota de equipos y datos COBie',
    rub_scanner_desc: 'Escaneo instantáneo de etiquetas QR de equipos',
    rub_spaces_desc: 'Árbol espacial: sitio, edificio, planta y sala',
    rub_work_orders_desc: 'Órdenes de trabajo, órdenes de servicio y cierres',
    rub_tickets_desc: 'Matriz resumen de reclamaciones por estado/gravedad',
    rub_maintenance_desc: 'Mantenimiento preventivo, recurrente y predictivo',
    rub_team_desc: 'Equipos técnicos, técnicos y asignaciones',
    rub_fieldtech_desc: 'Aplicación de campo móvil, firmas y fotos',
    rub_energy_desc: 'Análisis energético, huella de carbono e intensidad kWh/m²',
    rub_bim_desc: 'Visor 3D IFC y capas técnicas del edificio',
    rub_digital_twin_desc: 'Gemelo digital interactivo y sensores IoT',
    rub_predictive_ai_desc: 'Salud del equipo, predicción de averías e IA',
    rub_tenants_desc: 'Portal de ocupantes, satisfacción y alquileres',
    rub_cmms_desc: 'Plataforma GMAO avanzada y descarbonización',
    rub_erp_desc: 'Conectores SAP, Odoo y tuberías de datos',
    rub_analytics_desc: 'KPIs, informes de rendimiento y análisis MTTR',
    rub_leases_desc: 'Gestión de alquileres, contratos de mantenimiento y garantías',
    rub_exports_desc: 'Generación de informes de auditoría firmados',
    rub_notifications_desc: 'Alertas en tiempo real y umbrales telemétricos',
    rub_ai_assistant_desc: 'Asistente conversacional especializado en Facility Management',
    rub_workflow_desc: 'Automatizaciones y reglas de negocio configurables',
    rub_marketplace_desc: 'Extensiones y conectores de terceros',
    rub_sectoral_desc: 'Packs adaptados para Salud, Retail, Terciario y Logística',
    rub_plans_desc: 'Suscripciones, planes multisitio y facturación',
    rub_security_desc: 'Gestión de roles RLS, seguridad y trazabilidad',
    rub_settings_desc: 'Configuración del sistema, usuarios y preferencias',

    // Status tags
    status_active: 'Activo',
    status_pillar_1: 'Pilar 1',
    status_pillar_2: 'Pillar 2',
    status_pillar_3: 'Pilar 3',
    status_pillar_4: 'Pilar 4',
    status_pillar_5: 'Pilar 5',
    status_module: 'Módulo',
    status_copilot: 'IA Copilot',
    status_system: 'Sistema',
    status_security: 'Seguridad',
    status_admin: 'Admin',

    // Ticket Statuses
    status_submitted: 'Enviado',
    status_triaged: 'Validado FM',
    status_assigned: 'Asignado',
    status_in_progress: 'En Curso',
    status_tech_closed: 'Cierre Técnico',
    status_qap_passed: 'Validado QA',
    status_closed: 'Cerrado',

    // Severities
    sev_emergency: 'Peligro Inmediato',
    sev_critical: 'Crítica',
    sev_high: 'Alta',
    sev_medium: 'Media',
    sev_low: 'Baja',

    // Assets Page
    asset_model_title: 'Modelo de Datos de Activos',
    asset_canonical_structure: 'Estructura Canónica (H1)',
    asset_cobie_compliance: 'Cumplimiento estricto COBie Lite • Multinivel (Sitio → Equipo)',
    asset_sync_bim: 'Sinc. IFC / BIM',
    asset_scan_qr: 'Escanear QR',
    asset_close_scanner: 'Cerrar Escáner',
    asset_add_new: 'Añadir Activo',
    asset_hierarchical_ref: 'Registro Jerárquico (Espacial y Técnico)',
    asset_nomenclature: 'Nomenclatura y Estructura',
    asset_code_type: 'Código / Tipo',
    asset_standard: 'Estándar (COBie / IFC)',
    asset_operational: 'OPERATIVO',
    asset_maintenance: 'MANTENIMIENTO',
    asset_defective: 'DEFECTUOSO',
    asset_bim_data: 'Datos BIM y COBie',
    asset_ifc_certified: 'Certificado IFC',
    asset_create_wo: 'Crear Orden de Trabajo',
    asset_print_tag: 'Imprimir Etiqueta QR',
    asset_edit: 'Editar Activo',
    asset_select_prompt: 'Seleccione un equipo para ver detalles',

    // Work Orders Page
    wo_title: 'Gestión de Órdenes de Trabajo',
    wo_subtitle: 'Seguimiento operativo de intervenciones y mantenimiento',
    wo_new: 'Nueva Orden de Trabajo',
    wo_search_ph: 'Buscar por título, código o técnico...',
    wo_status_all: 'Todos los estados',
    wo_status_pending: 'Pendiente',
    wo_status_in_progress: 'En curso',
    wo_status_completed: 'Completado',
    wo_status_cancelled: 'Cancelado',

    // Spaces Page
    spaces_title: 'Gestión de Edificios y Espacios',
    spaces_subtitle: 'Jerarquía espacial, ocupación y cartografía',
    spaces_add_building: 'Añadir Edificio',
    spaces_add_floor: 'Añadir Planta',
    spaces_add_room: 'Añadir Sala',

    // Energy Page
    energy_title: 'Seguimiento Energético y Rendimiento ESG',
    energy_subtitle: 'Análisis de consumo, huella de carbono y eficiencia',
    energy_kwh: 'Consumo (kWh)',
    energy_carbon: 'Emisiones de CO2 (toneladas)',
    energy_target: 'Objetivo de Reducción ESG',

    // Digital Twin / BIM Page
    twin_title: 'Gemelo Digital y Modelado BIM',
    twin_subtitle: 'Visualización 3D, capas técnicas y telemetría en tiempo real',
    twin_layers: 'Capas Técnicas',
    twin_hvac: 'HVAC / Aire Acondicionado',
    twin_electrical: 'Electricidad e Iluminación',
    twin_plumbing: 'Fontanería y Fluidos',
    twin_fire: 'Seguridad contra Incendios',

    // Analytics Page
    analytics_title: 'Analítica e Indicadores Clave de Rendimiento (KPI)',
    analytics_subtitle: 'Informes predictivos, costes operativos y MTTR',
    analytics_mttr: 'Tiempo Medio de Reparación (MTTR)',
    analytics_costs: 'Costes de Mantenimiento',
    analytics_compliance: 'Tasa de Cumplimiento SLA',

    // Settings Page
    settings_title: 'Configuración del Sistema CAFM',
    settings_subtitle: 'Configuración global, integraciones y preferencias',
    settings_general: 'General',
    settings_notifications: 'Notificaciones',
    settings_security: 'Seguridad y Acceso',
    settings_theme: 'Apariencia y Tema',
    settings_language: 'Idioma de la aplicación',

    // Team Page
    team_title: 'Gestión de Equipos y Técnicos',
    team_subtitle: 'Gestión de roles, asignaciones y disponibilidad',
    team_add_member: 'Añadir Miembro',

    // AI Assistant
    ai_assistant_title: 'Asistente IA CAFM',
    ai_assistant_ph: 'Haga una pregunta sobre equipos, averías o consumo energético...',
    ai_assistant_send: 'Enviar',

    // Priorities
    priority_critical: 'Crítica',
    priority_high: 'Alta',
    priority_medium: 'Media',
    priority_low: 'Baja',

    // Languages
    lang_fr: 'Français',
    lang_en: 'English',
    lang_es: 'Español',
  }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('app_language') || 'fr';
  });

  const setLanguage = (lang) => {
    if (['fr', 'en', 'es'].includes(lang)) {
      setLanguageState(lang);
      localStorage.setItem('app_language', lang);
    }
  };

  const t = (key, fallback = '') => {
    return translations[language]?.[key] || translations['fr']?.[key] || fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
