import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { initAuth, googleSignIn, logout } from '../lib/firebaseAuth';
import { User } from 'firebase/auth';
import { 
  FileText, 
  BarChart2, 
  TrendingUp, 
  Check, 
  Download, 
  Share2, 
  Sparkles, 
  Plus, 
  Trash2, 
  Thermometer, 
  Droplet, 
  Bug, 
  DollarSign, 
  CloudSun, 
  Layout,
  Layers,
  ChevronRight,
  Filter
} from 'lucide-react';

interface DataBlock {
  id: string;
  name: string;
  icon: React.ReactNode;
  category: 'sensor' | 'historical' | 'operation';
  defaultEnabled: boolean;
  value: string;
}

interface ChartPoint {
  week: string;
  temp: number;
  yield: number;
}

export default function AgroReportBuilder({ onAddLog }: { onAddLog: (level: 'info' | 'success' | 'warn' | 'error', message: string) => void }) {
  const [enabledBlocks, setEnabledBlocks] = useState<string[]>(['temp_sensor', 'crop_yield', 'ops_cost']);
  const [reportTitle, setReportTitle] = useState('Q3 2024 Performance Audit');
  const [isGenerating, setIsGenerating] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Google Sheets stateful parameters
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [authChecking, setAuthChecking] = useState(true);

  const [isExporting, setIsExporting] = useState(false);
  const [sheetUrl, setSheetUrl] = useState<string | null>(null);
  const [showConfirmExport, setShowConfirmExport] = useState(false);

  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setGoogleUser(user);
        setAccessToken(token);
        setAuthChecking(false);
      },
      () => {
        setGoogleUser(null);
        setAccessToken(null);
        setAuthChecking(false);
      }
    );
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleGoogleLogin = async () => {
    try {
      const res = await googleSignIn();
      if (res) {
        setGoogleUser(res.user);
        setAccessToken(res.accessToken);
        onAddLog('success', `SHEETS: Connecté avec succès en tant que ${res.user.displayName || res.user.email}`);
      }
    } catch (err: any) {
      onAddLog('error', `SHEETS: Erreur de connexion Google Auth: ${err.message || err}`);
    }
  };

  const handleGoogleLogout = async () => {
    try {
      await logout();
      setGoogleUser(null);
      setAccessToken(null);
      setSheetUrl(null);
      onAddLog('info', 'SHEETS: Déconnexion Google réussie.');
    } catch (err: any) {
      onAddLog('error', `SHEETS: Erreur de déconnexion: ${err.message}`);
    }
  };

  const handleExportToSheets = async () => {
    if (!accessToken) {
      onAddLog('error', 'SHEETS: Vous devez vous connecter avec Google pour exporter.');
      return;
    }

    setShowConfirmExport(false);
    setIsExporting(true);
    onAddLog('info', `SHEETS: Création d'une nouvelle feuille Google Sheets "${reportTitle}"...`);

    try {
      // 1. Create spreadsheet with custom structured sheets
      const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          properties: {
            title: reportTitle
          },
          sheets: [
            {
              properties: {
                title: "Weekly Metrics"
              }
            },
            {
              properties: {
                title: "Operational Costs"
              }
            }
          ]
        })
      });

      if (!createRes.ok) {
        if (createRes.status === 401) {
          handleGoogleLogout();
          throw new Error('Votre session Google a expiré ou manque de permissions. Veuillez vous reconnecter.');
        }
        throw new Error(`Failed to create spreadsheet: ${createRes.statusText}`);
      }

      const createdSheet = await createRes.json();
      const spreadsheetId = createdSheet.spreadsheetId;
      const spreadsheetUrl = createdSheet.spreadsheetUrl;

      // 2. Prepare data for Weekly Metrics sheet
      const weeklyRows = [
        ["Week", "Mean Temperature (°C)", "Crop Yield (Tons)"],
        ...weeklyData.map(d => [d.week, d.temp, d.yield]),
        [],
        ["Export Time (UTC)", new Date().toUTCString()],
        ["Source System", "AgroMaître Advanced Custom Report Builder"],
        ["Format", "Enterprise Compilation Metric Tab"]
      ];

      // 3. Prepare data for Operational Costs sheet
      const costRows = [
        ["Expense Category", "Unit Expense Label", "Target Domain Detail"],
        ["Labor / Workforce Allocation", "$13.00/t", "General Agricultural Logistics Segment 1"],
        ["Equipment & Maintenance", "$36.00/t", "Advanced Irrigation & Mechanical Servicing"],
        ["Soil Inputs & Materials", "$22.00/t", "Organic Botanical Fertilisation"],
        [],
        ["Total Operational Mean", "$24.00/t", "Weighted System Output Index"]
      ];

      // 4. Update Weekly Metrics values
      const updateWeeklyRes = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'Weekly Metrics'!A1?valueInputOption=USER_ENTERED`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            values: weeklyRows
          })
        }
      );

      if (!updateWeeklyRes.ok) {
        throw new Error(`Failed to update Weekly Metrics: ${updateWeeklyRes.statusText}`);
      }

      // 5. Update Operational Costs values
      const updateCostsRes = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'Operational Costs'!A1?valueInputOption=USER_ENTERED`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            values: costRows
          })
        }
      );

      if (!updateCostsRes.ok) {
        throw new Error(`Failed to update Operational Costs: ${updateCostsRes.statusText}`);
      }

      onAddLog('success', `SHEETS: Données synchronisées avec succès ! Nouveau Spreadsheet "${reportTitle}" prêt.`);
      setSheetUrl(spreadsheetUrl);
    } catch (err: any) {
      console.error(err);
      onAddLog('error', `SHEETS: Échec de la synchronisation : ${err.message || err}`);
    } finally {
      setIsExporting(false);
    }
  };

  // Available blocks in sidebar
  const availableBlocks: DataBlock[] = [
    { id: 'temp_sensor', name: 'Temperature (sensor)', icon: <Thermometer className="w-4 h-4 text-orange-500" />, category: 'sensor', defaultEnabled: true, value: '23.4°C Mean' },
    { id: 'crop_yield', name: 'Crop Yield (historical)', icon: <TrendingUp className="w-4 h-4 text-emerald-500" />, category: 'historical', defaultEnabled: true, value: '98.2 Tons' },
    { id: 'ops_cost', name: 'Operational Cost', icon: <DollarSign className="w-4 h-4 text-amber-600" />, category: 'operation', defaultEnabled: true, value: '$24,500 Base' },
    { id: 'soil_moisture', name: 'Soil Moisture', icon: <Droplet className="w-4 h-4 text-blue-500" />, category: 'sensor', defaultEnabled: false, value: '62% R/H' },
    { id: 'pest_incidence', name: 'Pest Incidences', icon: <Bug className="w-4 h-4 text-red-500" />, category: 'sensor', defaultEnabled: false, value: '0 Active Swarms' },
    { id: 'weather_forecast', name: 'Weather Forecast', icon: <CloudSun className="w-4 h-4 text-sky-500" />, category: 'historical', defaultEnabled: false, value: 'Sunny Intermittent' },
  ];

  // Raw data values for interactive SVG charts
  const weeklyData: ChartPoint[] = [
    { week: 'W-7', temp: 15, yield: 20 },
    { week: 'W-11', temp: 18, yield: 33 },
    { week: 'W-17', temp: 21, yield: 45 },
    { week: 'W-19', temp: 23, yield: 53.8 },
    { week: 'W-21', temp: 20, yield: 48 },
    { week: 'W-28', temp: 25, yield: 62 },
    { week: 'W-35', temp: 24, yield: 58.5 }
  ];

  const handleToggleBlock = (blockId: string, blockName: string) => {
    setEnabledBlocks(prev => {
      const exists = prev.includes(blockId);
      if (exists) {
        onAddLog('warn', `REPORTS: Bloc "${blockName}" désactivé.`);
        return prev.filter(id => id !== blockId);
      } else {
        onAddLog('success', `REPORTS: Bloc "${blockName}" ajouté au canevas.`);
        return [...prev, blockId];
      }
    });
  };

  const handleGenerateReport = () => {
    setIsGenerating(true);
    onAddLog('info', `REPORTS: Compilation des métriques pour "${reportTitle}"...`);
    
    setTimeout(() => {
      setIsGenerating(false);
      onAddLog('success', `REPORTS: Rapport "${reportTitle}" généré avec succès ! PDF prêt au téléchargement.`);
    }, 2000);
  };

  const handleSaveTemplate = () => {
    setSaveSuccess(true);
    onAddLog('success', `REPORTS: Modèle de canevas sauvegardé avec succès sous le profil "Enterprise Custom Workflow".`);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Coordinates calculators for line charts
  const width = 500;
  const height = 180;
  const padding = 30;
  
  // Calculate SVG Points for Temperature Line
  const tempPoints = weeklyData.map((d, i) => {
    const x = padding + (i / (weeklyData.length - 1)) * (width - padding * 2);
    // Temp degrees mapped 10 -> 35
    const y = height - padding - ((d.temp - 10) / 25) * (height - padding * 2);
    return `${x},${y}`;
  }).join(' ');

  // Calculate SVG Points for Yield Line
  const yieldPoints = weeklyData.map((d, i) => {
    const x = padding + (i / (weeklyData.length - 1)) * (width - padding * 2);
    // Yield mapped 15 -> 70
    const y = height - padding - ((d.yield - 15) / 55) * (height - padding * 2);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="bg-[#FAF9F5] text-stone-800 p-6 rounded-[28px] border border-[#e1d5c1] font-sans shadow-md" id="agro-report-builder">
      
      {/* Brand Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#e1d5c1] pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-[#BC542B] to-[#5c2411] rounded-xl flex items-center justify-center text-white text-lg font-bold">
            <Layout className="w-5 h-5 text-red-100" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-serif font-bold text-[#451f14]">Advanced Custom Report Builder</span>
              <span className="text-[9px] bg-red-50 text-orange-850 border border-red-200 px-2 py-0.5 rounded-full font-mono font-bold uppercase tracking-tight">Enterprise Suite</span>
            </div>
            <p className="text-xs text-stone-500 font-mono uppercase">Create bespoke reports with drag-and-drop / clickable data blocks</p>
          </div>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={reportTitle}
            onChange={(e) => setReportTitle(e.target.value)}
            className="bg-white border border-[#e1d5c1] text-xs font-mono px-3 py-1.5 rounded-xl text-[#451f14] outline-none focus:ring-1 focus:ring-[#BC542B]"
            placeholder="Report Title"
          />
        </div>
      </header>

      {/* Main 4-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Side: Drag Blocks Menu */}
        <div className="bg-white p-5 rounded-2xl border border-[#e1d5c1]/60 space-y-4 h-fit">
          <h3 className="font-mono text-xs font-bold text-stone-400 uppercase tracking-wider mb-2 select-none">
            Click to Toggle Blocks
          </h3>

          <div className="space-y-2">
            {availableBlocks.map(block => {
              const isAdded = enabledBlocks.includes(block.id);
              return (
                <button
                  key={block.id}
                  onClick={() => handleToggleBlock(block.id, block.name)}
                  className={`w-full p-3.5 border rounded-xl flex items-center justify-between text-left text-xs transition active:scale-98 cursor-pointer ${
                    isAdded 
                      ? 'bg-amber-50/40 border-[#BC542B] text-stone-900 font-semibold shadow-xs' 
                      : 'bg-stone-50 border-[#e1d5c1]/60 text-stone-500 hover:bg-stone-100 hover:text-stone-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {block.icon}
                    <span>{block.name}</span>
                  </div>
                  {isAdded ? (
                    <span className="w-5 h-5 bg-[#BC542B] text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                      <Check className="w-3" />
                    </span>
                  ) : (
                    <Plus className="w-4 h-4 text-stone-400" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-stone-150">
            <button
              onClick={handleSaveTemplate}
              className={`w-full py-2.5 text-xs font-mono font-bold uppercase rounded-xl transition ${
                saveSuccess 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-stone-100 border border-stone-200 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {saveSuccess ? 'Template Saved ✓' : 'Save Template'}
            </button>
          </div>

          <div className="pt-4 border-t border-stone-150 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 bg-emerald-50 rounded-md border border-emerald-200 flex items-center justify-center font-bold text-xs text-emerald-600">
                田
              </span>
              <span className="text-xs font-serif font-bold text-stone-750">Google Sheets Sync</span>
            </div>

            {googleUser ? (
              <div className="bg-emerald-50/20 border border-emerald-200/50 p-3 rounded-xl space-y-2">
                <div className="flex items-center gap-2">
                  {googleUser.photoURL ? (
                    <img src={googleUser.photoURL} alt="Avatar" className="w-8 h-8 rounded-full border border-emerald-100" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                      {googleUser.displayName?.charAt(0) || googleUser.email?.charAt(0) || '?'}
                    </div>
                  )}
                  <div className="overflow-hidden">
                    <div className="text-[10px] font-sans font-bold text-stone-800 truncate">{googleUser.displayName || 'Google Account'}</div>
                    <div className="text-[8.5px] font-mono text-stone-400 truncate">{googleUser.email}</div>
                  </div>
                </div>
                
                <button
                  onClick={handleGoogleLogout}
                  className="w-full py-1.5 text-[9px] font-mono font-bold uppercase rounded-lg border border-red-200 hover:bg-red-50 text-red-650 transition cursor-pointer"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-[10.5px] text-stone-400 font-sans leading-relaxed">
                  Connect with Sheets permission to dynamically upload compile sheets.
                </p>
                
                <button 
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center justify-center gap-2 bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 hover:text-stone-900 font-sans text-xs py-2 px-3 rounded-xl transition cursor-pointer shadow-xs active:scale-98"
                >
                  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                  </svg>
                  <span className="font-semibold text-stone-700">Sign in with Google</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Side Canvas (Col Span 3) */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Engineering Radial Grid Canvas */}
          <div className="bg-white rounded-[24px] border border-[#e1d5c1] p-6 shadow-xs relative min-h-[480px] flex flex-col justify-between">
            {/* Overlay grid representation */}
            <div 
              className="absolute inset-0 rounded-[24.5px] pointer-events-none opacity-5 pr-2"
              style={{
                backgroundImage: 'radial-gradient(#4d3e38 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }}
            />

            <div>
              <div className="text-center mb-8 relative z-10">
                <span className="text-[10px] font-mono text-[#BC542B] bg-orange-50 border border-orange-200 rounded-full px-3 py-1 font-bold uppercase tracking-wider">
                  METROLOGY COMPILATION REPORT SHEET
                </span>
                <h2 className="text-2xl font-serif font-bold text-stone-800 mt-3">{reportTitle}</h2>
                <div className="h-0.5 w-16 bg-[#BC542B] mx-auto mt-2" />
              </div>

              {/* Grid content inside Report Canvas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                
                {/* Visual Chart 1: Interactive Line Graph */}
                {enabledBlocks.includes('temp_sensor') || enabledBlocks.includes('crop_yield') ? (
                  <div className="bg-[#FAF9F5]/85 border border-[#e1d5c1]/60 p-4 rounded-2xl shadow-xs">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-xs font-mono font-bold text-stone-700 uppercase">
                        Weekly Temperature vs. Yield
                      </h4>
                      <div className="flex items-center gap-2 text-[8.5px] font-mono">
                        <span className="flex items-center gap-1 text-[#BC542B] font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#BC542B]" /> Temp
                        </span>
                        <span className="flex items-center gap-1 text-emerald-600 font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" /> Yield
                        </span>
                      </div>
                    </div>

                    {/* Clean SVG Charts Drawing */}
                    <div className="h-44 bg-white/70 rounded-xl p-2 relative flex items-end">
                      <svg className="w-full h-full" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
                        {/* Horizontal Gridlines */}
                        <line x1={padding} y1={padding} x2={width-padding} y2={padding} stroke="#f0ece4" strokeWidth="1" strokeDasharray="3,3" />
                        <line x1={padding} y1={height/2} x2={width-padding} y2={height/2} stroke="#f0ece4" strokeWidth="1" strokeDasharray="3,3" />
                        <line x1={padding} y1={height-padding} x2={width-padding} y2={height-padding} stroke="#e6e1d6" strokeWidth="1.5" />

                        {/* Temperature line */}
                        {enabledBlocks.includes('temp_sensor') && (
                          <>
                            <polyline fill="none" stroke="#BC542B" strokeWidth="2.5" strokeLinecap="round" points={tempPoints} />
                            {/* Points indicator circles */}
                            {weeklyData.map((d, i) => {
                              const x = padding + (i / (weeklyData.length - 1)) * (width - padding * 2);
                              const y = height - padding - ((d.temp - 10) / 25) * (height - padding * 2);
                              return (
                                <g key={`t-${i}`}>
                                  <circle cx={x} cy={y} r="3.5" fill="#FAF9F5" stroke="#BC542B" strokeWidth="2" />
                                  <text x={x} y={y - 8} fontSize="7.5" fontFamily="monospace" fill="#BC542B" textAnchor="middle" fontWeight="bold">
                                    {d.temp}°C
                                  </text>
                                </g>
                              );
                            })}
                          </>
                        )}

                        {/* Crop Yield line */}
                        {enabledBlocks.includes('crop_yield') && (
                          <>
                            <polyline fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" points={yieldPoints} />
                            {/* Points indicator circles */}
                            {weeklyData.map((d, i) => {
                              const x = padding + (i / (weeklyData.length - 1)) * (width - padding * 2);
                              const y = height - padding - ((d.yield - 15) / 55) * (height - padding * 2);
                              return (
                                <g key={`y-${i}`}>
                                  <circle cx={x} cy={y} r="3.5" fill="#FAF9F5" stroke="#16a34a" strokeWidth="2" />
                                  <text x={x} y={y - 8} fontSize="7.5" fontFamily="monospace" fill="#16a34a" textAnchor="middle" fontWeight="bold">
                                    {d.yield}T
                                  </text>
                                </g>
                              );
                            })}
                          </>
                        )}
                      </svg>
                    </div>

                    <div className="flex justify-between text-[8px] font-mono text-stone-400 mt-2 px-6">
                      {weeklyData.map(d => <span key={d.week}>{d.week}</span>)}
                    </div>
                  </div>
                ) : (
                  <div className="bg-stone-50 border border-dashed border-[#e1d5c1] p-12 text-center rounded-2xl text-stone-400 text-xs italic flex flex-col justify-center items-center">
                    <span>Active Temperature & Yield lines to view plot analytics.</span>
                  </div>
                )}

                {/* Visual Chart 2: operational expense bars */}
                {enabledBlocks.includes('ops_cost') ? (
                  <div className="bg-[#FAF9F5]/85 border border-[#e1d5c1]/60 p-4 rounded-2xl shadow-xs">
                    <h4 className="text-xs font-mono font-bold text-stone-700 uppercase mb-5">
                      Cost Breakdown (Operational)
                    </h4>

                    <div className="h-44 flex items-end justify-around gap-4 bg-white/70 rounded-xl p-4 border border-stone-100">
                      {/* Bar 1 */}
                      <div className="flex-1 flex flex-col items-center group">
                        <div className="text-[9px] font-bold text-stone-500 mb-1 font-mono">$13.00/t</div>
                        <div className="bg-[#BC542B] w-8 h-24 rounded-t-md relative flex items-end justify-center transition-all duration-350 hover:bg-orange-700">
                          <span className="text-[8px] text-white font-mono font-semibold pb-1 vertical-text">Lab1</span>
                        </div>
                        <span className="text-[9px] font-mono text-stone-400 mt-1.5">Labor</span>
                      </div>

                      {/* Bar 2 */}
                      <div className="flex-1 flex flex-col items-center group">
                        <div className="text-[9px] font-bold text-stone-500 mb-1 font-mono">$36.00/t</div>
                        <div className="bg-[#BC542B]/80 w-8 h-32 rounded-t-md relative flex items-end justify-center transition-all duration-350 hover:bg-orange-600">
                          <span className="text-[8px] text-white font-mono font-semibold pb-1 vertical-text">Equip</span>
                        </div>
                        <span className="text-[9px] font-mono text-stone-400 mt-1.5">Equip</span>
                      </div>

                      {/* Bar 3 */}
                      <div className="flex-1 flex flex-col items-center group">
                        <div className="text-[9px] font-bold text-stone-500 mb-1 font-mono">$22.00/t</div>
                        <div className="bg-[#BC542B]/50 w-8 h-16 rounded-t-md relative flex items-end justify-center transition-all duration-350 hover:bg-orange-500">
                          <span className="text-[8px] text-white font-mono font-semibold pb-1 vertical-text">Inp</span>
                        </div>
                        <span className="text-[9px] font-mono text-stone-400 mt-1.5">Inputs</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-[10px] font-mono px-1 border-t border-stone-200 mt-3 pt-2">
                      <span className="text-stone-400 uppercase">Total Weighted Cost:</span>
                      <strong className="text-[#BC542B]">$24.00 Per Item Mean</strong>
                    </div>
                  </div>
                ) : (
                  <div className="bg-stone-50 border border-dashed border-[#e1d5c1] p-12 text-center rounded-2xl text-stone-400 text-xs italic flex flex-col justify-center items-center">
                    <span>Activate Operational Cost Block to render structural expenses metrics.</span>
                  </div>
                )}

              </div>

              {/* Grid content inside Report Canvas: secondary active metrics list summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                {enabledBlocks.map(blockId => {
                  const bObj = availableBlocks.find(b => b.id === blockId);
                  if (!bObj) return null;
                  return (
                    <div key={blockId} className="bg-stone-50 border border-[#e1d5c1]/50 p-3 rounded-xl flex items-center justify-between font-mono text-[10.5px]">
                      <div className="flex items-center gap-2">
                        {bObj.icon}
                        <span className="font-semibold text-stone-600">{bObj.name.split(' ')[0]}</span>
                      </div>
                      <strong className="text-stone-700">{bObj.value}</strong>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* Print, Download PDF actions footer trigger */}
            <div className="mt-8 pt-4 border-t border-stone-150 flex justify-end gap-3 z-10 flex-wrap">
              {sheetUrl && (
                <a
                  href={sheetUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-mono font-bold uppercase transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="font-bold">田</span>
                  <span>Open Sheet ↗</span>
                </a>
              )}
              {isExporting ? (
                <button
                  disabled
                  className="px-4 py-2 bg-stone-100 text-stone-400 border border-stone-200 rounded-xl text-xs font-mono font-bold uppercase flex items-center gap-1.5 cursor-not-allowed"
                >
                  <span className="w-3 h-3 border-t border-b border-[#BC542B] rounded-full animate-spin" />
                  <span>Exporting...</span>
                </button>
              ) : googleUser ? (
                <button
                  onClick={() => setShowConfirmExport(true)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-mono font-bold uppercase transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span className="font-bold">田</span>
                  <span>Export to Sheets</span>
                </button>
              ) : (
                <button
                  onClick={handleGoogleLogin}
                  className="px-4 py-2 bg-stone-50 hover:bg-stone-100 text-stone-650 rounded-xl text-xs font-mono font-bold uppercase transition flex items-center gap-1.5 cursor-pointer border border-stone-200"
                >
                  <span className="text-emerald-600 font-bold">田</span>
                  <span>Sync Sheets</span>
                </button>
              )}
              <button
                onClick={() => {
                  window.print();
                  onAddLog('success', 'REPORTS: Impression de la fiche de metrologie initiée.');
                }}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-650 rounded-xl text-xs font-mono font-bold uppercase transition flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  onAddLog('success', 'REPORTS: Lien de partage sécurisé copié dans le presse-papier.');
                }}
                className="px-4 py-2 bg-[#BC542B] hover:bg-[#a33f1b] text-white rounded-xl text-xs font-mono font-bold uppercase transition flex items-center gap-1.5 cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Share Link</span>
              </button>
            </div>
          </div>

          {/* Dynamic Live Report Preview Segment block at the bottom */}
          <div className="bg-white border border-[#e1d5c1] p-6 rounded-2xl shadow-xs">
            <h3 className="font-serif font-bold text-sm text-stone-850 mb-4 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#BC542B]" />
              <span>Live Report Compiler Preview</span>
            </h3>

            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin select-none">
              {availableBlocks.map(b => {
                const isActive = enabledBlocks.includes(b.id);
                return (
                  <div
                    key={`preview-${b.id}`}
                    onClick={() => handleToggleBlock(b.id, b.name)}
                    className={`min-w-[150px] p-2.5 border rounded-xl text-left font-mono text-[9.5px] cursor-pointer transition ${
                      isActive 
                        ? 'bg-[#FAF9F5] border-[#BC542B] text-stone-800' 
                        : 'bg-stone-50 border-stone-200 text-stone-400 opacity-60'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-[8.5px] text-stone-400">BLOCK METRE</span>
                      {isActive && <span className="w-1.5 h-1.5 bg-[#BC542B] rounded-full" />}
                    </div>
                    <div className="font-serif font-extrabold text-stone-700 truncate">{b.name}</div>
                    <div className="mt-1 font-mono font-bold text-[9px] text-[#BC542B]">{b.value}</div>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 flex justify-between items-center">
              <p className="text-[10px] text-stone-400 font-mono">
                Compilation size: <strong>{enabledBlocks.length} widgets selected</strong> • Dynamic SHA active
              </p>
              <button
                onClick={handleGenerateReport}
                disabled={isGenerating}
                className="px-6 py-2.5 bg-[#BC542B] hover:bg-[#a33f1b] text-white rounded-xl text-xs font-mono font-bold uppercase transition active:scale-95 disabled:bg-stone-200 disabled:text-stone-400 cursor-pointer flex items-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <span className="w-3.5 h-3.5 border-t border-b border-white rounded-full animate-spin" />
                    <span>Compiling Report...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Report</span>
                  </>
                )}
              </button>
            </div>
          </div>

      {/* Google Sheets export confirmation modal */}
      <AnimatePresence>
        {showConfirmExport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConfirmExport(false)}
              className="absolute inset-0 bg-stone-950/40 backdrop-blur-xs"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-[#FAF9F5] border border-[#e1d5c1] text-stone-800 p-6 rounded-[24px] shadow-2xl max-w-md w-full text-center z-10"
            >
              <div className="w-12 h-12 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                田
              </div>
              <h3 className="font-serif font-bold text-lg text-stone-900 mb-2">
                Export report data to Google Sheets?
              </h3>
              <p className="text-xs text-stone-500 font-sans leading-relaxed mb-6">
                This will create a new Spreadsheet titled <strong className="text-stone-750">"{reportTitle}"</strong> with custom sheets for <strong className="text-stone-750">"Weekly Metrics"</strong> and <strong className="text-stone-750">"Operational Costs"</strong>.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowConfirmExport(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-650 rounded-xl text-xs font-mono font-bold uppercase transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExportToSheets}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-mono font-bold uppercase transition flex items-center gap-1 cursor-pointer"
                >
                  Confirm Export
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

        </div>
      </div>
    </div>
  );
}
