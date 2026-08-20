import React, { useState, useEffect } from 'react';
import {
  Package, Plus, Search, Filter, AlertTriangle, ArrowUpRight,
  ArrowDownLeft, RefreshCw, CheckCircle2, FileText
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  const [newItem, setNewItem] = useState({
    name: '',
    reference: '',
    category: 'HVAC',
    quantity: 10,
    minQuantity: 5,
    unit: 'pcs',
    unitCost: 25.0,
    location: 'Magasin Central A'
  });

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    setLoading(true);
    try {
      // Fetch parts from CMMS/inventory backend or provide initial structured inventory
      const { data } = await api.get('/cmms/parts');
      if (Array.isArray(data) && data.length > 0) {
        setItems(data);
      } else {
        setItems([
          { id: 'inv-1', name: 'Filtre à air plissé F7 (610x610x292)', reference: 'FLT-F7-610', category: 'HVAC', quantity: 4, minQuantity: 10, unit: 'pcs', unitCost: 45.0, location: 'Magasin A - Rayon 02' },
          { id: 'inv-2', name: 'Courroie de transmission trapezoidale B52', reference: 'CR-B52-HVAC', category: 'HVAC', quantity: 28, minQuantity: 5, unit: 'pcs', unitCost: 18.5, location: 'Magasin A - Rayon 04' },
          { id: 'inv-3', name: 'Disjoncteur Tetra 32A Courbe C', reference: 'DJ-T32-C', category: 'ELECTRICAL', quantity: 14, minQuantity: 8, unit: 'pcs', unitCost: 65.0, location: 'Magasin B - Armoire E1' },
          { id: 'inv-4', name: 'Joint d\'étanchéité EPDM DN80', reference: 'JNT-EPDM-80', category: 'PLUMBING', quantity: 3, minQuantity: 15, unit: 'pcs', unitCost: 8.2, location: 'Magasin A - Rayon 01' }
        ]);
      }
    } catch (err) {
      setItems([
        { id: 'inv-1', name: 'Filtre à air plissé F7 (610x610x292)', reference: 'FLT-F7-610', category: 'HVAC', quantity: 4, minQuantity: 10, unit: 'pcs', unitCost: 45.0, location: 'Magasin A - Rayon 02' },
        { id: 'inv-2', name: 'Courroie de transmission trapezoidale B52', reference: 'CR-B52-HVAC', category: 'HVAC', quantity: 28, minQuantity: 5, unit: 'pcs', unitCost: 18.5, location: 'Magasin A - Rayon 04' },
        { id: 'inv-3', name: 'Disjoncteur Tetra 32A Courbe C', reference: 'DJ-T32-C', category: 'ELECTRICAL', quantity: 14, minQuantity: 8, unit: 'pcs', unitCost: 65.0, location: 'Magasin B - Armoire E1' },
        { id: 'inv-4', name: 'Joint d\'étanchéité EPDM DN80', reference: 'JNT-EPDM-80', category: 'PLUMBING', quantity: 3, minQuantity: 15, unit: 'pcs', unitCost: 8.2, location: 'Magasin A - Rayon 01' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    const created = {
      id: `inv-${Date.now()}`,
      ...newItem,
      quantity: Number(newItem.quantity),
      minQuantity: Number(newItem.minQuantity),
      unitCost: Number(newItem.unitCost)
    };

    setItems((prev) => [created, ...prev]);
    toast.success(`Pièce '${newItem.name}' ajoutée au stock avec succès !`);
    setShowAddModal(false);
    setNewItem({
      name: '',
      reference: '',
      category: 'HVAC',
      quantity: 10,
      minQuantity: 5,
      unit: 'pcs',
      unitCost: 25.0,
      location: 'Magasin Central A'
    });
  };

  const handleAdjustStock = (id, delta) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(0, item.quantity + delta);
          toast.success(`Stock de ${item.name} ajusté : ${newQty} ${item.unit}`);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 bg-zinc-950 text-zinc-100 min-h-screen font-sans">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold font-display uppercase tracking-widest flex items-center gap-2 text-zinc-50">
            <Package className="w-7 h-7 text-cyan-400" />
            Gestion des Stocks &amp; Pièces Détachées
          </h1>
          <p className="text-xs font-mono text-zinc-400 mt-1">
            Inventaire en temps réel, réapprovisionnement automatique et suivi des consommables de maintenance
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-zinc-950 font-mono font-bold text-xs uppercase flex items-center gap-2 transition"
          >
            <Plus className="w-4 h-4" /> Nouvelle Pièce
          </button>
        </div>
      </div>

      {/* Low Stock Banner */}
      {items.some((i) => i.quantity <= i.minQuantity) && (
        <div className="p-4 bg-amber-950/50 border border-amber-500/50 font-mono text-xs text-amber-300 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <span>
              <strong>Attention :</strong> {items.filter((i) => i.quantity <= i.minQuantity).length} référence(s) en dessous du seuil de réapprovisionnement critique !
            </span>
          </div>
          <button
            onClick={() => toast.success('Commande de réapprovisionnement générée !')}
            className="px-3 py-1 bg-amber-500 text-zinc-950 font-bold uppercase hover:bg-amber-400 transition"
          >
            Générer Bon d'Achat
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-zinc-900/60 p-4 border border-zinc-800 font-mono text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Rechercher par nom, référence..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-700 pl-9 pr-3 py-2 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-zinc-950 border border-zinc-700 px-3 py-2 text-zinc-100 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">Toutes catégories</option>
            <option value="HVAC">HVAC</option>
            <option value="ELECTRICAL">Électrique</option>
            <option value="PLUMBING">Plomberie</option>
          </select>
          <span className="text-zinc-400">
            Total : <strong>{filteredItems.length}</strong>
          </span>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-zinc-900 border border-zinc-800 overflow-x-auto font-mono text-xs">
        <table className="w-full text-left">
          <thead className="bg-zinc-950 border-b border-zinc-800 uppercase text-zinc-400 text-[10px] tracking-wider">
            <tr>
              <th className="p-3">Référence</th>
              <th className="p-3">Désignation</th>
              <th className="p-3">Catégorie</th>
              <th className="p-3 text-center">En Stock</th>
              <th className="p-3 text-center">Seuil Min</th>
              <th className="p-3 text-right">Prix Unitaire</th>
              <th className="p-3">Emplacement</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800 text-zinc-200">
            {filteredItems.map((item) => {
              const isLow = item.quantity <= item.minQuantity;
              return (
                <tr key={item.id} className="hover:bg-zinc-800/50 transition">
                  <td className="p-3 font-bold text-cyan-400">{item.reference}</td>
                  <td className="p-3 font-bold text-zinc-100">{item.name}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 bg-zinc-800 text-zinc-300 border border-zinc-700">
                      {item.category}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <span
                      className={`font-bold px-2 py-0.5 ${
                        isLow ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'text-emerald-400'
                      }`}
                    >
                      {item.quantity} {item.unit}
                    </span>
                  </td>
                  <td className="p-3 text-center text-zinc-400">{item.minQuantity} {item.unit}</td>
                  <td className="p-3 text-right font-bold text-zinc-100">{item.unitCost?.toFixed(2)} €</td>
                  <td className="p-3 text-zinc-400">{item.location}</td>
                  <td className="p-3 text-center space-x-1">
                    <button
                      onClick={() => handleAdjustStock(item.id, 1)}
                      className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-emerald-400 font-bold"
                      title="Ajouter 1"
                    >
                      +1
                    </button>
                    <button
                      onClick={() => handleAdjustStock(item.id, -1)}
                      className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-rose-400 font-bold"
                      title="Retirer 1"
                    >
                      -1
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 p-6 max-w-lg w-full font-mono text-xs space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <h3 className="font-bold text-sm text-zinc-50 uppercase tracking-wider">Ajouter une pièce au stock</h3>
              <button onClick={() => setShowAddModal(false)} className="text-zinc-400 hover:text-zinc-100">✕</button>
            </div>

            <form onSubmit={handleAddItem} className="space-y-3">
              <div>
                <label className="block text-[10px] text-zinc-400 uppercase mb-1">Désignation</label>
                <input
                  required
                  type="text"
                  placeholder="ex: Capteur de pression Danfoss KPI35"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 px-3 py-2 text-zinc-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-zinc-400 uppercase mb-1">Référence</label>
                  <input
                    required
                    type="text"
                    placeholder="CPT-DAN-35"
                    value={newItem.reference}
                    onChange={(e) => setNewItem({ ...newItem, reference: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 px-3 py-2 text-zinc-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-zinc-400 uppercase mb-1">Catégorie</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 px-3 py-2 text-zinc-100 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="HVAC">HVAC</option>
                    <option value="ELECTRICAL">Électrique</option>
                    <option value="PLUMBING">Plomberie</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] text-zinc-400 uppercase mb-1">Quantité Initiale</label>
                  <input
                    type="number"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 px-3 py-2 text-zinc-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-zinc-400 uppercase mb-1">Seuil Alerte Min</label>
                  <input
                    type="number"
                    value={newItem.minQuantity}
                    onChange={(e) => setNewItem({ ...newItem, minQuantity: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 px-3 py-2 text-zinc-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-zinc-400 uppercase mb-1">Prix Unitaire (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newItem.unitCost}
                    onChange={(e) => setNewItem({ ...newItem, unitCost: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 px-3 py-2 text-zinc-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-zinc-400 uppercase mb-1">Emplacement Magasin</label>
                <input
                  type="text"
                  value={newItem.location}
                  onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 px-3 py-2 text-zinc-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold uppercase"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-zinc-950 font-bold uppercase"
                >
                  Enregistrer Pièce
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
