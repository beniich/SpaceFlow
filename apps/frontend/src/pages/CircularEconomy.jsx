import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Recycle, Trash2, RefreshCw, BarChart2, TrendingUp, 
  Leaf, ArrowDownRight, ArrowUpRight, ShieldCheck, Box, 
  Truck, CheckCircle, AlertCircle, FileCheck, Layers, Sparkles
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, 
  Tooltip, CartesianGrid, PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';

const wasteStreams = [
  { id: 'ws-1', name: 'Métaux & Cuivre (Chantiers/CVC)', collected: 14.8, recycled: 14.5, rate: 98.0, value: '18 400 €', status: 'Optimal', color: '#00f1fe' },
  { id: 'ws-2', name: 'Filtres & Composants CVC usagés', collected: 8.2, recycled: 7.4, rate: 90.2, value: '4 200 €', status: 'Optimal', color: '#f38020' },
  { id: 'ws-3', name: 'Déchets Électroniques (DEEE / IoT)', collected: 3.5, recycled: 3.4, rate: 97.1, value: '9 800 €', status: 'Certifié WEEE', color: '#a855f7' },
  { id: 'ws-4', name: 'Huiles & Fluides Frigorifiques R32/R410A', collected: 2.1, recycled: 2.05, rate: 97.6, value: 'Regénéré 100%', status: 'F-Gas Conforme', color: '#3b82f6' },
  { id: 'ws-5', name: 'Palettes Bois & Cartons Tertiaires', collected: 28.4, recycled: 28.1, rate: 98.9, value: '3 100 €', status: 'Boucle Courte', color: '#22c55e' },
  { id: 'ws-6', name: 'Gravats & Béton Démolition Douce', collected: 64.0, recycled: 59.5, rate: 93.0, value: 'Sous-couche Voirie', status: 'Valorisé', color: '#eab308' },
];

const monthlyTrend = [
  { month: 'Jan', collecte: 18.2, revalorise: 17.1, valorisationRate: 94.0 },
  { month: 'Fév', collecte: 19.5, revalorise: 18.6, valorisationRate: 95.3 },
  { month: 'Mar', collecte: 22.1, revalorise: 21.2, valorisationRate: 95.9 },
  { month: 'Avr', collecte: 20.4, revalorise: 19.8, valorisationRate: 97.0 },
  { month: 'Mai', collecte: 24.8, revalorise: 24.1, valorisationRate: 97.2 },
  { month: 'Juin', collecte: 26.5, revalorise: 25.9, valorisationRate: 97.7 },
  { month: 'Juil', collecte: 23.0, revalorise: 22.6, valorisationRate: 98.2 },
  { month: 'Août', collecte: 21.8, revalorise: 21.4, valorisationRate: 98.1 },
];

const partsRefurbished = [
  { partName: 'Moteurs Ventilateurs CTA FläktGroup', originalPrice: '2 400 €', recondPrice: '850 €', savedCo2: '380 kg', count: 18 },
  { partName: 'Cartes Mères Automates Schneider Modicon', originalPrice: '1 800 €', recondPrice: '620 €', savedCo2: '140 kg', count: 12 },
  { partName: 'Vannes 3 Voies Motorisées Belimo', originalPrice: '750 €', recondPrice: '260 €', savedCo2: '65 kg', count: 34 },
  { partName: 'Pompes de Relevage Grundfos Magna3', originalPrice: '1 950 €', recondPrice: '700 €', savedCo2: '290 kg', count: 8 },
];

