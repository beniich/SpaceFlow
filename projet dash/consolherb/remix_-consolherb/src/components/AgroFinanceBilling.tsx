import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  HelpCircle,
  Activity,
  Sliders,
  Sparkles,
  RefreshCw,
  Plus,
  Compass,
  FileSpreadsheet,
  Users,
  Calculator,
  Receipt,
  Percent,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface AgroFinanceBillingProps {
  onAddLog: (level: 'info' | 'success' | 'warn' | 'error', message: string) => void;
}

interface InvoiceItem {
  id: string;
  productName: string;
  unitPrice: number;
  qty: number;
}

interface Invoice {
  id: string;
  clientName: string;
  date: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'Unpaid' | 'Paid';
}

export default function AgroFinanceBilling({ onAddLog }: AgroFinanceBillingProps) {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'budget' | 'invoicing' | 'roi' | 'payroll'>('budget');

  // Multipliers/Simulator Inputs (Tab 1: Budget)
  const [revenueSim, setRevenueSim] = useState(480000);
  const [expenseSim, setExpenseSim] = useState(215000);

  // Budget vs Actual limits
  const [budgetItems, setBudgetItems] = useState([
    { id: 'b1', name: 'Workforce Salaries', budgeted: 80000, actual: 78500, category: 'Labor' },
    { id: 'b2', name: 'Seeds & Organic Inputs', budgeted: 65000, actual: 68400, category: 'Materials' },
    { id: 'b3', name: 'Heavy Machinery Fuel & Repair', budgeted: 40000, actual: 36000, category: 'Logistics' },
    { id: 'b4', name: 'Greenhouse Climate & Electricity', budgeted: 30000, actual: 32100, category: 'Operations' },
    { id: 'b5', name: 'Soil Protection Compliance', budgeted: 20000, actual: 19500, category: 'Compliance' },
  ]);

  // Tab 2: B2B Invoicing variables
  const b2bProducts = [
    { name: 'Organic Winter Wheat (Bulk Ton)', price: 420 },
    { name: 'Lavender Extract Concentrate (L)', price: 150 },
    { name: 'Raw Premium Lavender Honey (Kg)', price: 35 },
    { name: 'Pasteurised Goat Milk (Hectoliter)', price: 180 },
    { name: 'Bio-Aura Soil Inoculant (Batch)', price: 290 },
  ];

  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: 'INV-2026-001',
      clientName: 'Grand Union Botanicals S.A.',
      date: '2026-06-01',
      items: [
        { id: 'ii1', productName: 'Lavender Extract Concentrate (L)', unitPrice: 150, qty: 120 },
        { id: 'ii2', productName: 'Bio-Aura Soil Inoculant (Batch)', unitPrice: 290, qty: 10 }
      ],
      subtotal: 20900,
      tax: 4180,
      total: 25080,
      status: 'Paid'
    },
    {
      id: 'INV-2026-002',
      clientName: 'Coopérative Allemande d’Agriculture',
      date: '2026-06-04',
      items: [
        { id: 'ii3', productName: 'Organic Winter Wheat (Bulk Ton)', unitPrice: 420, qty: 85 }
      ],
      subtotal: 35700,
      tax: 7140,
      total: 42840,
      status: 'Unpaid'
    }
  ]);

  const [activeInvoicePreview, setActiveInvoicePreview] = useState<Invoice | null>(null);

  // Form states to construct a new invoice inline
  const [selectedClient, setSelectedClient] = useState('Val-de-Loire Distribution');
  const [selectedProductIdx, setSelectedProductIdx] = useState(0);
  const [itemQty, setItemQty] = useState(10);
  const [currentLineItems, setCurrentLineItems] = useState<InvoiceItem[]>([]);

  // Tab 3: ROI calculator metrics
  const [roiItems, setRoiItems] = useState([
    { id: 'r1', type: 'Crop', name: 'Lavender Plot Block G', initialCap: 15000, recurringCap: 8000, expectedYieldSale: 38000 },
    { id: 'r2', type: 'Crop', name: 'Tomato Organic Block B', initialCap: 10000, recurringCap: 12000, expectedYieldSale: 29500 },
    { id: 'r3', type: 'Crop', name: 'Winter Wheat Plot D', initialCap: 22000, recurringCap: 5000, expectedYieldSale: 34000 },
    { id: 'r4', type: 'Livestock', name: 'Goat Dairy Flock Beta', initialCap: 45000, recurringCap: 18000, expectedYieldSale: 89000 },
    { id: 'r5', type: 'Livestock', name: 'Broiler House Lot 4', initialCap: 25000, recurringCap: 32000, expectedYieldSale: 75000 },
  ]);

  // Tab 4: HR Payroll calculation linked with performance scores
  const [workersPayroll, setWorkersPayroll] = useState([
    { id: 'wp1', name: 'John Doe', hoursWorked: 160, baseRate: 18, ratingScore: 92, status: 'Unpaid' },
    { id: 'wp2', name: 'Jane Smith', hoursWorked: 160, baseRate: 20, ratingScore: 97, status: 'Unpaid' },
    { id: 'wp3', name: 'Mark Lee', hoursWorked: 145, baseRate: 17, ratingScore: 78, status: 'Unpaid' },
    { id: 'wp4', name: 'Jean Dupont', hoursWorked: 168, baseRate: 22, ratingScore: 95, status: 'Unpaid' },
    { id: 'wp5', name: 'Marie Curie', hoursWorked: 160, baseRate: 25, ratingScore: 98, status: 'Unpaid' },
    { id: 'wp6', name: 'Pierre Martin', hoursWorked: 150, baseRate: 19, ratingScore: 84, status: 'Unpaid' },
  ]);

  const [payrollLoading, setPayrollLoading] = useState(false);

  // Dynamic Score Calculation based on Tab 1 simulation state
  const netProfitSim = revenueSim - expenseSim;
  const marginPercent = Math.round((netProfitSim / revenueSim) * 100);
  const calculatedHealthScore = Math.min(100, Math.max(10, Math.round((marginPercent / 60) * 100)));

  // Charts heights definitions
  const revenueMonths = [70, 75, 80, 85, 90, 50]; 
  const expenseMonths = [35, 40, 40, 35, 30, 30]; 
  const netProfitMonths = [35, 35, 40, 50, 60, 20];

  const handleAdjustFinancials = () => {
    onAddLog('success', `FINANCE: Simulation financière réalignée ! Score de santé ré-indexé à ${calculatedHealthScore}/100.`);
  };

  // Helper additions for custom inline invoice line
  const handleAddInvoiceLine = () => {
    const prod = b2bProducts[selectedProductIdx];
    const newLine: InvoiceItem = {
      id: `line-${Date.now()}-${Math.random()}`,
      productName: prod.name,
      unitPrice: prod.price,
      qty: itemQty
    };
    setCurrentLineItems(prev => [...prev, newLine]);
    onAddLog('info', `INVOICING: Ligne ajoutée : ${prod.name} x${itemQty}`);
  };

  const handleSaveInvoiceFinal = () => {
    if (currentLineItems.length === 0) {
      onAddLog('error', 'INVOICING: Impossible d’émettre une facture vide.');
      return;
    }
    const subtotal = currentLineItems.reduce((acc, item) => acc + (item.unitPrice * item.qty), 0);
    const tax = Math.round(subtotal * 0.20); // 20% standard French agronomy VAT
    const total = subtotal + tax;

    const newInv: Invoice = {
      id: `INV-2026-${String(invoices.length + 1).padStart(3, '0')}`,
      clientName: selectedClient,
      date: new Date().toISOString().split('T')[0],
      items: currentLineItems,
      subtotal,
      tax,
      total,
      status: 'Unpaid'
    };

    setInvoices(prev => [newInv, ...prev]);
    setCurrentLineItems([]);
    onAddLog('success', `INVOICING: Facture professionnelle B2B émise avec succès ! Total : $${total.toLocaleString()}`);
  };

  const handlePayInvoice = (id: string) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id === id) {
        onAddLog('success', `INVOICING: Paiement reçu pour la facture ${id}.`);
        return { ...inv, status: 'Paid' };
      }
      return inv;
    }));
    if (activeInvoicePreview?.id === id) {
      setActiveInvoicePreview(prev => prev ? { ...prev, status: 'Paid' } : null);
    }
  };

  const updateRoiItem = (id: string, field: 'initialCap' | 'recurringCap' | 'expectedYieldSale', val: number) => {
    setRoiItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, [field]: val };
      }
      return item;
    }));
  };

  // Run performance-linked payroll processing
  const handleProcessPayroll = () => {
    setPayrollLoading(true);
    onAddLog('info', 'PAYROLL: Calcul biométrique en cours lié à la performance des équipes...');

    setTimeout(() => {
      setWorkersPayroll(prev => prev.map(w => ({ ...w, status: 'Paid' })));
      setPayrollLoading(false);
      onAddLog('success', 'PAYROLL: 6 salaires consolidés selon indicateurs. $19,345 versés avec succès.');
    }, 1500);
  };

  return (
    <div className="bg-[#FAF9F5] text-stone-800 p-6 rounded-[28px] border border-[#e1d5c1] font-sans shadow-md" id="agro-finance-center-module">
      
      {/* Brand Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#e1d5c1] pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-[#BA5834] to-[#f26b4f] rounded-xl flex items-center justify-center text-white text-lg font-bold">
            💰
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-serif font-bold text-[#451e09]">AgroMaître (Herboferme)</span>
              <span className="text-[9px] bg-emerald-50 text-emerald-800 border border-green-200 px-2.5 py-0.5 rounded-full font-mono font-bold uppercase tracking-tight">ERP FINANCIAL ENGINE</span>
            </div>
            <p className="text-xs text-stone-500 font-mono">Secured Bank Sockets SOC-2 & Enterprise Capital Audit</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="text-[10px] bg-[#BA5834]/10 text-[#BA5834] border border-[#BA5834]/30 px-3 py-1 rounded-full font-mono font-bold">
            EBITDA Multi-Tenant Ledger
          </span>
        </div>
      </header>

      {/* Tabs Menu Selection */}
      <div className="flex flex-wrap gap-1.5 border-b border-stone-200 pb-3 mb-6 font-sans">
        {[
          { id: 'budget', label: 'Budget & Simulation', icon: <FileSpreadsheet className="w-3.5 h-3.5" /> },
          { id: 'invoicing', label: 'B2B Invoicing Center', icon: <Receipt className="w-3.5 h-3.5" /> },
          { id: 'roi', label: 'Crop Profitability (ROI)', icon: <Calculator className="w-3.5 h-3.5" /> },
          { id: 'payroll', label: 'Performance Payroll', icon: <Users className="w-3.5 h-3.5" /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold font-mono uppercase tracking-tight rounded-xl transition cursor-pointer border ${
              activeTab === tab.id 
                ? 'bg-[#1c2c3e] border-[#4de082] text-[#4de082] bg-stone-900 border-none' 
                : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        
        {/* TAB 1: BUDGET & LEDGER */}
        {activeTab === 'budget' && (
          <motion.div 
            key="tab-budget"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="space-y-6"
          >
            {/* Title with overall radial health score gauge */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-2 border-b border-orange-100/40 pb-4">
              <div>
                <h1 className="text-xl font-serif font-bold text-[#451e09] tracking-tight">Strategic Financial Health Center</h1>
                <p className="text-xs text-[#6e5845] font-mono uppercase mt-0.5">Global ledger consolidation, seasonal amortization & profit margins analysis</p>
              </div>

              {/* Radial score gauge */}
              <div className="bg-white border border-[#e1d5c1]/80 rounded-[22px] px-5 py-3 flex items-center gap-4 shadow-xs shrink-0 w-full lg:w-auto">
                <div className="relative w-12 h-12 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.8" fill="none" stroke="#f3f4f6" strokeWidth="3" />
                    <circle 
                      cx="18" cy="18" r="15.8" fill="none" 
                      stroke="#BA5834" strokeWidth="3" 
                      strokeDasharray={`${calculatedHealthScore}, 100`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute text-center">
                    <span className="text-sm font-bold font-mono text-stone-800">{calculatedHealthScore}</span>
                  </div>
                </div>
                <div>
                  <span className="text-[9px] font-mono text-stone-500 block uppercase font-semibold">FINANCIAL HEALTH SCORE</span>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-serif font-bold text-[#451e09]">
                      {calculatedHealthScore >= 80 ? 'Excellent' : calculatedHealthScore >= 50 ? 'Stable' : 'Critical'}
                    </span>
                    <span className="text-[10px] text-green-600 font-bold font-mono">(94th pct)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Overall Monthly stats row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* CARD 1: REVENUE OVERVIEW */}
              <div className="bg-white border border-[#e1d5c1] rounded-[24px] p-5 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-mono text-stone-400 font-bold uppercase tracking-widest block mb-1">Card 01 // Input Vectors</span>
                  <h3 className="font-serif font-bold text-sm text-stone-850">Revenue Overview</h3>
                  <div className="my-3 font-mono text-2xl font-bold text-gray-800">${revenueSim.toLocaleString()}</div>

                  <div className="h-24 border-b border-stone-100 flex items-end justify-between px-2 gap-1 pt-4 mb-4 select-none">
                    {revenueMonths.map((val, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center">
                        <div className="w-full bg-[#BA5834] rounded-t-sm" style={{ height: `${(val / 100) * 100}%` }} title={`$${val}k`} />
                        <span className="text-[8px] font-mono text-stone-400 mt-1">{['J','F','M','A','M','J'][idx]}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pt-2 border-t border-stone-100 flex justify-between text-xs font-mono text-stone-500">
                  <span>YTD growth:</span>
                  <span className="font-bold text-green-600 flex items-center gap-0.5"><TrendingUp className="w-3 h-3" />+18.3%</span>
                </div>
              </div>

              {/* CARD 2: EXPENSES OVERVIEW */}
              <div className="bg-white border border-[#e1d5c1] rounded-[24px] p-5 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-mono text-stone-400 font-bold uppercase tracking-widest block mb-1">Card 02 // Outward Vectors</span>
                  <h3 className="font-serif font-bold text-sm text-stone-850">Expenses Overview</h3>
                  <div className="my-3 font-mono text-2xl font-bold text-gray-800">${expenseSim.toLocaleString()}</div>

                  <div className="h-24 border-b border-stone-100 flex items-end justify-between px-2 gap-1 pt-4 mb-4 select-none">
                    {expenseMonths.map((val, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center">
                        <div className="w-full bg-[#fca5a5] rounded-t-sm" style={{ height: `${(val / 60) * 100}%` }} title={`$${val}k`} />
                        <span className="text-[8px] font-mono text-stone-400 mt-1">{['J','F','M','A','M','J'][idx]}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pt-2 border-t border-stone-100 flex justify-between text-xs font-mono text-stone-500">
                  <span>OpEx limits:</span>
                  <span className="font-bold text-red-500 flex items-center gap-0.5"><TrendingDown className="w-3 h-3" />-2.4%</span>
                </div>
              </div>

              {/* CARD 3: NET PROFIT */}
              <div className="bg-white border border-[#e1d5c1] rounded-[24px] p-5 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-mono text-stone-400 font-bold uppercase tracking-widest block mb-1">Card 03 // Net Yield Margin</span>
                  <h3 className="font-serif font-bold text-sm text-stone-850">Calculated Net Profit</h3>
                  <div className="my-3 font-mono text-2xl font-bold text-[#BA5834]">${netProfitSim.toLocaleString()}</div>

                  <div className="h-24 border-b border-stone-100 flex items-end justify-between px-2 gap-1 pt-4 mb-4 select-none">
                    {netProfitMonths.map((val, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center">
                        <div className="w-full bg-emerald-600 rounded-t-sm" style={{ height: `${(val / 80) * 100}%` }} title={`$${val}k`} />
                        <span className="text-[8px] font-mono text-stone-400 mt-1">{['J','F','M','A','M','J'][idx]}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pt-2 border-t border-stone-100 flex justify-between text-xs font-mono text-stone-500">
                  <span>Net Margin:</span>
                  <span className="font-bold text-emerald-600">{marginPercent}% Margin</span>
                </div>
              </div>
            </div>

            {/* GESTION DU BUDGET SECTION */}
            <div className="bg-white border border-stone-200 rounded-[24px] p-5">
              <div className="border-b border-stone-100 pb-3 mb-4 flex justify-between items-center">
                <div>
                  <h3 className="font-serif font-bold text-base text-stone-900">Enterprise Budget Control (Prévu vs Réel)</h3>
                  <p className="text-xs text-stone-400">Strict real-time budget alignment monitors per production sector</p>
                </div>
                <span className="text-[10px] bg-amber-50 border border-amber-200 text-amber-700 font-mono px-2 py-0.5 rounded-md font-bold">
                  AMORTIZATION CAP ENABLED
                </span>
              </div>

              <div className="space-y-4">
                {budgetItems.map(item => {
                  const overBudget = item.actual > item.budgeted;
                  const ratio = Math.min(100, Math.round((item.actual / item.budgeted) * 100));
                  return (
                    <div key={item.id} className="text-xs">
                      <div className="flex justify-between items-center mb-1 font-mono">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-stone-850">{item.name}</span>
                          <span className="text-[9px] text-stone-400 bg-stone-100 px-1.5 py-0.2 rounded font-sans">{item.category}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-stone-500">${item.actual.toLocaleString()}</span>
                          <span className="text-stone-300 mx-1">/</span>
                          <span className="font-bold text-stone-700">${item.budgeted.toLocaleString()}</span>
                          <span className={`ml-2 font-bold ${overBudget ? 'text-red-650 text-red-500' : 'text-emerald-600'}`}>
                            ({ratio}%)
                          </span>
                        </div>
                      </div>
                      <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden border border-stone-200/40 relative">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${overBudget ? 'bg-red-500' : 'bg-emerald-600'}`} 
                          style={{ width: `${ratio}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Slider Simulation controls panel */}
            <div className="bg-[#FFF9F4] border border-[#e1d5c1] rounded-[24px] p-5">
              <h3 className="font-serif text-xs font-bold text-[#451e09] mb-4 border-b border-orange-100 pb-2 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-[#BA5834]" />
                <span>Interactive Pro Forma Margin Simulator</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-[11px] mb-1 font-mono font-bold text-stone-600">
                      <span>Simulated Gross Sales:</span>
                      <span className="text-[#BA5834]">${revenueSim.toLocaleString()}</span>
                    </div>
                    <input
                      type="range" min="200000" max="800000" step="10000"
                      value={revenueSim} onChange={(e) => setRevenueSim(parseInt(e.target.value))}
                      className="w-full accent-[#BA5834] bg-stone-150 h-1 rounded-lg cursor-pointer"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] mb-1 font-mono font-bold text-stone-600">
                      <span>Simulated OpEx Bounds:</span>
                      <span className="text-[#BA5834]">${expenseSim.toLocaleString()}</span>
                    </div>
                    <input
                      type="range" min="100000" max="400000" step="5000"
                      value={expenseSim} onChange={(e) => setExpenseSim(parseInt(e.target.value))}
                      className="w-full accent-[#BA5834] bg-stone-150 h-1 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
                <div className="bg-white/80 p-4 rounded-xl border border-[#e1d5c1]/50 text-center space-y-2">
                  <span className="text-[9px] font-mono text-stone-400 font-bold block uppercase tracking-wide">SIMULATED NET EBITDA EBITDA MARGIN</span>
                  <div className="text-xl font-mono font-bold text-[#BA5834]">${netProfitSim.toLocaleString()}</div>
                  <button
                    onClick={handleAdjustFinancials}
                    className="px-4 py-2 bg-[#BA5834] hover:bg-[#a04321] text-white rounded-lg text-[10px] font-mono font-bold uppercase transition w-full cursor-pointer shadow-xs"
                  >
                    Recalibrate Ledger Index
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: B2B INVOICING CENTER */}
        {activeTab === 'invoicing' && (
          <motion.div 
            key="tab-invoicing"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Left side: Invoice Builder & History (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Build Custom Invoice */}
              <div className="bg-white border border-stone-200 rounded-[24px] p-5">
                <div className="border-b border-stone-100 pb-3 mb-4">
                  <h3 className="font-serif font-bold text-base text-stone-900">B2B Pro Invoice Builder</h3>
                  <p className="text-xs text-stone-400">Generate enterprise invoices for distributors and wholesalers</p>
                </div>

                <div className="space-y-4 text-xs">
                  {/* Select Client & Product */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono font-bold uppercase text-stone-400 mb-1">Target Wholesaler Account</label>
                      <select 
                        value={selectedClient} 
                        onChange={(e) => setSelectedClient(e.target.value)}
                        className="w-full px-3 py-2 border border-stone-200 rounded-xl bg-stone-50/50 cursor-pointer"
                      >
                        <option value="Grand Union Botanicals S.A.">Grand Union Botanicals S.A.</option>
                        <option value="Coopérative Allemande d’Agriculture">Coopérative Allemande d’Agriculture</option>
                        <option value="Val-de-Loire Distribution">Val-de-Loire Distribution</option>
                        <option value="Herbal Pharmacies Ltd.">Herbal Pharmacies Ltd.</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono font-bold uppercase text-stone-400 mb-1">Select Crop or Bio-Input</label>
                      <select 
                        value={selectedProductIdx} 
                        onChange={(e) => setSelectedProductIdx(parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-stone-200 rounded-xl bg-stone-50/50 cursor-pointer"
                      >
                        {b2bProducts.map((p, idx) => (
                          <option key={idx} value={idx}>{p.name} (${p.price}/unit)</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Quantity & Add line items button */}
                  <div className="flex items-end gap-3">
                    <div className="flex-grow">
                      <label className="block text-[10px] font-mono font-bold uppercase text-stone-400 mb-1">Quantity</label>
                      <input 
                        type="number" min={1} max={5000}
                        value={itemQty} onChange={(e) => setItemQty(Math.max(1, parseInt(e.target.value) || 0))}
                        className="w-full px-3 py-1.5 border border-stone-200 rounded-xl bg-stone-50/50"
                      />
                    </div>
                    <button
                      type="button" onClick={handleAddInvoiceLine}
                      className="px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white rounded-xl font-bold shrink-0 cursor-pointer flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" /> Add Item Line
                    </button>
                  </div>

                  {/* Current construction list */}
                  {currentLineItems.length > 0 && (
                    <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-150 space-y-2">
                      <span className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider block">Running Invoice Lines</span>
                      <div className="divide-y divide-stone-200">
                        {currentLineItems.map((item, idx) => (
                          <div key={item.id} className="flex justify-between py-1.5 text-xs font-mono">
                            <span>{item.productName} <strong>x{item.qty}</strong></span>
                            <span className="font-bold text-stone-850">${(item.unitPrice * item.qty).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                      <div className="pt-2 border-t border-stone-200 flex justify-end">
                        <button
                          type="button" onClick={handleSaveInvoiceFinal}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-mono uppercase text-[10px] font-bold rounded-lg cursor-pointer"
                        >
                          Emit Invoice #{invoices.length + 1}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Historical invoices table */}
              <div className="bg-white border border-stone-200 rounded-[24px] p-5">
                <div className="border-b border-stone-100 pb-2 mb-3">
                  <h3 className="font-serif font-bold text-sm text-stone-850">Recent issued B2B invoices</h3>
                </div>
                <div className="divide-y divide-stone-100 space-y-1.5">
                  {invoices.map(inv => (
                    <div 
                      key={inv.id}
                      onClick={() => setActiveInvoicePreview(inv)}
                      className={`p-3 rounded-xl border transition cursor-pointer text-xs flex justify-between items-center ${
                        activeInvoicePreview?.id === inv.id ? 'bg-orange-50/30 border-orange-200' : 'bg-stone-50/40 hover:bg-stone-50 border-stone-100'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-[#BA5834]">{inv.id}</span>
                          <span className="text-stone-300">|</span>
                          <span className="font-sans font-bold text-stone-850">{inv.clientName}</span>
                        </div>
                        <span className="text-[10px] text-stone-400 font-mono block mt-0.5">{inv.date} &bull; {inv.items.length} items listed</span>
                      </div>

                      <div className="text-right flex items-center gap-3">
                        <div>
                          <div className="font-mono font-bold text-stone-850">${inv.total.toLocaleString()}</div>
                          <span className={`text-[9px] font-bold font-mono uppercase ${inv.status === 'Paid' ? 'text-emerald-600' : 'text-red-500'}`}>
                            {inv.status}
                          </span>
                        </div>
                        <span className="text-stone-300 font-mono font-light text-base">&gt;</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right side: Detailed Printable preview (5 Cols) */}
            <div className="lg:col-span-5">
              <div className="bg-white border border-stone-300 rounded-[24px] p-6 shadow-md relative overflow-hidden flex flex-col justify-between h-full min-h-[460px]">
                {activeInvoicePreview ? (
                  <div className="space-y-4">
                    <div className="border-b-2 border-stone-200 pb-4 flex justify-between items-start">
                      <div>
                        <span className="text-[18px] font-bold font-serif text-stone-900 block">AgroMaître Corp</span>
                        <span className="text-[9px] font-mono text-stone-400 block">Herboferme Organic Logistics Ltd</span>
                        <span className="text-[9px] font-mono text-stone-400 block">VAT Code: FR-492949511</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-mono font-bold uppercase px-2.5 py-0.5 bg-stone-100 text-stone-700 rounded border">
                          {activeInvoicePreview.status}
                        </span>
                        <span className="text-[11px] font-mono font-bold text-[#BA5834] block mt-1.5">{activeInvoicePreview.id}</span>
                        <span className="text-[9px] font-mono text-stone-400 block">{activeInvoicePreview.date}</span>
                      </div>
                    </div>

                    <div className="text-[11px]">
                      <span className="text-[9px] font-mono font-bold text-stone-400 block uppercase">Client Account</span>
                      <strong className="text-stone-850 block">{activeInvoicePreview.clientName}</strong>
                      <span className="text-stone-500 block">Delivery Region: Central EU Distribution Block</span>
                    </div>

                    <div className="border-t border-b border-stone-150 py-3 space-y-2 text-[10.5px]">
                      <div className="flex justify-between font-mono font-bold text-stone-400 uppercase text-[9px]">
                        <span>Item details</span>
                        <span>Total (USD)</span>
                      </div>
                      {activeInvoicePreview.items.map((line, idx) => (
                        <div key={idx} className="flex justify-between font-sans text-stone-700">
                          <span>{line.productName} <strong>x{line.qty}</strong></span>
                          <span className="font-mono font-bold">${(line.unitPrice * line.qty).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-1.5 text-xs text-right font-mono">
                      <div className="flex justify-between text-stone-500">
                        <span>Subtotal:</span>
                        <span>${activeInvoicePreview.subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-stone-500">
                        <span>Agronomy Tax (20%):</span>
                        <span>${activeInvoicePreview.tax.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between border-t border-stone-200 pt-2 font-bold text-stone-850 text-sm">
                        <span>Grand Total:</span>
                        <span>${activeInvoicePreview.total.toLocaleString()}</span>
                      </div>
                    </div>

                    {activeInvoicePreview.status === 'Unpaid' && (
                      <button
                        onClick={() => handlePayInvoice(activeInvoicePreview.id)}
                        className="w-full mt-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-mono uppercase font-bold text-xs rounded-xl shadow cursor-pointer transition block text-center"
                      >
                        Register Bank Wire Payment ($100% Clearance)
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center py-16 text-stone-400 space-y-2 my-auto">
                    <Receipt className="w-10 h-10 text-stone-300" />
                    <span className="text-xs font-serif font-bold text-stone-600">Select an invoice to preview</span>
                    <p className="text-[10px] font-sans max-w-xs leading-relaxed">
                      Click list invoices on the left to see full tax items distribution detail and export as certification.
                    </p>
                  </div>
                )}

                <div className="border-t border-stone-150 pt-4 mt-8 flex justify-between items-center text-[8.5px] font-mono text-stone-400">
                  <span>SECURED GATEWAY SHA-256 v1.02</span>
                  <span>PAGE 1 OF 1</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 3: CROPS & LIVESTOCK ROI CALCULATOR */}
        {activeTab === 'roi' && (
          <motion.div 
            key="tab-roi"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="space-y-6"
          >
            <div className="bg-white border border-stone-200 rounded-[24px] p-5">
              <div className="border-b border-stone-100 pb-3 mb-4 flex justify-between items-center">
                <div>
                  <h3 className="font-serif font-bold text-base text-stone-900">Crop & Livestock Return-on-Investment (ROI)</h3>
                  <p className="text-xs text-stone-400">Calculate exact yields profitability against initial equipment amortization and input chemicals</p>
                </div>
                <span className="text-[10px] bg-emerald-50 border border-green-200 text-emerald-800 font-mono px-2.5 py-0.5 rounded-full font-bold uppercase">
                  ROI% = (Sales - Investment - Recurring) / Total Cost
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans text-stone-800">
                  <thead>
                    <tr className="border-b border-stone-200 text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider">
                      <th className="pb-2.5">Production Asset Name</th>
                      <th className="pb-2.5">Category</th>
                      <th className="pb-2.5">Initial Capital ($)</th>
                      <th className="pb-2.5">Recurring Expenses ($)</th>
                      <th className="pb-2.5">Harvest/Yield Sales ($)</th>
                      <th className="pb-2.5 text-right">Net Return ($) / ROI %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-medium">
                    {roiItems.map((item) => {
                      const totalCost = item.initialCap + item.recurringCap;
                      const netReturn = item.expectedYieldSale - totalCost;
                      const roiPct = totalCost > 0 ? Math.round((netReturn / totalCost) * 100) : 0;
                      return (
                        <tr key={item.id} className="hover:bg-stone-50/50 transition">
                          <td className="py-3.5 font-bold text-stone-900">{item.name}</td>
                          <td className="py-3.5">
                            <span className={`px-2 py-0.5 text-[9px] uppercase font-bold rounded ${
                              item.type === 'Crop' ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-emerald-50 text-emerald-800 border border-green-200'
                            }`}>
                              {item.type}
                            </span>
                          </td>
                          <td className="py-3.5 font-mono">
                            <input 
                              type="number" 
                              value={item.initialCap}
                              onChange={(e) => updateRoiItem(item.id, 'initialCap', Math.max(0, parseInt(e.target.value) || 0))}
                              className="w-20 px-2 py-1 border border-stone-200 rounded font-bold"
                            />
                          </td>
                          <td className="py-3.5 font-mono">
                            <input 
                              type="number" 
                              value={item.recurringCap}
                              onChange={(e) => updateRoiItem(item.id, 'recurringCap', Math.max(0, parseInt(e.target.value) || 0))}
                              className="w-20 px-2 py-1 border border-stone-200 rounded font-bold"
                            />
                          </td>
                          <td className="py-3.5 font-mono">
                            <input 
                              type="number" 
                              value={item.expectedYieldSale}
                              onChange={(e) => updateRoiItem(item.id, 'expectedYieldSale', Math.max(0, parseInt(e.target.value) || 0))}
                              className="w-24 px-2 py-1 border border-stone-200 rounded font-bold"
                            />
                          </td>
                          <td className="py-3.5 text-right font-mono">
                            <div className={`font-bold ${netReturn >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                              ${netReturn.toLocaleString()}
                            </div>
                            <div className={`text-[10.5px] font-serif font-bold ${roiPct >= 50 ? 'text-emerald-700' : roiPct >= 0 ? 'text-amber-700' : 'text-red-500'}`}>
                              {roiPct >= 0 ? '+' : ''}{roiPct}% ROI
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 4: BIOMETRIC HR WORKFORCE PAYROLL */}
        {activeTab === 'payroll' && (
          <motion.div 
            key="tab-payroll"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="space-y-6"
          >
            <div className="bg-white border border-stone-200 rounded-[24px] p-5">
              <div className="border-b border-stone-100 pb-3 mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="font-serif font-bold text-base text-stone-900">Biometric-Linked Performance Payroll</h3>
                  <p className="text-xs text-stone-400">Cohesive workspace link: wages dynamically scaled by Workforce pointage scores</p>
                </div>
                <button
                  type="button"
                  onClick={handleProcessPayroll}
                  disabled={payrollLoading}
                  className="px-5 py-2.5 bg-[#BA5834] hover:bg-[#a04321] text-white font-mono uppercase text-xs font-bold rounded-xl shadow transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  {payrollLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Calculating payroll ledger...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" /> Run team payroll execution
                    </>
                  )}
                </button>
              </div>

              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left font-sans text-stone-800">
                  <thead>
                    <tr className="border-b border-stone-200 text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider pb-2">
                      <th className="pb-2">Worker Name</th>
                      <th className="pb-2">Hours Logged</th>
                      <th className="pb-2">Hourly Rate ($)</th>
                      <th className="pb-2">Pointage Score YTD</th>
                      <th className="pb-2">Calculated Performance Bonus</th>
                      <th className="pb-2">Calculated Pay Value</th>
                      <th className="pb-2 text-right">Stripe Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-medium">
                    {workersPayroll.map(w => {
                      const bonusCoeff = Math.max(0, (w.ratingScore - 80) / 100);
                      const basePay = w.hoursWorked * w.baseRate;
                      const performanceBonus = Math.round(basePay * bonusCoeff);
                      const totalPay = basePay + performanceBonus;
                      return (
                        <tr key={w.id} className="hover:bg-stone-50/50 transition">
                          <td className="py-3 font-bold text-stone-900">{w.name}</td>
                          <td className="py-3 font-mono">{w.hoursWorked} hrs</td>
                          <td className="py-3 font-mono">${w.baseRate}/hr</td>
                          <td className="py-3">
                            <div className="flex items-center gap-1">
                              <span className="font-bold text-stone-800">{w.ratingScore}%</span>
                              <span className={`w-2 h-2 rounded-full ${w.ratingScore >= 90 ? 'bg-green-500' : 'bg-amber-500'}`} />
                            </div>
                          </td>
                          <td className="py-3 font-mono text-emerald-600">+${performanceBonus.toLocaleString()}</td>
                          <td className="py-3 font-mono font-bold text-stone-900">${totalPay.toLocaleString()}</td>
                          <td className="py-3 text-right">
                            <span className={`px-2 py-0.5 text-[9px] uppercase font-bold rounded-lg border font-mono ${
                              w.status === 'Paid' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-500 border-red-200 animate-pulse'
                            }`}>
                              {w.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}
