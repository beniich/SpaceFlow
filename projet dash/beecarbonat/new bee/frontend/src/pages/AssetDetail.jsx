import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Box, Wrench, Activity, AlertTriangle, ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react';
import api from '../services/api';

export default function AssetDetail() {
  const { id } = useParams();
  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAsset();
  }, [id]);

  const loadAsset = async () => {
    setLoading(true);
    try {
      if (id) {
        const { data } = await api.get(`/assets/${id}`);
        setAsset(data);
      } else {
        const { data } = await api.get('/assets');
        setAsset(data[0] || null);
      }
    } catch {
      setAsset({
        id: id || 'ast-demo-1',
        name: 'Groupe Frigorifique CHLR-02',
        serialNumber: 'SN-SAP-001',
        category: 'HVAC',
        status: 'OPERATIONAL',
        healthScore: 89,
        location: 'Toiture Bâtiment Alpha',
        manufacturer: 'Carrier Inc.',
        acquisitionDate: '2022-03-15',
        workOrders: [
          { id: 'wo-1', number: 'WO-2026-089', title: 'Entretien des filtres condenseur', status: 'COMPLETED', date: '2026-07-20' }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-zinc-400 font-mono text-xs bg-zinc-950 min-h-screen">
        Chargement des détails de l'équipement...
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 bg-zinc-950 text-zinc-100 min-h-screen font-sans font-mono text-xs">
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-4">
          <Link to="/assets" className="p-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 transition">
            <ArrowLeft className="w-4 h-4 text-zinc-300" />
          </Link>
          <div>
            <h1 className="text-xl font-bold font-display uppercase tracking-widest text-zinc-50 flex items-center gap-2">
              <Box className="w-6 h-6 text-cyan-400" />
              {asset?.name}
            </h1>
            <p className="text-xs text-zinc-400">N° Série : {asset?.serialNumber} • Emplacement : {asset?.location}</p>
          </div>
        </div>

        <span
          className={`px-3 py-1 font-bold text-xs uppercase border ${
            asset?.status === 'OPERATIONAL'
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
              : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
          }`}
        >
          {asset?.status === 'OPERATIONAL' ? 'Opérationnel' : 'En Panne'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 p-5 space-y-3">
          <h3 className="font-bold text-zinc-100 uppercase border-b border-zinc-800 pb-2">Spécifications Techniques</h3>
          <div className="space-y-2 text-zinc-300">
            <div className="flex justify-between">
              <span className="text-zinc-500">Catégorie :</span>
              <span className="font-bold">{asset?.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Constructeur :</span>
              <span>{asset?.manufacturer || 'Carrier'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Date Mise en Service :</span>
              <span>{asset?.acquisitionDate ? new Date(asset.acquisitionDate).toLocaleDateString() : '2022-03-15'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Santé Équipement :</span>
              <span className="font-bold text-emerald-400">{asset?.healthScore}%</span>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 bg-zinc-900 border border-zinc-800 p-5 space-y-3">
          <h3 className="font-bold text-zinc-100 uppercase border-b border-zinc-800 pb-2">Historique d'Interventions</h3>
          <div className="space-y-2">
            {(asset?.workOrders || []).map((wo) => (
              <div key={wo.id} className="p-3 bg-zinc-950 border border-zinc-800 flex justify-between items-center">
                <div>
                  <span className="font-bold text-cyan-400">{wo.number}</span>
                  <p className="text-zinc-200">{wo.title}</p>
                </div>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] uppercase font-bold">
                  {wo.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
