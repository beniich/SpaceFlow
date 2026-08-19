import React, { useState } from 'react';
import {
  ShoppingCart, Plus, FileText, CheckCircle2, Clock, AlertCircle,
  TrendingUp, Building, ArrowUpRight, Filter
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Procurement() {
  const [orders, setOrders] = useState([
    {
      id: 'PO-2026-001',
      supplier: 'Schneider Electric France',
      items: 'Disjoncteurs TGBT & Variateurs Altivar',
      totalCost: 14250.0,
      status: 'APPROVED',
      date: '2026-08-01',
      expectedDelivery: '2026-08-10'
    },
    {
      id: 'PO-2026-002',
      supplier: 'Daikin Europe Service',
      items: 'Compresseur Inverter R410A pour CHLR-02',
      totalCost: 8900.0,
      status: 'PENDING',
      date: '2026-08-04',
      expectedDelivery: '2026-08-12'
    },
    {
      id: 'PO-2026-003',
      supplier: 'Camfil Filters SAS',
      items: 'Lots de 50 Filtres F7 & G4 Bâtiment Horizon',
      totalCost: 3450.0,
      status: 'DELIVERED',
      date: '2026-07-28',
      expectedDelivery: '2026-08-02'
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPO, setNewPO] = useState({
    supplier: '',
    items: '',
    totalCost: '',
    expectedDelivery: ''
  });

  const handleCreatePO = (e) => {
    e.preventDefault();
    const created = {
      id: `PO-2026-0${orders.length + 1}`,
      supplier: newPO.supplier,
      items: newPO.items,
      totalCost: parseFloat(newPO.totalCost) || 0,
      status: 'PENDING',
      date: new Date().toISOString().split('T')[0],
      expectedDelivery: newPO.expectedDelivery || '2026-08-20'
    };
    setOrders([created, ...orders]);
    toast.success(`Bon de commande ${created.id} créé avec succès !`);
    setShowCreateModal(false);
    setNewPO({ supplier: '', items: '', totalCost: '', expectedDelivery: '' });
  };

  const handleApprovePO = (id) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: 'APPROVED' } : o))
    );
    toast.success(`Bon de commande ${id} approuvé !`);
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 bg-zinc-950 text-zinc-100 min-h-screen font-sans">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold font-display uppercase tracking-widest flex items-center gap-2 text-zinc-50">
            <ShoppingCart className="w-7 h-7 text-cyan-400" />
            Achats &amp; Approvisonnement (Procurement)
          </h1>
          <p className="text-xs font-mono text-zinc-400 mt-1">
            Gestion des fournisseurs, validation des bons de commande et suivi des livraisons de pièces
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-zinc-950 font-mono font-bold text-xs uppercase flex items-center gap-2 transition"
        >
          <Plus className="w-4 h-4" /> Nouveau Bon de Commande
        </button>
      </div>

      {/* Orders Table */}
      <div className="bg-zinc-900 border border-zinc-800 overflow-x-auto font-mono text-xs">
        <table className="w-full text-left">
          <thead className="bg-zinc-950 border-b border-zinc-800 uppercase text-zinc-400 text-[10px] tracking-wider">
            <tr>
              <th className="p-3">N° Commande</th>
              <th className="p-3">Fournisseur</th>
              <th className="p-3">Articles / Descriptif</th>
              <th className="p-3 text-right">Montant Total</th>
              <th className="p-3 text-center">Statut</th>
              <th className="p-3">Livraison Prévue</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800 text-zinc-200">
            {orders.map((po) => (
              <tr key={po.id} className="hover:bg-zinc-800/50 transition">
                <td className="p-3 font-bold text-cyan-400">{po.id}</td>
                <td className="p-3 font-bold text-zinc-100">{po.supplier}</td>
                <td className="p-3 text-zinc-300">{po.items}</td>
                <td className="p-3 text-right font-bold text-zinc-100">{po.totalCost.toLocaleString()} €</td>
                <td className="p-3 text-center">
                  <span
                    className={`font-bold px-2.5 py-0.5 text-[10px] uppercase border ${
                      po.status === 'DELIVERED'
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                        : po.status === 'APPROVED'
                        ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
                        : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                    }`}
                  >
                    {po.status === 'DELIVERED' ? 'Livré' : po.status === 'APPROVED' ? 'Approuvé' : 'En Attente'}
                  </span>
                </td>
                <td className="p-3 text-zinc-400">{po.expectedDelivery}</td>
                <td className="p-3 text-center">
                  {po.status === 'PENDING' && (
                    <button
                      onClick={() => handleApprovePO(po.id)}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-bold uppercase text-[10px]"
                    >
                      Approuver
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal New PO */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 p-6 max-w-lg w-full font-mono text-xs space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <h3 className="font-bold text-sm text-zinc-50 uppercase tracking-wider">Créer un Bon de Commande Achats</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-zinc-400 hover:text-zinc-100">✕</button>
            </div>

            <form onSubmit={handleCreatePO} className="space-y-3">
              <div>
                <label className="block text-[10px] text-zinc-400 uppercase mb-1">Fournisseur</label>
                <input
                  required
                  type="text"
                  placeholder="ex: Schneider Electric, Daikin..."
                  value={newPO.supplier}
                  onChange={(e) => setNewPO({ ...newPO, supplier: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 px-3 py-2 text-zinc-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-[10px] text-zinc-400 uppercase mb-1">Description des Articles</label>
                <textarea
                  required
                  rows="2"
                  placeholder="Liste des pièces ou équipements à commander..."
                  value={newPO.items}
                  onChange={(e) => setNewPO({ ...newPO, items: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 px-3 py-2 text-zinc-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-zinc-400 uppercase mb-1">Montant Estimé (€)</label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    placeholder="2500.00"
                    value={newPO.totalCost}
                    onChange={(e) => setNewPO({ ...newPO, totalCost: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 px-3 py-2 text-zinc-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-zinc-400 uppercase mb-1">Date Livraison Estimée</label>
                  <input
                    type="date"
                    value={newPO.expectedDelivery}
                    onChange={(e) => setNewPO({ ...newPO, expectedDelivery: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 px-3 py-2 text-zinc-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold uppercase"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-zinc-950 font-bold uppercase"
                >
                  Émettre Commande
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
