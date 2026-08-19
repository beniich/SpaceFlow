import { useState } from 'react';
import {
  Settings as SettingsIcon, Shield, Bell, Key, Database, CheckCircle2,
  Building, Mail, Users, Globe, ToggleLeft, ToggleRight, Server, Cloud, Cpu, Save, RefreshCw, Plus, Trash
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('PROFILE');
  const [saving, setSaving] = useState(false);

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
