import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Layers, Building2, ChevronDown, ChevronRight, Search, 
  Cpu, Wrench, AlertTriangle, CheckCircle2, Box, Eye, 
  Thermometer, Activity, Zap, Shield, Plus, ArrowRight,
  Maximize2, RotateCw, Download, Settings, Sliders
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ifcTreeData = [
  {
    id: 'bld-alpha',
    name: 'Bâtiment Alpha (Siège)',
    type: 'BUILDING',
    icon: Building2,
    children: [
      {
        id: 'lvl-02',
        name: 'Niveau 02 - Plateaux Tertiaires',
        type: 'FLOOR',
        children: [
          {
            id: 'sys-hvac',
            name: 'Système CVC & Traitement d\'Air',
            type: 'SYSTEM',
            children: [
              { id: 'cmp-1', name: 'Bouche d\'Insufflation CTA-02A', type: 'IFC_VALVE', status: 'NOMINAL', temp: '21.4°C', flow: '450 m³/h', health: 98 },
              { id: 'cmp-2', name: 'Conduit d\'Échappement & Registre VAV-04', type: 'IFC_DUCT', status: 'ALERT', temp: '26.8°C', flow: '210 m³/h', health: 64, fault: 'Écart débit détecté (+28%)' },
              { id: 'cmp-3', name: 'Groupe d\'Eau Glacée Carrier AquaSnap', type: 'IFC_CHILLER', status: 'NOMINAL', temp: '7.2°C', flow: '12.4 m³/h', health: 95 },
              { id: 'cmp-4', name: 'Ventiloconvecteur Cassette Z04', type: 'IFC_UNIT', status: 'WARNING', temp: '23.1°C', flow: '180 m³/h', health: 81 }
            ]
          },
          {
            id: 'sys-elec',
            name: 'Distribution Électrique TGBT & Onduleur',
            type: 'SYSTEM',
            children: [
              { id: 'cmp-5', name: 'Disjoncteur Général Masterpact MTZ', type: 'IFC_SWITCH', status: 'NOMINAL', power: '142 kW', cosPhi: 0.98, health: 99 },
              { id: 'cmp-6', name: 'Armoire Climatisation Salle Serveurs', type: 'IFC_PANEL', status: 'NOMINAL', power: '28.4 kW', cosPhi: 0.96, health: 94 }
            ]
          }
        ]
      },
      {
        id: 'lvl-01',
        name: 'Niveau 01 - Accueil & Restaurant',
        type: 'FLOOR',
        children: [
          {
            id: 'sys-hvac-01',
            name: 'Centrale CTA Double Flux RDC',
            type: 'SYSTEM',
            children: [
              { id: 'cmp-7', name: 'Échangeur Rotatif Récupération Chaleur', type: 'IFC_HEAT_EXCHANGER', status: 'NOMINAL', temp: '19.8°C', efficiency: '84%', health: 92 }
            ]
          }
        ]
      }
    ]
  }
];

