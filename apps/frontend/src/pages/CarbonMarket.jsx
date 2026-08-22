import React, { useState } from 'react';
import { Globe, TrendingUp, DollarSign, ArrowUpRight, ArrowDownRight, RefreshCw, ShoppingBag, ShieldCheck, AlertTriangle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

const mockPriceHistory = [
  { time: '09:00', price: 42.10 },
  { time: '10:00', price: 43.40 },
  { time: '11:00', price: 42.90 },
  { time: '12:00', price: 44.50 },
  { time: '13:00', price: 45.20 },
  { time: '14:00', price: 44.80 },
  { time: '15:00', price: 46.00 },
];

export default function CarbonMarket() {
  const [tradeMode, setTradeMode] = useState('BUY');
  const [quantity, setQuantity] = useState(1);
  const [availableCredit, setAvailableCredit] = useState(2517);
  const [userPortfolio, setUserPortfolio] = useState({ credits: 66.5, valueUsd: 3005.74 });

  const unitPrice = 45.20;
  const totalPrice = (quantity * unitPrice).toFixed(2);

  const handleExecuteTrade = () => {
    if (tradeMode === 'BUY') {
      if (parseFloat(totalPrice) > availableCredit) {
        toast.error("Crédit insuffisant !");
        return;
      }
      setAvailableCredit(prev => prev - parseFloat(totalPrice));
      setUserPortfolio(prev => ({
        credits: prev.credits + quantity,
        valueUsd: prev.valueUsd + parseFloat(totalPrice)
      }));
      toast.success(`Achat réussi de ${quantity} Crédit(s) Carbone ($${totalPrice}) !`);
    } else {
      if (quantity > userPortfolio.credits) {
        toast.error("Nombre de crédits insuffisant dans votre portefeuille !");
        return;
      }
      setAvailableCredit(prev => prev + parseFloat(totalPrice));
      setUserPortfolio(prev => ({
        credits: prev.credits - quantity,
        valueUsd: prev.valueUsd - parseFloat(totalPrice)
      }));
      toast.success(`Vente réussie de ${quantity} Crédit(s) Carbone (+$${totalPrice}) !`);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f14] text-slate-100 p-4 sm:p-6 lg:p-8 font-sans relative overflow-hidden">
      {/* Top Ticker Banner */}
      <div className="max-w-7xl mx-auto mb-6 bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs font-mono overflow-x-auto gap-4 backdrop-blur-md">
        <div className="flex items-center gap-6 whitespace-nowrap">
          <span className="text-slate-400">BTC: <span className="text-white font-semibold">$123.45</span> <span className="text-emerald-400 flex inline-items-center"><ArrowUpRight className="w-3 h-3 inline" />+2.1%</span></span>
          <span className="text-slate-400">CARBON CREDIT: <span className="text-[#f38020] font-semibold">$45.20</span> <span className="text-emerald-400 inline-flex items-center"><ArrowUpRight className="w-3 h-3 inline" />+1.8%</span></span>
          <span className="text-slate-400">VOLUME: <span className="text-white font-semibold">1.2M</span></span>
          <span className="text-slate-400">24H HIGH: <span className="text-[#00dbe7] font-semibold">$46.00</span></span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-emerald-400 uppercase tracking-widest shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> LIVE UPLINK
        </div>
      </div>

      {/* Main Title */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <Globe className="w-8 h-8 text-[#00dbe7] animate-pulse" />
            Carbon Credits Market
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Bourse d'échange mondiale de crédits carbone certifiés BeeCarbonat
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
            Portefeuille: <span className="text-[#f38020] font-bold">${userPortfolio.valueUsd.toFixed(2)} USD</span>
          </div>
        </div>
      </div>

      {/* Grid Content */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: 3D Holographic Globe + Market Chart + Trading */}
        <div className="lg:col-span-8 space-y-6">
          {/* 3D Earth Globe Visualizer Box */}
          <div className="relative h-64 rounded-2xl bg-gradient-to-b from-slate-900/80 to-[#0b0f14] border border-slate-800 p-6 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,219,231,0.15)_0,transparent_60%)]" />

            {/* Simulated 3D Hologram Globe SVG */}
            <div className="relative w-48 h-48 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#00dbe7]/40 animate-[spin_20s_linear_infinite]" />
              <div className="absolute inset-3 rounded-full border border-dashed border-[#f38020]/30 animate-[spin_15s_linear_infinite_reverse]" />
              <div className="w-36 h-36 rounded-full bg-slate-900/90 border border-[#00dbe7] shadow-[0_0_50px_rgba(0,219,231,0.4)] flex items-center justify-center relative overflow-hidden">
                <Globe className="w-24 h-24 text-[#00dbe7] opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f14] via-transparent to-transparent" />
              </div>
            </div>

            <div className="absolute bottom-4 left-6 text-xs font-mono text-slate-400">
              MARCHÉ MONDIAL EN DIRECT • OFFSET VERIFIÉ
            </div>
          </div>

          {/* Market Overview & Trading Desk Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Market Overview Chart */}
            <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">MARKET OVERVIEW</span>
                  <div className="text-xl font-bold text-white flex items-center gap-2">
                    Carbon Credit Price <span className="text-[#f38020]">$45.20</span>
                  </div>
                </div>
                <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 text-xs font-mono">+1.8%</span>
              </div>

              <div className="h-40 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockPriceHistory}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f38020" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#f38020" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" stroke="#475569" fontSize={10} tickLine={false} />
                    <YAxis stroke="#475569" fontSize={10} domain={['dataMin - 1', 'dataMax + 1']} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                    <Area type="monotone" dataKey="price" stroke="#f38020" strokeWidth={2} fillOpacity={1} fill="url(#colorPrice)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Trading Desk Box (BUY / SELL) */}
            <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setTradeMode('BUY')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                      tradeMode === 'BUY'
                        ? 'bg-[#f38020] text-white shadow-lg shadow-orange-500/20'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    BUY
                  </button>
                  <button
                    onClick={() => setTradeMode('SELL')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                      tradeMode === 'SELL'
                        ? 'bg-red-500 text-white shadow-lg shadow-red-500/20'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    SELL
                  </button>
                </div>
                <span className="text-xs font-mono text-slate-400">Acheter / Vendre</span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">Quantité (Tonnes CRD)</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-[#f38020]"
                    />
                    <span className="text-xs font-mono text-slate-400 shrink-0">CRD</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-1">
                  <span>Prix unitaire:</span>
                  <span className="text-white font-bold">${unitPrice} USD</span>
                </div>

                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>Total commande:</span>
                  <span className="text-[#00dbe7] font-bold">${totalPrice} USD</span>
                </div>

                <button
                  onClick={handleExecuteTrade}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                    tradeMode === 'BUY'
                      ? 'bg-[#f38020] hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20'
                      : 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  {tradeMode === 'BUY' ? `ACHETER ($${totalPrice})` : `VENDRE ($${totalPrice})`}
                </button>

                <div className="text-[11px] font-mono text-slate-400 text-center">
                  Crédit disponible: <span className="text-emerald-400 font-semibold">${availableCredit.toLocaleString()} USD</span>
                </div>
              </div>
            </div>
          </div>

          {/* Portfolio & Recent Transactions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* My Portfolio Box */}
            <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-xl space-y-3">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">MY PORTFOLIO</span>
              <div className="text-xs text-slate-400">Holdings Crédits Carbone</div>
              <div className="text-2xl font-extrabold text-[#f38020] font-mono">
                {userPortfolio.credits.toFixed(1)} <span className="text-xs text-slate-400 font-normal">CRD</span>
              </div>
              <div className="text-sm font-mono text-slate-300">
                Valeur estimée: <span className="text-white font-bold">${userPortfolio.valueUsd.toFixed(2)} USD</span>
              </div>
            </div>

            {/* Recent Transactions List */}
            <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-xl space-y-3">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">TRANSACTIONS RÉCENTES</span>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between p-2 rounded bg-slate-950/60 border border-slate-800/80">
                  <span>Carbon Credit Transfer</span>
                  <span className="text-emerald-400 font-bold">+1,050 SC</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-slate-950/60 border border-slate-800/80">
                  <span>Achat Bourse Spot</span>
                  <span className="text-emerald-400 font-bold">+$22.00</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-slate-950/60 border border-slate-800/80">
                  <span>Compensation Bâtiment A</span>
                  <span className="text-red-400 font-bold">-10 SC</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Inspector Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-mono uppercase tracking-widest text-[#00dbe7] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> Market Telemetry
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-mono">ACTIVE</span>
            </div>

            <div className="space-y-3 text-xs font-mono text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Market Index:</span>
                <span className="text-white font-bold">4.2 bar</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Temp Trend (2H):</span>
                <span className="text-[#f38020] font-bold">85°C</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Compliance Audit:</span>
                <span className="text-emerald-400 font-bold">VERIFIED ISO-14064</span>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-4 space-y-2">
              <div className="text-[10px] font-mono text-slate-400 uppercase">METADATA & GUID</div>
              <div className="p-2 bg-slate-950 rounded border border-slate-800 text-[11px] font-mono text-slate-300 break-all">
                12af-55gh-99xy-4b2c-88qp
              </div>
              <div className="text-xs text-slate-400 font-mono mt-2">
                Cycle de maintenance: Tous les 6 mois
              </div>
            </div>

            <button
              onClick={() => toast.success("Ordre d'intervention marché généré avec succès")}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-white transition tracking-wider uppercase font-mono"
            >
              Créer ordre d'intervention
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
