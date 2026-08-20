import { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import {
  Store, Package, Star, Download, CheckCircle2, XCircle,
  Search, Filter, Shield, Zap, BarChart3, Globe, Wrench,
  Box, Cpu, Clock, ExternalLink, Plus
} from 'lucide-react';

const CATEGORIES = [
  { value: '', label: 'Toutes les extensions' },
  { value: 'INTEGRATION', label: '🔌 Intégrations ERP/IoT' },
  { value: 'ANALYTICS', label: '📊 Analytics & BI' },
  { value: 'COMPLIANCE', label: '🛡️ Conformité & ESG' },
  { value: 'AUTOMATION', label: '⚡ Automatisation' },
  { value: 'COMMUNICATION', label: '💬 Communication' },
];

// Extensions de démonstration (catalogue interne)
const DEMO_EXTENSIONS = [
  {
    id: 'ext-sap-connector',
    name: 'SAP RFC Connector',
    slug: 'sap-rfc-connector',
    description: 'Synchronisation bidirectionnelle avec SAP PM (Plant Maintenance) et SAP RE-FX. Assets, Work Orders, factures.',
    category: 'INTEGRATION',
    version: '2.1.0',
    authorName: 'beecarbonit Labs',
    rating: 4.8,
    installCount: 142,
    price: 0,
    tags: ['SAP', 'ERP', 'PM', 'RE-FX'],
    status: 'APPROVED',
    sandboxPassed: true,
    icon: '🏭',
    featured: true
  },
  {
    id: 'ext-power-bi',
    name: 'Power BI Embed',
    slug: 'power-bi-embed',
    description: 'Intégration native Microsoft Power BI — publiez vos dashboards directement dans beecarbonit.',
    category: 'ANALYTICS',
    version: '1.4.2',
    authorName: 'beecarbonit Labs',
    rating: 4.6,
    installCount: 89,
    price: 0,
    tags: ['Microsoft', 'BI', 'Dashboard'],
    status: 'APPROVED',
    sandboxPassed: true,
    icon: '📊',
    featured: false
  },
  {
    id: 'ext-docusign',
    name: 'DocuSign e-Signature',
    slug: 'docusign-esign',
    description: 'Signature électronique certifiée eIDAS pour vos ordres de travail, contrats de bail et rapports ESG.',
    category: 'COMPLIANCE',
    version: '3.0.1',
    authorName: 'DocuSign Inc.',
    rating: 4.9,
    installCount: 218,
    price: 29,
    tags: ['Signature', 'eIDAS', 'Contrats'],
    status: 'APPROVED',
    sandboxPassed: true,
    icon: '✍️',
    featured: true
  },
  {
    id: 'ext-ms-teams',
    name: 'Microsoft Teams Alerts',
    slug: 'ms-teams-alerts',
    description: 'Envoyez des alertes IoT, notifications de pannes et rapports hebdomadaires directement dans vos canaux Teams.',
    category: 'COMMUNICATION',
    version: '1.2.0',
    authorName: 'beecarbonit Labs',
    rating: 4.5,
    installCount: 176,
    price: 0,
    tags: ['Teams', 'Alertes', 'Microsoft'],
    status: 'APPROVED',
    sandboxPassed: true,
    icon: '💬',
    featured: false
  },
  {
    id: 'ext-bacnet',
    name: 'BACnet/IP Gateway',
    slug: 'bacnet-ip-gateway',
    description: 'Connectez vos équipements CVC, GTB et systèmes de contrôle BMS via le protocole BACnet/IP (ISO 16484-5).',
    category: 'INTEGRATION',
    version: '1.0.4',
    authorName: 'IoT Solutions GmbH',
    rating: 4.3,
    installCount: 54,
    price: 49,
    tags: ['BACnet', 'CVC', 'GTB', 'IoT'],
    status: 'APPROVED',
    sandboxPassed: true,
    icon: '🌐',
    featured: false
  },
  {
    id: 'ext-predictive-ml',
    name: 'Predictive Maintenance ML',
    slug: 'predictive-ml',
    description: 'Modèle de Machine Learning entraîné sur 2M+ interventions HVAC. Prédit les pannes 14 jours à l\'avance avec 87% de précision.',
    category: 'AUTOMATION',
    version: '2.0.0-beta',
    authorName: 'beecarbonit AI',
    rating: 4.7,
    installCount: 31,
    price: 99,
    tags: ['ML', 'Prédictif', 'HVAC', 'IA'],
    status: 'APPROVED',
    sandboxPassed: true,
    icon: '🤖',
    featured: true
  },
];

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} className={`w-3 h-3 ${i <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-zinc-700'}`} />
      ))}
      <span className="text-[10px] text-zinc-500 ml-1 font-mono">{rating.toFixed(1)}</span>
    </div>
  );
}

