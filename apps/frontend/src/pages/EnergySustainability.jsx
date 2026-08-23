import React, { useState } from 'react';
import { 
  UploadCloud, FileText, Download, BarChart2, Leaf, Zap, Droplet, 
  CheckCircle2, Sparkles, AlertCircle, ArrowUpRight, ShieldCheck, 
  FileCheck, RefreshCw, Layers, Sliders, Globe, TrendingDown
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import clsx from 'clsx';
import toast from 'react-hot-toast';

const monthlyData = [
  { name: 'Jan', HVAC: 4200, Lighting: 2400, Servers: 2400, Total: 9000 },
  { name: 'Feb', HVAC: 3800, Lighting: 2100, Servers: 2350, Total: 8250 },
  { name: 'Mar', HVAC: 3100, Lighting: 1950, Servers: 2400, Total: 7450 },
  { name: 'Apr', HVAC: 2600, Lighting: 1800, Servers: 2300, Total: 6700 },
  { name: 'May', HVAC: 2200, Lighting: 1650, Servers: 2450, Total: 6300 },
  { name: 'Jun', HVAC: 3100, Lighting: 1500, Servers: 2500, Total: 7100 },
  { name: 'Jul', HVAC: 3900, Lighting: 1450, Servers: 2600, Total: 7950 },
  { name: 'Aug', HVAC: 4300, Lighting: 1400, Servers: 2650, Total: 8350 },
  { name: 'Sep', HVAC: 2900, Lighting: 1600, Servers: 2500, Total: 7000 },
  { name: 'Oct', HVAC: 2400, Lighting: 1850, Servers: 2450, Total: 6700 },
  { name: 'Nov', HVAC: 3300, Lighting: 2200, Servers: 2400, Total: 7900 },
  { name: 'Dec', HVAC: 4500, Lighting: 2600, Servers: 2450, Total: 9550 },
];

const mockParsedInvoices = [
  { id: 'INV-2026-08', provider: 'EDF Pro Entreprise', period: 'Août 2026', kwh: '42,150 kWh', cost: '6,322.50 €', status: 'Parsed (OCR 99%)', scope: 'Scope 2' },
  { id: 'INV-2026-07', provider: 'Engie Gaz Naturel', period: 'Juillet 2026', kwh: '18,400 kWh', cost: '2,110.00 €', status: 'Parsed (OCR 98%)', scope: 'Scope 1' },
  { id: 'INV-2026-06', provider: 'Eau de Paris', period: 'T2 2026', kwh: '1,420 m³', cost: '4,686.00 €', status: 'Parsed (OCR 100%)', scope: 'Scope 3' },
];

export default function EnergySustainability() {
  const [isDragging, setIsDragging] = useState(false);
  const [invoices, setInvoices] = useState(mockParsedInvoices);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [activeMetric, setActiveMetric] = useState('all');

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    // Simulate OCR ingestion
    const newInvoice = {
      id: `INV-2026-${Math.floor(Math.random()*90)+10}`,
      provider: 'TotalEnergies Gaz / Elec',
      period: 'Facture Téléversée (Août 2026)',
      kwh: '31,800 kWh',
      cost: '4,770.00 €',
      status: 'Parsed (OCR 99.4%)',
      scope: 'Scope 2'
    };
    setInvoices([newInvoice, ...invoices]);
    toast.success('Facture analysée par OCR IA & intégrée au bilan Scope 2 !');
  };

  const handleGenerateCSRD = () => {
    setIsGeneratingReport(true);
    toast.loading('Compilation du rapport CSRD & calcul des facteurs d’émission...', { id: 'csrd' });
    setTimeout(() => {
      setIsGeneratingReport(false);
      toast.success('Rapport CSRD 2026 généré avec signature cryptographique !', { id: 'csrd' });
    }, 1800);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#08080A] text-zinc-100 p-4 sm:p-6 font-sans">
      <div className="max-w-[1600px] mx-auto flex flex-col gap-6">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold font-sans tracking-tight text-white flex items-center gap-2.5">
              <Leaf className="w-6 h-6 text-[#10B981]" />
              ESG &amp; Carbon Footprint Analytics Portal
            </h1>
            <p className="text-xs font-mono text-zinc-400 mt-1">
              Bilan Carbone Normé GHG Protocol • Suivi Décret Tertiaire &amp; CSRD
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-[#131313] border border-zinc-800 rounded-lg px-3 py-1.5 flex items-center gap-2 text-xs font-mono text-zinc-300">
              <ShieldCheck className="w-4 h-4 text-[#10B981]" />
              <span>Audit Ready: <strong className="text-white">Conforme CSRD 2026</strong></span>
            </div>
          </div>
        </header>

        {/* Top Section: 4 KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Scope 1 */}
          <div className="bg-[#131313]/90 backdrop-blur-md border border-[#10B981]/30 p-5 rounded-xl flex flex-col justify-between relative overflow-hidden group hover:border-[#10B981]/60 transition-all shadow-lg">
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-[#10B981]/10 rounded-full blur-xl group-hover:bg-[#10B981]/20 transition-all"></div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Scope 1 (Direct Emissions)</span>
                <span className="text-[10px] font-mono text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded border border-[#10B981]/30">-8.4% YoY</span>
              </div>
              <div className="text-3xl font-mono font-bold text-white tracking-tight">
                124.5 <span className="text-sm font-sans font-normal text-zinc-400">tCO2e</span>
              </div>
            </div>
            <div className="text-[10px] font-mono text-zinc-500 mt-3 pt-2 border-t border-zinc-800/80">
              Chaudières gaz &amp; fuites frigorigènes
            </div>
          </div>

          {/* Scope 2 */}
          <div className="bg-[#131313]/90 backdrop-blur-md border border-[#10B981]/30 p-5 rounded-xl flex flex-col justify-between relative overflow-hidden group hover:border-[#10B981]/60 transition-all shadow-lg">
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-[#10B981]/10 rounded-full blur-xl group-hover:bg-[#10B981]/20 transition-all"></div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Scope 2 (Indirect / Elec)</span>
                <span className="text-[10px] font-mono text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded border border-[#10B981]/30">-14.2% YoY</span>
              </div>
              <div className="text-3xl font-mono font-bold text-white tracking-tight">
                450.2 <span className="text-sm font-sans font-normal text-zinc-400">tCO2e</span>
              </div>
            </div>
            <div className="text-[10px] font-mono text-zinc-500 mt-3 pt-2 border-t border-zinc-800/80">
              Réseau électrique &amp; sous-stations
            </div>
          </div>

          {/* Scope 3 */}
          <div className="bg-[#131313]/90 backdrop-blur-md border border-[#10B981]/30 p-5 rounded-xl flex flex-col justify-between relative overflow-hidden group hover:border-[#10B981]/60 transition-all shadow-lg">
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-[#10B981]/10 rounded-full blur-xl group-hover:bg-[#10B981]/20 transition-all"></div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Scope 3 (Value Chain)</span>
                <span className="text-[10px] font-mono text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded">Stable</span>
              </div>
              <div className="text-3xl font-mono font-bold text-white tracking-tight">
                1,240.8 <span className="text-sm font-sans font-normal text-zinc-400">tCO2e</span>
              </div>
            </div>
            <div className="text-[10px] font-mono text-zinc-500 mt-3 pt-2 border-t border-zinc-800/80">
              Déplacements, achats &amp; déchets
            </div>
          </div>

          {/* Carbon Intensity */}
          <div className="bg-[#131313]/90 backdrop-blur-md border border-[#00F0FF]/30 p-5 rounded-xl flex flex-col justify-between relative overflow-hidden group hover:border-[#00F0FF]/60 transition-all shadow-lg">
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-[#00F0FF]/10 rounded-full blur-xl group-hover:bg-[#00F0FF]/20 transition-all"></div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Intensité Carbone</span>
                <span className="text-[10px] font-mono text-[#00F0FF] bg-[#00F0FF]/10 px-2 py-0.5 rounded border border-[#00F0FF]/30">Objectif 2030: 9.5</span>
              </div>
              <div className="text-3xl font-mono font-bold text-[#00F0FF] tracking-tight">
                12.4 <span className="text-sm font-sans font-normal text-zinc-400">kgCO2e/m²</span>
              </div>
            </div>
            <div className="text-[10px] font-mono text-zinc-500 mt-3 pt-2 border-t border-zinc-800/80">
              Surface totale certifiée : 24,500 m²
            </div>
          </div>
        </div>

        {/* Main Content Columns: Left (Ingestion) & Right (12-Month Chart) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Bill Ingestion */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="bg-[#131313]/90 backdrop-blur-md border border-zinc-800/80 p-5 rounded-xl flex-1 flex flex-col shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-sans font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#00F0FF]" />
                  Energy Bill Ingestion (AI OCR)
                </h2>
                <span className="text-[10px] font-mono text-[#00F0FF] bg-[#00F0FF]/10 px-2 py-0.5 rounded border border-[#00F0FF]/30">
                  Auto-Parsing
                </span>
              </div>

              <p className="text-xs text-zinc-400 mb-4 leading-relaxed font-sans">
                Déposez vos factures énergétiques (PDF, Scans, EDI). L'agent extrait automatiquement les consommations réelles et ajuste les bilans Scope 1 &amp; 2.
              </p>
              
              {/* Dropzone */}
              <div 
                className={clsx(
                  "border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-2.5 transition-all text-center cursor-pointer mb-5",
                  isDragging 
                    ? "border-[#00F0FF] bg-[#00F0FF]/10 scale-[0.99]" 
                    : "border-zinc-700/80 hover:border-[#00F0FF]/50 bg-[#08080A]/60 hover:bg-[#08080A]"
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => {
                  handleDrop({ preventDefault: () => {} });
                }}
              >
                <div className="w-12 h-12 rounded-full bg-[#131313] border border-zinc-700 flex items-center justify-center">
                  <UploadCloud className={clsx("w-6 h-6", isDragging ? "text-[#00F0FF]" : "text-zinc-400")} />
                </div>
                <div className="text-xs font-sans font-bold text-zinc-200">
                  Glissez-déposez vos factures ici
                </div>
                <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider">
                  Format PDF, PNG, XML Factur-X (Max 15MB)
                </span>
              </div>

              {/* Parsed Invoices List */}
              <div>
                <h4 className="text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Dernières Factures Traitées</span>
                  <span className="text-[10px] text-zinc-500 font-normal">{invoices.length} intégrées</span>
                </h4>
                
                <div className="space-y-2">
                  {invoices.map((inv) => (
                    <div key={inv.id} className="p-2.5 rounded-lg bg-[#08080A] border border-zinc-800/80 flex items-center justify-between text-xs font-mono">
                      <div>
                        <div className="font-bold text-zinc-200 flex items-center gap-1.5">
                          <span>{inv.provider}</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400">{inv.scope}</span>
                        </div>
                        <div className="text-[10px] text-zinc-500 mt-0.5">{inv.period} • {inv.kwh}</div>
                      </div>
                      <div className="text-right">
                        <span className="text-zinc-300 font-bold">{inv.cost}</span>
                        <div className="text-[9px] text-[#10B981] flex items-center gap-1 justify-end">
                          <CheckCircle2 className="w-3 h-3" /> {inv.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: 12-Month Stacked Bar Chart */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="bg-[#131313]/90 backdrop-blur-md border border-zinc-800/80 p-5 rounded-xl flex-1 flex flex-col shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div>
                  <h2 className="text-sm font-sans font-bold text-white flex items-center gap-2">
                    <BarChart2 className="w-4 h-4 text-[#10B981]" />
                    Consommation Mensuelle par Usage (12 Mois)
                  </h2>
                  <p className="text-[10px] font-mono text-zinc-500 mt-0.5">
                    Énergie mesurée en kWh (HVAC, Éclairage DALI, Baies Serveurs)
                  </p>
                </div>

                <div className="flex items-center gap-2 text-[10px] font-mono">
                  <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-[#00F0FF]" /> HVAC</span>
                  <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-[#10B981]" /> Éclairage</span>
                  <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-[#F38020]" /> Serveurs</span>
                </div>
              </div>

              {/* Chart Component */}
              <div className="flex-1 min-h-[340px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                    <XAxis dataKey="name" stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `${val/1000}k`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0D0E12', border: '1px solid #27272a', borderRadius: '8px', fontSize: '11px', fontFamily: 'monospace' }}
                      itemStyle={{ color: '#e4e4e7' }}
                      formatter={(value, name) => [`${value} kWh`, name]}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px', fontFamily: 'monospace' }} />
                    <Bar dataKey="HVAC" stackId="usage" fill="#00F0FF" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="Lighting" name="Éclairage" stackId="usage" fill="#10B981" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="Servers" name="Serveurs / IT" stackId="usage" fill="#F38020" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Bottom Insight Pill */}
              <div className="mt-4 pt-3 border-t border-zinc-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs font-mono text-zinc-400 gap-2">
                <span className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-[#10B981]" />
                  <span>Pic estival HVAC compensé par optimisation GTB (-18%)</span>
                </span>
                <span className="text-[#00F0FF] font-bold">Total Annuel : 90.6 MWh</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Action Panel: Audit-Ready CSRD Report Generator */}
        <div className="bg-gradient-to-r from-[#10B981]/15 via-[#131313] to-[#00F0FF]/15 border border-[#10B981]/40 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-5 shadow-xl">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-[#10B981]/20 text-[#10B981] font-mono text-[10px] font-bold border border-[#10B981]/30">
                DIRECTIVE EU 2022/2464
              </span>
              <span className="text-zinc-500 font-mono text-[10px]">• Scope 1, 2, 3 Certified</span>
            </div>
            <h3 className="font-sans font-bold text-white text-xl mt-1">
              Rapport d'Audit ESG &amp; Déclaration Extra-Financière CSRD
            </h3>
            <p className="font-mono text-xs text-zinc-400 mt-1 max-w-2xl">
              Générez un dossier d'audit infalsifiable avec horodatage, annexes Décret Tertiaire et calcul d'évitement carbone certifié pour commissaires aux comptes.
            </p>
          </div>

          <button 
            onClick={handleGenerateCSRD}
            disabled={isGeneratingReport}
            className="px-6 py-3.5 bg-[#10B981] hover:bg-[#059669] text-black font-mono font-bold text-xs uppercase tracking-wider rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.35)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all flex items-center gap-2.5 whitespace-nowrap shrink-0 disabled:opacity-50"
          >
            {isGeneratingReport ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Génération en cours...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Generate Audit-Ready CSRD Report (Signed PDF)</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
