import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';

import AgroInventorySupply from './AgroInventorySupply';
import AgroFinanceBilling from './AgroFinanceBilling';
import AgroAIPredictive from './AgroAIPredictive';
import AgroITInfrastructure from './AgroITInfrastructure';
import AgroFleetGPS from './AgroFleetGPS';
import AgroTelemetryIoT from './AgroTelemetryIoT';
import AgroHRWorkforce from './AgroHRWorkforce';
import AgroSustainabilityTracker from './AgroSustainabilityTracker';
import AgroWorkspaceSettings from './AgroWorkspaceSettings';
import AgroCropsIrrigation from './AgroCropsIrrigation';
import AgroKanbanTasks from './AgroKanbanTasks';
import AgroGreenhouseControl from './AgroGreenhouseControl';
import AgroLivestockHub from './AgroLivestockHub';
import AgroBotanicalModule from './AgroBotanicalModule';
import AgroProductShop from './AgroProductShop';
import AgroPestWarning from './AgroPestWarning';
import AgroWorkforceLeaderboard from './AgroWorkforceLeaderboard';
import AgroSupplyChainTrace from './AgroSupplyChainTrace';
import AgroReportBuilder from './AgroReportBuilder';
import AgroApiSettings from './AgroApiSettings';
import AgroSystemMaintenance from './AgroSystemMaintenance';

interface AgroMaitreSuiteProps {
  onAddLog: (level: 'info' | 'success' | 'warn' | 'error', message: string) => void;
}

