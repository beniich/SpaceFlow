import React, { useState, useEffect } from 'react';
import { Box, Search, Filter, Plus, RefreshCw, AlertTriangle } from 'lucide-react';
import api from '../services/api';
import { Link } from 'react-router-dom';

export default function AssetsInventory() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/assets');
      setAssets(Array.isArray(data) ? data : []);
    } catch {
      setAssets([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = assets.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    (a.serialNumber && a.serialNumber.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 bg-zinc-950 text-zinc-100 min-h-screen font-sans font-mono text-xs">
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold font-display uppercase tracking-widest flex items-center gap-2 text-zinc-50">
            <Box className="w-7 h-7 text-cyan-400" />
            Inventaire Général des Équipements
          </h1>
          <p className="text-xs text-zinc-400 mt-1">Registre complet des actifs techniques et fiches de vie</p>
        </div>
        <button onClick={loadAssets} className="p-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 transition">
          <RefreshCw className={`w-4 h-4 text-zinc-300 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="flex items-center justify-between gap-4 bg-zinc-900 p-4 border border-zinc-800">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Rechercher équipement..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-700 pl-9 pr-3 py-1.5 text-zinc-100 focus:outline-none focus:border-cyan-500"
          />
        </div>
        <span className="text-zinc-400">Total : <strong>{filtered.length}</strong> actifs</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((asset) => (
          <div key={asset.id} className="bg-zinc-900 border border-zinc-800 p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-zinc-100">{asset.name}</h3>
                <p className="text-[10px] text-zinc-500">{asset.category || 'Général'} • N° {asset.serialNumber || 'N/A'}</p>
              </div>
              <span className={`px-2 py-0.5 text-[10px] uppercase font-bold border ${asset.status === 'OPERATIONAL' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' : 'bg-rose-500/20 text-rose-400 border-rose-500/40'}`}>
                {asset.status === 'OPERATIONAL' ? 'Actif' : 'Panne'}
              </span>
            </div>
            <div className="pt-2 border-t border-zinc-800 flex justify-between items-center">
              <span className="text-zinc-400">Santé : <strong className="text-emerald-400">{asset.healthScore || 90}%</strong></span>
              <Link to={`/assets/${asset.id}`} className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-cyan-400 font-bold uppercase text-[10px]">
                Fiche Technique
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