export default function CircularEconomy() {
  const [activeTab, setActiveTab] = useState('overview');

  const totalCollected = wasteStreams.reduce((acc, curr) => acc + curr.collected, 0).toFixed(1);
  const totalRecycled = wasteStreams.reduce((acc, curr) => acc + curr.recycled, 0).toFixed(1);
  const averageRate = ((totalRecycled / totalCollected) * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-black text-white p-6 lg:p-10 font-sans">
      {/* Header section */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-zinc-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono mb-3">
              <Recycle className="w-3.5 h-3.5" />
              <span>CIRCULAR ECONOMY & MATERIAL RECOVERY</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-white flex items-center gap-3">
              Flux Circulaires & Valorisation des Déchets
            </h1>
            <p className="text-zinc-400 mt-2 max-w-2xl text-sm lg:text-base">
              Pilotage temps réel du réemploi des équipements techniques, traçabilité des filières de recyclage et valorisation des flux de démantèlement.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-mono uppercase text-zinc-300 rounded-lg flex items-center gap-2 transition-colors">
              <FileCheck className="w-4 h-4 text-brand-cyan" />
              Bordereaux BSDD / Trackdéchets
            </button>
            <button className="px-4 py-2 bg-brand-orange hover:bg-white text-black font-bold text-xs font-mono uppercase rounded-lg shadow-[0_0_15px_rgba(243,128,32,0.3)] transition-colors">
              Nouveau Bilan Matière
            </button>
          </div>
        </div>

        {/* Global summary KPI widgets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="bg-zinc-900/70 border border-zinc-800 p-5 rounded-2xl backdrop-blur-md">
            <div className="flex items-center justify-between text-zinc-400 font-mono text-xs mb-2">
              <span>Taux de Valorisation Global</span>
              <Recycle className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-bold font-mono text-emerald-400">{averageRate}%</div>
            <div className="text-xs text-zinc-500 font-mono mt-1 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
              <span>+3.2% vs trimestre précédent</span>
            </div>
          </div>

          <div className="bg-zinc-900/70 border border-zinc-800 p-5 rounded-2xl backdrop-blur-md">
            <div className="flex items-center justify-between text-zinc-400 font-mono text-xs mb-2">
              <span>Matière Recyclée Totale</span>
              <Trash2 className="w-4 h-4 text-brand-cyan" />
            </div>
            <div className="text-3xl font-bold font-mono text-brand-cyan">{totalRecycled} <span className="text-lg">T</span></div>
            <div className="text-xs text-zinc-500 font-mono mt-1">sur {totalCollected} Tonnes collectées</div>
          </div>

          <div className="bg-zinc-900/70 border border-zinc-800 p-5 rounded-2xl backdrop-blur-md">
            <div className="flex items-center justify-between text-zinc-400 font-mono text-xs mb-2">
              <span>Économie Réemploi Pièces</span>
              <RefreshCw className="w-4 h-4 text-brand-orange" />
            </div>
            <div className="text-3xl font-bold font-mono text-brand-orange">46 200 €</div>
            <div className="text-xs text-zinc-500 font-mono mt-1">72 équipements reconditionnés</div>
          </div>

          <div className="bg-zinc-900/70 border border-zinc-800 p-5 rounded-2xl backdrop-blur-md">
            <div className="flex items-center justify-between text-zinc-400 font-mono text-xs mb-2">
              <span>Évitement Carbone Matière</span>
              <Leaf className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-bold font-mono text-white">184 <span className="text-lg">tCO2e</span></div>
            <div className="text-xs text-zinc-500 font-mono mt-1">Scope 3 Amont & Fin de vie</div>
          </div>
        </div>
      </div>

      {/* Main content tabs & dashboards */}
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Monthly trend area chart */}
          <div className="lg:col-span-2 bg-zinc-900/60 border border-zinc-800 p-6 rounded-2xl backdrop-blur-md">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-brand-cyan" />
                  Progression du Taux de Valorisation Matière (2026)
                </h3>
                <p className="text-xs text-zinc-400 font-mono mt-0.5">Tonnage collecté vs flux effectivement revalorisé</p>
              </div>
              <span className="px-2.5 py-1 rounded bg-zinc-800 border border-zinc-700 text-zinc-300 font-mono text-xs">
                Objectif 2026 : &gt;95%
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyTrend}>
                  <defs>
                    <linearGradient id="colorCollecte" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stop-color="#3b82f6" stopOpacity={0.4}/>
                      <stop offset="95%" stop-color="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorReval" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stop-color="#00f1fe" stopOpacity={0.8}/>
                      <stop offset="95%" stop-color="#00f1fe" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="month" stroke="#71717a" tick={{ fill: '#a1a1aa', fontSize: 11 }} />
                  <YAxis stroke="#71717a" tick={{ fill: '#a1a1aa', fontSize: 11 }} unit=" T" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', borderRadius: '8px', color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="collecte" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCollecte)" name="Collecté" />
                  <Area type="monotone" dataKey="revalorise" stroke="#00f1fe" fillOpacity={1} fill="url(#colorReval)" name="Revalorisé" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Waste stream breakdown pie */}
          <div className="bg-zinc-900/60 border border-zinc-800 p-6 rounded-2xl backdrop-blur-md flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
                <Layers className="w-4 h-4 text-brand-orange" />
                Répartition des Déchets par Filière
              </h3>
              <p className="text-xs text-zinc-400 font-mono">Part massique des catégories collectées</p>
            </div>

            <div className="h-52 w-full flex items-center justify-center my-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={wasteStreams}
                    dataKey="collected"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                  >
                    {wasteStreams.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', borderRadius: '8px', color: '#fff' }}
                    formatter={(value) => [`${value} Tonnes`, 'Tonnage']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              {wasteStreams.slice(0, 4).map((stream) => (
                <div key={stream.id} className="flex items-center gap-1.5 text-zinc-300">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: stream.color }} />
                  <span className="truncate">{stream.name.split(' ')[0]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Stream Tables */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden backdrop-blur-md">
          <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Registre des Flux & Traçabilité Réglementaire</h3>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">Conformité CSRD, Décret 7 flux et bordereaux BSDD</p>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
              100% Déchets Tracés
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-black/60 text-xs font-mono text-zinc-400 uppercase border-b border-zinc-800">
                <tr>
                  <th className="py-3 px-6">Flux Matière</th>
                  <th className="py-3 px-6">Collecté</th>
                  <th className="py-3 px-6">Revalorisé</th>
                  <th className="py-3 px-6">Taux Recyclage</th>
                  <th className="py-3 px-6">Bénéfice / Destination</th>
                  <th className="py-3 px-6">Statut Conforme</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-200">
                {wasteStreams.map((ws) => (
                  <tr key={ws.id} className="hover:bg-zinc-800/40 transition-colors font-mono text-xs">
                    <td className="py-4 px-6 font-sans font-medium text-white flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ws.color }} />
                      {ws.name}
                    </td>
                    <td className="py-4 px-6 font-bold">{ws.collected} T</td>
                    <td className="py-4 px-6 text-brand-cyan">{ws.recycled} T</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-400 font-bold">{ws.rate}%</span>
                        <div className="w-16 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${ws.rate}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-zinc-300 font-sans">{ws.value}</td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 bg-zinc-800 text-zinc-300 border border-zinc-700 rounded-md text-[11px]">
                        {ws.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Refurbished equipment catalog banner */}
        <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-black border border-brand-orange/30 p-6 lg:p-8 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <RefreshCw className="w-48 h-48 text-brand-orange" />
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-orange/10 border border-brand-orange/30 text-brand-orange text-xs font-mono mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SECOND-LIFE SPARE PARTS MARKETPLACE</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Bourse Interne de Pièces Détachées Reconditionnées</h3>
            <p className="text-zinc-400 text-sm mb-6">
              Évitez les délais de livraison fabricant et économisez jusqu'à 65% sur vos interventions grâce à notre stock mutualisé de pièces testées et certifiées garanties 12 mois.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {partsRefurbished.map((part, idx) => (
                <div key={idx} className="bg-black/60 border border-zinc-800 p-4 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-white">{part.partName}</div>
                    <div className="flex items-center gap-3 text-xs font-mono mt-1">
                      <span className="text-zinc-500 line-through">{part.originalPrice}</span>
                      <span className="text-brand-orange font-bold">{part.recondPrice}</span>
                      <span className="text-emerald-400">-{part.savedCo2} CO2</span>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-zinc-800 text-zinc-300 text-xs font-mono rounded">
                    {part.count} dispo
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
