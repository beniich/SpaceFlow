import { useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Layers, CheckCircle2, ChevronRight, Building2, Heart, ShoppingBag, Server, GraduationCap, Factory, Zap, FileText, Shield, BarChart3, Plus } from 'lucide-react';

const SECTOR_PACKS = [
  {
    id: 'healthcare',
    name: 'Healthcare & Hôpitaux',
    slug: 'healthcare',
    vertical: 'SANTE',
    icon: Heart,
    color: 'text-rose-400',
    borderColor: 'border-rose-500/30',
    bgColor: 'bg-rose-950/20',
    glowColor: 'shadow-rose-900/30',
    description: 'Pack complet pour hôpitaux, cliniques et EHPAD. Conformité HAS, maintenance biomédicale, traçabilité réglementaire complète.',
    features: [
      'Gestion équipements biomédicaux (GMAO spécialisée)',
      'Workflows conformité HAS & HACCP',
      'Traçabilité stérilisation & hygiène',
      'Reporting réglementaire automatisé',
      'Alertes criticité patient-environnement',
      'Intégration PMSI / DMP (prévu)'
    ],
    workflows: 8,
    checklistTemplates: 24,
    reportTemplates: 12,
    pricing: 'PREMIUM',
    price: 299,
    clients: '47 établissements de santé',
    highlight: 'Certifié HAS'
  },
  {
    id: 'hospitality',
    name: 'Hôtellerie & Resorts',
    slug: 'hospitality',
    vertical: 'HOSPITALITY',
    icon: Building2,
    color: 'text-amber-400',
    borderColor: 'border-amber-500/30',
    bgColor: 'bg-amber-950/20',
    glowColor: 'shadow-amber-900/30',
    description: 'Pour hôtels, resorts et chaînes hôtelières. Gestion des demandes guests, maintenance préventive chambres, suivi énergétique par unité.',
    features: [
      'Gestion des demandes Guests (room service / maintenance)',
      'Suivi maintenance préventive par chambre',
      'Reporting énergie par unité / étage',
      'Intégration PMS (Opera, Fidelio)',
      'Conformité HACCP cuisine & restauration',
      'KPIs hôteliers (ADR, RevPAR, SLA housekeeping)'
    ],
    workflows: 12,
    checklistTemplates: 18,
    reportTemplates: 8,
    pricing: 'PREMIUM',
    price: 199,
    clients: '23 hôtels & resorts',
    highlight: 'Intégration PMS'
  },
  {
    id: 'retail',
    name: 'Retail & Grande Distribution',
    slug: 'retail',
    vertical: 'RETAIL',
    icon: ShoppingBag,
    color: 'text-blue-400',
    borderColor: 'border-blue-500/30',
    bgColor: 'bg-blue-950/20',
    glowColor: 'shadow-blue-900/30',
    description: 'Optimisé pour les réseaux de magasins, centres commerciaux et franchises. Multi-sites, conformité incendie, gestion frigorifique.',
    features: [
      'Gestion multi-sites (réseau de franchises)',
      'Conformité incendie & sécurité ERP',
      'Maintenance enceintes réfrigérées (HACCP)',
      'Suivi énergie par m² de surface commerciale',
      'Alertes température chaîne du froid',
      'Reporting tableau de bord réseau centralisé'
    ],
    workflows: 10,
    checklistTemplates: 20,
    reportTemplates: 6,
    pricing: 'PREMIUM',
    price: 149,
    clients: '89 enseignes retail',
    highlight: 'Multi-sites'
  },
  {
    id: 'datacenter',
    name: 'Data Centers & Télécom',
    slug: 'datacenter',
    vertical: 'INDUSTRIE',
    icon: Server,
    color: 'text-cyan-400',
    borderColor: 'border-cyan-500/30',
    bgColor: 'bg-cyan-950/20',
    glowColor: 'shadow-cyan-900/30',
    description: 'Pour data centers Tier II/III/IV, opérateurs télécom et hébergeurs. Suivi PUE, refroidissement, alimentation, conformité ISO 27001.',
    features: [
      'Monitoring PUE (Power Usage Effectiveness) en temps réel',
      'Gestion alimentation ondulée & groupes électrogènes',
      'Suivi refroidissement (CRAC/CRAH/adiabatique)',
      'Workflows changement de bande (ITIL-inspired)',
      'Conformité ISO 27001 & EN 50600',
      'Alertes criticité niveau 1/2/3'
    ],
    workflows: 15,
    checklistTemplates: 30,
    reportTemplates: 10,
    pricing: 'PREMIUM',
    price: 399,
    clients: '12 data centers',
    highlight: 'ISO 50600 Ready'
  },
  {
    id: 'education',
    name: 'Éducation & Campus',
    slug: 'education',
    vertical: 'EDUCATION',
    icon: GraduationCap,
    color: 'text-green-400',
    borderColor: 'border-green-500/30',
    bgColor: 'bg-green-950/20',
    glowColor: 'shadow-green-900/30',
    description: 'Universités, grandes écoles, campus multi-bâtiments. Gestion des salles, accessibilité PMR, maintenance préventive saisonnière.',
    features: [
      'Planning gestion des salles & amphithéâtres',
      'Conformité accessibilité PMR (Ad\'AP)',
      'Maintenance préventive saisonnière (intersemestre)',
      'Suivi patrimoine immobilier public',
      'Reporting développement durable campus',
      'Gestion mobilier & inventaire académique'
    ],
    workflows: 6,
    checklistTemplates: 15,
    reportTemplates: 7,
    pricing: 'CORE',
    price: 0,
    clients: '34 établissements',
    highlight: 'Gratuit'
  },
  {
    id: 'industrie',
    name: 'Industrie & Manufacture',
    slug: 'industrie',
    vertical: 'INDUSTRIE',
    icon: Factory,
    color: 'text-orange-400',
    borderColor: 'border-orange-500/30',
    bgColor: 'bg-orange-950/20',
    glowColor: 'shadow-orange-900/30',
    description: 'Sites de production, usines et plateformes logistiques. GMAO avancée, conformité ATEX, intégration SCADA/PLC.',
    features: [
      'GMAO machines de production (MTBF, MTTR)',
      'Conformité ATEX & zones classifiées',
      'Intégration SCADA / MES / PLC',
      'Gestion pièces de rechange critiques',
      'Arbre de défaillance (AMDEC)',
      'Consignation/déconsignation (LOTO)'
    ],
    workflows: 18,
    checklistTemplates: 35,
    reportTemplates: 9,
    pricing: 'PREMIUM',
    price: 249,
    clients: '18 sites industriels',
    highlight: 'ATEX Compliant'
  }
];

