import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, Leaf, Zap, BarChart3, ArrowUpRight, Award, 
  CheckCircle2, Filter, Globe, Sparkles, TrendingDown,
  ShieldCheck, FileText, ChevronRight, Share2, Layers
} from 'lucide-react';
import { Link } from 'react-router-dom';

const caseStudiesData = [
  {
    id: 'cs-01',
    title: 'Tour Horizon - Campus Tertiaire Zéro Carbone',
    client: 'Nexity Immobilier Entreprise',
    location: 'Paris La Défense, France',
    category: 'Tertiaire',
    surface: '48 000 m²',
    period: '2024 - 2026',
    coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    reductionCo2: '-42%',
    energySaved: '1.8 GWh/an',
    roiYears: '2.4 ans',
    certifications: ['HQE Exceptionnel', 'BREEAM Outstanding', 'Ready2Services (R2S)'],
    summary: 'Déploiement complet du jumeau numérique BIM et de l\'IA de pilotage CVC prédictive sur un IGH de 32 étages.',
    challenge: 'Surconsommation thermique due à une régulation CVC non synchronisée avec l\'occupation réelle post-COVID (télétravail hybride).',
    solution: 'Intégration du Digital Twin BEECARBONAT avec 340 capteurs IoT LoRaWAN et pilotage dynamique BACnet/IP des centrales de traitement d\'air.',
    results: [
      'Réduction de 42% des émissions Scope 1 & 2 en 18 mois',
      'Gain de 320 000 €/an sur la facture énergétique globale',
      'Amélioration du score de confort thermique occupant à 96.4%',
      'Conformité anticipée Décret Tertiaire 2030 atteinte dès 2025'
    ],
    kpis: [
      { label: 'CO2 évité total', value: '840 tCO2e/an', trend: '+14% vs obj.' },
      { label: 'Indice EUI', value: '78 kWh/m²/an', trend: '-38%' },
      { label: 'Taux de détection pannes', value: '99.2%', trend: 'Temps réel' }
    ]
  },
  {
    id: 'cs-02',
    title: 'GigaHub Logistique Sud-Europe',
    client: 'Prologis & ID Logistics',
    location: 'Lyon Saint-Exupéry, France',
    category: 'Logistique',
    surface: '92 000 m²',
    period: '2025 - 2026',
    coverImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
    reductionCo2: '-58%',
    energySaved: '3.4 GWh/an',
    roiYears: '1.9 an',
    certifications: ['LEED Gold', 'BiodiverCity', 'ISO 50001'],
    summary: 'Autoconsommation photovoltaïque intelligente, gestion circulaire des fluides et GTB prédictive.',
    challenge: 'Pics de demande électrique lors de la recharge nocturne de 80 camions électriques et forte déperdition en toiture.',
    solution: 'Algorithme BEECARBONAT d\'arbitrage charge VE / production solaire 4.2 MWc / stockage batteries stationnaires.',
    results: [
      'Autosuffisance électrique moyenne de 64% sur l\'année',
      'Suppression totale des pénalités de dépassement de puissance souscrite',
      'Valorisation de 94% des déchets d\'emballage et palettes sur site',
      'Empreinte carbone du transport interne réduite de 61%'
    ],
    kpis: [
      { label: 'Production Solaire', value: '4 820 MWh/an', trend: '100% valorisé' },
      { label: 'Taux d\'autoconsommation', value: '78.5%', trend: '+22 pts' },
      { label: 'Économie annuelle', value: '540 000 €', trend: 'Net' }
    ]
  },
  {
    id: 'cs-03',
    title: 'Site Industriel Aéronautique & Micro-électronique',
    client: 'Safran SafranTech Aerospace',
    location: 'Toulouse Occitanie, France',
    category: 'Industrie',
    surface: '65 000 m²',
    period: '2024 - 2026',
    coverImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
    reductionCo2: '-36%',
    energySaved: '4.9 GWh/an',
    roiYears: '2.1 ans',
    certifications: ['ISO 14001', 'ISO 50001', 'REACH Compliant'],
    summary: 'Récupération de chaleur fatale des salles blanches et maintenance conditionnelle sur compresseurs d\'air comprimé.',
    challenge: 'Pertes massives d\'énergie sur les circuits d\'air comprimé industriels et besoin strict de tolérance hydrométrique à ±1.5%.',
    solution: 'Modules d\'IA acoustique de détection de micro-fuites et échangeurs thermiques connectés au réseau urbain de chaleur.',
    results: [
      'Plus de 1 200 tCO2e évitées par an via la réinjection de chaleur',
      'Détection automatique de 48 fuites d\'air comprimé avant criticité',
      'Disponibilité machine accrue de 99.85%',
      'Audit carbone ISO validé sans aucune non-conformité'
    ],
    kpis: [
      { label: 'Chaleur fatale valorisée', value: '2.8 GWh/an', trend: 'Réseau urbain' },
      { label: 'Gain air comprimé', value: '145 000 €/an', trend: '-28% pertes' },
      { label: 'Score CSRD / ESG', value: 'A+', trend: 'Top 1% secteur' }
    ]
  },
  {
    id: 'cs-04',
    title: 'Éco-Quartier Rive Gauche - Smart Grid Résidentiel',
    client: 'Métropole Européenne & CDC Habitat',
    location: 'Bordeaux Euratlantique, France',
    category: 'Résidentiel',
    surface: '110 000 m²',
    period: '2025 - 2026',
    coverImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    reductionCo2: '-49%',
    energySaved: '2.6 GWh/an',
    roiYears: '3.0 ans',
    certifications: ['Label ÉcoQuartier', 'E+C- Niveau E3C2', 'Bbio -35%'],
    summary: 'Réseau d\'énergie partagée, boucle d\'eau tempérée géothermique et application locataire éco-citoyenne.',
    challenge: 'Mutualisation énergétique entre 850 logements, commerces de rez-de-chaussée et une école primaire.',
    solution: 'Portail BEECARBONAT Occupant Care avec gamification des éco-gestes et répartition dynamique des flux d\'énergie.',
    results: [
      'Baisse moyenne des charges de chauffage de 41% pour les ménages',
      'Taux d\'engagement citoyen de 78% sur l\'application mobile',
      'Zéro recours aux énergies fossiles sur l\'ensemble de l\'îlot',
      'Trophée National de la Transition Bas-Carbone 2025'
    ],
    kpis: [
      { label: 'Foyers connectés', value: '850 unités', trend: '98% actifs' },
      { label: 'Part EnR locale', value: '89%', trend: 'Géothermie + Solaire' },
      { label: 'Baisse de charges', value: '-380 €/an/foyer', trend: 'Moyenne' }
    ]
  }
];

