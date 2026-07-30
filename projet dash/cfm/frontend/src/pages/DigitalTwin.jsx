import { useEffect, useState } from 'react';
import api from '../services/api';
import {
  Box, Activity, Play, Camera, Flame, Zap, Wrench,
  Users, Layers, RefreshCw, CheckCircle
} from 'lucide-react';
import clsx from 'clsx';
import toast from 'react-hot-toast';

const SCENARIOS = [
  {
    id: 'fire',
    name: 'Incendie',
    icon: Flame,
    color: 'red',
    desc: 'Simulation évacuation & intervention'
  },
  {
    id: 'evacuation',
    name: 'Évacuation',
    icon: Users,
    color: 'orange',
    desc: "Plan d'évacuation optimisé"
  },
  {
    id: 'energy_optim',
    name: 'Optimisation énergie',
    icon: Zap,
    color: 'yellow',
    desc: 'Réduction consommation énergétique'
  },
  {
    id: 'maintenance',
    name: 'Impact maintenance',
    icon: Wrench,
    color: 'blue',
    desc: "Simulation d'arrêt pour maintenance"
  }
];

const COLOR_MAP = {
  red: { bg: 'bg-red-50', border: 'border-red-300', icon: 'text-red-600', badge: 'bg-red-100 text-red-700' },
  orange: { bg: 'bg-orange-50', border: 'border-orange-300', icon: 'text-orange-600', badge: 'bg-orange-100 text-orange-700' },
  yellow: { bg: 'bg-yellow-50', border: 'border-yellow-300', icon: 'text-yellow-600', badge: 'bg-yellow-100 text-yellow-700' },
  blue: { bg: 'bg-blue-50', border: 'border-blue-300', icon: 'text-blue-600', badge: 'bg-blue-100 text-blue-700' }
};

// Données de démo du plan SVG
function generateFloor(floorNum, spaces = 10) {
  return Array.from({ length: spaces }, (_, j) => ({
    id: `${floorNum}-${j}`,
    name: `E${floorNum}.${(j + 1).toString().padStart(2, '0')}`,
    status: Math.random() > 0.3 ? 'occupied' : 'available',
    type: j < 2 ? 'meeting' : 'office',
    temperature: parseFloat((20 + Math.random() * 4).toFixed(1)),
    occupancy: Math.floor(Math.random() * 10)
  }));
}

