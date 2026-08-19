import { useState } from 'react';
import { ExternalLink, LayoutGrid, Monitor, ChevronLeft, ChevronRight } from 'lucide-react';

const TEMPLATES = [
  { id: 'accueil_cafm_pro', label: 'Accueil CAFM Pro', category: 'Landing' },
  { id: 'cafm_pro_home_hero_screen', label: 'Hero Screen', category: 'Landing' },
  { id: 'tableau_de_bord_principal', label: 'Dashboard Principal', category: 'Dashboard' },
  { id: 'cafm_pro_unified_management_dashboard', label: 'Unified Dashboard', category: 'Dashboard' },
  { id: 'analyses_avanc_es_big_data', label: 'Analyses Big Data', category: 'Analytics' },
  { id: 'gestion_des_actifs_bim', label: 'Gestion Actifs BIM', category: 'Assets' },
  { id: 'ordres_de_travail_maintenance', label: 'Ordres de Travail', category: 'Maintenance' },
  { id: 'consommation_nerg_tique', label: 'Consommation Énergétique', category: 'Energy' },
  { id: 'gestion_d_quipe', label: 'Gestion d\'Équipe', category: 'Team' },
  { id: 'rapports_documentation', label: 'Rapports & Documentation', category: 'Reports' },
  { id: 's_curit_contr_le_d_acc_s', label: 'Sécurité & Contrôle d\'Accès', category: 'Security' },
  { id: 's_curit_beecarbonat', label: 'Sécurité Beecarbonat', category: 'Security' },
  { id: 'cafm_pro_security_future_tech', label: 'Security Future Tech', category: 'Security' },
  { id: 'tarification_cafm_pro', label: 'Tarification CAFM Pro', category: 'Landing' },
  { id: 'tarification_beecarbonat', label: 'Tarification Beecarbonat', category: 'Landing' },
  { id: 'tudes_de_cas_cafm_pro', label: 'Études de Cas', category: 'Landing' },
  { id: 'cafm_pro_pricing_plans', label: 'Pricing Plans', category: 'Landing' },
  { id: 'solutions_cafm_pro', label: 'Solutions CAFM Pro', category: 'Landing' },
  { id: 'kinetic_infrastructure', label: 'Kinetic Infrastructure', category: 'Dashboard' },
  { id: 'centre_d_aide', label: 'Centre d\'Aide', category: 'Other' },
  { id: 'configuration_syst_me', label: 'Configuration Système', category: 'Settings' },
  { id: 'hero_beecarbonat', label: 'Hero Beecarbonat', category: 'Landing' },
  { id: 'shader', label: 'Shader Background', category: 'Other' },
];

const CATEGORIES = ['All', ...Array.from(new Set(TEMPLATES.map(t => t.category)))];

const CATEGORY_COLORS = {
  'Landing': 'bg-brand-cyan/20 text-brand-cyan border-brand-cyan/30',
  'Dashboard': 'bg-brand-orange/20 text-brand-orange border-brand-orange/30',
  'Analytics': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'Assets': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'Maintenance': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  'Energy': 'bg-green-500/20 text-green-400 border-green-500/30',
  'Team': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Reports': 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  'Security': 'bg-rose-500/20 text-rose-400 border-rose-500/30',
  'Settings': 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30',
  'Other': 'bg-zinc-700/20 text-zinc-500 border-zinc-700/30',
};

export default function HtmlDesignGallery() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selected, setSelected] = useState(TEMPLATES[2]); // default: dashboard principal
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const filtered = activeCategory === 'All'
    ? TEMPLATES
    : TEMPLATES.filter(t => t.category === activeCategory);

  const srcUrl = `/dashboard_html/${selected.id}/code.html`;

  return (
    <div className="h-[calc(100vh-64px)] bg-zinc-950 text-zinc-100 flex flex-col overflow-hidden">

      {/* ---- Header ---- */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-zinc-800 shrink-0 bg-zinc-900/60 backdrop-blur">
        <div className="flex items-center gap-3">
          <LayoutGrid className="w-5 h-5 text-brand-cyan" />
          <h1 className="font-mono text-sm font-bold uppercase tracking-widest text-zinc-100">
            UI Design Gallery
          </h1>
          <span className="text-[10px] font-mono px-2 py-0.5 bg-brand-orange/20 text-brand-orange border border-brand-orange/30 rounded uppercase">
            {TEMPLATES.length} templates
          </span>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={srcUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 text-xs font-mono rounded transition"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Ouvrir dans un onglet
          </a>
          <button
            onClick={() => setSidebarOpen(o => !o)}
            className="flex items-center gap-1 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-400 text-xs font-mono rounded transition"
          >
            {sidebarOpen ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            {sidebarOpen ? 'Masquer' : 'Galerie'}
          </button>
        </div>
      </div>

      {/* ---- Body ---- */}
      <div className="flex flex-1 overflow-hidden">

        {/* ---- Sidebar ---- */}
        {sidebarOpen && (
          <aside className="w-72 shrink-0 border-r border-zinc-800 bg-zinc-900/40 flex flex-col overflow-hidden">
            {/* Category filter */}
            <div className="p-3 border-b border-zinc-800 flex flex-wrap gap-1.5">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded border transition ${
                    activeCategory === cat
                      ? 'bg-brand-cyan/20 text-brand-cyan border-brand-cyan/40'
                      : 'bg-transparent text-zinc-500 border-zinc-700 hover:border-zinc-500'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Template list */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {filtered.map(t => (
                <button
                  key={t.id}
                  onClick={() => setSelected(t)}
                  className={`w-full text-left px-3 py-2.5 rounded text-xs font-mono transition group flex items-center justify-between ${
                    selected.id === t.id
                      ? 'bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan'
                      : 'bg-transparent text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 border border-transparent'
                  }`}
                >
                  <span className="flex items-center gap-2 min-w-0">
                    <Monitor className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{t.label}</span>
                  </span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded border font-mono uppercase shrink-0 ml-2 ${CATEGORY_COLORS[t.category] || ''}`}>
                    {t.category}
                  </span>
                </button>
              ))}
            </div>
          </aside>
        )}

        {/* ---- IFrame Viewer ---- */}
        <div className="flex-1 flex flex-col overflow-hidden bg-zinc-950">
          <div className="px-4 py-2 border-b border-zinc-800 bg-zinc-900/30 flex items-center gap-3 shrink-0">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500" />
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
            </div>
            <span className="text-xs font-mono text-zinc-500 flex-1 truncate">{srcUrl}</span>
            <span className={`text-[9px] px-1.5 py-0.5 rounded border font-mono uppercase ${CATEGORY_COLORS[selected.category] || ''}`}>
              {selected.category}
            </span>
          </div>
          <iframe
            key={selected.id}
            src={srcUrl}
            title={selected.label}
            className="flex-1 w-full border-0"
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      </div>
    </div>
  );
}