export default function CaseStudies() {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [activeStudy, setActiveStudy] = useState(null);

  const categories = ['ALL', 'Tertiaire', 'Logistique', 'Industrie', 'Résidentiel'];

  const filteredStudies = selectedCategory === 'ALL' 
    ? caseStudiesData 
    : caseStudiesData.filter(s => s.category === selectedCategory);

  return (
    <div className="min-h-screen bg-black text-white p-6 lg:p-10 font-sans">
      {/* Header section */}
      <div className="max-w-7xl mx-auto mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-zinc-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-orange/10 border border-brand-orange/30 text-brand-orange text-xs font-mono mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>PROJETS BAS-CARBONE & DÉPLOYÉS</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-white flex items-center gap-3">
              Études de Cas & Déploiements Éco-Responsables
            </h1>
            <p className="text-zinc-400 mt-2 max-w-2xl text-sm lg:text-base">
              Découvrez comment les plus grands gestionnaires d’actifs réduisent drastiquement leur empreinte carbone grâce à l’intelligence opérationnelle BEECARBONAT.
            </p>
          </div>

          {/* Aggregate impact badge */}
          <div className="grid grid-cols-2 gap-4 bg-zinc-900/80 border border-zinc-800 p-4 rounded-xl backdrop-blur-md">
            <div>
              <div className="text-2xl font-mono font-bold text-brand-cyan">-47.5%</div>
              <div className="text-xs text-zinc-400 uppercase font-mono">Moyenne CO2 Évitée</div>
            </div>
            <div className="border-l border-zinc-800 pl-4">
              <div className="text-2xl font-mono font-bold text-brand-orange">12.7 GWh</div>
              <div className="text-xs text-zinc-400 uppercase font-mono">Énergie Épargnée/an</div>
            </div>
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <Filter className="w-4 h-4 text-zinc-500 mr-2" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-all ${
                  selectedCategory === cat
                    ? 'bg-brand-orange text-black font-bold shadow-[0_0_15px_rgba(243,128,32,0.3)]'
                    : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white border border-zinc-800'
                }`}
              >
                {cat === 'ALL' ? 'Tous les secteurs' : cat}
              </button>
            ))}
          </div>

          <div className="text-xs font-mono text-zinc-500">
            Affichage de {filteredStudies.length} projet{filteredStudies.length > 1 ? 's' : ''} certifié{filteredStudies.length > 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Case studies grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredStudies.map((study) => (
          <motion.div
            key={study.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="group bg-zinc-900/60 border border-zinc-800 hover:border-brand-orange/50 rounded-2xl overflow-hidden backdrop-blur-md transition-all duration-300 flex flex-col hover:shadow-[0_10px_30px_rgba(243,128,32,0.1)]"
          >
            {/* Top image with badges */}
            <div className="relative h-56 w-full overflow-hidden">
              <img 
                src={study.coverImage} 
                alt={study.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-3 py-1 bg-black/70 backdrop-blur-md border border-zinc-700 text-white text-xs font-mono uppercase rounded-full">
                  {study.category}
                </span>
                <span className="px-3 py-1 bg-brand-cyan/20 border border-brand-cyan/40 text-brand-cyan text-xs font-mono font-bold rounded-full">
                  {study.surface}
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <div>
                  <div className="text-xs text-zinc-400 font-mono flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>{study.client}</span>
                  </div>
                  <div className="text-sm font-semibold text-white mt-0.5">{study.location}</div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-mono font-black text-brand-orange drop-shadow-[0_0_10px_rgba(243,128,32,0.5)]">
                    {study.reductionCo2}
                  </div>
                  <div className="text-[10px] text-zinc-400 font-mono uppercase">CO2 Scope 1-2</div>
                </div>
              </div>
            </div>

            {/* Card body */}
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-white group-hover:text-brand-orange transition-colors">
                  {study.title}
                </h3>
                <p className="text-zinc-400 text-sm mt-3 line-clamp-2">
                  {study.summary}
                </p>

                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-2 my-5 p-3 rounded-xl bg-black/40 border border-zinc-800/80">
                  <div className="text-center">
                    <div className="text-xs text-zinc-500 font-mono">Énergie</div>
                    <div className="text-sm font-mono font-bold text-brand-cyan">{study.energySaved}</div>
                  </div>
                  <div className="text-center border-x border-zinc-800">
                    <div className="text-xs text-zinc-500 font-mono">ROI Mesuré</div>
                    <div className="text-sm font-mono font-bold text-white">{study.roiYears}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-zinc-500 font-mono">Période</div>
                    <div className="text-sm font-mono font-bold text-zinc-300">{study.period}</div>
                  </div>
                </div>

                {/* Certifications badges */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {study.certifications.map((cert) => (
                    <span 
                      key={cert}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-zinc-800/80 text-zinc-300 text-[11px] font-mono rounded-md border border-zinc-700"
                    >
                      <Award className="w-3 h-3 text-brand-orange" />
                      {cert}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-zinc-800/80">
                <button
                  onClick={() => setActiveStudy(study)}
                  className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-brand-orange hover:text-white font-bold transition-colors"
                >
                  <span>Consulter le rapport complet</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-3">
                  <Link 
                    to="/energy" 
                    className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                    title="Voir dans le module Énergie"
                  >
                    <Zap className="w-4 h-4" />
                  </Link>
                  <Link 
                    to="/bim" 
                    className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                    title="Voir le jumeau numérique 3D"
                  >
                    <Layers className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal Detail View */}
      <AnimatePresence>
        {activeStudy && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl p-6 lg:p-8 relative"
            >
              <button
                onClick={() => setActiveStudy(null)}
                className="absolute top-6 right-6 w-8 h-8 rounded-full bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center border border-zinc-700 transition-colors"
              >
                ✕
              </button>

              <div className="flex items-center gap-2 text-brand-orange font-mono text-xs uppercase mb-2">
                <Leaf className="w-4 h-4" />
                <span>Rapport de Décarbonation Opérationnelle</span>
              </div>

              <h2 className="text-2xl lg:text-3xl font-bold text-white">{activeStudy.title}</h2>
              <div className="text-zinc-400 text-sm mt-1">{activeStudy.client} — {activeStudy.location}</div>

              {/* KPI Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
                {activeStudy.kpis.map((kpi, i) => (
                  <div key={i} className="bg-black/60 border border-zinc-800 p-4 rounded-xl">
                    <div className="text-xs text-zinc-400 font-mono">{kpi.label}</div>
                    <div className="text-xl font-bold font-mono text-brand-cyan mt-1">{kpi.value}</div>
                    <div className="text-xs text-brand-orange font-mono mt-0.5">{kpi.trend}</div>
                  </div>
                ))}
              </div>

              {/* Challenge & Solution */}
              <div className="space-y-6 text-sm text-zinc-300">
                <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700">
                  <h4 className="text-xs font-mono uppercase text-brand-orange font-bold mb-2">Défi Initial</h4>
                  <p>{activeStudy.challenge}</p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700">
                  <h4 className="text-xs font-mono uppercase text-brand-cyan font-bold mb-2">Architecture & Solution BEECARBONAT</h4>
                  <p>{activeStudy.solution}</p>
                </div>

                <div>
                  <h4 className="text-xs font-mono uppercase text-white font-bold mb-3">Résultats et Bénéfices Chiffrés</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeStudy.results.map((res, i) => (
                      <div key={i} className="flex items-start gap-2.5 p-3 rounded-lg bg-black/40 border border-zinc-800">
                        <CheckCircle2 className="w-4 h-4 text-brand-cyan flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-zinc-200">{res}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer Modal */}
              <div className="mt-8 pt-6 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-4">
                <div className="flex gap-2">
                  {activeStudy.certifications.map(c => (
                    <span key={c} className="text-[11px] font-mono px-2.5 py-1 rounded bg-zinc-800 border border-zinc-700 text-zinc-400">
                      {c}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Lien de l\'étude de cas copié !');
                    }}
                    className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-mono uppercase text-zinc-300 flex items-center gap-2 transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    Partager
                  </button>
                  <Link
                    to="/exports"
                    className="px-5 py-2 rounded-lg bg-brand-orange text-black font-bold font-mono text-xs uppercase flex items-center gap-2 hover:bg-white transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Télécharger PDF Exécutif
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