export default function AgroMaitreSuite({ onAddLog }: AgroMaitreSuiteProps) {
  const [isMaintenanceActive, setIsMaintenanceActive] = useState(false);

  // Available sub-pages correspond to the premium interfaces + existing analytics shards
  const [activePortal, setActivePortal] = useState<
    | 'workspace'
    | 'irrigation'
    | 'tasks_kanban'
    | 'ai_predictive'
    | 'finance'
    | 'greenhouse'
    | 'sustainability'
    | 'attendance'
    | 'inventory'
    | 'it_infra'
    | 'fleet_gps'
    | 'telemetry_iot'
    | 'livestock_hub'
    | 'botanical_module'
    | 'product_shop'
    | 'pest_warnings'
    | 'workforce_leaderboard'
    | 'supply_chain_trace'
    | 'report_builder'
    | 'api_settings'
  >('livestock_hub');

  // SLEEK MINUSCULE MENU: Small list mapping for top navigation bar
  const portals = [
    { id: 'livestock_hub' as const, title: 'Livestock Hub', icon: '🐄', tag: 'Img 6 New' },
    { id: 'botanical_module' as const, title: 'Botanical Module', icon: '🌿', tag: 'Img 7 New' },
    { id: 'product_shop' as const, title: 'Product Shop', icon: '🛒', tag: 'Img 1 New' },
    { id: 'pest_warnings' as const, title: 'Pest Warnings', icon: '🐛', tag: 'Img 2 New' },
    { id: 'workforce_leaderboard' as const, title: 'Workforce Performance', icon: '🏆', tag: 'Img 3 New' },
    { id: 'supply_chain_trace' as const, title: 'Supply Chain Trace', icon: '🚚', tag: 'Img 4 New' },
    { id: 'report_builder' as const, title: 'Report Builder', icon: '📊', tag: 'Img 7 New' },
    { id: 'api_settings' as const, title: 'API Settings', icon: '🔑', tag: 'Img 8 New' },
    { id: 'workspace' as const, title: 'Workspace Settings', icon: '⚙️', tag: 'Img 1 DB' },
    { id: 'irrigation' as const, title: 'Irrigation & Weather', icon: '💧', tag: 'Image 1' },
    { id: 'tasks_kanban' as const, title: 'Tasks Kanban', icon: '📋', tag: 'Image 2' },
    { id: 'ai_predictive' as const, title: 'Yield Spline & Risks', icon: '🧠', tag: 'Image 3' },
    { id: 'finance' as const, title: 'Finance Health', icon: '💰', tag: 'Image 4' },
    { id: 'greenhouse' as const, title: 'Greenhouse Climate', icon: '🏠', tag: 'Image 5' },
    { id: 'sustainability' as const, title: 'CO₂ Sustainability', icon: '🌱', tag: 'Active' },
    { id: 'attendance' as const, title: 'HR Presence', icon: '🌾', tag: 'Active' },
    { id: 'inventory' as const, title: 'Supply Barcode', icon: '📦', tag: 'Active' },
    { id: 'it_infra' as const, title: 'IT Diagnostics', icon: '🔌', tag: 'Active' },
    { id: 'fleet_gps' as const, title: 'Fleet Track', icon: '🚜', tag: 'Active' },
    { id: 'telemetry_iot' as const, title: 'IoT Telemetry', icon: '📡', tag: 'Active' },
  ];

  const handlePortalSwitch = (portalId: typeof activePortal, title: string) => {
    setActivePortal(portalId);
    onAddLog('success', `PORTAL_SUITE: Passage réussi au portail [${title}]`);
  };

  if (isMaintenanceActive) {
    return (
      <AgroSystemMaintenance 
        onExit={() => {
          setIsMaintenanceActive(false);
          onAddLog('success', 'MAINTENANCE: Option de maintenance résolue, accès aux terminaux restauré.');
        }}
      />
    );
  }

  return (
    <div className="space-y-4" id="agromaitre-suite-container">
      
      {/* 2. ULTRALIGHT MINUSCULE MENU - Tiny selection strip at the top of the page */}
      <div className="bg-[#0b131c] border border-slate-700/60 p-2 rounded-lg shadow-md" id="agromaitre-selector">
        <div className="flex flex-wrap items-center justify-between gap-2 px-1 border-b border-slate-800 pb-1.5 mb-1.5">
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-[#4de082] rounded-full animate-pulse" />
            <span className="text-[10px] font-mono font-bold text-slate-300 uppercase tracking-tight">
              AgroMaître Shard Navigation (Tiny Menu)
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsMaintenanceActive(true);
                onAddLog('warn', 'MAINTENANCE: Simulation du mode maintenance en cours (Image 9)...');
              }}
              className="text-[8.5px] uppercase font-mono font-bold bg-[#381a12]/80 hover:bg-orange-950 border border-[#BC542B]/40 hover:border-[#BC542B] text-[#e06d4d] px-2 py-0.5 rounded cursor-pointer select-none active:scale-95 transition"
            >
              🛠 Simulate Maintenance (Pg 9)
            </button>
            <div className="text-[8px] font-mono text-emerald-400 bg-emerald-950/20 px-1.5 py-0.5 rounded-sm border border-emerald-500/30">
              16 RE-ENGINEERED WEB INTERFACES ACTIVE
            </div>
          </div>
        </div>

        {/* Minimal Horizontal Pills Segment Row - Maximum screen conserving */}
        <div className="flex flex-wrap gap-1 md:gap-1.5 overflow-x-auto py-0.5 max-h-24 scrollbar-thin scrollbar-thumb-slate-700 font-sans">
          {portals.map(p => {
            const isSelected = activePortal === p.id;
            const isPrimaryImage = ['irrigation', 'tasks_kanban', 'ai_predictive', 'finance', 'greenhouse'].includes(p.id);
            const isNewImage = ['livestock_hub', 'botanical_module', 'product_shop', 'pest_warnings', 'workforce_leaderboard', 'supply_chain_trace', 'report_builder', 'api_settings'].includes(p.id);

            return (
              <button
                key={p.id}
                onClick={() => handlePortalSwitch(p.id, p.title)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase transition duration-150 cursor-pointer select-none border whitespace-nowrap active:scale-95 ${
                  isSelected 
                    ? 'bg-[#1c2c3e] border-[#4de082] text-[#4de082] shadow-xs' 
                    : isPrimaryImage 
                      ? 'bg-[#15120e] border-orange-500/20 text-[#BC542B] hover:border-orange-500/40'
                      : isNewImage
                        ? 'bg-[#1a140d]/80 border-amber-600/30 text-amber-500 hover:border-amber-600/50'
                        : 'bg-[#080d14] border-slate-800 text-slate-400 hover:text-white hover:border-slate-600'
                }`}
              >
                <span className="text-xs shrink-0">{p.icon}</span>
                <span>{p.title}</span>
                <span className={`text-[7.5px] scale-90 px-1 py-[1.2px] rounded-sm tracking-tight ${
                  isSelected 
                    ? 'bg-emerald-950/50 text-[#4de082]' 
                    : isPrimaryImage 
                      ? 'bg-orange-950/50 text-orange-400' 
                      : isNewImage
                        ? 'bg-amber-950/40 text-amber-400'
                        : 'bg-slate-900 text-slate-500'
                }`}>
                  {p.tag}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Portal Visual Rendering Area with AnimatePresence */}
      <div className="relative">
        <AnimatePresence mode="wait">
          {activePortal === 'livestock_hub' && (
            <motion.div
              key="portal-livestock"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.12 }}
            >
              <AgroLivestockHub onAddLog={onAddLog} />
            </motion.div>
          )}

          {activePortal === 'botanical_module' && (
            <motion.div
              key="portal-botanical"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.12 }}
            >
              <AgroBotanicalModule onAddLog={onAddLog} />
            </motion.div>
          )}

          {activePortal === 'product_shop' && (
            <motion.div
              key="portal-product-shop"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.12 }}
            >
              <AgroProductShop onAddLog={onAddLog} />
            </motion.div>
          )}

          {activePortal === 'pest_warnings' && (
            <motion.div
              key="portal-pest-warnings"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.12 }}
            >
              <AgroPestWarning onAddLog={onAddLog} />
            </motion.div>
          )}

          {activePortal === 'workforce_leaderboard' && (
            <motion.div
              key="portal-workforce-leaderboard"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.12 }}
            >
              <AgroWorkforceLeaderboard onAddLog={onAddLog} />
            </motion.div>
          )}

          {activePortal === 'supply_chain_trace' && (
            <motion.div
              key="portal-supply-chain-trace"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.12 }}
            >
              <AgroSupplyChainTrace onAddLog={onAddLog} />
            </motion.div>
          )}

          {activePortal === 'workspace' && (
            <motion.div
              key="portal-workspace"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.12 }}
            >
              <AgroWorkspaceSettings onAddLog={onAddLog} />
            </motion.div>
          )}


          {activePortal === 'irrigation' && (
            <motion.div
              key="portal-irrigation"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.12 }}
            >
              <AgroCropsIrrigation onAddLog={onAddLog} />
            </motion.div>
          )}

          {activePortal === 'tasks_kanban' && (
            <motion.div
              key="portal-tasks-kanban"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.12 }}
            >
              <AgroKanbanTasks onAddLog={onAddLog} />
            </motion.div>
          )}

          {activePortal === 'ai_predictive' && (
            <motion.div
              key="portal-ai"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.12 }}
            >
              <AgroAIPredictive onAddLog={onAddLog} />
            </motion.div>
          )}

          {activePortal === 'finance' && (
            <motion.div
              key="portal-finance"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.12 }}
            >
              <AgroFinanceBilling onAddLog={onAddLog} />
            </motion.div>
          )}

          {activePortal === 'greenhouse' && (
            <motion.div
              key="portal-greenhouse"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.12 }}
            >
              <AgroGreenhouseControl onAddLog={onAddLog} />
            </motion.div>
          )}

          {activePortal === 'sustainability' && (
            <motion.div
              key="portal-sustainability"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.12 }}
            >
              <AgroSustainabilityTracker onAddLog={onAddLog} />
            </motion.div>
          )}

          {activePortal === 'attendance' && (
            <motion.div
              key="portal-attendance"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.12 }}
            >
              <AgroHRWorkforce onAddLog={onAddLog} />
            </motion.div>
          )}

          {activePortal === 'inventory' && (
            <motion.div
              key="portal-inventory"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.12 }}
            >
              <AgroInventorySupply onAddLog={onAddLog} />
            </motion.div>
          )}

          {activePortal === 'it_infra' && (
            <motion.div
              key="portal-it"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.12 }}
            >
              <AgroITInfrastructure onAddLog={onAddLog} />
            </motion.div>
          )}

          {activePortal === 'fleet_gps' && (
            <motion.div
              key="portal-fleet"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.12 }}
            >
              <AgroFleetGPS onAddLog={onAddLog} />
            </motion.div>
          )}

          {activePortal === 'telemetry_iot' && (
            <motion.div
              key="portal-iot"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.12 }}
            >
              <AgroTelemetryIoT onAddLog={onAddLog} />
            </motion.div>
          )}

          {activePortal === 'report_builder' && (
            <motion.div
              key="portal-report-builder"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.12 }}
            >
              <AgroReportBuilder onAddLog={onAddLog} />
            </motion.div>
          )}

          {activePortal === 'api_settings' && (
            <motion.div
              key="portal-api-settings"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.12 }}
            >
              <AgroApiSettings onAddLog={onAddLog} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