export default function BIMAssetExplorer() {
  const [expandedNodes, setExpandedNodes] = useState({ 'bld-alpha': true, 'lvl-02': true, 'sys-hvac': true });
  const [selectedComponent, setSelectedComponent] = useState({
    id: 'cmp-2',
    name: 'Conduit d\'Échappement & Registre VAV-04',
    ifcGuid: '2$X9aB123_4FgH89JkLm0P',
    ifcType: 'IfcAirTerminal / IfcDamper',
    status: 'ALERT',
    system: 'CVC / Ventilation Variable',
    location: 'Bâtiment Alpha · Niveau 02 · Zone Nord',
    health: 64,
    temp: '26.8°C (Cible: 21.0°C)',
    flow: '210 m³/h (Consigne: 160 m³/h)',
    pressure: '145 Pa',
    lastMaintenance: '12 Janvier 2026',
    fault: 'Sur-débit anormal détecté par l\'IA avec surconsommation du ventilateur (+1.8 kW). Risque d\'usure prématurée du servomoteur Belimo.'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('3d');

  const toggleNode = (nodeId) => {
    setExpandedNodes(prev => ({ ...prev, [nodeId]: !prev[nodeId] }));
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 lg:p-8 font-sans">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-orange/10 border border-brand-orange/30 text-brand-orange text-xs font-mono mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>BIM ASSET INTELLIGENCE & 3D TELEMETRY</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            Explorateur & Diagnostic d'Actifs BIM 3D
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/tickets"
            className="px-4 py-2 bg-brand-orange text-black font-bold text-xs font-mono uppercase rounded-lg hover:bg-white transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(243,128,32,0.3)]"
          >
            <Plus className="w-4 h-4" />
            Créer Ordre d'Intervention
          </Link>
        </div>
      </div>

      {/* 3-Column Workspace Layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[700px]">
        {/* Left Column: IFC Tree Structure (3 cols) */}
        <div className="lg:col-span-4 bg-zinc-900/70 border border-zinc-800 rounded-2xl p-4 flex flex-col backdrop-blur-md">
          <div className="mb-4">
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text"
                placeholder="Rechercher un équipement IFC..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-black border border-zinc-700 text-xs text-white focus:outline-none focus:border-brand-cyan font-mono"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 text-xs font-mono">
            {ifcTreeData.map((bld) => (
              <div key={bld.id} className="space-y-1">
                <div 
                  onClick={() => toggleNode(bld.id)}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-zinc-800 cursor-pointer text-white font-bold"
                >
                  {expandedNodes[bld.id] ? <ChevronDown className="w-4 h-4 text-brand-orange" /> : <ChevronRight className="w-4 h-4 text-zinc-500" />}
                  <Building2 className="w-4 h-4 text-brand-orange" />
                  <span>{bld.name}</span>
                </div>

                {expandedNodes[bld.id] && bld.children.map((lvl) => (
                  <div key={lvl.id} className="pl-4 space-y-1">
                    <div 
                      onClick={() => toggleNode(lvl.id)}
                      className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-zinc-800/80 cursor-pointer text-zinc-300"
                    >
                      {expandedNodes[lvl.id] ? <ChevronDown className="w-3.5 h-3.5 text-brand-cyan" /> : <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />}
                      <Layers className="w-3.5 h-3.5 text-brand-cyan" />
                      <span>{lvl.name}</span>
                    </div>

                    {expandedNodes[lvl.id] && lvl.children.map((sys) => (
                      <div key={sys.id} className="pl-4 space-y-1">
                        <div 
                          onClick={() => toggleNode(sys.id)}
                          className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-zinc-800/50 cursor-pointer text-zinc-400"
                        >
                          {expandedNodes[sys.id] ? <ChevronDown className="w-3.5 h-3.5 text-zinc-400" /> : <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />}
                          <Cpu className="w-3.5 h-3.5 text-zinc-400" />
                          <span className="font-semibold text-zinc-300">{sys.name}</span>
                        </div>

                        {expandedNodes[sys.id] && sys.children.map((cmp) => (
                          <div
                            key={cmp.id}
                            onClick={() => setSelectedComponent({ ...cmp, system: sys.name, location: `${bld.name} · ${lvl.name}` })}
                            className={`pl-6 p-2 rounded-lg cursor-pointer flex items-center justify-between transition-all ${
                              selectedComponent?.id === cmp.id
                                ? 'bg-brand-orange/20 border border-brand-orange/50 text-white font-bold'
                                : 'hover:bg-zinc-800/40 text-zinc-400'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <span className={`w-2 h-2 rounded-full ${
                                cmp.status === 'NOMINAL' ? 'bg-emerald-400' :
                                cmp.status === 'WARNING' ? 'bg-amber-400' : 'bg-rose-500 animate-pulse'
                              }`} />
                              <span className="truncate">{cmp.name}</span>
                            </div>

                            <span className="text-[10px] text-zinc-500 font-mono flex-shrink-0 ml-2">
                              {cmp.health}%
                            </span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Center Column: 3D Wireframe / Model Viewport (5 cols) */}
        <div className="lg:col-span-5 bg-zinc-950 border border-zinc-800 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between z-10">
            <span className="text-xs font-mono text-zinc-400 flex items-center gap-1.5">
              <Box className="w-4 h-4 text-brand-cyan" />
              Viewport IFC 3D · Shading Télémétrique
            </span>
            <div className="flex items-center gap-1.5 bg-black/60 p-1 rounded-lg border border-zinc-800">
              <button className="p-1 rounded bg-zinc-800 text-white text-xs"><Maximize2 className="w-3.5 h-3.5" /></button>
              <button className="p-1 rounded text-zinc-400 hover:text-white text-xs"><RotateCw className="w-3.5 h-3.5" /></button>
            </div>
          </div>

          {/* Central Interactive Mock Visualizer Canvas */}
          <div className="relative my-auto w-full aspect-square flex items-center justify-center">
            {/* SVG 3D Isometric Piping Network */}
            <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-[0_0_20px_rgba(0,241,254,0.2)]">
              <defs>
                <linearGradient id="duct-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f38020" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#ffb4ab" stopOpacity="0.4" />
                </linearGradient>
                <linearGradient id="pipe-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00f1fe" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#00363a" stopOpacity="0.3" />
                </linearGradient>
              </defs>

              {/* Grid plane */}
              <g opacity="0.3">
                <line x1="50" y1="250" x2="200" y2="350" stroke="#52525b" strokeWidth="1" />
                <line x1="200" y1="350" x2="350" y2="250" stroke="#52525b" strokeWidth="1" />
                <line x1="50" y1="250" x2="200" y2="150" stroke="#52525b" strokeWidth="1" />
                <line x1="200" y1="150" x2="350" y2="250" stroke="#52525b" strokeWidth="1" />
              </g>

              {/* 3D Duct elements */}
              <path d="M100,180 L200,120 L300,180 L200,240 Z" fill="url(#pipe-cyan)" stroke="#00f1fe" strokeWidth="1.5" />
              <path d="M100,180 L100,220 L200,280 L200,240 Z" fill="#00363a" opacity="0.7" />
              <path d="M300,180 L300,220 L200,280 L200,240 Z" fill="#002022" opacity="0.9" />

              {/* Selected Fault Component Highlight */}
              <g transform="translate(180, 160)">
                <circle cx="20" cy="20" r="16" fill="url(#duct-grad)" stroke="#f38020" strokeWidth="2" className="animate-pulse" />
                <circle cx="20" cy="20" r="6" fill="#ffb4ab" />
                <text x="20" y="48" fill="#ffb4ab" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                  VAV-04 (ALERT)
                </text>
              </g>
            </svg>

            {/* Hover Telemetry Overlay */}
            <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-md p-3 rounded-xl border border-zinc-800 flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-400">Position 3D: X: 142.5 Y: 89.2 Z: 4.80m</span>
              <span className="text-brand-cyan">BoundingBox: OK</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 z-10 pt-2 border-t border-zinc-900">
            <span>Rendu WebGL Shaders v2.4</span>
            <span>FPS: 60 · Mesh: 14.2k polys</span>
          </div>
        </div>

        {/* Right Column: Diagnostic & Telemetry Detail (3 cols) */}
        <div className="lg:col-span-3 bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between backdrop-blur-md">
          {selectedComponent ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase mb-1 ${
                    selectedComponent.status === 'NOMINAL' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                    selectedComponent.status === 'WARNING' ? 'bg-amber-400/10 text-amber-400 border border-amber-400/30' :
                    'bg-rose-500/10 text-rose-400 border border-rose-500/30 animate-pulse'
                  }`}>
                    Statut : {selectedComponent.status}
                  </span>
                  <h3 className="text-base font-bold text-white leading-snug">{selectedComponent.name}</h3>
                </div>
              </div>

              {/* Health Score Gauge */}
              <div className="p-3 bg-black/60 rounded-xl border border-zinc-800">
                <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-1">
                  <span>Score Santé Actif</span>
                  <span className="font-bold text-white">{selectedComponent.health}/100</span>
                </div>
                <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      selectedComponent.health > 80 ? 'bg-emerald-400' :
                      selectedComponent.health > 60 ? 'bg-amber-400' : 'bg-rose-500'
                    }`}
                    style={{ width: `${selectedComponent.health}%` }}
                  />
                </div>
              </div>

              {/* Fault Diagnostic Alert Box */}
              {selectedComponent.fault && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                  <div className="flex items-center gap-1.5 font-bold font-mono mb-1 text-rose-400">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Diagnostic IA Automatisé
                  </div>
                  <p className="leading-relaxed">{selectedComponent.fault}</p>
                </div>
              )}

              {/* Telemetry Metrics */}
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between p-2 bg-black/40 rounded border border-zinc-800/80">
                  <span className="text-zinc-500">IFC GUID</span>
                  <span className="text-zinc-300 truncate max-w-[140px]">{selectedComponent.ifcGuid || '2$X9aB123_4FgH'}</span>
                </div>
                <div className="flex justify-between p-2 bg-black/40 rounded border border-zinc-800/80">
                  <span className="text-zinc-500">Température</span>
                  <span className="text-brand-orange font-bold">{selectedComponent.temp}</span>
                </div>
                <div className="flex justify-between p-2 bg-black/40 rounded border border-zinc-800/80">
                  <span className="text-zinc-500">Débit Volumique</span>
                  <span className="text-brand-cyan font-bold">{selectedComponent.flow}</span>
                </div>
                <div className="flex justify-between p-2 bg-black/40 rounded border border-zinc-800/80">
                  <span className="text-zinc-500">Dernière Maintenance</span>
                  <span className="text-zinc-300">{selectedComponent.lastMaintenance || '12/01/2026'}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-zinc-500 text-xs font-mono">
              Sélectionnez un élément dans l'arbre IFC pour inspecter ses métadonnées.
            </div>
          )}

          <div className="pt-4 border-t border-zinc-800 space-y-2">
            <Link
              to="/tickets"
              className="w-full py-2.5 bg-brand-orange text-black font-bold font-mono text-xs uppercase rounded-lg flex items-center justify-center gap-2 hover:bg-white transition-colors"
            >
              <Wrench className="w-3.5 h-3.5" />
              Déclencher Ordre de Travail
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
