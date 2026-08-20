import { useEffect, useState } from 'react';
import api from '../services/api';
import { MapPin, Users, Maximize2, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Spaces() {
  const [spaces, setSpaces] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [floor, setFloor] = useState(1);
  const [buildingId, setBuildingId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/buildings').then(({ data }) => {
      const bList = Array.isArray(data) ? data : (data?.data || []);
      setBuildings(bList);
      if (bList[0]) setBuildingId(bList[0].id);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!buildingId) return;
    setLoading(true);
    api.get(`/assets/spaces?buildingId=${buildingId}`)
      .then(({ data }) => setSpaces(Array.isArray(data) ? data : (data?.data || [])))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [buildingId]);

  const totalFloors = Math.max(...spaces.map(s => s.floor), 1);
  const filtered = spaces.filter(s => s.floor === floor);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 bg-zinc-950 text-zinc-100 min-h-screen font-sans">
      <div className="pb-4 border-b border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display uppercase tracking-widest text-zinc-50 flex items-center gap-2">
            <MapPin className="w-7 h-7 text-cyan-400" />
            Plan des Espaces &amp; Zonation
          </h1>
          <p className="text-xs font-mono text-zinc-400 mt-1">{spaces.length} espaces répertoriés</p>
        </div>
        <div className="flex gap-2">
          <select
            value={buildingId || ''}
            onChange={e => setBuildingId(e.target.value)}
            className="px-3 py-2 bg-zinc-900 border border-zinc-700 text-zinc-100 font-mono text-xs focus:outline-none focus:border-cyan-500"
          >
            {buildings.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4 flex-wrap font-mono text-xs">
        <span className="text-zinc-500 text-[10px] uppercase font-bold mr-2">Étage:</span>
        {Array.from({ length: totalFloors }, (_, i) => i + 1).map(f => (
          <button
            key={f}
            onClick={() => setFloor(f)}
            className={`w-9 h-9 font-bold transition border ${
              floor === f ? 'bg-cyan-500 text-zinc-950 border-cyan-400' : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-100 hover:border-zinc-700'
            }`}
          >
            E{f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-zinc-500 font-mono text-xs">Chargement de la cartographie...</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 font-mono text-xs">
          {filtered.map(s => (
            <div
              key={s.id}
              className={`p-4 border transition ${
                s.status === 'occupied' ? 'border-amber-500/40 bg-amber-950/20' : 'border-emerald-500/40 bg-emerald-950/20'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-zinc-100 font-sans">{s.name}</span>
                <span className={`w-2 h-2 rounded-full ${s.status === 'occupied' ? 'bg-amber-400' : 'bg-emerald-400'}`} />
              </div>
              <p className="text-[10px] text-zinc-400 capitalize mb-3">
                {s.type === 'meeting' ? 'Réunion' : s.type === 'office' ? 'Bureau' : 'Commun'}
              </p>
              <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-2 border-t border-zinc-800/60">
                <span className="flex items-center gap-1"><Users className="w-3 h-3 text-cyan-400" /> {s.occupancy}/{s.capacity}</span>
                <span className="flex items-center gap-1"><Maximize2 className="w-3 h-3 text-cyan-400" /> {s.area}m²</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
