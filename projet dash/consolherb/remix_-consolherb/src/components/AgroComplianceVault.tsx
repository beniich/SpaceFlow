import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, 
  Cpu, 
  Terminal as TerminalIcon, 
  Lock, 
  Fingerprint, 
  Activity, 
  Radio, 
  RefreshCw, 
  Database,
  Plus,
  Compass,
  CheckCircle,
  Clock
} from 'lucide-react';

interface AgroComplianceVaultProps {
  onAddLog: (level: 'info' | 'success' | 'warn' | 'error', message: string) => void;
}

export default function AgroComplianceVault({ onAddLog }: AgroComplianceVaultProps) {
  // Timeline nodes state
  const [timelineEntries, setTimelineEntries] = useState([
    { date: '2026-06-05 10:15 AM', type: 'DATA_ENTRY_HASH', label: 'Data Entry Hashed', hash: '43eaf3e5a2127c3b', user: 'Admin_AB' },
    { date: '2026-06-05 11:30 AM', type: 'POLICY_UPDATE', label: 'Policy Updated', hash: '45cae5c535b23ede', user: 'System_Sec' },
    { date: '2026-06-05 02:45 PM', type: 'LOGS_ARCHIVED', label: 'Access Log Archived', hash: '43a4a7b7e28ba06a', user: 'Admin_AB' },
  ]);

  const [inputEntryLabel, setInputEntryLabel] = useState('');
  const [tenantMultiplier, setTenantMultiplier] = useState(1);
  const [activeNodesCount, setActiveNodesCount] = useState(24);

  // Dynamic ledger entry simulation
  const handleAddLedgerNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputEntryLabel.trim()) return;

    // Simulate custom SHA-256 hashing
    const hex = '0123456789abcdef';
    let pseudoHash = '';
    for (let i = 0; i < 16; i++) {
      pseudoHash += hex[Math.floor(Math.random() * 16)];
    }

    const timeString = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString().substring(0, 5);
    const newEntry = {
      date: timeString,
      type: 'OPERATOR_COMMIT',
      label: inputEntryLabel.toUpperCase(),
      hash: pseudoHash,
      user: 'adambeniich7'
    };

    setTimelineEntries(prev => [...prev, newEntry]);
    setInputEntryLabel('');
    onAddLog('success', `VAULT_LEDGER: Nouveau bloc cryptographique engagé ! Intégrité SHA: ${pseudoHash}.`);
  };

  const handleSelfAuditTrigger = () => {
    setActiveNodesCount(prev => prev + 1);
    setTenantMultiplier(prev => prev + 0.01);
    onAddLog('info', 'VAULT_AUDIT: Signal d\'intégrité global (Vérificateur local de bloc) activé.');
  };

  return (
    <div className="bg-[#0b1727] text-[#d4e4fa] rounded-sm p-6 border border-[#1e2f47] relative font-mono shadow-2xl overflow-hidden" id="agro-compliance-vault">
      
      {/* Background glowing particles or vector mesh */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none select-none"></div>
      
      {/* Brand Header */}
      <header className="flex justify-between items-center mb-8 pb-4 border-b border-[#1c2e46] relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-cyan-950 border border-cyan-500 rounded-sm flex items-center justify-center p-1.5 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <Fingerprint className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-white tracking-tight uppercase">AgroMaître (Herboferme)</span>
              <span className="text-[9px] bg-cyan-950 text-cyan-400 border border-cyan-500/30 px-1.5 py-0.5 rounded-sm font-bold animate-pulse">CRYPTOGRAPHIC_CORE</span>
            </div>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest">Compliance & Security Audit Vault</p>
          </div>
        </div>

        {/* User context info */}
        <div className="flex items-center gap-3">
          <span className="text-[9px] bg-slate-900 border border-slate-700 font-bold font-mono text-[#8f9097] px-2 py-1 rounded-sm">
            USER: adambeniich7@gmail.com
          </span>
          <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-xs font-bold text-cyan-400">
            AM
          </div>
        </div>
      </header>

      {/* Main Core Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        
        {/* Left Area (col-span-8): Immutable Audit Timeline */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="bg-[#0e2137]/90 border border-[#1d3554] p-5 rounded-xs shadow-lg relative">
            <div className="absolute top-2 right-2 text-[8px] text-cyan-400 font-bold bg-cyan-950/40 p-1 border border-cyan-500/35 uppercase">
              REDUCED LATENCY ENCRYPTION
            </div>

            <h3 className="text-white text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
              <Compass className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
              SEC-SOC Immutable Audit Timeline
            </h3>

            {/* Connecting visual pipeline graph */}
            <div className="overflow-x-auto pb-4">
              <div className="min-w-[600px] flex items-center gap-1.5 justify-start relative px-4">
                
                {timelineEntries.map((node, idx) => (
                  <div key={idx} className="flex items-center">
                    
                    {/* Node block visualizer */}
                    <div className="bg-[#071322] border-2 border-cyan-500/80 p-4 w-52 rounded-xs hover:border-cyan-400 transition-all duration-200 shadow-md flex gap-3 relative group">
                      
                      {/* Node number tag */}
                      <div className="w-7 h-7 bg-cyan-950/80 border border-cyan-500 flex items-center justify-center text-cyan-400 text-xs font-bold rounded-sm shrink-0">
                        #
                      </div>

                      <div className="space-y-1 overflow-hidden">
                        <div className="text-[8px] text-[#8f9097] font-mono whitespace-nowrap flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" /> {node.date.split(' ')[1] + ' ' + node.date.split(' ')[2]}
                        </div>
                        <h4 className="text-white text-[10px] font-bold tracking-tight uppercase truncate">{node.label}</h4>
                        <div className="text-[9px] text-[#38BDF8] font-mono font-bold leading-none truncate">
                          HASH: {node.hash}
                        </div>
                        <div className="text-[7.5px] text-gray-500">BY: {node.user}</div>
                      </div>
                    </div>

                    {/* Pipe Connection arrow */}
                    {idx < timelineEntries.length - 1 && (
                      <div className="w-10 h-0.5 bg-gradient-to-r from-cyan-500 to-cyan-500/60 relative flex items-center justify-center shrink-0">
                        <div className="absolute w-1.5 h-1.5 bg-cyan-300 rounded-full animate-ping" />
                        <span className="text-[7px] text-cyan-400 absolute bottom-1 font-bold">»</span>
                      </div>
                    )}

                  </div>
                ))}

              </div>
            </div>

            {/* Quick Commit form inside ledger */}
            <form onSubmit={handleAddLedgerNode} className="border-t border-[#1d3554]/60 pt-4 mt-6 flex gap-3 items-end">
              <div className="flex-1">
                <label className="text-[8.5px] text-[#8f9097] uppercase font-bold block mb-1">Add New Compliancy Log To Immutable Ledger:</label>
                <input 
                  type="text" 
                  value={inputEntryLabel}
                  onChange={(e) => setInputEntryLabel(e.target.value)}
                  className="w-full bg-[#071322] border border-[#1e3450] p-1.5 rounded-sm text-xs text-cyan-300 placeholder-slate-600 focus:outline-none focus:border-cyan-400 transition"
                  placeholder="e.g. SENSOR_SECTOR_B12_RECALIBRATED..."
                />
              </div>
              <button 
                type="submit"
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold uppercase py-1.5 px-3 block transition cursor-pointer shrink-0 rounded-xs"
              >
                + Commit Node
              </button>
            </form>

          </div>

          {/* Interactive self audit status trigger area */}
          <div className="bg-[#0e2137]/90 border border-[#1d3554] p-5 rounded-xs shadow-lg">
            <h3 className="text-white text-xs font-bold uppercase tracking-widest mb-4">Secured Operational Compliance Nodes</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-[#071322] border border-[#192f49] p-3 rounded-xs text-center">
                <div className="text-[9px] text-[#8f9097] uppercase">Vulnerabilities Scan</div>
                <div className="text-xs font-bold text-emerald-400 mt-1">0 CRITICAL</div>
              </div>
              <div className="bg-[#071322] border border-[#192f49] p-3 rounded-xs text-center">
                <div className="text-[9px] text-[#8f9097] uppercase">Certificate Level</div>
                <div className="text-xs font-bold text-cyan-400 mt-1">SOC-2 COMPLETE</div>
              </div>
              <div className="bg-[#071322] border border-[#192f49] p-3 rounded-xs text-center">
                <div className="text-[9px] text-[#8f9097] uppercase">Encryptions Checked</div>
                <div className="text-xs font-bold text-white mt-1">100% PERFECT</div>
              </div>
              <div className="bg-[#071322] border border-[#1d3554] p-3 rounded-xs text-center flex flex-col justify-between">
                <div className="text-[9px] text-[#8f9097] uppercase leading-none">Active Cores</div>
                <div className="text-xs font-bold text-white mt-1 shrink-0">{activeNodesCount} Cores</div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Area (col-span-4): Multi-Tenancy Isolation stats */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Glass Card: Multi-Tenancy Isolation stats */}
          <div className="bg-[#0e2137]/65 border border-[#1e3450] p-5 rounded-xs space-y-4 shadow-xl">
            <h3 className="text-white text-xs font-bold uppercase tracking-widest border-b border-[#1d3554]/80 pb-2 flex items-center justify-between">
              <span>Multi-Tenancy Isolation Stats</span>
              <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
            </h3>

            <div className="space-y-4">
              
              {/* Isolated tenants */}
              <div 
                className="p-3 bg-[#071322] border border-[#1e3450] rounded-xs relative group cursor-pointer hover:border-cyan-400 transition"
                onClick={() => {
                  setTenantMultiplier(prev => prev + 0.05);
                  onAddLog('info', 'VAULT_ISOLATION: Réajustement dynamique de l\'hyperviseur d\'isolation multitenant.');
                }}
              >
                <div className="flex justify-between items-start text-[10px] mb-1">
                  <span className="text-[#8f9097] uppercase">Isolated Tenants:</span>
                  <span className="text-cyan-400 font-bold">{Math.round(1250 * tenantMultiplier)} Units</span>
                </div>
                {/* Micro sparkline */}
                <div className="h-6 w-full pt-1">
                  <svg className="w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none">
                    <polyline fill="none" stroke="#22d3ee" strokeWidth="1.5" points="0,15 20,12 40,16 60,8 80,11 100,2" />
                  </svg>
                </div>
              </div>

              {/* Resource Segmentation */}
              <div className="p-3 bg-[#071322] border border-[#1e3450] rounded-xs relative">
                <div className="flex justify-between items-start text-[10px] mb-1">
                  <span className="text-[#8f9097] uppercase">Resource Segmentation:</span>
                  <span className="text-emerald-400 font-bold">99.99%</span>
                </div>
                <div className="h-6 w-full pt-1">
                  <svg className="w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none">
                    <polyline fill="none" stroke="#10b981" strokeWidth="1.5" points="0,5 20,8 40,4 60,6 80,3 100,4" />
                  </svg>
                </div>
              </div>

              {/* Data Integrity Checks */}
              <div className="p-3 bg-[#071322] border border-[#1e3450] rounded-xs relative">
                <div className="flex justify-between items-start text-[10px] mb-1">
                  <span className="text-[#8f9097] uppercase">Data Integrity Checks:</span>
                  <span className="text-[#38BDF8] font-bold">24/7 ACTIVE</span>
                </div>
                <div className="h-6 w-full pt-1">
                  {/* Dynamic waveform mock */}
                  <div className="flex items-end gap-1.5 h-full opacity-60">
                    <div className="w-1.5 h-3 bg-cyan-400 animate-pulse"></div>
                    <div className="w-1.5 h-4 bg-cyan-400"></div>
                    <div className="w-1.5 h-2 bg-cyan-400 animate-ping"></div>
                    <div className="w-1.5 h-5 bg-cyan-400"></div>
                  </div>
                </div>
              </div>

              {/* Logical separation status */}
              <div className="p-3 bg-[#071322] border border-[#1d3554] rounded-xs flex justify-between items-center">
                <span className="text-[10px] text-[#8f9097] uppercase">Logical Separation:</span>
                <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800/40 px-2 py-0.5 rounded-sm font-bold tracking-widest uppercase">
                  ✓ SECURE
                </span>
              </div>

            </div>
          </div>

          {/* SOC 2 type II certificate status card */}
          <div className="p-4 bg-[#071322] border border-[#1d2f47] rounded-xs flex justify-between items-center hover:border-cyan-400 transition cursor-help relative group shadow-lg"
            onClick={handleSelfAuditTrigger}
          >
            <div className="space-y-1">
              <div className="text-[10px] text-[#8f9097] uppercase tracking-wide">COMPLIANCY CERTIFICATE</div>
              <h4 className="text-white text-xs font-bold uppercase">SOC 2 Type II Certified</h4>
              <p className="text-[8px] text-gray-500 font-mono">STATUS: ACTIVE // VAL THROUGH: 2027</p>
            </div>
            
            <CheckCircle className="w-8 h-8 text-[#4de082] shrink-0" />
          </div>

          {/* System Health Card */}
          <div className="p-4 bg-[#071322] border border-[#1d2f47] rounded-xs flex justify-between items-center shadow-lg">
            <div className="space-y-0.5">
              <div className="text-[9px] text-[#8f9097] uppercase">Global Vault Telemetry</div>
              <h4 className="text-white text-xs font-bold uppercase">SYSTEM HEALTH: OPTIMAL</h4>
            </div>
            
            {/* Green glowing indicator dot */}
            <span className="w-3 h-3 bg-[#4de082] rounded-full shadow-[0_0_10px_rgba(77,224,130,0.8)] animate-pulse"></span>
          </div>

        </div>

      </div>

    </div>
  );
}