export default function DigitalTwin() {
  const [buildings, setBuildings] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState(1);
  const [scenario, setScenario] = useState(null);
  const [simulationResult, setSimulationResult] = useState(null);
  const [running, setRunning] = useState(false);
  const [floors, setFloors] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadBuildings();
  }, []);

  const loadBuildings = async () => {
    try {
      const { data } = await api.get('/digitaltwin/buildings');
      setBuildings(data);
      if (data.length > 0) loadOverview(data[0]);
    } catch {
      // Fallback démo
      const demo = { id: 'demo', name: 'Tour Horizon', floors: 8, area: 12000 };
      setSelectedBuilding(demo);
      initDemoFloors(demo);
    }
  };

  const loadOverview = async (building) => {
    setSelectedBuilding(building);
    try {
      const { data } = await api.get(`/digitaltwin/overview/${building.id}`);
      setStats(data.stats);
      setFloors(data.floors || initDemoFloors(building, true));
    } catch {
      initDemoFloors(building);
    }
  };

  const initDemoFloors = (building, returnOnly = false) => {
    const floorCount = building.floors || 8;
    const f = Array.from({ length: floorCount }, (_, i) => ({
      number: i + 1,
      name: `Étage ${i + 1}`,
      spaces: generateFloor(i + 1),
      assets: Array.from({ length: 3 }, (_, j) => ({
        id: `a-${i}-${j}`,
        name: `HVAC ${i + 1}-${j + 1}`,
        health: 70 + Math.floor(Math.random() * 30)
      }))
    }));
    if (!returnOnly) {
      setFloors(f);
      setStats({
        totalAssets: 48,
        operationalAssets: 44,
        totalSpaces: floorCount * 10,
        occupiedSpaces: Math.floor(floorCount * 7),
        avgHealth: 87,
        totalArea: building.area || 12000
      });
    }
    return f;
  };

  const runSimulation = async (sc) => {
    setRunning(true);
    setScenario(sc);
    setSimulationResult(null);
    try {
      const locationId = selectedBuilding?.id || 'demo';
      const { data } = await api.post(`/digitaltwin/simulate/${locationId}`, {
        scenario: sc.id,
        parameters: { occupancy: 150 }
      });
      setSimulationResult(data.results);
    } catch {
      // Fallback démo
      const DEMO = {
        fire: {
          evacuationTime: 9.4,
          peopleAtRisk: 89,
          affectedZones: ['Zone A', 'Zone B'],
          safeExits: 4,
          recommendations: [
            'Activer alarme sonore immédiatement',
            'Débloquer sorties de secours B et C',
            'Mobiliser équipe intervention zone A'
          ]
        },
        evacuation: {
          totalEvacuees: 150,
          timeToClear: 7.2,
          bottleneck: 'Escalier principal',
          recommendations: ['Ouvrir sortie de secours Ouest']
        },
        energy_optim: {
          currentConsumption: 8500,
          optimizedConsumption: 6760,
          savingsPercent: 20.5,
          co2ReductionTonnes: 1.4,
          recommendations: [
            'Réduire HVAC zones inoccupées 18h–6h',
            'Baisser éclairage couloirs 30%',
            'Mode éco ascenseurs heures creuses'
          ]
        },
        maintenance: {
          plannedDowntime: 4,
          affectedAssets: 12,
          estimatedCostImpact: 4500,
          optimalWindow: 'Samedi 22h00 – Dimanche 06h00',
          recommendations: ['Planifier intervention week-end', 'Précommander pièces détachées']
        }
      };
      setTimeout(() => {
        setSimulationResult(DEMO[sc.id] || {});
        setRunning(false);
      }, 1500);
      return;
    }
    setRunning(false);
  };

  const handleSnapshot = async () => {
    try {
      const id = selectedBuilding?.id || 'demo';
      await api.post(`/digitaltwin/snapshot/${id}`);
      toast.success('Snapshot capturé');
    } catch {
      toast.success('Snapshot capturé (démo)');
    }
  };

  const currentFloor = floors[selectedFloor - 1];

  return (
    <div className="p-8 bg-slate-50 min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Box className="w-6 h-6 text-primary-600" />
            Jumeau Numérique
          </h1>
          <p className="text-slate-500 text-sm">
            {selectedBuilding?.name || 'Chargement…'} — Vue interactive en temps réel
          </p>
        </div>
        <div className="flex gap-2">
          {buildings.length > 1 && (
            <select
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
              onChange={(e) => {
                const b = buildings.find((x) => x.id === e.target.value);
                if (b) loadOverview(b);
              }}
            >
              {buildings.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          )}
          <button
            onClick={handleSnapshot}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm hover:bg-slate-50"
          >
            <Camera className="w-4 h-4" /> Capturer
          </button>
        </div>
      </div>

      {/* KPI Row */}
      {stats && (
        <div className="grid grid-cols-6 gap-3 mb-6">
          {[
            { label: 'Étages', value: floors.length },
            { label: 'Actifs opérat.', value: `${stats.operationalAssets}/${stats.totalAssets}`, cls: 'text-green-600' },
            { label: 'Espaces occupés', value: `${stats.occupiedSpaces}/${stats.totalSpaces}`, cls: 'text-blue-600' },
            { label: 'Santé moy.', value: `${stats.avgHealth}%`, cls: 'text-indigo-600' },
            { label: 'Surface', value: `${(stats.totalArea / 1000).toFixed(1)}k m²` },
            { label: 'Capteurs actifs', value: stats.totalSensors || '—', cls: 'text-purple-600' }
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl p-4 border border-slate-200 hover:shadow-md transition">
              <p className="text-xs text-slate-500">{s.label}</p>
              <p className={`text-xl font-bold mt-1 ${s.cls || 'text-slate-900'}`}>{s.value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Plan SVG */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary-500" />
              Plan — Étage {selectedFloor}
            </h3>
            <div className="flex gap-1 flex-wrap max-w-xs">
              {floors.map((f) => (
                <button
                  key={f.number}
                  onClick={() => setSelectedFloor(f.number)}
                  className={clsx(
                    'w-8 h-8 text-xs rounded-lg font-medium transition',
                    selectedFloor === f.number
                      ? 'bg-primary-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  )}
                >
                  {f.number}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[420px] bg-gradient-to-br from-slate-50 to-slate-100 p-4">
            <svg viewBox="0 0 820 380" className="w-full h-full">
              {/* Périmètre bâtiment */}
              <rect x="20" y="20" width="780" height="340" rx="12" fill="white" stroke="#cbd5e1" strokeWidth="2" />
              <text x="410" y="45" textAnchor="middle" fontSize="13" fill="#94a3b8" fontWeight="500">
                {currentFloor?.name}
              </text>

              {/* Couloir central */}
              <rect x="20" y="185" width="780" height="30" fill="#f1f5f9" />
              <text x="410" y="204" textAnchor="middle" fontSize="10" fill="#94a3b8">COULOIR</text>

              {/* Espaces — rangée haute */}
              {currentFloor?.spaces.slice(0, 5).map((space, i) => {
                const x = 30 + i * 154;
                const y = 55;
                const occupied = space.status === 'occupied';
                return (
                  <g key={space.id}>
                    <rect
                      x={x} y={y} width={138} height={120}
                      rx="8"
                      fill={occupied ? '#fef3c7' : '#f0fdf4'}
                      stroke={occupied ? '#f59e0b' : '#22c55e'}
                      strokeWidth="1.5"
                    />
                    <text x={x + 69} y={y + 45} textAnchor="middle" fontSize="12" fontWeight="600" fill="#1e293b">{space.name}</text>
                    <text x={x + 69} y={y + 65} textAnchor="middle" fontSize="9" fill="#64748b">{space.type}</text>
                    <text x={x + 69} y={y + 82} textAnchor="middle" fontSize="9" fill="#64748b">
                      {space.occupancy} pers • {space.temperature}°C
                    </text>
                    <circle
                      cx={x + 125} cy={y + 15} r="6"
                      fill={occupied ? '#f59e0b' : '#22c55e'}
                    />
                  </g>
                );
              })}

              {/* Espaces — rangée basse */}
              {currentFloor?.spaces.slice(5, 10).map((space, i) => {
                const x = 30 + i * 154;
                const y = 225;
                const occupied = space.status === 'occupied';
                return (
                  <g key={space.id}>
                    <rect
                      x={x} y={y} width={138} height={120}
                      rx="8"
                      fill={occupied ? '#fef3c7' : '#f0fdf4'}
                      stroke={occupied ? '#f59e0b' : '#22c55e'}
                      strokeWidth="1.5"
                    />
                    <text x={x + 69} y={y + 45} textAnchor="middle" fontSize="12" fontWeight="600" fill="#1e293b">{space.name}</text>
                    <text x={x + 69} y={y + 65} textAnchor="middle" fontSize="9" fill="#64748b">{space.type}</text>
                    <text x={x + 69} y={y + 82} textAnchor="middle" fontSize="9" fill="#64748b">
                      {space.occupancy} pers • {space.temperature}°C
                    </text>
                    <circle cx={x + 125} cy={y + 15} r="6" fill={occupied ? '#f59e0b' : '#22c55e'} />
                  </g>
                );
              })}

              {/* Capteurs IoT sur le couloir */}
              {currentFloor?.assets.map((asset, i) => (
                <g key={asset.id}>
                  <circle
                    cx={120 + i * 280} cy={200} r="10"
                    fill={asset.health > 70 ? '#10b981' : asset.health > 40 ? '#f59e0b' : '#ef4444'}
                    className="animate-pulse"
                  />
                  <text x={120 + i * 280} y={175} textAnchor="middle" fontSize="9" fill="#475569">{asset.name}</text>
                </g>
              ))}
            </svg>
          </div>

          {/* Légende */}
          <div className="p-3 border-t border-slate-100 bg-slate-50 flex items-center gap-5 text-xs text-slate-600">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-green-400 rounded" /> Disponible</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-yellow-400 rounded" /> Occupé</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-green-500 rounded-full" /> Capteur OK</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-red-500 rounded-full" /> Capteur alerte</span>
          </div>
        </div>

        {/* Panel simulations */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Play className="w-4 h-4 text-primary-500" />
              Simulations de scénarios
            </h3>
            <div className="space-y-2">
              {SCENARIOS.map((s) => {
                const c = COLOR_MAP[s.color];
                const isActive = scenario?.id === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => runSimulation(s)}
                    disabled={running}
                    className={clsx(
                      'w-full flex items-center gap-3 p-3 rounded-xl border-2 transition text-left',
                      isActive
                        ? `${c.border} ${c.bg}`
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50',
                      running && 'opacity-60 cursor-not-allowed'
                    )}
                  >
                    <div className={`w-9 h-9 ${c.bg} ${c.border} border rounded-lg flex items-center justify-center shrink-0`}>
                      <s.icon className={`w-4 h-4 ${c.icon}`} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-900 text-sm">{s.name}</p>
                      <p className="text-xs text-slate-500">{s.desc}</p>
                    </div>
                    {isActive && !running && <CheckCircle className="w-4 h-4 text-primary-500" />}
                  </button>
                );
              })}
            </div>
          </div>

          {running && (
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600" />
                <div>
                  <p className="text-sm font-medium text-slate-900">Simulation en cours…</p>
                  <p className="text-xs text-slate-500">{scenario?.name}</p>
                </div>
              </div>
              <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary-500 rounded-full animate-pulse w-3/4" />
              </div>
            </div>
          )}

          {simulationResult && !running && (
            <div className={`rounded-xl border-2 p-5 ${scenario ? COLOR_MAP[scenario.color].bg : 'bg-white'} ${scenario ? COLOR_MAP[scenario.color].border : 'border-slate-200'}`}>
              <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Résultats — {scenario?.name}
              </h3>
              <div className="space-y-2">
                {Object.entries(simulationResult)
                  .filter(([k]) => k !== 'recommendations')
                  .map(([key, val]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-slate-600 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').trim()}
                      </span>
                      <span className="font-semibold text-slate-900">
                        {Array.isArray(val) ? val.join(', ') : String(val)}
                      </span>
                    </div>
                  ))}
              </div>
              {simulationResult.recommendations && (
                <div className="mt-4 pt-3 border-t border-white/60">
                  <p className="text-xs font-semibold text-slate-700 mb-2">📋 Recommandations</p>
                  <ul className="space-y-1">
                    {simulationResult.recommendations.map((r, i) => (
                      <li key={i} className="text-xs text-slate-700 flex gap-1.5">
                        <span className="text-primary-500 font-bold shrink-0">•</span>{r}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
