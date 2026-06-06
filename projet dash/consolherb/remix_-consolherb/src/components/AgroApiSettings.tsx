import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Key, 
  Copy, 
  Check, 
  RotateCcw, 
  Eye, 
  EyeOff, 
  Globe, 
  Settings, 
  Plus, 
  Activity, 
  CheckCircle,
  Cpu,
  Trash2,
  Plug
} from 'lucide-react';

interface KeyConfig {
  id: string;
  name: string;
  created: string;
  value: string;
  masked: boolean;
}

interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string;
  status: 'active' | 'inactive';
}

export default function AgroApiSettings({ onAddLog }: { onAddLog: (level: 'info' | 'success' | 'warn' | 'error', message: string) => void }) {
  // Setup standard stateful tokens
  const [tokens, setTokens] = useState<KeyConfig[]>([
    { id: 't1', name: 'Production API Key', created: 'Oct 25, 2023', value: 'mock_live_fg84j2k8so0293asdf999asd', masked: true },
    { id: 't2', name: 'Development Key', created: 'Nov 12, 2023', value: 'mock_test_hkas038djsk8844asdf03kl2', masked: true }
  ]);

  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  // Setup Webhook endpoints
  const [webhooks, setWebhooks] = useState<Webhook[]>([
    { id: 'w1', name: 'Order Updates Endpoint', url: 'https://api.agromaitre.com/webhooks/orders', events: 'order.created, order.updated', status: 'active' }
  ]);

  const [showWebhookModal, setShowWebhookModal] = useState(false);
  const [newWebhookName, setNewWebhookName] = useState('');
  const [newWebhookUrl, setNewWebhookUrl] = useState('');
  
  // Custom interactive Integrations
  const [glpiConnected, setGlpiConnected] = useState(false);
  const [stripeConnected, setStripeConnected] = useState(true);

  // Handle keys show/hide values toggle
  const handleToggleMask = (keyId: string) => {
    setTokens(prev => prev.map(t => {
      if (t.id === keyId) {
        onAddLog('info', `API_SETTINGS: Jeton de sécurité "${t.name}" ${!t.masked ? 'masqué' : 'affiché'}`);
        return { ...t, masked: !t.masked };
      }
      return t;
    }));
  };

  // Handle keys regeneration
  const handleRegenerate = (keyId: string, keyName: string) => {
    const randomSuffix = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
    const prefix = keyName.toLowerCase().includes('production') ? 'mock_live_' : 'mock_test_';
    const newVal = `${prefix}${randomSuffix}`;

    setTokens(prev => prev.map(t => {
      if (t.id === keyId) {
        onAddLog('warn', `API_SETTINGS: Le jeton "${t.name}" a été regénéré.`);
        return { ...t, value: newVal, created: 'Today (Regenerated)' };
      }
      return t;
    }));
  };

  // Handle copy to Clipboard
  const handleCopyToClipboard = (keyId: string, rawText: string) => {
    navigator.clipboard.writeText(rawText);
    setCopiedKeyId(keyId);
    onAddLog('success', 'API_SETTINGS: Jeton copié dans le presse-papier.');
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  // Create token
  const handleAddToken = () => {
    const freshTokenKey = 't_' + Date.now();
    const subVal = 'mock_test_' + Math.random().toString(36).substring(2, 12) + Math.random().toString(36).substring(2, 10);
    const newTok: KeyConfig = {
      id: freshTokenKey,
      name: `Custom Dev Key #${tokens.length + 1}`,
      created: 'Today',
      value: subVal,
      masked: true
    };
    setTokens(prev => [...prev, newTok]);
    onAddLog('success', `API_SETTINGS: Nouveau jeton de test créé avec succès.`);
  };

  // Toggle webhook status
  const handleToggleWebhookStatus = (id: string, name: string) => {
    setWebhooks(prev => prev.map(w => {
      if (w.id === id) {
        const nextStatus = w.status === 'active' ? 'inactive' : 'active';
        onAddLog('info', `API_SETTINGS: Webhook "${name}" configuré sur [${nextStatus.toUpperCase()}]`);
        return { ...w, status: nextStatus };
      }
      return w;
    }));
  };

  // Handle Webhook creation
  const handleSaveWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWebhookName || !newWebhookUrl) return;

    const freshW: Webhook = {
      id: 'w_' + Date.now(),
      name: newWebhookName,
      url: newWebhookUrl,
      events: 'sensor.alerts, climate.breach',
      status: 'active'
    };

    setWebhooks(prev => [...prev, freshW]);
    setShowWebhookModal(false);
    setNewWebhookName('');
    setNewWebhookUrl('');
    onAddLog('success', `API_SETTINGS: Nouveau récepteur de webhook rattaché : "${freshW.name}"`);
  };

  return (
    <div className="bg-[#FAF9F5] text-stone-800 p-6 rounded-[28px] border border-[#e1d5c1] font-sans shadow-md" id="agro-api-settings">
      
      {/* Brand Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#e1d5c1] pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-[#1c2c3e] to-[#0d151c] rounded-xl flex items-center justify-center text-white text-lg font-bold">
            <Key className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-serif font-bold text-[#111c24]">API & Integration Management Settings</span>
              <span className="text-[9px] bg-[#e3ebf3] text-[#1c2c3e] border border-[#cbd9e7] px-2.5 py-0.5 rounded-full font-mono font-bold uppercase tracking-tight">Security Gateway</span>
            </div>
            <p className="text-xs text-stone-500 font-mono uppercase">Manage API keys, webhooks endpoints, and third-party SaaS integrations securely</p>
          </div>
        </div>

        <span className="text-[9.5px] font-mono font-bold bg-stone-100 text-stone-500 border px-3 py-1 rounded-full uppercase">
          FIPS 140-3 Standard
        </span>
      </header>

      {/* Primary Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Side Col: API Keys Security */}
        <div className="bg-white p-6 rounded-2xl border border-[#e1d5c1]/60 space-y-6">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="font-serif font-bold text-[#111c24] text-sm flex items-center gap-2">
              <Key className="w-4 h-4 text-[#BC542B]" />
              <span>Cryptographic API Credentials</span>
            </h3>
            <span className="text-[9px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-sm font-bold uppercase">
              SSL Sealed
            </span>
          </div>

          <div className="space-y-4">
            {tokens.map(tk => {
              const displayVal = tk.masked 
                ? `${tk.value.substring(0, 8)}••••••••••••••••••••` 
                : tk.value;

              return (
                <div key={tk.id} className="p-4 border border-[#e1d5c1]/60 rounded-xl space-y-3 bg-[#FAF9F5]/45 hover:shadow-xs transition duration-200">
                  <div className="flex justify-between items-center sm:gap-4">
                    <div>
                      <span className="text-xs font-serif font-bold text-stone-850">{tk.name}</span>
                      <p className="text-[9px] font-mono text-stone-400">Created: {tk.created}</p>
                    </div>

                    <div className="flex gap-1.5 shrink-0">
                      <button
                        onClick={() => handleCopyToClipboard(tk.id, tk.value)}
                        className="px-2.5 py-1.5 bg-white border border-stone-200 hover:bg-stone-100 shadow-xs rounded-lg text-[9.5px] font-mono font-bold uppercase transition flex items-center gap-1 cursor-pointer active:scale-95"
                      >
                        {copiedKeyId === tk.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-500" />
                            <span className="text-emerald-500">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-stone-500" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 bg-white border border-stone-200 px-3 py-2 rounded-lg font-mono text-xs text-stone-600">
                    <span className="truncate max-w-[200px] sm:max-w-[320px] select-all font-mono font-bold tracking-wider">{displayVal}</span>
                    <div className="flex gap-2.5 shrink-0 pr-0.5 select-none text-[10.5px]">
                      <button
                        onClick={() => handleToggleMask(tk.id)}
                        className="text-stone-450 hover:text-[#BC542B] font-semibold transition cursor-pointer flex items-center gap-0.5"
                      >
                        {tk.masked ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        <span>{tk.masked ? 'Show' : 'Hide'}</span>
                      </button>
                      <button
                        onClick={() => handleRegenerate(tk.id, tk.name)}
                        className="text-stone-450 hover:text-red-500 transition cursor-pointer flex items-center gap-0.5"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Regen</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={handleAddToken}
            className="w-full py-3 bg-[#BC542B] hover:bg-[#a33f1b] text-white rounded-xl text-xs font-mono font-bold uppercase transition active:scale-97 cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Token</span>
          </button>
        </div>

        {/* Right Side Col: Webhooks & SaaS Integrations */}
        <div className="space-y-6">
          
          {/* Webhook Configuration Block */}
          <div className="bg-white p-6 rounded-2xl border border-[#e1d5c1]/60 space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-serif font-bold text-[#111c24] text-sm flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#BC542B]" />
                <span>Webhook Recipient Gateway</span>
              </h3>
              <span className="text-[10px] font-mono text-stone-400">REST Specs</span>
            </div>

            <div className="space-y-3">
              {webhooks.map(wh => (
                <div key={wh.id} className="p-4 border border-[#e1d5c1]/40 rounded-xl space-y-3 bg-[#FAF9F5]/40 relative overflow-hidden">
                  <div className="flex justify-between items-center">
                    <span className="font-serif font-bold text-xs text-stone-800">{wh.name}</span>
                    <button
                      onClick={() => handleToggleWebhookStatus(wh.id, wh.name)}
                      className={`text-[8px] font-mono uppercase font-bold px-2.5 py-1 rounded-full border cursor-pointer select-none ${
                        wh.status === 'active' 
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                          : 'bg-stone-100 text-stone-400 border-stone-200'
                      }`}
                    >
                      <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1 ${wh.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-stone-300'}`} />
                      {wh.status === 'active' ? 'Active' : 'Inactive'}
                    </button>
                  </div>

                  <div className="font-mono text-[10px] leading-relaxed break-all bg-white border border-stone-150 p-2 rounded-lg text-stone-500">
                    <div><span className="text-stone-300">URL:</span> {wh.url}</div>
                    <div className="mt-1"><span className="text-stone-300">Events:</span> {wh.events}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Simulated webhook adding trigger */}
            {!showWebhookModal ? (
              <button
                onClick={() => setShowWebhookModal(true)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-[#BC542B] rounded-xl text-xs font-mono font-bold uppercase transition flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Webhook</span>
              </button>
            ) : (
              <motion.form 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSaveWebhook}
                className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3"
              >
                <div>
                  <label className="block text-[9.5px] font-mono uppercase text-stone-500 font-bold mb-1">Webhook Name</label>
                  <input
                    type="text"
                    required
                    value={newWebhookName}
                    onChange={(e) => setNewWebhookName(e.target.value)}
                    className="w-full bg-white border text-xs p-2 rounded-lg outline-none font-mono"
                    placeholder="e.g., Moisture Emergency Alert"
                  />
                </div>
                <div>
                  <label className="block text-[9.5px] font-mono uppercase text-stone-500 font-bold mb-1">Callback URL</label>
                  <input
                    type="url"
                    required
                    value={newWebhookUrl}
                    onChange={(e) => setNewWebhookUrl(e.target.value)}
                    className="w-full bg-white border text-xs p-2 rounded-lg outline-none font-mono"
                    placeholder="https://yourserver.com/endpoint"
                  />
                </div>
                <div className="flex gap-2 justify-end pt-1">
                  <button 
                    type="button" 
                    onClick={() => setShowWebhookModal(false)}
                    className="px-3 py-1.5 text-[10px] uppercase font-mono font-bold text-stone-500 hover:text-stone-700"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-1.5 text-[10px] uppercase font-mono font-bold bg-[#BC542B] text-white rounded-lg"
                  >
                    Register
                  </button>
                </div>
              </motion.form>
            )}
          </div>

          {/* Third-Party Integrations Connected Panel */}
          <div className="bg-white p-6 rounded-2xl border border-[#e1d5c1]/60 space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-serif font-bold text-[#111c24] text-sm flex items-center gap-2">
                <Plug className="w-4 h-4 text-[#BC542B]" />
                <span>Third-Party Core Connectors</span>
              </h3>
              <span className="text-[10px] font-mono text-stone-400">SaaS Hub</span>
            </div>

            <div className="space-y-3">
              {/* Connector 1: GLPI */}
              <div className="flex justify-between items-center p-4 border border-stone-150 rounded-xl bg-stone-50/20">
                <div>
                  <span className="text-xs font-serif font-extrabold text-stone-850">GLPI (IT Asset Management)</span>
                  <p className="text-[9px] font-mono text-stone-450 mt-0.5">Asset inventory logs tracking and auto-diagnostics</p>
                </div>

                <div className="flex items-center gap-3">
                  {glpiConnected ? (
                    <>
                      <span className="text-[10px] font-mono text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5 inline text-emerald-600" />
                        <span>Connected</span>
                      </span>
                      <button
                        onClick={() => {
                          setGlpiConnected(false);
                          onAddLog('warn', 'API_SETTINGS: Intégration GLPI retirée.');
                        }}
                        className="px-3 py-1.5 border hover:bg-stone-100 rounded-lg text-[9.5px] font-mono font-bold uppercase transition cursor-pointer"
                      >
                        Disconnect
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        setGlpiConnected(true);
                        onAddLog('success', 'API_SETTINGS: Connexion à GLPI Asset Management établie.');
                      }}
                      className="px-3.5 py-1.5 bg-[#BC542B] hover:bg-[#a33f1b] text-white rounded-lg text-[9.5px] font-mono font-bold uppercase shadow-sm transition active:scale-95 cursor-pointer"
                    >
                      Connect
                    </button>
                  )}
                </div>
              </div>

              {/* Connector 2: Stripe payments */}
              <div className="flex justify-between items-center p-4 border border-stone-150 rounded-xl bg-stone-50/20">
                <div>
                  <span className="text-xs font-serif font-extrabold text-stone-850">Stripe (E-Commerce Payments)</span>
                  <p className="text-[9px] font-mono text-stone-450 mt-0.5">Secure card checkout bindings for Herboferme Shop</p>
                </div>

                <div className="flex items-center gap-3">
                  {stripeConnected ? (
                    <>
                      <span className="text-[10px] font-mono text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Connected</span>
                      </span>
                      <button
                        onClick={() => {
                          setStripeConnected(false);
                          onAddLog('warn', 'API_SETTINGS: Compte Stripe temporairement découplé.');
                        }}
                        className="px-3.5 py-1.5 border hover:bg-stone-100 rounded-lg text-[9.5px] font-mono font-bold uppercase transition cursor-pointer"
                      >
                        Configure
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        setStripeConnected(true);
                        onAddLog('success', 'API_SETTINGS: Stripe Gateway activée.');
                      }}
                      className="px-3.5 py-1.5 bg-[#BC542B] hover:bg-[#a33f1b] text-white rounded-lg text-[9.5px] font-mono font-bold uppercase shadow-sm transition active:scale-95 cursor-pointer"
                    >
                      Connect
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          
        </div>

      </div>

    </div>
  );
}
