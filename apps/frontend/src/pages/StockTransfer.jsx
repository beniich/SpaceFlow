import React, { useState } from 'react';
import { RefreshCw, ArrowRightLeft, Package, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function StockTransfer() {
  const [transfers, setTransfers] = useState([
    {
      id: 'TRF-001',
      item: 'Filtre à air plissé F7',
      qty: 10,
      from: 'Magasin Central A',
      to: 'Local Technique Tour B',
      status: 'COMPLETED',
      date: '2026-08-04'
    },
    {
      id: 'TRF-002',
      item: 'Disjoncteur Tetra 32A',
      qty: 4,
      from: 'Magasin B',
      to: 'Chantier Réhabilitation R3',
      status: 'IN_TRANSIT',
      date: '2026-08-05'
    }
  ]);

  const [newTrf, setNewTrf] = useState({
    item: 'Courroie de transmission B52',
    qty: 2,
    from: 'Magasin Central A',
    to: 'Local HVAC Toiture Nord'
  });

  const handleCreateTransfer = (e) => {
    e.preventDefault();
    const created = {
      id: `TRF-00${transfers.length + 1}`,
      ...newTrf,
      status: 'IN_TRANSIT',
      date: new Date().toISOString().split('T')[0]
    };
    setTransfers([created, ...transfers]);
    toast.success(`Ordre de transfert inter-magasin ${created.id} initiated !`);
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 bg-zinc-950 text-zinc-100 min-h-screen font-sans">
      <div className="pb-4 border-b border-zinc-800">
        <h1 className="text-2xl font-bold font-display uppercase tracking-widest flex items-center gap-2 text-zinc-50">
          <ArrowRightLeft className="w-7 h-7 text-cyan-400" />
          Transferts Inter-Magasins &amp; Mouvements de Stock
        </h1>
        <p className="text-xs font-mono text-zinc-400 mt-1">
          Déplacement de pièces détachées et réaffectation d'équipements entre bâtiments et dépôts
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono text-xs">
        {/* Form */}
        <div className="bg-zinc-900 border border-zinc-800 p-5 space-y-4">
          <h3 className="font-bold text-sm text-zinc-50 border-b border-zinc-800 pb-2 uppercase">
            Nouveau Transfert
          </h3>
          <form onSubmit={handleCreateTransfer} className="space-y-3">
            <div>
              <label className="block text-[10px] text-zinc-400 uppercase mb-1">Désignation Pièce</label>
              <input
                required
                type="text"
                value={newTrf.item}
                onChange={(e) => setNewTrf({ ...newTrf, item: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-700 px-3 py-2 text-zinc-100 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-[10px] text-zinc-400 uppercase mb-1">Quantité à transférer</label>
              <input
                required
                type="number"
                min="1"
                value={newTrf.qty}
                onChange={(e) => setNewTrf({ ...newTrf, qty: Number(e.target.value) })}
                className="w-full bg-zinc-950 border border-zinc-700 px-3 py-2 text-zinc-100 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-[10px] text-zinc-400 uppercase mb-1">Dépôt Source</label>
              <select
                value={newTrf.from}
                onChange={(e) => setNewTrf({ ...newTrf, from: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-700 px-3 py-2 text-zinc-100 focus:outline-none focus:border-cyan-500"
              >
                <option value="Magasin Central A">Magasin Central A</option>
                <option value="Magasin B">Magasin B</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] text-zinc-400 uppercase mb-1">Emplacement Destination</label>
              <input
                required
                type="text"
                value={newTrf.to}
                onChange={(e) => setNewTrf({ ...newTrf, to: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-700 px-3 py-2 text-zinc-100 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-zinc-950 font-bold uppercase transition"
            >
              Exécuter Transfert
            </button>
          </form>
        </div>

        {/* History List */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 p-5 space-y-4">
          <h3 className="font-bold text-sm text-zinc-50 border-b border-zinc-800 pb-2 uppercase">
            Historique des Transferts Recents
          </h3>
          <div className="space-y-3">
            {transfers.map((t) => (
              <div key={t.id} className="p-3 bg-zinc-950 border border-zinc-800 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-cyan-400">{t.id}</span>
                    <span className="font-bold text-zinc-100">{t.item}</span>
                    <span className="px-2 py-0.5 bg-zinc-800 text-zinc-300 font-bold">{t.qty} pcs</span>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    De : <strong className="text-zinc-200">{t.from}</strong> ➔ Vers : <strong className="text-zinc-200">{t.to}</strong>
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold uppercase border ${
                      t.status === 'COMPLETED'
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                        : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                    }`}
                  >
                    {t.status === 'COMPLETED' ? 'Terminé' : 'En Transit'}
                  </span>
                  <p className="text-[10px] text-zinc-500 mt-1">{t.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
