import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AlertTriangle, 
  Package, 
  Check, 
  QrCode, 
  RefreshCw, 
  Search, 
  Printer, 
  Database,
  Camera,
  X,
  FileCheck,
  Wrench,
  Settings,
  Calendar,
  Layers,
  Sparkles,
  CheckCircle,
  Clock
} from 'lucide-react';

interface AgroInventorySupplyProps {
  onAddLog: (level: 'info' | 'success' | 'warn' | 'error', message: string) => void;
}

interface EquipmentAsset {
  id: string;
  name: string;
  type: 'Tractor' | 'Drone' | 'Sensor' | 'Loader';
  purchaseDate: string;
  lastMaintenance: string;
  nextMaintenance: string;
  status: 'Operational' | 'Maintenance Required' | 'Scheduled Soon';
  healthScore: number;
}

export default function AgroInventorySupply({ onAddLog }: AgroInventorySupplyProps) {
  const [activeTab, setActiveTab] = useState<'supplies' | 'machinery'>('supplies');

  // Input Stock Levels (Semences, Engrais, Médicaments vétérinaires, Aliments pour bétail)
  const [wheatSeedsLevel, setWheatSeedsLevel] = useState(10); // Semence
  const [npkFertLevel, setNpkFertLevel] = useState(2);       // Engrais
  const [vetMedsLevel, setVetMedsLevel] = useState(15);       // Médicaments vétérinaires
  const [animalFeedLevel, setAnimalFeedLevel] = useState(8);   // Aliments bétail

  const [isReorderingWheat, setIsReorderingWheat] = useState(false);
  const [isReorderingNpk, setIsReorderingNpk] = useState(false);
  const [isReorderingMeds, setIsReorderingMeds] = useState(false);
  const [isReorderingFeed, setIsReorderingFeed] = useState(false);

  // Scan modal simulation states
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scannerStep, setScannerStep] = useState<'idle' | 'scanning' | 'success'>('idle');
  const [scannedCode, setScannedCode] = useState('PKG-SEED-WHT-89240');

  // Equipment assets list state
  const [equipmentAssets, setEquipmentAssets] = useState<EquipmentAsset[]>([
    {
      id: 'EQ-001',
      name: 'John Deere 6120M Heavy Cabin Tractor',
      type: 'Tractor',
      purchaseDate: '2021-04-12',
      lastMaintenance: '2026-02-15',
      nextMaintenance: '2026-08-15',
      status: 'Operational',
      healthScore: 94
    },
    {
      id: 'EQ-002',
      name: 'Aerospray Agronomic Phantom Drone D4',
      type: 'Drone',
      purchaseDate: '2024-09-02',
      lastMaintenance: '2026-05-11',
      nextMaintenance: '2026-11-11',
      status: 'Operational',
      healthScore: 88
    },
    {
      id: 'EQ-003',
      name: 'Soil-Moisture Precised Sensor Network C-II',
      type: 'Sensor',
      purchaseDate: '2025-01-20',
      lastMaintenance: '2025-10-18',
      nextMaintenance: '2026-05-20',
      status: 'Maintenance Required',
      healthScore: 24
    },
    {
      id: 'EQ-004',
      name: 'Caterpillar Silhouette Seed Loader 305',
      type: 'Loader',
      purchaseDate: '2020-03-10',
      lastMaintenance: '2025-12-01',
      nextMaintenance: '2026-06-01',
      status: 'Scheduled Soon',
      healthScore: 78
    }
  ]);

  // For adding custom machinery asset inline
  const [showAddAsset, setShowAddAsset] = useState(false);
  const [newAssetName, setNewAssetName] = useState('');
  const [newAssetType, setNewAssetType] = useState<'Tractor' | 'Drone' | 'Sensor' | 'Loader'>('Tractor');
  const [newAssetPurchase, setNewAssetPurchase] = useState('2026-01-01');

  // Logistics tracking arrivals ledgers
  const [ledger, setLedger] = useState([
    { id: 'WHT-SEED-Q4-01', material: 'Winter Wheat Seeds', qty: '1500 Kg', scanned: '08:42 AM', operator: 'RFID Gate 1', status: 'Checked In', color: 'text-green-700 bg-green-50 border-green-200' },
    { id: 'NPK-FERT-L2-35', material: 'NPK Organic Fertilizer', qty: '400 Kg', scanned: '--', operator: 'Pending Cargo Transit', status: 'In Transit', color: 'text-amber-700 bg-amber-50 border-amber-200 animate-pulse' }
  ]);

  const handleReorderWheat = () => {
    setIsReorderingWheat(true);
    onAddLog('info', 'INVENTORY_REORDER: Lancement de la commande fétiche de semence de blé d\'hiver (A-12)...');
    setTimeout(() => {
      setWheatSeedsLevel(100);
      setIsReorderingWheat(false);
      onAddLog('success', 'INVENTORY_REORDER: 1,500kg de Graines de Blé réceptionnés et balisés en soute A-12.');
    }, 1200);
  };

  const handleReorderNpk = () => {
    setIsReorderingNpk(true);
    onAddLog('info', 'INVENTORY_REORDER: Déplacement du bon de transport d\'engrais N-P-K (B-35) au statut Prioritaire...');
    setTimeout(() => {
      setNpkFertLevel(100);
      setIsReorderingNpk(false);
      onAddLog('success', 'INVENTORY_REORDER: N-P-K bio-engrais réapprovisionné à 100%. Compartiment B-35 calibré.');
    }, 1200);
  };

  const handleReorderMeds = () => {
    setIsReorderingMeds(true);
    onAddLog('info', 'INVENTORY_REORDER: Commande urgente d’antibiotiques ovins et probiotiques bovins...');
    setTimeout(() => {
      setVetMedsLevel(100);
      setIsReorderingMeds(false);
      onAddLog('success', 'INVENTORY_REORDER: Médicaments vétérinaires au complet. Soute médicale D-05 mise à jour.');
    }, 1200);
  };

  const handleReorderFeed = () => {
    setIsReorderingFeed(true);
    onAddLog('info', 'INVENTORY_REORDER: Reconstitution des silos de céréales de provende oasienne...');
    setTimeout(() => {
      setAnimalFeedLevel(100);
      setIsReorderingFeed(false);
      onAddLog('success', 'INVENTORY_REORDER: 2,500kg d’aliments bio pour bétail dépotés dans le Silo 3.');
    }, 1200);
  };

  const handleStartScanner = () => {
    setIsScannerOpen(true);
    setScannerStep('scanning');
    onAddLog('info', 'SCANNER_NFC: Allumage de la caméra de scannage laser...');
    
    setTimeout(() => {
      setScannerStep('success');
      onAddLog('success', `SCANNER_NFC: Code-barres mémorisé avec succès ! ID: [${scannedCode}].`);
    }, 1500);
  };

  const handleAcceptPackage = () => {
    const newEntry = {
      id: scannedCode,
      material: 'Organic Alfalfa Animal Feed',
      qty: '500 Kg',
      status: 'Checked In',
      scanned: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      operator: 'Manual Terminal Scan 02',
      color: 'text-green-700 bg-green-50 border-green-200'
    };
    setLedger(prev => [newEntry, ...prev]);
    setIsScannerOpen(false);
    onAddLog('success', `INVENTORY: Colis [${scannedCode}] enregistré par certificat de dépôt.`);
    setScannedCode(`PKG-FEED-ANM-${Math.floor(Math.random() * 90000 + 10000)}`);
  };

  const triggerMaintenance = (id: string, name: string) => {
    setEquipmentAssets(prev => prev.map(eq => {
      if (eq.id === id) {
        onAddLog('info', `MACHINERY: Envoi du matériel [${name}] en atelier de maintenance...`);
        return { 
          ...eq, 
          status: 'Operational', 
          lastMaintenance: new Date().toISOString().split('T')[0],
          healthScore: 100 
        };
      }
      return eq;
    }));
    setTimeout(() => {
      onAddLog('success', `MACHINERY: [${name}] ré-étalonné à 100% de performance. Certificat de maintenance validé.`);
    }, 1000);
  };

  const handleAddNewMachineAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssetName.trim()) return;

    const newAsset: EquipmentAsset = {
      id: `EQ-00${equipmentAssets.length + 1}`,
      name: newAssetName.trim(),
      type: newAssetType,
      purchaseDate: newAssetPurchase,
      lastMaintenance: newAssetPurchase,
      nextMaintenance: new Date(new Date(newAssetPurchase).setMonth(new Date(newAssetPurchase).getMonth() + 6)).toISOString().split('T')[0],
      status: 'Operational',
      healthScore: 100
    };

    setEquipmentAssets(prev => [...prev, newAsset]);
    setNewAssetName('');
    setShowAddAsset(false);
    onAddLog('success', `MACHINERY: Nouvel équipement inséré au registre : "${newAsset.name}"`);
  };

  return (
    <div className="bg-[#fdfbf9] text-[#4a4a4a] p-6 rounded-[28px] border border-stone-200/60 font-sans shadow-lg select-none" id="inventory-alerts-module">
      
      {/* Brand Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-orange-100 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-[#f26b4f] to-[#e65a3d] rounded-xl flex items-center justify-center text-white text-lg font-bold">
            📦
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-800">AgroMaître <span className="text-xs font-normal text-gray-400">(Herboferme)</span></span>
              <span className="text-[9px] bg-orange-50 text-[#f26b4f] border border-orange-200 px-2.5 py-0.5 rounded-full font-mono font-bold uppercase tracking-tight">STOCKS & VEHICLES ERP</span>
            </div>
            <p className="text-xs text-gray-500 font-mono">Image 5: Reorder alerts, Barcode & Heavy Fleet Assets</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="text-[10px] bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-full font-sans font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            Central Stock Core Connected
          </span>
        </div>
      </header>

      {/* Tabs Menu Selection */}
      <div className="flex flex-wrap gap-1.5 border-b border-stone-200 pb-3 mb-6 font-sans">
        <button
          onClick={() => setActiveTab('supplies')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold font-mono uppercase tracking-tight rounded-xl transition cursor-pointer border ${
            activeTab === 'supplies' 
              ? 'bg-[#1c2c3e] border-[#4de082] text-[#4de082] bg-stone-900 border-none' 
              : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Input Stocks (Intrants / Semence)</span>
        </button>

        <button
          onClick={() => setActiveTab('machinery')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold font-mono uppercase tracking-tight rounded-xl transition cursor-pointer border ${
            activeTab === 'machinery' 
              ? 'bg-[#1c2c3e] border-[#4de082] text-[#4de082] bg-stone-900 border-none' 
              : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
          }`}
        >
          <Wrench className="w-3.5 h-3.5" />
          <span>Fleet & Machinery Asset Registry</span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        
        {/* TAB 1: SUPPLIES & LOGISTICS */}
        {activeTab === 'supplies' && (
          <motion.div 
            key="tab-supplies"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="space-y-6"
          >
            {/* Title description */}
            <div className="text-center mb-2">
              <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Agricultural Material & Inputs Center</h1>
              <p className="text-xs text-gray-400 mt-1">Real-time depletion tracking of seeds, fertilizers, veterinary meds and fodder silos</p>
            </div>

            {/* Low stocks notification list - four items (Stock d'Intrants) */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              
              {/* Box 1: Seeds (Wheat) */}
              <div className="bg-white border-2 border-orange-100 rounded-[24px] p-5 relative overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] text-gray-400 font-mono font-bold uppercase">Box A-12</span>
                    <span className={`text-[9px] uppercase font-mono font-bold px-1.5 py-0.2 rounded-full border ${wheatSeedsLevel <= 15 ? 'text-orange-500 bg-orange-50 border-orange-200' : 'text-emerald-600 bg-emerald-50 border-green-200'}`}>
                      {wheatSeedsLevel <= 15 ? 'Low seed level' : 'Nominal Level'}
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-sm text-stone-850">Winter Wheat Seeds</h3>
                  <span className="text-[10px] font-mono text-stone-400 block mt-1">CAT: CROP RE-SEEDING</span>

                  <div className="space-y-1.5 my-4">
                    <div className="flex justify-between text-[10px] font-mono text-stone-500">
                      <span>Inventory percentage:</span>
                      <strong className={wheatSeedsLevel <= 15 ? 'text-orange-500' : 'text-emerald-600'}>{wheatSeedsLevel}%</strong>
                    </div>
                    <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden border">
                      <div className={`h-full transition-all duration-300 ${wheatSeedsLevel <= 15 ? 'bg-orange-500' : 'bg-emerald-600'}`} style={{ width: `${wheatSeedsLevel}%` }} />
                    </div>
                  </div>
                </div>

                <button
                  type="button" onClick={handleReorderWheat}
                  disabled={isReorderingWheat || wheatSeedsLevel > 15}
                  className="w-full py-2 bg-gradient-to-r from-[#f26b4f] to-[#e65a3d] hover:brightness-105 disabled:opacity-50 text-white text-[10px] font-mono uppercase font-bold rounded-xl cursor-pointer flex items-center justify-center gap-1"
                >
                  {isReorderingWheat ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Package className="w-3.5 h-3.5" />}
                  <span>{isReorderingWheat ? 'Procuring...' : wheatSeedsLevel > 15 ? 'Stock Clean ✓' : 'Replenish Box'}</span>
                </button>
              </div>

              {/* Box 2: Fertilizer (NPK) */}
              <div className="bg-white border-2 border-red-100 rounded-[24px] p-5 relative overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] text-gray-400 font-mono font-bold uppercase">Box B-35</span>
                    <span className={`text-[9px] uppercase font-mono font-bold px-1.5 py-0.2 rounded-full border ${npkFertLevel <= 10 ? 'text-red-500 bg-red-50 border-red-200' : 'text-emerald-600 bg-emerald-50 border-green-200'}`}>
                      {npkFertLevel <= 10 ? 'Critical fertilizer' : 'Nominal Level'}
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-sm text-stone-850">NPK Bio-Fertilizer Sack</h3>
                  <span className="text-[10px] font-mono text-stone-400 block mt-1">CAT: SOIL NUTRITION</span>

                  <div className="space-y-1.5 my-4">
                    <div className="flex justify-between text-[10px] font-mono text-stone-500">
                      <span>Inventory percentage:</span>
                      <strong className={npkFertLevel <= 10 ? 'text-red-500 font-bold' : 'text-emerald-600'}>{npkFertLevel}%</strong>
                    </div>
                    <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden border">
                      <div className={`h-full transition-all duration-300 ${npkFertLevel <= 10 ? 'bg-red-500' : 'bg-emerald-600'}`} style={{ width: `${npkFertLevel}%` }} />
                    </div>
                  </div>
                </div>

                <button
                  type="button" onClick={handleReorderNpk}
                  disabled={isReorderingNpk || npkFertLevel > 10}
                  className="w-full py-2 bg-gradient-to-r from-[#f26b4f] to-[#e65a3d] hover:brightness-105 disabled:opacity-50 text-white text-[10px] font-mono uppercase font-bold rounded-xl cursor-pointer flex items-center justify-center gap-1"
                >
                  {isReorderingNpk ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Package className="w-3.5 h-3.5" />}
                  <span>{isReorderingNpk ? 'Procuring...' : npkFertLevel > 10 ? 'Stock Clean ✓' : 'Replenish Box'}</span>
                </button>
              </div>

              {/* Box 3: Veterinary Medicines */}
              <div className="bg-white border-2 border-orange-100 rounded-[24px] p-5 relative overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] text-gray-400 font-mono font-bold uppercase">Box D-05</span>
                    <span className={`text-[9px] uppercase font-mono font-bold px-1.5 py-0.2 rounded-full border ${vetMedsLevel <= 20 ? 'text-orange-500 bg-orange-50 border-orange-200' : 'text-emerald-600 bg-emerald-50 border-green-200'}`}>
                      {vetMedsLevel <= 20 ? 'Low meds limit' : 'Nominal Level'}
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-sm text-stone-850">Livestock Veterinary Vacc</h3>
                  <span className="text-[10px] font-mono text-stone-400 block mt-1">CAT: ANIMAL HEALTH</span>

                  <div className="space-y-1.5 my-4">
                    <div className="flex justify-between text-[10px] font-mono text-stone-500">
                      <span>Inventory percentage:</span>
                      <strong className={vetMedsLevel <= 20 ? 'text-orange-500 font-bold' : 'text-emerald-600'}>{vetMedsLevel}%</strong>
                    </div>
                    <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden border">
                      <div className={`h-full transition-all duration-300 ${vetMedsLevel <= 20 ? 'bg-orange-500' : 'bg-emerald-600'}`} style={{ width: `${vetMedsLevel}%` }} />
                    </div>
                  </div>
                </div>

                <button
                  type="button" onClick={handleReorderMeds}
                  disabled={isReorderingMeds || vetMedsLevel > 20}
                  className="w-full py-2 bg-gradient-to-r from-[#f26b4f] to-[#e65a3d] hover:brightness-105 disabled:opacity-50 text-white text-[10px] font-mono uppercase font-bold rounded-xl cursor-pointer flex items-center justify-center gap-1"
                >
                  {isReorderingMeds ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Package className="w-3.5 h-3.5" />}
                  <span>{isReorderingMeds ? 'Procuring...' : vetMedsLevel > 20 ? 'Stock Clean ✓' : 'Replenish Box'}</span>
                </button>
              </div>

              {/* Box 4: Aliments pour bétail (Animal Feeds) */}
              <div className="bg-white border-2 border-red-150 rounded-[24px] p-5 relative overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] text-gray-400 font-mono font-bold uppercase">Silo 3 Row C</span>
                    <span className={`text-[9px] uppercase font-mono font-bold px-1.5 py-0.2 rounded-full border ${animalFeedLevel <= 10 ? 'text-red-500 bg-red-50 border-red-200' : 'text-emerald-600 bg-emerald-50 border-green-200'}`}>
                      {animalFeedLevel <= 10 ? 'Critical forage' : 'Nominal Level'}
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-sm text-stone-850">Organic Feed Silo Provende</h3>
                  <span className="text-[10px] font-mono text-stone-400 block mt-1">CAT: SILO ANIMAL DIET</span>

                  <div className="space-y-1.5 my-4">
                    <div className="flex justify-between text-[10px] font-mono text-stone-500">
                      <span>Inventory percentage:</span>
                      <strong className={animalFeedLevel <= 10 ? 'text-red-500 font-bold' : 'text-emerald-600'}>{animalFeedLevel}%</strong>
                    </div>
                    <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden border">
                      <div className={`h-full transition-all duration-300 ${animalFeedLevel <= 10 ? 'bg-red-500' : 'bg-emerald-600'}`} style={{ width: `${animalFeedLevel}%` }} />
                    </div>
                  </div>
                </div>

                <button
                  type="button" onClick={handleReorderFeed}
                  disabled={isReorderingFeed || animalFeedLevel > 10}
                  className="w-full py-2 bg-gradient-to-r from-[#f26b4f] to-[#e65a3d] hover:brightness-105 disabled:opacity-50 text-white text-[10px] font-mono uppercase font-bold rounded-xl cursor-pointer flex items-center justify-center gap-1"
                >
                  {isReorderingFeed ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Package className="w-3.5 h-3.5" />}
                  <span>{isReorderingFeed ? 'Procuring...' : animalFeedLevel > 10 ? 'Stock Clean ✓' : 'Replenish Silo'}</span>
                </button>
              </div>

            </div>

            {/* Bottom Logistics ledger table */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Ledger arrivals - 8 Cols */}
              <div className="lg:col-span-8 bg-white border border-stone-200 rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <div className="border-b border-stone-100 pb-3 mb-4">
                    <h2 className="text-base font-bold text-gray-800">Logistics Incoming Ledger</h2>
                    <p className="text-xs text-gray-400">Incoming vehicles & barcoded ingredients reception registry</p>
                  </div>

                  <div className="overflow-x-auto text-xs">
                    <table className="w-full text-left font-sans text-stone-800">
                      <thead>
                        <tr className="border-b border-stone-100 text-stone-400 font-mono font-bold text-[10px] uppercase pb-2">
                          <th className="pb-2">Material SKU</th>
                          <th className="pb-2">Logistics Weight</th>
                          <th className="pb-2">Arrival/Check Time</th>
                          <th className="pb-2">Verification Gate</th>
                          <th className="pb-2 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-50 font-medium font-sans">
                        {ledger.map((item, idx) => (
                          <tr key={idx} className="hover:bg-stone-50/50 transition">
                            <td className="py-3 font-mono font-bold text-stone-900">{item.id}</td>
                            <td className="py-3">{item.qty} &bull; <span className="text-stone-400">{item.material}</span></td>
                            <td className="py-3 font-mono text-stone-500">{item.scanned}</td>
                            <td className="py-3 font-mono text-stone-500">{item.operator}</td>
                            <td className="py-3 text-right">
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${item.color}`}>
                                {item.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="border-t border-stone-100 pt-4 mt-6">
                  <button
                    type="button" onClick={handleStartScanner}
                    className="w-full py-3 bg-gradient-to-r from-[#f26b4f] to-[#e65a3d] text-white text-xs font-mono font-bold uppercase rounded-xl transition hover:opacity-95 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Camera className="w-4 h-4" /> Simulate Barcode Scanner Camera
                  </button>
                </div>
              </div>

              {/* Utility actions - 4 Cols */}
              <div className="lg:col-span-4 bg-white border border-stone-200 rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <div className="border-b border-stone-100 pb-3 mb-4">
                    <h3 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest">
                      ERP Inventory Actions
                    </h3>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <button 
                      onClick={() => {
                        onAddLog('info', 'INVENTORY: Réconciliation des stocks théorique vs physique.');
                        alert('Running automated database reconciliation across silo silos...');
                      }}
                      className="w-full text-left p-3.5 border border-stone-150 hover:border-orange-200 bg-stone-50/20 hover:bg-white text-gray-700 font-semibold rounded-xl flex items-center gap-2.5 transition cursor-pointer"
                    >
                      <Database className="w-4 h-4 text-stone-400" />
                      <span>Reconcile stocks with IoT Silo Levels</span>
                    </button>

                    <button 
                      onClick={() => {
                        onAddLog('info', 'INVENTORY: Lancement du diagnostic de réquisition matérielle.');
                        alert('Compiling materials purchase order spreadsheet...');
                      }}
                      className="w-full text-left p-3.5 border border-stone-150 hover:border-orange-200 bg-stone-50/20 hover:bg-white text-gray-700 font-semibold rounded-xl flex items-center gap-2.5 transition cursor-pointer"
                    >
                      <FileCheck className="w-4 h-4 text-stone-400" />
                      <span>Issue Wholesalers Orders (CSV)</span>
                    </button>

                    <button 
                      onClick={() => {
                        onAddLog('success', 'INVENTORY: Impression d’étiquettes code-barres thermiques PDF.');
                        alert('Dispatched 40 Barcodes Labels to network thermal printer.');
                      }}
                      className="w-full text-left p-3.5 border border-stone-150 hover:border-orange-200 bg-stone-50/20 hover:bg-white text-gray-700 font-semibold rounded-xl flex items-center gap-2.5 transition cursor-pointer"
                    >
                      <Printer className="w-4 h-4 text-stone-400" />
                      <span>Print Thermal Box Codes</span>
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-red-50/50 border border-red-150 rounded-xl mt-4">
                  <span className="text-[9px] font-mono text-red-700 uppercase font-bold block mb-1">AUTOMATED LOW-STOCK TRIGGER</span>
                  <p className="text-[10px] leading-relaxed text-red-650">
                    Silo 3 Alfalfa Feed falls below 10%! Automatic request submitted to Val-de-Loire Wholesalers Logistics.
                  </p>
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* TAB 2: MACHINERY & FLEET MAINTENANCE ASSETS REGISTRY */}
        {activeTab === 'machinery' && (
          <motion.div 
            key="tab-machinery"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="space-y-6"
          >
            {/* Title */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-200 pb-3">
              <div>
                <h2 className="text-xl font-serif font-bold text-stone-900">Heavy Fleet & Machinery Maintenance Registry</h2>
                <p className="text-xs text-stone-400">Inventory of tractors, drones, sensors with automated maintenance cycle logs</p>
              </div>
              <button
                type="button" onClick={() => setShowAddAsset(true)}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white rounded-xl text-xs font-mono font-bold uppercase transition flex items-center gap-1.5 cursor-pointer"
              >
                Register Heavy Vehicle +
              </button>
            </div>

            {/* Form pop-up to Register Machinery inline */}
            <AnimatePresence>
              {showAddAsset && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-white border-2 border-[#e1d5c1] rounded-2xl p-5 shadow-inner"
                >
                  <form onSubmit={handleAddNewMachineAsset} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end text-xs">
                    <div>
                      <label className="block text-[10px] font-mono font-bold uppercase text-stone-400 mb-1">Equipment / Model Name</label>
                      <input 
                        type="text" required
                        placeholder="e.g., Kubota M7-172 Luxury Tractor"
                        value={newAssetName} onChange={(e) => setNewAssetName(e.target.value)}
                        className="w-full px-3 py-2 border border-stone-200 rounded-xl bg-stone-50/50"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono font-bold uppercase text-stone-400 mb-1">Asset Category</label>
                      <select 
                        value={newAssetType} onChange={(e) => setNewAssetType(e.target.value as any)}
                        className="w-full px-3 py-2 border border-stone-200 rounded-xl bg-stone-50/50"
                      >
                        <option value="Tractor">Tractor</option>
                        <option value="Drone">Drone</option>
                        <option value="Loader">Loader</option>
                        <option value="Sensor">Sensor Array</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono font-bold uppercase text-stone-400 mb-1">Purchase Date</label>
                      <input 
                        type="date" required
                        value={newAssetPurchase} onChange={(e) => setNewAssetPurchase(e.target.value)}
                        className="w-full px-3 py-2 border border-stone-200 rounded-xl bg-stone-50/50 font-mono"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button 
                        type="submit"
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase flex-grow cursor-pointer"
                      >
                        Save Asset
                      </button>
                      <button 
                        type="button" onClick={() => setShowAddAsset(false)}
                        className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-xl text-xs font-bold uppercase cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* List of active vehicles registry */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {equipmentAssets.map(asset => {
                const isCritical = asset.status === 'Maintenance Required';
                const isScheduled = asset.status === 'Scheduled Soon';
                return (
                  <div 
                    key={asset.id}
                    className={`bg-white border rounded-3xl p-5 shadow-xs relative flex flex-col justify-between ${
                      isCritical ? 'border-red-250 bg-red-50/5' : 'border-stone-200'
                    }`}
                  >
                    <div className="space-y-3.5">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-mono font-bold text-[#f26b4f] bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                            {asset.type}
                          </span>
                          <span className="text-[10px] font-mono text-stone-400 ml-2">{asset.id}</span>
                        </div>

                        <span className={`text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full border ${
                          isCritical 
                            ? 'text-red-700 bg-red-50 border-red-200' 
                            : isScheduled 
                              ? 'text-amber-700 bg-amber-50 border-amber-200' 
                              : 'text-green-700 bg-green-50 border-green-250'
                        }`}>
                          {asset.status}
                        </span>
                      </div>

                      <div>
                        <h3 className="font-serif font-bold text-gray-800 text-base">{asset.name}</h3>
                        <div className="grid grid-cols-3 gap-2 mt-3 select-none text-[10.5px]">
                          <div>
                            <span className="text-gray-400 block">Acquired:</span>
                            <span className="font-semibold text-gray-700 font-mono">{asset.purchaseDate}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 block">Last Check:</span>
                            <span className="font-semibold text-gray-700 font-mono">{asset.lastMaintenance}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 block">Next Cycle:</span>
                            <span className="font-semibold text-gray-700 font-mono">{asset.nextMaintenance}</span>
                          </div>
                        </div>
                      </div>

                      {/* Health progress score */}
                      <div className="space-y-1 pt-1">
                        <div className="flex justify-between text-[10px] font-bold font-mono">
                          <span>Infrastructure Health Quotient:</span>
                          <span className={asset.healthScore < 50 ? 'text-red-500' : 'text-emerald-600'}>{asset.healthScore}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden border">
                          <div 
                            className={`h-full ${asset.healthScore < 50 ? 'bg-red-500' : asset.healthScore < 80 ? 'bg-amber-500' : 'bg-emerald-600'}`} 
                            style={{ width: `${asset.healthScore}%` }} 
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-stone-100 flex justify-end">
                      <button
                        type="button" onClick={() => triggerMaintenance(asset.id, asset.name)}
                        className="px-3.5 py-1.5 border border-stone-150 hover:bg-stone-50 text-stone-700 text-[10.5px] font-bold font-mono uppercase rounded-xl flex items-center gap-1 cursor-pointer transition"
                      >
                        <Wrench className="w-3.5 h-3.5 text-[#f26b4f]" /> Simulate Maintenance Refresher
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* Barcode scanner Simulator Modal OVERLAY */}
      <AnimatePresence>
        {isScannerOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl border border-stone-200 p-6 max-w-sm w-full font-sans text-xs text-[#4a4a4a] shadow-2xl relative"
            >
              <div className="flex justify-between items-center border-b border-stone-100 pb-3 mb-4">
                <span className="font-bold text-gray-800 text-sm flex items-center gap-1.5">
                  <QrCode className="w-4 h-4 text-[#f26b4f]" /> Barcode Scan Simulator
                </span>
                <button onClick={() => setIsScannerOpen(false)} className="cursor-pointer hover:text-red-500 text-gray-400">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {scannerStep === 'scanning' ? (
                <div className="flex flex-col items-center py-6 space-y-4">
                  <div className="relative w-48 h-32 bg-stone-50 border border-stone-200 rounded-lg flex items-center justify-center p-4 overflow-hidden shadow-inner">
                    <div className="absolute left-0 right-0 h-0.5 bg-red-500 shadow-[0_0_10px_2px_rgba(239,68,68,0.8)] animate-bounce" style={{ top: '35%' }} />
                    <div className="flex items-stretch gap-1 w-full h-16 select-none opacity-80">
                      <div className="bg-stone-800 w-1.5"></div>
                      <div className="bg-stone-800 w-0.5"></div>
                      <div className="bg-stone-800 w-1"></div>
                      <div className="bg-stone-800 w-2"></div>
                      <div className="bg-stone-800 w-0.5"></div>
                      <div className="bg-stone-800 w-1"></div>
                      <div className="bg-[#f26b4f] w-1.5 animate-pulse"></div>
                      <div className="bg-stone-800 w-2"></div>
                      <div className="bg-stone-800 w-0.5"></div>
                      <div className="bg-stone-800 w-1"></div>
                      <div className="bg-stone-800 w-1.5"></div>
                    </div>
                  </div>
                  <span className="text-gray-500 font-mono tracking-wider animate-pulse">Reading organic cargo tag metadata...</span>
                </div>
              ) : (
                <div className="space-y-4 py-3">
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                    <div className="w-10 h-10 bg-green-505 bg-green-500 rounded-full text-white flex items-center justify-center mx-auto mb-2 shadow-sm">
                      <Check className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-bold text-green-800 block">Package Cargo Read Nominal!</span>
                    <span className="text-xs font-mono text-green-700 block mt-1">{scannedCode}</span>
                  </div>

                  <div className="space-y-2 text-xs text-gray-600 bg-stone-50 p-3.5 rounded-xl">
                    <div className="flex justify-between">
                      <span>Inferred Material:</span>
                      <strong className="text-gray-800 font-mono">Organic Alfalfa feed Sack</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Logistics Registry:</span>
                      <strong className="text-gray-800 font-mono">FR-Wholesaler Feed Express</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Status Certified:</span>
                      <strong className="text-green-600">PASSED QUALITY TESTS</strong>
                    </div>
                  </div>

                  <div className="pt-2 flex gap-2 text-xs">
                    <button 
                      type="button" 
                      onClick={() => setIsScannerOpen(false)}
                      className="flex-1 py-2 bg-stone-100 hover:bg-stone-200 rounded-lg font-bold text-gray-600 transition cursor-pointer text-center text-[10px] font-mono leading-none"
                    >
                      Reject Pack
                    </button>
                    <button 
                      type="button" 
                      onClick={handleAcceptPackage}
                      className="flex-1 py-2 bg-[#f26b4f] hover:bg-[#e65a3d] text-white rounded-lg font-bold transition shadow-sm cursor-pointer text-center text-[10px] font-mono leading-none"
                    >
                      Accept Package
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