export default function SectorTemplates() {
  const [installing, setInstalling] = useState({});
  const [installed, setInstalled] = useState(new Set(['education'])); // Education gratuit par défaut

  const handleInstall = async (pack) => {
    if (pack.price > 0) {
      toast('Ce pack premium nécessite une mise à niveau. Contactez sales@beecarbonit.com', { icon: '💎', duration: 4000 });
      return;
    }
    setInstalling(p => ({ ...p, [pack.id]: true }));
    await new Promise(r => setTimeout(r, 1200));
    setInstalled(prev => new Set([...prev, pack.id]));
    toast.success(`Pack "${pack.name}" installé ! ${pack.workflows} workflows + ${pack.checklistTemplates} checklists activés.`);
    setInstalling(p => ({ ...p, [pack.id]: false }));
  };

  return (
    <div className="p-6 md:p-8 min-h-screen bg-zinc-950 text-zinc-100 font-sans space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-widest text-zinc-50 flex items-center gap-2">
            <Layers className="w-7 h-7 text-indigo-400" />
            Packs Sectoriels — Building OS
          </h1>
          <p className="text-xs font-mono text-zinc-400 mt-1">
            Des référentiels métier prêts à l'emploi — workflows, checklists et rapports préconfigurés pour votre secteur
          </p>
        </div>
        <div className="font-mono text-xs flex items-center gap-3">
          <span className="px-3 py-1.5 border border-indigo-500/30 text-indigo-400 bg-indigo-950/20">
            {installed.size} pack(s) actif(s)
          </span>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs">
        {[
          { icon: Layers, label: 'Packs disponibles', value: SECTOR_PACKS.length, color: 'text-indigo-400' },
          { icon: Zap, label: 'Workflows inclus', value: SECTOR_PACKS.reduce((s, p) => s + p.workflows, 0), color: 'text-amber-400' },
          { icon: FileText, label: 'Templates checklists', value: SECTOR_PACKS.reduce((s, p) => s + p.checklistTemplates, 0), color: 'text-cyan-400' },
          { icon: Shield, label: 'Conformités couvertes', value: '12+', color: 'text-emerald-400' },
        ].map(s => (
          <div key={s.label} className="bg-zinc-900 border border-zinc-800 p-4 flex items-center gap-3">
            <s.icon className={`w-5 h-5 ${s.color} shrink-0`} />
            <div>
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-zinc-500 text-[10px] uppercase">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Sector Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {SECTOR_PACKS.map(pack => {
          const isInstalled = installed.has(pack.id);
          const isInstalling = installing[pack.id];

          return (
            <div key={pack.id}
              className={`bg-zinc-900 border ${isInstalled ? 'border-emerald-500/30' : pack.borderColor} p-5 space-y-4 hover:shadow-lg ${pack.glowColor} transition-all duration-300 relative overflow-hidden`}>
              
              {/* Installed badge */}
              {isInstalled && (
                <div className="absolute top-3 right-3">
                  <span className="text-[9px] font-mono px-2 py-0.5 bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 uppercase">
                    ✓ Actif
                  </span>
                </div>
              )}

              {/* Header */}
              <div className="flex items-start gap-3">
                <div className={`p-2.5 ${pack.bgColor} border ${pack.borderColor} shrink-0`}>
                  <pack.icon className={`w-5 h-5 ${pack.color}`} />
                </div>
                <div>
                  <h3 className="font-bold text-zinc-100 text-sm">{pack.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 border ${pack.borderColor} ${pack.color} uppercase`}>
                      {pack.highlight}
                    </span>
                    <span className="text-[9px] font-mono text-zinc-600">{pack.clients}</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-zinc-400">{pack.description}</p>

              {/* Features */}
              <div className="space-y-1.5">
                {pack.features.slice(0, 4).map(f => (
                  <div key={f} className="flex items-start gap-2 text-xs text-zinc-300">
                    <CheckCircle2 className={`w-3.5 h-3.5 ${pack.color} shrink-0 mt-0.5`} />
                    <span>{f}</span>
                  </div>
                ))}
                {pack.features.length > 4 && (
                  <p className="text-[10px] text-zinc-600 font-mono pl-5">+{pack.features.length - 4} autres fonctionnalités...</p>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-zinc-800 font-mono text-[10px] text-zinc-500">
                <div className="text-center">
                  <p className={`text-sm font-bold ${pack.color}`}>{pack.workflows}</p>
                  <p className="uppercase">Workflows</p>
                </div>
                <div className="text-center">
                  <p className={`text-sm font-bold ${pack.color}`}>{pack.checklistTemplates}</p>
                  <p className="uppercase">Checklists</p>
                </div>
                <div className="text-center">
                  <p className={`text-sm font-bold ${pack.color}`}>{pack.reportTemplates}</p>
                  <p className="uppercase">Rapports</p>
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={() => handleInstall(pack)}
                disabled={isInstalling || isInstalled}
                className={`w-full py-2 text-xs font-bold font-mono uppercase transition flex items-center justify-center gap-2 ${
                  isInstalled
                    ? 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 cursor-default'
                    : pack.price === 0
                    ? `${pack.bgColor} border ${pack.borderColor} ${pack.color} hover:opacity-80`
                    : 'bg-zinc-800 border border-zinc-700 text-zinc-300 hover:border-indigo-500/50 hover:text-indigo-400'
                }`}>
                {isInstalling ? (
                  <><div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" /> Installation...</>
                ) : isInstalled ? (
                  <><CheckCircle2 className="w-3.5 h-3.5" /> Pack Installé</>
                ) : pack.price === 0 ? (
                  <><Plus className="w-3.5 h-3.5" /> Installer Gratuitement</>
                ) : (
                  <><ChevronRight className="w-3.5 h-3.5" /> Activer — {pack.price}€/mois</>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="bg-gradient-to-r from-indigo-950/40 to-purple-950/40 border border-indigo-500/20 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <p className="font-bold text-zinc-100">Votre secteur n'est pas listé ?</p>
          <p className="text-sm text-zinc-400">Notre équipe peut développer un pack sectoriel sur mesure en 4-6 semaines.</p>
        </div>
        <button onClick={() => toast('Contactez-nous : sectors@beecarbonit.com', { icon: '✉️', duration: 4000 })}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold font-mono text-xs uppercase transition shrink-0">
          Demander un Pack Personnalisé →
        </button>
      </div>
    </div>
  );
}