export default function Marketplace() {
  const [extensions, setExtensions] = useState(DEMO_EXTENSIONS);
  const [installed, setInstalled] = useState(new Set());
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState({});
  const [activeTab, setActiveTab] = useState('catalog'); // catalog | installed | submit

  useEffect(() => {
    loadInstalled();
  }, []);

  const loadInstalled = async () => {
    try {
      const { data } = await api.get('/marketplace/installed');
      const ids = new Set((data.installed || []).map(i => i.extensionId));
      setInstalled(ids);
    } catch {
      // En mode démo, on ne charge rien
    }
  };

  const handleInstall = async (ext) => {
    setLoading(prev => ({ ...prev, [ext.id]: true }));
    try {
      await api.post(`/marketplace/extensions/${ext.id}/install`);
      setInstalled(prev => new Set([...prev, ext.id]));
      toast.success(`✅ ${ext.name} installée avec succès !`);
    } catch {
      // Démo : simulation
      setInstalled(prev => new Set([...prev, ext.id]));
      toast.success(`✅ ${ext.name} installée (mode démo) !`);
    } finally {
      setLoading(prev => ({ ...prev, [ext.id]: false }));
    }
  };

  const handleUninstall = async (ext) => {
    setLoading(prev => ({ ...prev, [ext.id]: true }));
    try {
      await api.post(`/marketplace/extensions/${ext.id}/uninstall`);
      setInstalled(prev => { const s = new Set(prev); s.delete(ext.id); return s; });
      toast.success(`Extension ${ext.name} désinstallée.`);
    } catch {
      setInstalled(prev => { const s = new Set(prev); s.delete(ext.id); return s; });
      toast.success(`Extension ${ext.name} désinstallée (démo).`);
    } finally {
      setLoading(prev => ({ ...prev, [ext.id]: false }));
    }
  };

  const filteredExtensions = extensions.filter(e => {
    const matchSearch = !search || e.name.toLowerCase().includes(search.toLowerCase()) || e.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = !category || e.category === category;
    return matchSearch && matchCat;
  });

  const featuredExtensions = extensions.filter(e => e.featured);
  const installedExtensions = extensions.filter(e => installed.has(e.id));

  return (
    <div className="p-6 md:p-8 min-h-screen bg-zinc-950 text-zinc-100 font-sans space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-widest text-zinc-50 flex items-center gap-2">
            <Store className="w-7 h-7 text-purple-400" />
            Marketplace — Extensions & Connecteurs
          </h1>
          <p className="text-xs font-mono text-zinc-400 mt-1">
            {extensions.length} extensions certifiées • Revenue sharing 70/30 pour les partenaires
          </p>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-3 py-1.5 bg-emerald-950/40 border border-emerald-500/30 text-emerald-400">
            ✓ {installed.size} installée(s)
          </span>
          <button onClick={() => setActiveTab('submit')}
            className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold uppercase transition">
            <Plus className="w-3.5 h-3.5" /> Soumettre une Extension
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-zinc-800 font-mono text-xs">
        {[
          { id: 'catalog', label: `📦 Catalogue (${extensions.length})` },
          { id: 'installed', label: `✅ Installées (${installed.size})` },
          { id: 'submit', label: '🚀 Soumettre' },
        ].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2.5 border-b-2 transition -mb-px ${activeTab === t.id ? 'border-purple-500 text-purple-400' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Catalog Tab */}
      {activeTab === 'catalog' && (
        <div className="space-y-6">
          {/* Featured */}
          {!search && !category && (
            <div>
              <h2 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-3 font-bold">⭐ Extensions Phares</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {featuredExtensions.map(ext => (
                  <div key={ext.id} className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 border border-purple-500/20 p-4 space-y-3 hover:border-purple-500/50 transition">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{ext.icon}</span>
                        <div>
                          <p className="font-bold text-sm text-zinc-100">{ext.name}</p>
                          <p className="text-[10px] font-mono text-zinc-500">{ext.authorName}</p>
                        </div>
                      </div>
                      <span className="text-[9px] px-1.5 py-0.5 bg-purple-950/50 border border-purple-500/30 text-purple-400 font-mono uppercase">
                        {ext.price === 0 ? 'Gratuit' : `${ext.price}€/mois`}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 line-clamp-2">{ext.description}</p>
                    <div className="flex items-center justify-between">
                      <StarRating rating={ext.rating} />
                      <span className="text-[10px] font-mono text-zinc-600 flex items-center gap-1">
                        <Download className="w-3 h-3" /> {ext.installCount}
                      </span>
                    </div>
                    <button
                      onClick={() => installed.has(ext.id) ? handleUninstall(ext) : handleInstall(ext)}
                      disabled={loading[ext.id]}
                      className={`w-full py-1.5 text-xs font-bold font-mono uppercase transition ${installed.has(ext.id)
                        ? 'bg-zinc-800 hover:bg-red-950/50 text-zinc-400 hover:text-red-400 border border-zinc-700 hover:border-red-500/40'
                        : 'bg-purple-600 hover:bg-purple-500 text-white'}`}>
                      {loading[ext.id] ? '...' : installed.has(ext.id) ? '✓ Installée — Désinstaller' : 'Installer'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search & Filter */}
          <div className="flex gap-3 flex-col sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher une extension..."
                className="w-full bg-zinc-900 border border-zinc-800 pl-9 pr-4 py-2 text-sm text-zinc-200 focus:outline-none focus:border-purple-500" />
            </div>
            <select value={category} onChange={e => setCategory(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-purple-500">
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>

          {/* Extension List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredExtensions.map(ext => (
              <div key={ext.id} className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 p-4 flex gap-4 transition">
                <span className="text-3xl shrink-0">{ext.icon}</span>
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-bold text-sm text-zinc-100">{ext.name}
                        <span className="ml-2 text-[9px] font-mono text-zinc-600">v{ext.version}</span>
                      </p>
                      <p className="text-[10px] font-mono text-zinc-500">{ext.authorName}</p>
                    </div>
                    <span className="text-[9px] shrink-0 px-2 py-0.5 bg-zinc-800 border border-zinc-700 text-zinc-400 font-mono">
                      {ext.price === 0 ? 'Gratuit' : `${ext.price}€/mo`}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 line-clamp-2">{ext.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {ext.tags.map(t => (
                      <span key={t} className="text-[9px] px-1.5 py-0.5 bg-zinc-800 text-zinc-500 font-mono">{t}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-3">
                      <StarRating rating={ext.rating} />
                      <span className="text-[10px] text-zinc-600 font-mono flex items-center gap-1">
                        <Download className="w-3 h-3" /> {ext.installCount}
                      </span>
                      {ext.sandboxPassed && (
                        <span className="text-[9px] text-emerald-500 font-mono flex items-center gap-0.5">
                          <Shield className="w-2.5 h-2.5" /> Certifié
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => installed.has(ext.id) ? handleUninstall(ext) : handleInstall(ext)}
                      disabled={loading[ext.id]}
                      className={`px-3 py-1 text-[10px] font-bold font-mono uppercase transition ${installed.has(ext.id)
                        ? 'text-emerald-400 border border-emerald-500/40 hover:border-red-500/40 hover:text-red-400'
                        : 'bg-purple-600 hover:bg-purple-500 text-white'}`}>
                      {loading[ext.id] ? '...' : installed.has(ext.id) ? '✓ Installée' : 'Installer'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Installed Tab */}
      {activeTab === 'installed' && (
        <div className="space-y-4">
          {installedExtensions.length === 0 ? (
            <div className="text-center py-16 text-zinc-600 font-mono">
              <Package className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>Aucune extension installée.</p>
              <button onClick={() => setActiveTab('catalog')} className="mt-4 text-purple-400 hover:text-purple-300 text-xs underline">
                Parcourir le catalogue
              </button>
            </div>
          ) : installedExtensions.map(ext => (
            <div key={ext.id} className="bg-zinc-900 border border-emerald-500/20 p-4 flex items-center gap-4">
              <span className="text-2xl">{ext.icon}</span>
              <div className="flex-1">
                <p className="font-bold text-sm text-zinc-100">{ext.name} <span className="text-[10px] font-mono text-zinc-600">v{ext.version}</span></p>
                <p className="text-xs text-zinc-400">{ext.description}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Active
                </span>
                <button onClick={() => handleUninstall(ext)}
                  className="text-[10px] font-mono text-zinc-500 hover:text-red-400 transition flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5" /> Désinstaller
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Submit Tab */}
      {activeTab === 'submit' && (
        <div className="max-w-2xl space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 p-6 space-y-2">
            <h2 className="font-bold text-zinc-100 flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-400" /> Programme Partenaires beecarbonit
            </h2>
            <p className="text-sm text-zinc-400">Soumettez votre extension et accédez au marché de plus de 1000 gestionnaires de bâtiments. Revenue sharing 70% pour les partenaires.</p>
            <div className="grid grid-cols-3 gap-3 pt-3 font-mono text-xs">
              {[
                { v: '70%', l: 'Revenue Share' },
                { v: '5-10j', l: 'Délai Review' },
                { v: '100%', l: 'RGPD-ready' },
              ].map(m => (
                <div key={m.l} className="bg-zinc-950 border border-zinc-800 p-3 text-center">
                  <p className="text-lg font-bold text-purple-400">{m.v}</p>
                  <p className="text-zinc-500 text-[10px] uppercase">{m.l}</p>
                </div>
              ))}
            </div>
          </div>
          <form className="bg-zinc-900 border border-zinc-800 p-6 space-y-4" onSubmit={e => { e.preventDefault(); toast.success('Candidature soumise ! L\'équipe beecarbonit vous contactera sous 48h.'); }}>
            <h3 className="font-bold text-sm text-zinc-200 uppercase font-mono">Formulaire de Soumission</h3>
            {[
              { name: 'name', placeholder: 'Nom de l\'extension', label: 'Nom *' },
              { name: 'authorName', placeholder: 'Nom ou société', label: 'Auteur *' },
              { name: 'authorEmail', placeholder: 'contact@votresociete.com', label: 'Email de contact *' },
              { name: 'repoUrl', placeholder: 'https://github.com/...', label: 'Dépôt Git public' },
            ].map(f => (
              <div key={f.name}>
                <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-1.5">{f.label}</label>
                <input required={f.label.includes('*')} name={f.name} placeholder={f.placeholder}
                  className="w-full bg-zinc-950 border border-zinc-700 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-purple-500" />
              </div>
            ))}
            <div>
              <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-1.5">Description *</label>
              <textarea required rows={3} placeholder="Décrivez ce que fait votre extension et sa valeur ajoutée pour les FM..."
                className="w-full bg-zinc-950 border border-zinc-700 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-purple-500 resize-none" />
            </div>
            <button type="submit"
              className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold font-mono text-xs uppercase transition">
              Soumettre ma Candidature →
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
