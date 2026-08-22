import { useState } from 'react';
import {
  Settings as SettingsIcon, Shield, Bell, Key, Database, CheckCircle2,
  Building, Mail, Users, Globe, ToggleLeft, ToggleRight, Server, Cloud, Cpu, Save, RefreshCw, Plus, Trash,
  MapPin, Edit3, ShieldAlert, FileText, CheckSquare, RotateCcw, AlertTriangle, Info, PhoneCall
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useSiteConfig } from '../context/SiteConfigContext';
import DynamicFormIndications from '../components/DynamicFormIndications';

export default function Settings() {
  const {
    sites,
    formConfig,
    addSite,
    updateSite,
    deleteSite,
    addFormBanner,
    updateFormBanner,
    toggleFormBanner,
    deleteFormBanner,
    addCustomField,
    updateCustomField,
    toggleCustomField,
    deleteCustomField,
    resetToDefaults
  } = useSiteConfig();

  const [activeTab, setActiveTab] = useState('PROFILE');
  const [saving, setSaving] = useState(false);

  // Superadmin editing states
  const [editingSiteId, setEditingSiteId] = useState(null);
  const [siteEditData, setSiteEditData] = useState({});
  const [showAddSiteModal, setShowAddSiteModal] = useState(false);
  const [newSiteForm, setNewSiteForm] = useState({
    name: '',
    streetAddress: '',
    postalCode: '',
    city: '',
    country: 'France',
    phone: '',
    accessInstructions: ''
  });

  const [showAddBannerModal, setShowAddBannerModal] = useState(false);
  const [newBannerForm, setNewBannerForm] = useState({
    title: '',
    text: '',
    type: 'warning'
  });

  const [showAddFieldModal, setShowAddFieldModal] = useState(false);
  const [newFieldForm, setNewFieldForm] = useState({
    label: '',
    type: 'text',
    placeholder: '',
    required: false,
    helpText: ''
  });

  // Profile & Org Config
  const [profileConfig, setProfileConfig] = useState({
    companyName: 'BEECARBONAT Facility Management Ltd.',
    primaryContact: 'Dr. Aris Thorne',
    timezone: 'Europe/London (GMT+0)',
    language: 'English',
    themePreference: 'Dark Mode - Cyber Obsidian',
    accentColor: localStorage.getItem('beecarbonat_accent_color') || '#f38020'
  });

  // API & Integrations Config
  const [apiKeys, setApiKeys] = useState([
    { id: 'key-1', name: 'SAP S/4HANA Connector', prefix: 'beecarbonat_sap_live_...', created: '2026-04-10', status: 'ACTIVE' },
    { id: 'key-2', name: 'Google Workspace OAuth Client', prefix: 'beecarbonat_gws_prod_...', created: '2026-06-15', status: 'ACTIVE' }
  ]);
  const [newKeyName, setNewKeyName] = useState('');

  // Alert Routing Configuration
  const [alertConfig, setAlertConfig] = useState({
    sreSlackWebhook: 'https://hooks.slack.com/services/T000/B000/XXXXXX',
    telegramChatId: '@beecarbonat_sre_alarms',
    hvacCriticalTemp: 28,
    serverUptimeThreshold: 99.9,
    channelEmail: true,
    channelSlack: true,
    channelTelegram: false,
    channelSMS: true
  });

  // System Parameters Configuration
  const [sysConfig, setSysConfig] = useState({
    offlineSyncInterval: 15,
    maxLogRetentionDays: 90,
    serviceWorkerCacheSize: '256 MB',
    experimentalBimShader: true,
    aiModelTemperature: 0.15
  });

  const handleSaveAll = (e) => {
    e.preventDefault();
    setSaving(true);
    const saveToast = toast.loading('Enregistrement de la configuration système...');
    
    // Explicitly commit selected accent color to localStorage and document style
    localStorage.setItem('beecarbonat_accent_color', profileConfig.accentColor);
    document.documentElement.style.setProperty('--brand-orange', profileConfig.accentColor);
    
    setTimeout(() => {
      setSaving(false);
      toast.success('Paramètres système enregistrés avec succès.', { id: saveToast });
    }, 1200);
  };

  const handleCreateApiKey = (e) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;
    const newKey = {
      id: `key-${Date.now()}`,
      name: newKeyName,
      prefix: `beecarbonat_gen_${Math.random().toString(36).substr(2, 5)}_...`,
      created: new Date().toISOString().split('T')[0],
      status: 'ACTIVE'
    };
    setApiKeys([...apiKeys, newKey]);
    setNewKeyName('');
    toast.success(`API Secret Key generated: ${newKey.name}`);
  };

  const handleDeleteApiKey = (id, name) => {
    setApiKeys(apiKeys.filter(k => k.id !== id));
    toast.error(`Revoked access for token: ${name}`);
  };

  return (
    <div className="p-6 md:p-8 space-y-8 bg-[#09090b] text-zinc-100 min-h-screen font-sans">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-zinc-800/60">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-display uppercase tracking-widest text-zinc-50 flex items-center gap-3">
            <SettingsIcon className="w-8 h-8 text-brand-orange animate-spin" style={{ animationDuration: '8s' }} />
            System Configuration
          </h1>
          <p className="text-zinc-400 text-xs mt-1 max-w-xl">
            Configure system parameters, OAuth workspace integrations, SRE alert thresholds, and global environmental routing coefficients.
          </p>
        </div>
        <div>
          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="flex items-center gap-2 bg-brand-orange hover:bg-[#e27010] text-black px-6 py-2.5 text-xs font-mono uppercase tracking-wider font-bold rounded-sm shadow-[0_0_15px_rgba(243,128,32,0.15)] transition"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Commit Parameters
          </button>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-zinc-800/80 gap-6 overflow-x-auto pb-px">
        {[
          { id: 'SUPERADMIN', label: 'Superadmin: Adresses & Formulaires', icon: Shield },
          { id: 'PROFILE', label: 'Profile & Org', icon: Building },
          { id: 'INTEGRATIONS', label: 'API & Integrations', icon: Database },
          { id: 'ROUTING', label: 'Alert Routing', icon: Bell },
          { id: 'PARAMETERS', label: 'System Parameters', icon: Server }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 font-mono text-xs uppercase tracking-widest flex items-center gap-2 border-b-2 transition ${
              activeTab === tab.id
                ? 'border-brand-orange text-brand-orange font-bold'
                : 'border-transparent text-zinc-400 hover:text-zinc-100 hover:border-zinc-800'
            }`}
          >
            <tab.icon className="w-4 h-4 shrink-0" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Settings Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left/Middle Column - Main Interactive Form Panels */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSaveAll} className="space-y-6">
            
            {/* Panel 0: Superadmin Address & Form Indications Config */}
            {activeTab === 'SUPERADMIN' && (
              <div className="space-y-8">
                {/* Superadmin Header Banner */}
                <div className="bg-gradient-to-r from-amber-500/10 via-brand-orange/10 to-transparent border border-brand-orange/30 p-6 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Shield className="w-8 h-8 text-brand-orange animate-pulse" />
                      <div>
                        <h2 className="text-lg font-bold font-mono uppercase tracking-widest text-white flex items-center gap-2">
                          Panneau Superadmin — Adresses &amp; Indications de Formulaires
                          <span className="text-[10px] bg-brand-orange text-black px-2 py-0.5 rounded font-mono font-bold">MODE PRIVILÉGIÉ</span>
                        </h2>
                        <p className="text-xs text-zinc-400 font-mono mt-0.5">
                          Gérez les adresses des bâtiments et personnalisez les consignes &amp; champs exigés sur tous les formulaires (GMAO, Réclamations, Interventions).
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={resetToDefaults}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-mono text-xs rounded transition cursor-pointer"
                      title="Réinitialiser les configurations aux valeurs par défaut"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Réinitialiser
                    </button>
                  </div>
                </div>

                {/* Section 1: Gestion des Adresses de Sites / Bâtiments */}
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-800 pb-4">
                    <div>
                      <h3 className="font-mono text-sm font-bold text-brand-orange uppercase tracking-widest flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-brand-orange" />
                        Adresses des Sites &amp; Consignes d'Accès ({sites.length})
                      </h3>
                      <p className="text-zinc-400 text-xs mt-0.5">
                        Modifier les adresses, coordonnées postales et consignes d'accès des bâtiments.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAddSiteModal(true)}
                      className="flex items-center gap-1.5 bg-brand-orange hover:bg-[#e27010] text-black font-mono font-bold text-xs px-4 py-2 rounded transition uppercase shrink-0 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" /> Ajouter un Site
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {sites.map((site) => {
                      const isEditing = editingSiteId === site.id;
                      const currentData = isEditing ? siteEditData : site;

                      return (
                        <div key={site.id} className="bg-zinc-950 border border-zinc-800 p-5 rounded-xl space-y-4">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-zinc-800/60 pb-3">
                            <div className="flex items-center gap-2">
                              <Building className="w-4 h-4 text-cyan-400" />
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={currentData.name || ''}
                                  onChange={(e) => setSiteEditData({ ...siteEditData, name: e.target.value })}
                                  className="bg-zinc-900 border border-zinc-700 text-zinc-100 px-2 py-1 text-xs font-mono rounded focus:border-brand-orange outline-none font-bold"
                                />
                              ) : (
                                <span className="font-mono text-sm font-bold text-zinc-100">{site.name}</span>
                              )}
                              {site.isPrimary && (
                                <span className="text-[9px] bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded font-mono font-bold border border-cyan-500/20 uppercase">
                                  Siège Principal
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              {isEditing ? (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      updateSite(site.id, siteEditData);
                                      setEditingSiteId(null);
                                    }}
                                    className="px-3 py-1 bg-emerald-500 text-black font-mono font-bold text-xs rounded hover:bg-emerald-400 flex items-center gap-1 cursor-pointer"
                                  >
                                    <Save className="w-3.5 h-3.5" /> Enregistrer
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setEditingSiteId(null)}
                                    className="px-3 py-1 bg-zinc-800 text-zinc-300 font-mono text-xs rounded hover:bg-zinc-700 cursor-pointer"
                                  >
                                    Annuler
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingSiteId(site.id);
                                      setSiteEditData({ ...site });
                                    }}
                                    className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-mono text-xs rounded flex items-center gap-1 cursor-pointer"
                                  >
                                    <Edit3 className="w-3.5 h-3.5 text-brand-orange" /> Modifier l'Adresse
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => deleteSite(site.id)}
                                    className="p-1.5 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 rounded transition cursor-pointer"
                                    title="Supprimer le site"
                                  >
                                    <Trash className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Editable Fields */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
                            <div className="space-y-1">
                              <label className="text-[10px] uppercase text-zinc-500 block font-bold">Rue / Adresse</label>
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={currentData.streetAddress || ''}
                                  onChange={(e) => setSiteEditData({ ...siteEditData, streetAddress: e.target.value })}
                                  className="w-full bg-zinc-900 border border-zinc-700 px-2 py-1.5 text-zinc-100 rounded focus:border-brand-orange outline-none"
                                />
                              ) : (
                                <p className="text-zinc-200">{site.streetAddress || 'N/A'}</p>
                              )}
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] uppercase text-zinc-500 block font-bold">Code Postal &amp; Ville</label>
                              {isEditing ? (
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    value={currentData.postalCode || ''}
                                    onChange={(e) => setSiteEditData({ ...siteEditData, postalCode: e.target.value })}
                                    placeholder="CP"
                                    className="w-20 bg-zinc-900 border border-zinc-700 px-2 py-1.5 text-zinc-100 rounded focus:border-brand-orange outline-none"
                                  />
                                  <input
                                    type="text"
                                    value={currentData.city || ''}
                                    onChange={(e) => setSiteEditData({ ...siteEditData, city: e.target.value })}
                                    placeholder="Ville"
                                    className="flex-1 bg-zinc-900 border border-zinc-700 px-2 py-1.5 text-zinc-100 rounded focus:border-brand-orange outline-none"
                                  />
                                </div>
                              ) : (
                                <p className="text-zinc-200">{site.postalCode} {site.city}, {site.country}</p>
                              )}
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] uppercase text-zinc-500 block font-bold">Téléphone Standard / Urgence</label>
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={currentData.phone || ''}
                                  onChange={(e) => setSiteEditData({ ...siteEditData, phone: e.target.value })}
                                  className="w-full bg-zinc-900 border border-zinc-700 px-2 py-1.5 text-zinc-100 rounded focus:border-brand-orange outline-none"
                                />
                              ) : (
                                <p className="text-cyan-400 font-bold">{site.phone || 'N/A'}</p>
                              )}
                            </div>

                            <div className="md:col-span-3 space-y-1 pt-2 border-t border-zinc-800/40">
                              <label className="text-[10px] uppercase text-zinc-500 block font-bold">Consignes d'Accès Terrain &amp; Instructions du Superadmin</label>
                              {isEditing ? (
                                <textarea
                                  rows={2}
                                  value={currentData.accessInstructions || ''}
                                  onChange={(e) => setSiteEditData({ ...siteEditData, accessInstructions: e.target.value })}
                                  className="w-full bg-zinc-900 border border-zinc-700 px-2.5 py-1.5 text-zinc-100 rounded focus:border-brand-orange outline-none"
                                />
                              ) : (
                                <p className="text-zinc-400 text-[11px] bg-zinc-900/60 p-2 rounded border border-zinc-800/80 leading-relaxed">
                                  {site.accessInstructions || 'Aucune consigne spécifique.'}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Section 2: Consignes & Bannières d'Indications du Formulaire */}
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-800 pb-4">
                    <div>
                      <h3 className="font-mono text-sm font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-amber-400" />
                        Consignes Générales sur les Formulaires ({formConfig.banners.length})
                      </h3>
                      <p className="text-zinc-400 text-xs mt-0.5">
                        Ajoutez des bandeaux d'avertissement ou consignes affichés en haut des formulaires pour informer les techniciens et demandeurs.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAddBannerModal(true)}
                      className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-xs px-4 py-2 rounded transition uppercase shrink-0 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" /> Ajouter une Consigne
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {formConfig.banners.map((banner) => (
                      <div key={banner.id} className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl flex items-start justify-between gap-4">
                        <div className="space-y-1 text-xs font-mono flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-zinc-100">{banner.title}</span>
                            <span className={`text-[9px] uppercase px-2 py-0.5 rounded font-bold ${
                              banner.type === 'important' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                              banner.type === 'warning' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                              'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                            }`}>
                              {banner.type}
                            </span>
                            <span className={`text-[9px] uppercase px-2 py-0.5 rounded font-bold ${
                              banner.enabled ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-800 text-zinc-500'
                            }`}>
                              {banner.enabled ? 'Actif' : 'Masqué'}
                            </span>
                          </div>
                          <p className="text-zinc-400 text-[11px] leading-relaxed">{banner.text}</p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => toggleFormBanner(banner.id)}
                            className="text-zinc-400 hover:text-zinc-100 p-1 cursor-pointer"
                            title={banner.enabled ? 'Désactiver la consigne' : 'Activer la consigne'}
                          >
                            {banner.enabled ? <ToggleRight className="w-6 h-6 text-emerald-400" /> : <ToggleLeft className="w-6 h-6 text-zinc-600" />}
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteFormBanner(banner.id)}
                            className="text-zinc-500 hover:text-rose-400 p-1.5 transition cursor-pointer"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 3: Champs & Requirements Personnalisés du Formulaire */}
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-800 pb-4">
                    <div>
                      <h3 className="font-mono text-sm font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                        <CheckSquare className="w-4 h-4 text-cyan-400" />
                        Champs Exigés &amp; Indications Supplémentaires ({formConfig.customFields.length})
                      </h3>
                      <p className="text-zinc-400 text-xs mt-0.5">
                        Configurez de nouveaux champs de saisie ou cases à cocher obligatoires pour les formulaires.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAddFieldModal(true)}
                      className="flex items-center gap-1.5 bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs px-4 py-2 rounded transition uppercase shrink-0 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" /> Ajouter un Champ
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {formConfig.customFields.map((field) => (
                      <div key={field.id} className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl flex items-center justify-between gap-4 text-xs font-mono">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-zinc-100">{field.label}</span>
                            {field.required && (
                              <span className="text-[9px] bg-rose-500/20 text-rose-400 px-1.5 py-0.5 rounded uppercase font-bold border border-rose-500/30">
                                Obligatoire
                              </span>
                            )}
                            <span className="text-[9px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded uppercase font-bold">
                              Type: {field.type}
                            </span>
                            <span className={`text-[9px] uppercase px-2 py-0.5 rounded font-bold ${
                              field.enabled ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-800 text-zinc-500'
                            }`}>
                              {field.enabled ? 'Inclus' : 'Désactivé'}
                            </span>
                          </div>
                          {field.helpText && <p className="text-zinc-400 text-[11px]">{field.helpText}</p>}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => toggleCustomField(field.id)}
                            className="text-zinc-400 hover:text-zinc-100 p-1 cursor-pointer"
                            title={field.enabled ? 'Masquer le champ' : 'Afficher le champ'}
                          >
                            {field.enabled ? <ToggleRight className="w-6 h-6 text-emerald-400" /> : <ToggleLeft className="w-6 h-6 text-zinc-600" />}
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteCustomField(field.id)}
                            className="text-zinc-500 hover:text-rose-400 p-1.5 transition cursor-pointer"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 4: Live Preview Mode */}
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                    <h3 className="font-mono text-xs font-bold text-brand-orange uppercase tracking-widest flex items-center gap-2">
                      <FileText className="w-4 h-4 text-brand-orange" />
                      Aperçu Temps Réel du Formulaire Modifié
                    </h3>
                    <span className="text-[9px] bg-brand-orange/10 text-brand-orange px-2 py-0.5 rounded font-mono font-bold uppercase border border-brand-orange/20">
                      Rendu Utilisateur
                    </span>
                  </div>

                  <div className="bg-zinc-950 p-5 rounded-xl border border-zinc-800 space-y-4">
                    <p className="text-xs font-mono text-zinc-400">
                      Voici le rendu des consignes et champs personnalisés configurés par le superadmin :
                    </p>
                    <DynamicFormIndications />
                  </div>
                </div>

                {/* MODAL: ADD SITE */}
                {showAddSiteModal && (
                  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-full max-w-lg space-y-4 shadow-2xl font-mono text-xs">
                      <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
                        <h3 className="font-bold text-white text-sm flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-brand-orange" /> Nouveau Site &amp; Adresse
                        </h3>
                        <button onClick={() => setShowAddSiteModal(false)} className="text-zinc-400 hover:text-white cursor-pointer">✕</button>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-[10px] uppercase text-zinc-400 mb-1 font-bold">Nom du Bâtiment / Site</label>
                          <input
                            type="text"
                            placeholder="Ex: Marseille Hub - Bâtiment C"
                            value={newSiteForm.name}
                            onChange={(e) => setNewSiteForm({ ...newSiteForm, name: e.target.value })}
                            className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white focus:border-brand-orange outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase text-zinc-400 mb-1 font-bold">Rue / Adresse</label>
                          <input
                            type="text"
                            placeholder="Ex: 15 Avenue du Prado"
                            value={newSiteForm.streetAddress}
                            onChange={(e) => setNewSiteForm({ ...newSiteForm, streetAddress: e.target.value })}
                            className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white focus:border-brand-orange outline-none"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] uppercase text-zinc-400 mb-1 font-bold">Code Postal</label>
                            <input
                              type="text"
                              placeholder="13006"
                              value={newSiteForm.postalCode}
                              onChange={(e) => setNewSiteForm({ ...newSiteForm, postalCode: e.target.value })}
                              className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white focus:border-brand-orange outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase text-zinc-400 mb-1 font-bold">Ville</label>
                            <input
                              type="text"
                              placeholder="Marseille"
                              value={newSiteForm.city}
                              onChange={(e) => setNewSiteForm({ ...newSiteForm, city: e.target.value })}
                              className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white focus:border-brand-orange outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase text-zinc-400 mb-1 font-bold">Téléphone Standard / Urgence</label>
                          <input
                            type="text"
                            placeholder="+33 4 91 00 20 00"
                            value={newSiteForm.phone}
                            onChange={(e) => setNewSiteForm({ ...newSiteForm, phone: e.target.value })}
                            className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white focus:border-brand-orange outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase text-zinc-400 mb-1 font-bold">Consignes d'Accès &amp; Instructions Superadmin</label>
                          <textarea
                            rows={2}
                            placeholder="Ex: Badge obligatoire au poste de garde. Port du casque requis."
                            value={newSiteForm.accessInstructions}
                            onChange={(e) => setNewSiteForm({ ...newSiteForm, accessInstructions: e.target.value })}
                            className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white focus:border-brand-orange outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 pt-3 border-t border-zinc-800">
                        <button
                          type="button"
                          onClick={() => setShowAddSiteModal(false)}
                          className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded hover:bg-zinc-700 cursor-pointer"
                        >
                          Annuler
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (!newSiteForm.name) return toast.error('Veuillez indiquer le nom du site');
                            addSite(newSiteForm);
                            setShowAddSiteModal(false);
                            setNewSiteForm({ name: '', streetAddress: '', postalCode: '', city: '', country: 'France', phone: '', accessInstructions: '' });
                          }}
                          className="px-5 py-2 bg-brand-orange text-black font-bold rounded hover:bg-[#e27010] cursor-pointer"
                        >
                          Créer le Site
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* MODAL: ADD FORM BANNER */}
                {showAddBannerModal && (
                  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-full max-w-lg space-y-4 shadow-2xl font-mono text-xs">
                      <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
                        <h3 className="font-bold text-white text-sm flex items-center gap-2">
                          <ShieldAlert className="w-4 h-4 text-amber-400" /> Nouvelle Consigne de Formulaire
                        </h3>
                        <button onClick={() => setShowAddBannerModal(false)} className="text-zinc-400 hover:text-white cursor-pointer">✕</button>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-[10px] uppercase text-zinc-400 mb-1 font-bold">Titre de la Consigne</label>
                          <input
                            type="text"
                            placeholder="Ex: Consigne de Sécurité Électrique"
                            value={newBannerForm.title}
                            onChange={(e) => setNewBannerForm({ ...newBannerForm, title: e.target.value })}
                            className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white focus:border-amber-400 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase text-zinc-400 mb-1 font-bold">Type de Consigne</label>
                          <select
                            value={newBannerForm.type}
                            onChange={(e) => setNewBannerForm({ ...newBannerForm, type: e.target.value })}
                            className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white focus:border-amber-400 outline-none"
                          >
                            <option value="warning">Avertissement (Orange)</option>
                            <option value="important">Urgent / Important (Rouge)</option>
                            <option value="info">Information Générale (Cyan)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase text-zinc-400 mb-1 font-bold">Texte d'Instruction Détaillé</label>
                          <textarea
                            rows={3}
                            placeholder="Rédigez la consigne à faire apparaître en haut du formulaire..."
                            value={newBannerForm.text}
                            onChange={(e) => setNewBannerForm({ ...newBannerForm, text: e.target.value })}
                            className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white focus:border-amber-400 outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 pt-3 border-t border-zinc-800">
                        <button
                          type="button"
                          onClick={() => setShowAddBannerModal(false)}
                          className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded hover:bg-zinc-700 cursor-pointer"
                        >
                          Annuler
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (!newBannerForm.title || !newBannerForm.text) return toast.error('Veuillez remplir le titre et le texte');
                            addFormBanner(newBannerForm);
                            setShowAddBannerModal(false);
                            setNewBannerForm({ title: '', text: '', type: 'warning' });
                          }}
                          className="px-5 py-2 bg-amber-500 text-black font-bold rounded hover:bg-amber-400 cursor-pointer"
                        >
                          Ajouter au Formulaire
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* MODAL: ADD CUSTOM FIELD */}
                {showAddFieldModal && (
                  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-full max-w-lg space-y-4 shadow-2xl font-mono text-xs">
                      <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
                        <h3 className="font-bold text-white text-sm flex items-center gap-2">
                          <CheckSquare className="w-4 h-4 text-cyan-400" /> Nouveau Champ de Formulaire
                        </h3>
                        <button onClick={() => setShowAddFieldModal(false)} className="text-zinc-400 hover:text-white cursor-pointer">✕</button>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-[10px] uppercase text-zinc-400 mb-1 font-bold">Intitulé du Champ</label>
                          <input
                            type="text"
                            placeholder="Ex: Code d'autorisation travaux"
                            value={newFieldForm.label}
                            onChange={(e) => setNewFieldForm({ ...newFieldForm, label: e.target.value })}
                            className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white focus:border-cyan-400 outline-none"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] uppercase text-zinc-400 mb-1 font-bold">Type de Champ</label>
                            <select
                              value={newFieldForm.type}
                              onChange={(e) => setNewFieldForm({ ...newFieldForm, type: e.target.value })}
                              className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white focus:border-cyan-400 outline-none"
                            >
                              <option value="text">Texte libre</option>
                              <option value="checkbox">Case à cocher (Oui/Non)</option>
                              <option value="number">Numérique</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase text-zinc-400 mb-1 font-bold">Obligatoire ?</label>
                            <select
                              value={newFieldForm.required ? 'YES' : 'NO'}
                              onChange={(e) => setNewFieldForm({ ...newFieldForm, required: e.target.value === 'YES' })}
                              className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white focus:border-cyan-400 outline-none"
                            >
                              <option value="YES">Oui (Obligatoire)</option>
                              <option value="NO">Non (Optionnel)</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase text-zinc-400 mb-1 font-bold">Exemple / Placeholder</label>
                          <input
                            type="text"
                            placeholder="Ex: AUT-88902"
                            value={newFieldForm.placeholder}
                            onChange={(e) => setNewFieldForm({ ...newFieldForm, placeholder: e.target.value })}
                            className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white focus:border-cyan-400 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase text-zinc-400 mb-1 font-bold">Note d'Aide / Explication</label>
                          <input
                            type="text"
                            placeholder="Ex: Fourni par le responsable sécurité bâtiment"
                            value={newFieldForm.helpText}
                            onChange={(e) => setNewFieldForm({ ...newFieldForm, helpText: e.target.value })}
                            className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded text-white focus:border-cyan-400 outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 pt-3 border-t border-zinc-800">
                        <button
                          type="button"
                          onClick={() => setShowAddFieldModal(false)}
                          className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded hover:bg-zinc-700 cursor-pointer"
                        >
                          Annuler
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (!newFieldForm.label) return toast.error('Veuillez indiquer un intitulé');
                            addCustomField(newFieldForm);
                            setShowAddFieldModal(false);
                            setNewFieldForm({ label: '', type: 'text', placeholder: '', required: false, helpText: '' });
                          }}
                          className="px-5 py-2 bg-cyan-500 text-black font-bold rounded hover:bg-cyan-400 cursor-pointer"
                        >
                          Ajouter au Formulaire
                        </button>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* Panel 1: Profile & Org Settings */}
            {activeTab === 'PROFILE' && (
              <div className="bg-zinc-900 border border-zinc-800 p-6 space-y-6">
                <div>
                  <h3 className="font-mono text-xs font-bold text-brand-orange uppercase tracking-widest mb-4">Organization Identity</h3>
                  <p className="text-zinc-400 text-xs mb-4">Set the primary tenant parameters and brand configurations for local UI clients.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-zinc-400 uppercase text-[10px] font-mono tracking-wider">Registered Entity Name</label>
                    <input
                      type="text"
                      value={profileConfig.companyName}
                      onChange={(e) => setProfileConfig({ ...profileConfig, companyName: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 px-3 py-2 text-xs font-mono rounded-sm focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-zinc-400 uppercase text-[10px] font-mono tracking-wider">Primary System Administrator</label>
                    <input
                      type="text"
                      value={profileConfig.primaryContact}
                      onChange={(e) => setProfileConfig({ ...profileConfig, primaryContact: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 px-3 py-2 text-xs font-mono rounded-sm focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-zinc-400 uppercase text-[10px] font-mono tracking-wider">Default Timezone</label>
                    <select
                      value={profileConfig.timezone}
                      onChange={(e) => setProfileConfig({ ...profileConfig, timezone: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 text-zinc-300 px-3 py-2 text-xs font-mono rounded-sm focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none transition"
                    >
                      <option value="Europe/London (GMT+0)">Europe/London (GMT+0)</option>
                      <option value="Europe/Paris (GMT+1)">Europe/Paris (GMT+1)</option>
                      <option value="America/New_York (EST-5)">America/New_York (EST-5)</option>
                      <option value="Asia/Tokyo (GMT+9)">Asia/Tokyo (GMT+9)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-zinc-400 uppercase text-[10px] font-mono tracking-wider">Localization Context</label>
                    <select
                      value={profileConfig.language}
                      onChange={(e) => setProfileConfig({ ...profileConfig, language: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 text-zinc-300 px-3 py-2 text-xs font-mono rounded-sm focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none transition"
                    >
                      <option value="English">English (United States / United Kingdom)</option>
                      <option value="French">Français (France / Canada)</option>
                      <option value="German">Deutsch (Deutschland)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5 pt-4 border-t border-zinc-800/40">
                  <label className="block text-zinc-400 uppercase text-[10px] font-mono tracking-wider">Primary Theme / Aesthetic</label>
                  <select
                    value={profileConfig.themePreference}
                    onChange={(e) => setProfileConfig({ ...profileConfig, themePreference: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 text-zinc-300 px-3 py-2 text-xs font-mono rounded-sm focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none transition"
                  >
                    <option value="Dark Mode - Cyber Obsidian">Dark Mode - Cyber Obsidian (Default High Contrast)</option>
                    <option value="Light Mode - Slate Precision">Light Mode - Slate Precision</option>
                  </select>
                </div>

                <div className="space-y-3 pt-4 border-t border-zinc-800/40">
                  <label className="block text-zinc-400 uppercase text-[10px] font-mono tracking-wider">
                    Couleur par défaut (Accent Color)
                  </label>
                  <p className="text-zinc-500 text-xs">
                    Sélectionnez la couleur d'accentuation principale de l'interface BEECARBONAT.
                  </p>
                  <div className="flex flex-wrap gap-3 pt-1">
                    {[
                      { hex: '#f38020', name: 'Orange Classique', bg: 'bg-[#f38020]' },
                      { hex: '#00dbe7', name: 'Cyan Industriel', bg: 'bg-[#00dbe7]' },
                      { hex: '#10b981', name: 'Vert Émeraude', bg: 'bg-[#10b981]' },
                      { hex: '#2563eb', name: 'Bleu Cobalt', bg: 'bg-[#2563eb]' },
                      { hex: '#ef4444', name: 'Rouge Alerte', bg: 'bg-[#ef4444]' },
                      { hex: '#8b5cf6', name: 'Violet Quantum', bg: 'bg-[#8b5cf6]' },
                    ].map((color) => {
                      const isActive = profileConfig.accentColor === color.hex;
                      return (
                        <button
                          key={color.hex}
                          type="button"
                          onClick={() => {
                            setProfileConfig({ ...profileConfig, accentColor: color.hex });
                            document.documentElement.style.setProperty('--brand-orange', color.hex);
                            localStorage.setItem('beecarbonat_accent_color', color.hex);
                            toast.success(`Couleur d'accentuation changée : ${color.name}`);
                          }}
                          className={`group relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                            isActive 
                              ? 'border-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.25)]' 
                              : 'border-transparent hover:border-zinc-700 hover:scale-105'
                          }`}
                          title={color.name}
                        >
                          <span className={`w-6 h-6 rounded-full ${color.bg} shadow-inner`} />
                          
                          {/* Hover Tooltip */}
                          <span className="absolute bottom-12 bg-zinc-950 text-white font-mono text-[9px] uppercase tracking-wider py-1 px-2 border border-zinc-800 opacity-0 group-hover:opacity-100 transition duration-200 pointer-events-none whitespace-nowrap z-50">
                            {color.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Panel 2: API & Integrations Settings */}
            {activeTab === 'INTEGRATIONS' && (
              <div className="bg-zinc-900 border border-zinc-800 p-6 space-y-6">
                <div>
                  <h3 className="font-mono text-xs font-bold text-brand-orange uppercase tracking-widest mb-4">Integration API Secret Keys</h3>
                  <p className="text-zinc-400 text-xs mb-4">Provision tokens to allow automated BEECARBONAT client scripts to programmatically push sensor anomalies.</p>
                </div>

                {/* API Key Form */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    placeholder="E.g., HVAC Sensor Collector Key"
                    className="flex-1 bg-zinc-950 border border-zinc-800 text-zinc-100 px-3 py-2 text-xs font-mono rounded-sm focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={handleCreateApiKey}
                    className="flex items-center gap-1 bg-brand-orange hover:bg-[#e27010] text-black font-mono font-bold text-xs px-4 py-2 rounded-sm transition uppercase"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Generate
                  </button>
                </div>

                {/* API Keys List */}
                <div className="space-y-2">
                  {apiKeys.map((key) => (
                    <div key={key.id} className="flex justify-between items-center bg-zinc-950 border border-zinc-800 p-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-semibold text-zinc-200">{key.name}</span>
                          <span className="text-[9px] px-1.5 py-0.5 bg-green-500/10 text-green-400 font-mono font-bold uppercase rounded-sm border border-green-500/10">Active</span>
                        </div>
                        <p className="text-[10px] font-mono text-zinc-500">Key: <code className="text-brand-orange font-semibold">{key.prefix}</code> • Created: {key.created}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteApiKey(key.id, key.name)}
                        className="text-zinc-500 hover:text-red-400 p-2 border border-transparent hover:border-zinc-800 transition"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {apiKeys.length === 0 && (
                    <div className="text-center py-6 text-zinc-500 font-mono text-xs">No active API tokens generated.</div>
                  )}
                </div>

                {/* Enterprise Gateway Links */}
                <div className="pt-4 border-t border-zinc-800/40 space-y-3">
                  <h4 className="font-mono text-[10px] font-bold uppercase text-zinc-400">Enterprise Integrations</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-zinc-950 p-4 border border-zinc-800 flex justify-between items-center">
                      <div className="space-y-1">
                        <span className="font-mono text-xs font-semibold block text-zinc-300">SAP S/4HANA ERP</span>
                        <p className="text-[10px] text-zinc-500">Auto-sync of assets and purchase bills</p>
                      </div>
                      <span className="text-[9px] px-1.5 py-0.5 bg-green-500/10 text-green-400 font-mono font-bold uppercase border border-green-500/10 rounded-sm">Connected</span>
                    </div>
                    <div className="bg-zinc-950 p-4 border border-zinc-800 flex justify-between items-center">
                      <div className="space-y-1">
                        <span className="font-mono text-xs font-semibold block text-zinc-300">Google Workspace</span>
                        <p className="text-[10px] text-zinc-500">Drive exports &amp; Sheets integrations</p>
                      </div>
                      <span className="text-[9px] px-1.5 py-0.5 bg-green-500/10 text-green-400 font-mono font-bold uppercase border border-green-500/10 rounded-sm">Connected</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Panel 3: Alert Routing Settings */}
            {activeTab === 'ROUTING' && (
              <div className="bg-zinc-900 border border-zinc-800 p-6 space-y-6">
                <div>
                  <h3 className="font-mono text-xs font-bold text-brand-orange uppercase tracking-widest mb-4">SRE Telemetry &amp; Alarm Routing</h3>
                  <p className="text-zinc-400 text-xs mb-4">Designate target channels for hardware alarm events, fire alarms, or HVAC failures.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-zinc-400 uppercase text-[10px] font-mono tracking-wider">SRE Slack Webhook Endpoint</label>
                    <input
                      type="text"
                      value={alertConfig.sreSlackWebhook}
                      onChange={(e) => setAlertConfig({ ...alertConfig, sreSlackWebhook: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 px-3 py-2 text-xs font-mono rounded-sm focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-zinc-400 uppercase text-[10px] font-mono tracking-wider">Telegram Alarm Chat ID</label>
                    <input
                      type="text"
                      value={alertConfig.telegramChatId}
                      onChange={(e) => setAlertConfig({ ...alertConfig, telegramChatId: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 px-3 py-2 text-xs font-mono rounded-sm focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-zinc-400 uppercase text-[10px] font-mono tracking-wider">Critical Temp Threshold (°C)</label>
                    <input
                      type="number"
                      value={alertConfig.hvacCriticalTemp}
                      onChange={(e) => setAlertConfig({ ...alertConfig, hvacCriticalTemp: Number(e.target.value) })}
                      className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 px-3 py-2 text-xs font-mono rounded-sm focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-zinc-400 uppercase text-[10px] font-mono tracking-wider">Target Node Uptime SLA (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={alertConfig.serverUptimeThreshold}
                      onChange={(e) => setAlertConfig({ ...alertConfig, serverUptimeThreshold: Number(e.target.value) })}
                      className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 px-3 py-2 text-xs font-mono rounded-sm focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none transition"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-800/40 space-y-3">
                  <h4 className="font-mono text-[10px] font-bold uppercase text-zinc-400">Target Notification Channels</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-zinc-950 border border-zinc-800">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-brand-orange" />
                        <span className="font-mono text-xs text-zinc-300">Email Alarms and PDF Summary Digests</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAlertConfig({ ...alertConfig, channelEmail: !alertConfig.channelEmail })}
                        className="text-zinc-400 hover:text-zinc-100"
                      >
                        {alertConfig.channelEmail ? <ToggleRight className="w-7 h-7 text-brand-orange" /> : <ToggleLeft className="w-7 h-7 text-zinc-600" />}
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-zinc-950 border border-zinc-800">
                      <div className="flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-brand-orange" />
                        <span className="font-mono text-xs text-zinc-300">Push Slack Core Notification Alerts</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAlertConfig({ ...alertConfig, channelSlack: !alertConfig.channelSlack })}
                        className="text-zinc-400 hover:text-zinc-100"
                      >
                        {alertConfig.channelSlack ? <ToggleRight className="w-7 h-7 text-brand-orange" /> : <ToggleLeft className="w-7 h-7 text-zinc-600" />}
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-zinc-950 border border-zinc-800">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-cyan-400" />
                        <span className="font-mono text-xs text-zinc-300">Relay Telegram Bot Broadcast Channel</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAlertConfig({ ...alertConfig, channelTelegram: !alertConfig.channelTelegram })}
                        className="text-zinc-400 hover:text-zinc-100"
                      >
                        {alertConfig.channelTelegram ? <ToggleRight className="w-7 h-7 text-cyan-400" /> : <ToggleLeft className="w-7 h-7 text-zinc-600" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Panel 4: System Parameters Settings */}
            {activeTab === 'PARAMETERS' && (
              <div className="bg-zinc-900 border border-zinc-800 p-6 space-y-6">
                <div>
                  <h3 className="font-mono text-xs font-bold text-brand-orange uppercase tracking-widest mb-4">Core System Thresholds &amp; Service Worker</h3>
                  <p className="text-zinc-400 text-xs mb-4">Fine-tune browser caching rules, hardware accelerations, and memory allocation coefficients.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-zinc-400 uppercase text-[10px] font-mono tracking-wider">SW Offline Caching Cycle (Minutes)</label>
                    <input
                      type="number"
                      value={sysConfig.offlineSyncInterval}
                      onChange={(e) => setSysConfig({ ...sysConfig, offlineSyncInterval: Number(e.target.value) })}
                      className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 px-3 py-2 text-xs font-mono rounded-sm focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-zinc-400 uppercase text-[10px] font-mono tracking-wider">Telemetry Retain Interval (Days)</label>
                    <input
                      type="number"
                      value={sysConfig.maxLogRetentionDays}
                      onChange={(e) => setSysConfig({ ...sysConfig, maxLogRetentionDays: Number(e.target.value) })}
                      className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 px-3 py-2 text-xs font-mono rounded-sm focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-zinc-400 uppercase text-[10px] font-mono tracking-wider">Browser Cache Memory Cap</label>
                    <select
                      value={sysConfig.serviceWorkerCacheSize}
                      onChange={(e) => setSysConfig({ ...sysConfig, serviceWorkerCacheSize: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 text-zinc-300 px-3 py-2 text-xs font-mono rounded-sm focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none transition"
                    >
                      <option value="128 MB">128 MB (Safe Standard)</option>
                      <option value="256 MB">256 MB (High Density Cache)</option>
                      <option value="512 MB">512 MB (Requires Local Storage API permissions)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-zinc-400 uppercase text-[10px] font-mono tracking-wider">Gemini LLM Temperature Coefficient</label>
                    <input
                      type="number"
                      step="0.05"
                      min="0"
                      max="1.0"
                      value={sysConfig.aiModelTemperature}
                      onChange={(e) => setSysConfig({ ...sysConfig, aiModelTemperature: Number(e.target.value) })}
                      className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 px-3 py-2 text-xs font-mono rounded-sm focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none transition"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-800/40 space-y-3">
                  <h4 className="font-mono text-[10px] font-bold uppercase text-zinc-400">Experimental Settings</h4>
                  <div className="flex items-center justify-between p-3 bg-zinc-950 border border-zinc-800">
                    <div className="space-y-0.5">
                      <span className="font-mono text-xs text-zinc-300 block">BIM Shader WebGL Hardware Acceleration</span>
                      <p className="text-[10px] text-zinc-500">Accelerates WebGL compilation speeds for active 3D Digital Twin layouts.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSysConfig({ ...sysConfig, experimentalBimShader: !sysConfig.experimentalBimShader })}
                      className="text-zinc-400 hover:text-zinc-100"
                    >
                      {sysConfig.experimentalBimShader ? <ToggleRight className="w-7 h-7 text-brand-orange" /> : <ToggleLeft className="w-7 h-7 text-zinc-600" />}
                    </button>
                  </div>
                </div>
              </div>
            )}

          </form>
        </div>

        {/* Right Column - Status Overview Sidebar Card */}
        <div className="space-y-6">
          
          {/* ============== MULTI-TENANT TENANT INFO CARD (IMAGE 11) ============== */}
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl space-y-6 relative overflow-hidden group hover:border-cyan-500/30 transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-all duration-500"></div>
            <div>
              <h3 className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                <Building className="w-4 h-4 text-cyan-400" />
                Tenant &amp; Multi-Tenancy Card
              </h3>
              <p className="text-zinc-500 text-[10px] font-mono mt-0.5">Active cryptographic SRE tenant routing context</p>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-zinc-950 border border-zinc-800 rounded">
                <span className="text-[9px] text-zinc-500 uppercase block">Organization Node</span>
                <span className="text-zinc-100 font-bold">BEECARBONAT Ltd.</span>
              </div>
              <div className="p-3 bg-zinc-950 border border-zinc-800 rounded">
                <span className="text-[9px] text-zinc-500 uppercase block">Residency Cluster</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                  Frankfurt, Germany (EU-Central-1)
                </span>
              </div>
              <div className="p-3 bg-zinc-950 border border-zinc-800 rounded">
                <span className="text-[9px] text-zinc-500 uppercase block">Licence Subscription Tier</span>
                <span className="text-brand-orange font-bold font-sans tracking-wider">ENTERPRISE PRO // UNLIMITED SENSORS</span>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800/40 text-[9px] font-mono text-zinc-500 uppercase flex justify-between">
              <span>RLS Isolation: Enforced</span>
              <span>Audit: PASS</span>
            </div>
          </div>

          {/* ============== SRE OPERATOR PROFILE DASHBOARD (IMAGE 11) ============== */}
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl space-y-5 group hover:border-brand-orange/30 transition-all duration-300">
            <div>
              <h3 className="font-mono text-xs font-bold text-brand-orange uppercase tracking-widest flex items-center gap-2">
                <Users className="w-4 h-4 text-brand-orange animate-pulse" />
                SRE Operator Security Profile
              </h3>
              <p className="text-zinc-500 text-[10px] font-mono mt-0.5">SRE credential manager &amp; local public keys</p>
            </div>

            {/* Avatar & Clearance Panel */}
            <div className="flex items-center gap-4 bg-zinc-950/60 p-4 border border-zinc-800 rounded">
              <div className="w-12 h-12 bg-zinc-800 border-2 border-brand-orange/40 rounded-full flex items-center justify-center font-bold text-brand-orange text-lg">
                ER
              </div>
              <div>
                <h4 className="font-sans font-bold text-zinc-50 text-sm">Elena Rostova</h4>
                <p className="font-mono text-[9px] text-zinc-400">SRE Specialist Level 4</p>
                <p className="font-mono text-[9px] text-brand-cyan uppercase tracking-wider font-bold">Clearance Level Alpha</p>
              </div>
            </div>

            {/* PGP Public Key Slot */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase text-zinc-400 block font-bold">Cryptographic Credentials</span>
              <div className="border border-dashed border-zinc-800 bg-[#050b14] hover:bg-[#070e1b] hover:border-cyan-500/30 p-3.5 rounded text-center cursor-pointer transition-all">
                <span className="text-[10px] font-mono text-zinc-500 block uppercase">Drag-and-Drop PGP Public Key File</span>
                <span className="text-[8px] font-mono text-zinc-600 block mt-1">Accepts .asc or .pub keys for digital work orders</span>
              </div>
            </div>

            {/* Offline sync log stats */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase text-zinc-400 block font-bold">Offline Client Sync Monitor</span>
              <div className="bg-zinc-950 p-3.5 border border-zinc-800 rounded text-[10px] font-mono space-y-1.5">
                <div className="flex justify-between text-zinc-500">
                  <span>Last database pull:</span>
                  <span className="text-zinc-300">Just Now</span>
                </div>
                <div className="flex justify-between text-zinc-500">
                  <span>Unsent Offline Updates:</span>
                  <span className="text-emerald-400 font-bold">0 Pending</span>
                </div>
                <div className="flex justify-between text-zinc-500">
                  <span>Service Worker Status:</span>
                  <span className="text-emerald-400 font-bold">ACTIVE &amp; PRE-CACHED</span>
                </div>
              </div>
            </div>

          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-6 space-y-6">
            <div>
              <h3 className="font-mono text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">Hardware &amp; Database State</h3>
              <p className="text-zinc-500 text-xs">Diagnostic reports mapping direct virtual machine states and database integrity metrics.</p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-zinc-800/40">
                <span className="text-xs font-mono text-zinc-400">SRE Database Sync</span>
                <span className="text-xs font-mono font-bold text-green-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> SECURE
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-zinc-800/40">
                <span className="text-xs font-mono text-zinc-400">Firebase Cloud Storage</span>
                <span className="text-xs font-mono font-bold text-green-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> CONNECTED
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-zinc-800/40">
                <span className="text-xs font-mono text-zinc-400">Memory Load (VM)</span>
                <span className="text-xs font-mono font-bold text-zinc-200">14.2%</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-zinc-800/40">
                <span className="text-xs font-mono text-zinc-400">Active WebSocket Links</span>
                <span className="text-xs font-mono font-bold text-brand-orange">12 Nodes</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-xs font-mono text-zinc-400">Current Node Latency</span>
                <span className="text-xs font-mono font-bold text-zinc-200">8 ms</span>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800/40 space-y-2">
              <span className="text-[10px] font-mono text-zinc-500 block uppercase">Client Environment Info</span>
              <p className="text-[10px] font-mono text-zinc-600">BEECARBONAT Core Engine v3.45 • Browser Session Ref: {Math.random().toString(16).substr(2, 6).toUpperCase()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
