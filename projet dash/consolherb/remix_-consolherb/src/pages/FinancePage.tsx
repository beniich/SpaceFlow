import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight, Plus, Package, Percent, FileText } from 'lucide-react';
import { apiGet, apiPost } from '../api/apiService';
import { useStore } from '../store/useStore';

interface Transaction {
  id: string;
  cropName: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  description?: string;
  date: string;
}

interface ROISummary {
  cropName: string;
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  roiPercentage: number;
}

export default function FinancePage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [roiList, setRoiList] = useState<ROISummary[]>([]);
  const [activeTab, setActiveTab] = useState<'records' | 'roi'>('roi');
  const [loading, setLoading] = useState(true);

  // Form states
  const [showTxForm, setShowTxForm] = useState(false);
  const [showSaleForm, setShowSaleForm] = useState(false);
  const [txCrop, setTxCrop] = useState('Tomato');
  const [txAmount, setTxAmount] = useState('');
  const [txType, setTxType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');
  const [txCategory, setTxCategory] = useState('FERTILIZER');
  const [txDesc, setTxDesc] = useState('');

  const [saleCrop, setSaleCrop] = useState('Tomato');
  const [saleQty, setSaleQty] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [saleBuyer, setSaleBuyer] = useState('');

  const addLog = useStore((s) => s.addLog);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [txData, roiData] = await Promise.all([
        apiGet<Transaction[]>('/finance/records'),
        apiGet<ROISummary[]>('/finance/roi'),
      ]);
      setTransactions(txData || []);
      setRoiList(roiData || []);
    } catch (err: any) {
      addLog('error', `Échec de chargement des données financières: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateTx = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!txAmount || Number(txAmount) <= 0) return;
    try {
      await apiPost('/finance/records', {
        cropName: txCrop,
        amount: Number(txAmount),
        type: txType,
        category: txCategory,
        description: txDesc,
      });
      addLog('success', `Transaction ajoutée : ${txType === 'INCOME' ? '+' : '-'}${txAmount}€ pour ${txCrop}`);
      setShowTxForm(false);
      setTxAmount('');
      setTxDesc('');
      fetchData();
    } catch (err: any) {
      addLog('error', `Erreur lors de l'ajout de la transaction : ${err.message}`);
    }
  };

  const handleRecordSale = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!saleQty || !salePrice) return;
    try {
      const qty = Number(saleQty);
      const price = Number(salePrice);
      await apiPost('/finance/sales', {
        cropName: saleCrop,
        quantity: qty,
        unitPrice: price,
        buyer: saleBuyer,
      });
      addLog('success', `Vente enregistrée : ${qty} unités de ${saleCrop} à ${price}€/u (Total: ${qty * price}€)`);
      setShowSaleForm(false);
      setSaleQty('');
      setSalePrice('');
      setSaleBuyer('');
      fetchData();
    } catch (err: any) {
      addLog('error', `Erreur lors de l'enregistrement de la vente : ${err.message}`);
    }
  };

  const totalIncome = transactions
    .filter((t) => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfit = totalIncome - totalExpenses;
  const avgROI = totalExpenses > 0 ? (netProfit / totalExpenses) * 100 : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 space-y-6">
      {/* Upper overview metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-[#122131]/80 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">REVENUS TOTAL</span>
            <span className="text-xl font-bold text-[#4de082] font-mono">{totalIncome.toLocaleString()} €</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#4de082]/10 border border-[#4de082]/20 flex items-center justify-center text-[#4de082]">
            <ArrowUpRight size={20} />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#122131]/80 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">DÉPENSES TOTAL</span>
            <span className="text-xl font-bold text-rose-500 font-mono">{totalExpenses.toLocaleString()} €</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
            <ArrowDownRight size={20} />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-[#122131]/80 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">MÉTRIQUE DE ROI GLOBAL</span>
            <span className={`text-xl font-bold font-mono ${netProfit >= 0 ? 'text-[#4de082]' : 'text-rose-500'}`}>
              {netProfit >= 0 ? '+' : ''}
              {netProfit.toLocaleString()} €
            </span>
          </div>
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${netProfit >= 0 ? 'bg-[#4de082]/10 border border-[#4de082]/20 text-[#4de082]' : 'bg-rose-500/10 border border-rose-500/20 text-rose-500'}`}>
            <DollarSign size={20} />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-[#122131]/80 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">MÉGATREND ROI MOYEN</span>
            <span className="text-xl font-bold text-[#f97316] font-mono">+{avgROI.toFixed(1)} %</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#f97316]/10 border border-[#f97316]/20 flex items-center justify-center text-[#f97316]">
            <TrendingUp size={20} />
          </div>
        </div>
      </div>

      {/* Control Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-[#0c1825]/90 border border-slate-800 p-3 rounded-xl">
        <div className="flex bg-[#122131] border border-slate-800 p-0.5 rounded-lg text-xs font-mono">
          <button
            onClick={() => setActiveTab('roi')}
            className={`px-3 py-1.5 rounded-md transition-all font-semibold ${
              activeTab === 'roi' ? 'bg-[#f97316] text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Percent className="w-3.5 h-3.5 inline mr-1" /> ROI Cultures
          </button>
          <button
            onClick={() => setActiveTab('records')}
            className={`px-3 py-1.5 rounded-md transition-all font-semibold ${
              activeTab === 'records' ? 'bg-[#f97316] text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5 inline mr-1" /> Registre de Caisse
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowTxForm(true)}
            className="flex items-center gap-1.5 bg-[#1e293b] border border-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg text-slate-300 hover:border-[#f97316] hover:text-white transition-all active:scale-95"
          >
            <Plus size={14} /> Dépense/Revenu
          </button>
          <button
            onClick={() => setShowSaleForm(true)}
            className="flex items-center gap-1.5 bg-[#f97316] text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md hover:bg-[#ea580c] transition-all active:scale-95"
          >
            <Package size={14} /> Enregistrer Vente
          </button>
        </div>
      </div>

      {/* Main Grid View */}
      <div className="bg-[#122131]/40 border border-slate-800 rounded-2xl p-5 shadow-2xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-10 h-10 border-2 border-[#f97316]/20 border-t-[#f97316] rounded-full animate-spin" />
            <span className="text-xs font-mono text-[#f97316] tracking-widest uppercase animate-pulse">
              Calcul des équations financières...
            </span>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {activeTab === 'roi' ? (
              <motion.div
                key="roi"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="border-b border-slate-800 pb-2">
                  <h2 className="text-base font-bold text-white font-mono uppercase tracking-wide">
                    Rentabilité & ROI par culture
                  </h2>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Rapprochement des dépenses opérationnelles et des revenus de ventes
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {roiList.map((item) => (
                    <div
                      key={item.cropName}
                      className="bg-[#0f172a]/80 border border-slate-800/80 rounded-xl p-4 space-y-4 shadow-lg flex flex-col justify-between"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-white font-mono">{item.cropName}</span>
                        <span className="text-xs bg-[#f97316]/10 border border-[#f97316]/20 text-[#f97316] font-mono px-2 py-0.5 rounded-full font-bold">
                          ROI : +{item.roiPercentage.toFixed(0)}%
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-mono text-slate-400">
                          <span>Dépenses</span>
                          <span className="text-rose-400">{item.totalExpenses} €</span>
                        </div>
                        <div className="flex justify-between text-xs font-mono text-slate-400">
                          <span>Revenus</span>
                          <span className="text-[#4de082]">{item.totalRevenue} €</span>
                        </div>
                        <div className="flex justify-between text-xs font-mono text-white border-t border-slate-800 pt-1.5 font-bold">
                          <span>Profit Net</span>
                          <span className={item.netProfit >= 0 ? 'text-[#4de082]' : 'text-rose-400'}>
                            {item.netProfit} €
                          </span>
                        </div>
                      </div>

                      {/* Health ROI Progress Bar */}
                      <div className="space-y-1.5">
                        <div className="h-2 bg-[#051424] rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, Math.max(0, item.roiPercentage / 3))}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className="h-full bg-gradient-to-r from-[#ea580c] to-[#4de082] rounded-full shadow-[0_0_8px_rgba(77,224,130,0.3)]"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="records"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="border-b border-slate-800 pb-2">
                  <h2 className="text-base font-bold text-white font-mono uppercase tracking-wide">
                    Registre des Flux Financiers
                  </h2>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Journal d'audit de toutes les entrées et sorties de caisse
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        <th className="py-2.5 px-3">Date</th>
                        <th className="py-2.5 px-3">Culture</th>
                        <th className="py-2.5 px-3">Catégorie</th>
                        <th className="py-2.5 px-3">Description</th>
                        <th className="py-2.5 px-3 text-right">Montant</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {transactions.map((t) => (
                        <tr key={t.id} className="hover:bg-[#122131]/40 transition">
                          <td className="py-2.5 px-3 text-slate-500">
                            {new Date(t.date).toLocaleDateString('fr-FR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: '2-digit',
                            })}
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-white">{t.cropName}</td>
                          <td className="py-2.5 px-3 text-slate-400">
                            <span className="bg-[#1e293b] px-1.5 py-0.5 rounded border border-slate-700 text-[10px]">
                              {t.category}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-300 max-w-xs truncate">{t.description || '-'}</td>
                          <td className={`py-2.5 px-3 text-right font-bold font-mono ${
                            t.type === 'INCOME' ? 'text-[#4de082]' : 'text-rose-400'
                          }`}>
                            {t.type === 'INCOME' ? '+' : '-'} {t.amount} €
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Transaction Form Modal */}
      {showTxForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#051424]/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#122131] border border-slate-700 w-full max-w-md p-6 rounded-2xl shadow-2xl relative"
          >
            <h3 className="text-base font-bold text-white font-mono mb-4 uppercase tracking-wide">
              Ajouter une Transaction
            </h3>
            <form onSubmit={handleCreateTx} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-mono">Culture</label>
                <select
                  value={txCrop}
                  onChange={(e) => setTxCrop(e.target.value)}
                  className="w-full bg-[#051424] border border-slate-700 p-2.5 rounded-lg text-white"
                >
                  <option value="Tomato">Tomate</option>
                  <option value="Lavender">Lavande</option>
                  <option value="Ginseng">Ginseng</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-mono">Type</label>
                  <select
                    value={txType}
                    onChange={(e) => setTxType(e.target.value as 'INCOME' | 'EXPENSE')}
                    className="w-full bg-[#051424] border border-slate-700 p-2.5 rounded-lg text-white"
                  >
                    <option value="EXPENSE">Dépense (Débit)</option>
                    <option value="INCOME">Revenu (Crédit)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-mono">Montant (€)</label>
                  <input
                    type="number"
                    value={txAmount}
                    onChange={(e) => setTxAmount(e.target.value)}
                    required
                    placeholder="0.00"
                    className="w-full bg-[#051424] border border-slate-700 p-2.5 rounded-lg text-white placeholder-slate-600 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-mono">Catégorie</label>
                <select
                  value={txCategory}
                  onChange={(e) => setTxCategory(e.target.value)}
                  className="w-full bg-[#051424] border border-slate-700 p-2.5 rounded-lg text-white"
                >
                  <option value="SEEDS">Semences</option>
                  <option value="FERTILIZER">Engrais</option>
                  <option value="LABOR">Main d'œuvre</option>
                  <option value="EQUIPMENT">Équipement</option>
                  <option value="SALES">Vente de récolte</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-mono">Description</label>
                <textarea
                  value={txDesc}
                  onChange={(e) => setTxDesc(e.target.value)}
                  placeholder="Détail de la transaction..."
                  className="w-full bg-[#051424] border border-slate-700 p-2.5 rounded-lg text-white placeholder-slate-600 h-16 resize-none"
                />
              </div>

              <div className="flex gap-2 pt-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowTxForm(false)}
                  className="bg-slate-800 text-slate-400 px-4 py-2 rounded-lg font-bold border border-slate-700 hover:text-white"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-[#f97316] text-white px-4 py-2 rounded-lg font-bold hover:bg-[#ea580c]"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Sale Form Modal */}
      {showSaleForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#051424]/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#122131] border border-slate-700 w-full max-w-md p-6 rounded-2xl shadow-2xl relative"
          >
            <h3 className="text-base font-bold text-white font-mono mb-4 uppercase tracking-wide">
              Enregistrer une Vente de Récolte
            </h3>
            <form onSubmit={handleRecordSale} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-mono">Culture</label>
                <select
                  value={saleCrop}
                  onChange={(e) => setSaleCrop(e.target.value)}
                  className="w-full bg-[#051424] border border-slate-700 p-2.5 rounded-lg text-white"
                >
                  <option value="Tomato">Tomate</option>
                  <option value="Lavender">Lavande</option>
                  <option value="Ginseng">Ginseng</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-mono">Quantité (kg/unité)</label>
                  <input
                    type="number"
                    value={saleQty}
                    onChange={(e) => setSaleQty(e.target.value)}
                    required
                    placeholder="Ex: 50"
                    className="w-full bg-[#051424] border border-slate-700 p-2.5 rounded-lg text-white placeholder-slate-600 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-mono">Prix Unitaire (€)</label>
                  <input
                    type="number"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                    required
                    placeholder="Ex: 2.50"
                    className="w-full bg-[#051424] border border-slate-700 p-2.5 rounded-lg text-white placeholder-slate-600 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-mono">Acheteur (Client/Distributeur)</label>
                <input
                  type="text"
                  value={saleBuyer}
                  onChange={(e) => setSaleBuyer(e.target.value)}
                  placeholder="Ex: Supermarché Bio Lyon"
                  className="w-full bg-[#051424] border border-slate-700 p-2.5 rounded-lg text-white placeholder-slate-600"
                />
              </div>

              <div className="flex gap-2 pt-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowSaleForm(false)}
                  className="bg-slate-800 text-slate-400 px-4 py-2 rounded-lg font-bold border border-slate-700 hover:text-white"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-[#f97316] text-white px-4 py-2 rounded-lg font-bold hover:bg-[#ea580c]"
                >
                  Valider la Vente
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
