import { ShieldAlert, Zap, Cpu, RefreshCw, Layers } from 'lucide-react';
import { motion } from 'motion/react';

interface AttackSimulatorProps {
  onSimulateDDoS: () => void;
  onSimulateMalware: () => void;
  onSimulatePatch: () => void;
  onSimulateScan: () => void;
  onRestoreAll: () => void;
  isAttacking: boolean;
}

export default function AttackSimulator({
  onSimulateDDoS,
  onSimulateMalware,
  onSimulatePatch,
  onSimulateScan,
  onRestoreAll,
  isAttacking
}: AttackSimulatorProps) {
  return (
    <div className="bg-[#122131] border border-[#334155] rounded-[4px] p-5 flex flex-col justify-between" id="attack-simulation-hub">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Layers className="w-4 h-4 text-[#38BDF8]" />
          <h3 className="font-mono text-[12px] font-bold text-white uppercase tracking-wider">
            CONTRÔLE INTÉGRÉ & INTRUSION SIMULÉE
          </h3>
        </div>
        <p className="text-xs text-[#c5c6cd] mb-4">
          Testez la robustesse du centre de commandement en temps réel avec des injecteurs d'événements.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          {/* Preset 1: DDoS Attack */}
          <button
            onClick={onSimulateDDoS}
            className="flex items-center gap-2 justify-center bg-red-950/40 hover:bg-red-950/80 border border-red-500/30 text-red-300 rounded-[3px] py-2 px-3 text-xs font-mono font-semibold hover:border-red-500 transition shadow-sm cursor-pointer"
            id="trigger-ddos-sim"
          >
            <Zap className="w-3.5 h-3.5 text-red-400 animate-bounce" />
            <span>Spike DDoS</span>
          </button>

          {/* Preset 2: SQL Malware Insertion */}
          <button
            onClick={onSimulateMalware}
            className="flex items-center gap-2 justify-center bg-amber-950/40 hover:bg-amber-950/80 border border-amber-500/30 text-amber-300 rounded-[3px] py-2 px-3 text-xs font-mono font-semibold hover:border-amber-500 transition shadow-sm cursor-pointer"
            id="trigger-malware-sim"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Inject Malware</span>
          </button>

          {/* Preset 3: Database Patching */}
          <button
            onClick={onSimulatePatch}
            className="flex items-center gap-2 justify-center bg-blue-950/40 hover:bg-blue-950/80 border border-blue-500/30 text-blue-300 rounded-[3px] py-2 px-3 text-xs font-mono font-semibold hover:border-blue-500 transition shadow-sm cursor-pointer"
            id="trigger-patch-sim"
          >
            <Cpu className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>Apply Patch</span>
          </button>

          {/* Preset 4: Global audit checks */}
          <button
            onClick={onSimulateScan}
            className="flex items-center gap-2 justify-center bg-emerald-950/40 hover:bg-emerald-950/80 border border-[#4de082]/30 text-emerald-300 rounded-[3px] py-2 px-3 text-xs font-mono font-semibold hover:border-[#4de082] transition shadow-sm cursor-pointer"
            id="trigger-scan-sim"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#4de082]" />
            <span>SOC 2 Scan</span>
          </button>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-[#334155]/60 flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-mono text-[10px]">
          <span className={`w-2 h-2 rounded-full ${isAttacking ? 'bg-red-500 animate-ping' : 'bg-[#4de082]'}`}></span>
          <span className="text-[#8f9097] uppercase">STATUS SIMULATEUR:</span>
          <span className={isAttacking ? 'text-red-400 font-bold' : 'text-[#4de082]'}>
            {isAttacking ? 'ATTAC_INJECT_ON' : 'NORMAL (REPOS)'}
          </span>
        </div>

        <button
          onClick={onRestoreAll}
          className="text-[10px] font-mono text-[#38BDF8] hover:text-white hover:underline transition uppercase px-2 py-0.5 border border-[#38BDF8]/40 hover:border-[#38BDF8] rounded-sm cursor-pointer"
          id="trigger-restore-all"
        >
          Réinitialiser le Système
        </button>
      </div>
    </div>
  );
}
