import { useEffect, useState } from 'react';
import api from '../services/api';
import { io } from 'socket.io-client';
import {
  Box, Activity, Play, Camera, Flame, Zap, Wrench,
  Users, AlertTriangle, Layers
} from 'lucide-react';
import BuildingViewer from '../components/3d/BuildingViewer';

const SCENARIOS = [
  { id: 'fire', name: 'Incendie', icon: Flame, color: 'red', desc: 'Évacuation et intervention urgence' },
  { id: 'evacuation', name: 'Évacuation global', icon: Users, color: 'orange', desc: 'Plan d\'évacuation par étage' },
  { id: 'energy_optim', name: 'Optimisation énergie', icon: Zap, color: 'yellow', desc: 'Réduction consommation HVAC' },
  { id: 'maintenance', name: 'Impact Maintenance', icon: Wrench, color: 'blue', desc: 'Simulation d\'arrêt équipement' }
];

export default function DigitalTwin() {
  const [overview, setOverview] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState(1);
  const [scenario, setScenario] = useState(null);
  const [simulationResult, setSimulationResult] = useState(null);
  const [running, setRunning] = useState(false);
  const [twinId] = useState('demo-twin-id');

  useEffect(() => {
    loadOverview();

    // Connexion WebSocket pour le Temps Réel (IoT & Jumeau Numérique)
    const socket = io('http://localhost:8081', { transports: ['websocket', 'polling'] });

    socket.on('connect', () => {
      console.log('[DigitalTwin] WebSocket Connecté');
    });

    socket.on('dashboard:update', (msg) => {
      if (msg.type === 'sensor' && msg.data) {
        setOverview(prev => {
          if (!prev) return prev;
          
          // Clonage profond simplifié pour muter l'état proprement
          const next = JSON.parse(JSON.stringify(prev));
          let sensorFound = false;
          
          next.floors.forEach(floor => {
            floor.spaces.forEach(space => {
              if (space.id === msg.data.sensorId || space.name.includes(msg.data.sensorId)) {
                if (msg.data.type === 'temperature') space.temperature = msg.data.value;
                sensorFound = true;
              }
            });
          });

          // Si on veut aussi update les stats globales
          if (sensorFound && msg.data.type === 'temperature' && msg.data.value > 25) {
            next.stats.avgHealth = Math.max(0, next.stats.avgHealth - 1); // Baisse de la santé
          }

          return next;
        });
      }
    });

    socket.on('sensor:reading', (msg) => {
      console.log('[DigitalTwin] Nouvelle lecture IoT:', msg);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const loadOverview = async () => {
    try {
      const { data } = await api.get('/digitaltwin/overview/main-building');
      setOverview(data);
    } catch (err) {
      setOverview({
        building: { name: 'Tour Horizon Alpha', floors: 5, totalArea: 15000 },
        stats: {
          totalAssets: 48,
          operationalAssets: 44,
          totalSpaces: 120,
          occupiedSpaces: 89,
          totalSensors: 28,
          avgHealth: 89
        },
        floors: Array.from({ length: 5 }, (_, i) => ({
          number: i + 1,
          spaces: Array.from({ length: 8 }, (_, j) => ({
            id: `${i + 1}-${j}`,
            name: `Espace E${i + 1}.${j + 1}`,
            status: j % 2 === 0 ? 'occupied' : 'available',
            type: j < 2 ? 'Salle Réunion' : 'Bureau',
            temperature: 20 + Math.random() * 3,
            occupancy: Math.floor(Math.random() * 8)
          })),
          assets: Array.from({ length: 3 }, (_, j) => ({
            id: `asset-${i}-${j}`,
            name: `HVAC-R${i + 1}.${j + 1}`,
            status: 'OPERATIONAL',
            health: 75 + Math.floor(Math.random() * 25)
          }))
        }))
      });
    }
  };

  const runSimulation = async (sc) => {
    setRunning(true);
    setScenario(sc);

    try {
      const { data } = await api.post(`/digitaltwin/${twinId}/simulate`, {
        scenario: sc.id,
        parameters: { occupancy: 150 }
      });
      setSimulationResult(typeof data.results === 'string' ? JSON.parse(data.results) : data.results);
    } catch (err) {
      const fallbackResults = {
        fire: {
          evacuationTime: '7.8 minutes',
          peopleAtRisk: 64,
          affectedZones: ['Zone A1', 'Zone A2'],
          safeExits: 4,
          recommendations: [
            'Déclencher l\'alarme de secteur B',
            'Ouvrir automatiquement les sas de secours Nord',
            'Déployer l\'équipe de sécurité niveau 2'
          ]
        },
        evacuation: {
          evacuationTime: '5.2 minutes',
          bottleneck: 'Escalier principal B',
          timeToClear: '6.5 minutes',
          optimalPath: ['Sortie de secours Est', 'Porte Principale']
        },
        energy_optim: {
          currentConsumption: '8500 kWh',
          optimizedConsumption: '6800 kWh',
          savingsPercent: '20%',
          recommendations: [
            'Ajuster la température de consigne HVAC à 21°C',
            'Activer la régulation d\'éclairage adaptative',
            'Couper la ventilation des salles inoccupées après 19h'
          ]
        },
        maintenance: {
          downtime: '4 heures',
          affectedAssets: 8,
          costImpact: '3 400 €',
          alternativeSchedule: 'Intervention recommandée Samedi 06h00'
        }
      };

      setTimeout(() => {
        setSimulationResult(fallbackResults[sc.id] || {});
        setRunning(false);
      }, 1200);
      return;
    }
    setRunning(false);
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 bg-zinc-950 text-zinc-100 min-h-screen font-sans">
      <div className="pb-4 border-b border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display uppercase tracking-widest text-zinc-50 flex items-center gap-2">
            <Box className="w-7 h-7 text-cyan-400" />
            Jumeau Numérique (Digital Twin 3D)
          </h1>
          <p className="text-xs font-mono text-zinc-400 mt-1">{overview?.building?.name || 'Bâtiment Principal'} • Visualisation & Moteur de Simulation IoT</p>
        </div>
        <button
          onClick={() => api.post(`/digitaltwin/${twinId}/snapshot`)}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-mono text-xs font-bold uppercase transition shadow-sm"
        >
          <Camera className="w-4 h-4" /> Capturer Instantané (Snapshot)
        </button>
      </div>

      {overview && (
        <>
          {/* Métriques clés */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 font-mono text-xs">
            <div className="bg-zinc-900 border border-zinc-800 p-4 space-y-1">
              <p className="text-zinc-500 uppercase text-[10px]">Bâtiment</p>
              <p className="text-xl font-bold text-zinc-100">{overview.building.floors} étages</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 p-4 space-y-1">
              <p className="text-zinc-500 uppercase text-[10px]">Actifs en service</p>
              <p className="text-xl font-bold text-emerald-400">
                {overview.stats.operationalAssets} / {overview.stats.totalAssets}
              </p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 p-4 space-y-1">
              <p className="text-zinc-500 uppercase text-[10px]">Occupation Espaces</p>
              <p className="text-xl font-bold text-cyan-400">
                {overview.stats.occupiedSpaces} / {overview.stats.totalSpaces}
              </p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 p-4 space-y-1">
              <p className="text-zinc-500 uppercase text-[10px]">Capteurs IoT</p>
              <p className="text-xl font-bold text-amber-400">{overview.stats.totalSensors}</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 p-4 space-y-1">
              <p className="text-zinc-500 uppercase text-[10px]">Santé Globale</p>
              <p className="text-xl font-bold text-emerald-400">{Math.round(overview.stats.avgHealth)}%</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 p-4 space-y-1">
              <p className="text-zinc-500 uppercase text-[10px]">Superficie Total</p>
              <p className="text-xl font-bold text-zinc-100">{overview.building.totalArea} m²</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Visualiseur SVG/3D */}
            <div className="lg:col-span-2">
              <BuildingViewer
                buildingName={overview.building.name}
                floors={overview.floors}
                selectedFloor={selectedFloor}
                onSelectFloor={setSelectedFloor}
              />
            </div>

            {/* Panneau de Simulation */}
            <div className="space-y-4 font-mono text-xs">
              <div className="bg-zinc-900 border border-zinc-800 p-5">
                <h3 className="font-bold font-display uppercase tracking-wider text-zinc-100 mb-4 flex items-center gap-2">
                  <Play className="w-4 h-4 text-cyan-400" /> Lancer une Simulation
                </h3>
                <div className="space-y-3">
                  {SCENARIOS.map(s => (
                    <button
                      key={s.id}
                      onClick={() => runSimulation(s)}
                      disabled={running}
                      className={`w-full flex items-center gap-3 p-3 border transition text-left ${
                        scenario?.id === s.id
                          ? 'border-cyan-500 bg-cyan-950/40 text-cyan-300'
                          : 'border-zinc-800 hover:border-zinc-700 bg-zinc-950/60 text-zinc-300'
                      }`}
                    >
                      <div className="p-2 bg-zinc-900 border border-zinc-700 shrink-0">
                        <s.icon className="w-5 h-5 text-cyan-400" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-xs uppercase text-zinc-100">{s.name}</p>
                        <p className="text-[11px] text-zinc-400">{s.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {running && (
                <div className="bg-zinc-900 border border-zinc-800 p-5 flex items-center gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-cyan-400" />
                  <span className="text-xs text-cyan-400">Calcul des algorithmes de simulation...</span>
                </div>
              )}

              {simulationResult && !running && (
                <div className="bg-zinc-900 border border-zinc-800 p-5">
                  <h3 className="font-bold font-display uppercase tracking-wider text-zinc-100 mb-3 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400" /> Résultats de Simulation
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(simulationResult).map(([key, val]) => {
                      if (key === 'recommendations') return null;
                      return (
                        <div key={key} className="flex justify-between text-xs py-1 border-b border-zinc-800">
                          <span className="text-zinc-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                          <span className="font-bold text-zinc-100">{Array.isArray(val) ? val.join(', ') : val}</span>
                        </div>
                      );
                    })}
                    {simulationResult.recommendations && (
                      <div className="mt-3 pt-2">
                        <p className="text-xs font-bold text-zinc-300 mb-2 uppercase">Recommandations :</p>
                        <ul className="space-y-1">
                          {simulationResult.recommendations.map((r, i) => (
                            <li key={i} className="text-xs text-zinc-400 flex gap-1.5">
                              <span className="text-cyan-400 font-bold">•</span> {r}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
