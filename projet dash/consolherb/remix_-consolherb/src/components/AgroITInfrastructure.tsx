import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Server, 
  Database, 
  Terminal as TermIcon, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Play, 
  RefreshCw, 
  TrendingUp, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Eye
} from 'lucide-react';

interface AgroITInfrastructureProps {
  onAddLog: (level: 'info' | 'success' | 'warn' | 'error', message: string) => void;
}

export default function AgroITInfrastructure({ onAddLog }: AgroITInfrastructureProps) {
  const [tickets, setTickets] = useState([
    { id: '#4501', subject: 'URGENT: Database Connection Failure', status: 'Open', color: 'bg-red-650 text-white border border-red-500', assigned: 'Tech A', due: 'Today 10:00 AM' },
    { id: '#4498', subject: 'Feature Request: New Reports', status: 'In Progress', color: 'bg-amber-100 text-amber-805 border border-amber-300', assigned: 'Dev B', due: 'Tomorrow' },
    { id: '#4495', subject: 'User Access Issue', status: 'Closed', color: 'bg-stone-100 text-stone-500 border border-stone-300', assigned: 'Tech A', due: 'Yesterday' },
  ]);

  const [logs, setLogs] = useState([
    { time: '10:18:32', type: 'INFO', msg: 'Redis cache cleared successfully.', service: '(System)' },
    { time: '10:19:15', type: 'WARN', msg: 'High CPU usage on worker-node-03.', service: '(Monitoring)' },
    { time: '10:20:01', type: 'OK', msg: 'API health check passed. Response time: 15ms.', service: '(Health Check)' },
    { time: '10:20:30', type: 'ERROR', msg: 'Failed to connect to external payment gateway. Retrying...', service: '(Payment Service)' },
  ]);

  const [testProgress, setTestProgress] = useState(55);
  const [isRunningTests, setIsRunningTests] = useState(false);

  const handleClearCache = () => {
    onAddLog('info', 'INFRA: Commande de purge de cache initiée par l\'administrateur.');
    setTimeout(() => {
      const stamp = new Date().toLocaleTimeString();
      setLogs(prev => [
        { time: stamp, type: 'INFO', msg: 'Manual cache invalidation requested. Cleared 1,240 keys.', service: '(Admin)' },
        ...prev
      ]);
      onAddLog('success', 'INFRA: Base Redis purgée et reconsolidée.');
    }, 800);
  };

  const runDevOpsTests = () => {
    if (isRunningTests) return;
    setIsRunningTests(true);
    setTestProgress(10);
    onAddLog('info', 'INFRA: Relance des tests unitaires et intégration (DevOps Pipeline v2.4.1).');
    
    const interval = setInterval(() => {
      setTestProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setIsRunningTests(false);
          const stamp = new Date().toLocaleTimeString();
          setLogs(prev => [
            { time: stamp, type: 'OK', msg: 'All 84 unit tests and 12 integration tasks passed successfully.', service: '(CI/CD)' },
            ...prev
          ]);
          onAddLog('success', 'INFRA: Pipeline DevOps v2.4.1 passé vert.');
          return 100;
        }
        return p + 15;
      });
    }, 450);
  };

  return (
    <div className="bg-[#FAF9F5] text-[#2c1a04] p-4 sm:p-6 border border-[#e1d5c1] rounded-sm font-sans shadow-md" id="it-infrastructure-monitor">
      
      {/* Brand Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#e1d5c1] pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#BC542B] rounded-sm flex items-center justify-center text-white font-bold text-lg select-none">
            ⚙️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-serif font-bold text-[#451e09] lg:text-base">AgroMaître (Herboferme)</span>
              <span className="text-[10px] text-stone-500 font-mono hidden sm:inline">|</span>
              <span className="text-xs uppercase font-mono tracking-wider font-bold text-[#BC542B]">IT Infrastructure & Support Monitor</span>
            </div>
            <p className="text-xs text-[#6e5845] font-mono uppercase">IMAGE 4: Server Health Diagnostics & Support Tickets (GLPI)</p>
          </div>
        </div>

        {/* Dashboard inner secondary tabs mockup */}
        <div className="flex gap-4 text-xs font-mono font-bold text-stone-500 shrink-0 select-none">
          <span className="text-[#BC542B] border-b border-[#BC542B] pb-1 cursor-pointer">Dashboard</span>
          <span className="hover:text-black cursor-pointer">Tickets (GLPI)</span>
          <span className="hover:text-black cursor-pointer">DevOps</span>
          <span className="hover:text-black cursor-pointer">Settings</span>
        </div>
      </header>

      {/* Main Health View block */}
      <div className="space-y-6">
        
        <div>
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-stone-500 mb-3 select-none">Infrastructure Health View</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* MongoDB Card */}
            <div className="bg-white border border-[#e1d5c1] rounded-sm p-4 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start border-b border-stone-150 pb-1.5">
                  <div>
                    <h3 className="text-sm font-bold text-[#451e09] font-mono">MongoDB Cluster</h3>
                    <p className="text-[9.5px] font-mono text-stone-400 mt-0.5">Status: <span className="text-emerald-700 font-bold">Healthy</span></p>
                  </div>
                  <span className="text-[9px] font-bold text-[#BC542B] bg-[#BC542B]/10 rounded-sm px-1.5 py-0.5 font-mono select-none uppercase">Brick Orange</span>
                </div>

                {/* Sparkling visual heart monitor */}
                <div className="py-4 h-16 flex items-center justify-between">
                  {/* Custom wave */}
                  <svg className="w-full h-full text-red-600" viewBox="0 0 100 30" preserveAspectRatio="none">
                    <path 
                      d="M 0 15 L 20 15 L 30 15 L 35 5 L 40 25 L 45 15 L 50 15 L 55 10 L 60 20 L 65 15 L 80 15 L 100 15" 
                      fill="none" 
                      stroke="#BA5834" 
                      strokeWidth="1.8" 
                    />
                    <circle cx="80" cy="15" r="2.5" fill="#BA5834" className="animate-ping" />
                  </svg>
                </div>
              </div>

              <div className="flex justify-between text-[10px] font-mono text-stone-500 border-t border-stone-100 pt-2.5">
                <span>Nodes: <strong>5/5</strong></span>
                <span>Uptime: <strong>99.99%</strong></span>
                <span>Latency: <strong>12ms</strong></span>
              </div>
            </div>

            {/* Redis Cache Card */}
            <div className="bg-white border border-[#e1d5c1] rounded-sm p-4 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start border-b border-stone-150 pb-1.5">
                  <div>
                    <h3 className="text-sm font-bold text-[#451e09] font-mono">Redis Cache</h3>
                    <p className="text-[9.5px] font-mono text-stone-400 mt-0.5">Status: <span className="text-emerald-700 font-bold">Healthy</span></p>
                  </div>
                  <span className="text-[9px] font-bold text-[#BC542B] bg-[#BC542B]/10 rounded-sm px-1.5 py-0.5 font-mono select-none uppercase">Brick Orange</span>
                </div>

                {/* Sparkling visual heart monitor */}
                <div className="py-4 h-16 flex items-center justify-between">
                  <svg className="w-full h-full text-red-600" viewBox="0 0 100 30" preserveAspectRatio="none">
                    <path 
                      d="M 0 15 L 15 15 L 25 15 L 30 7 L 35 23 L 40 15 L 55 15 L 60 5 L 65 25 L 70 15 L 85 15 L 100 15" 
                      fill="none" 
                      stroke="#BA5834" 
                      strokeWidth="1.8" 
                    />
                    <circle cx="85" cy="15" r="2.5" fill="#BA5834" className="animate-ping" />
                  </svg>
                </div>
              </div>

              <div className="flex justify-between text-[10px] font-mono text-stone-500 border-t border-stone-100 pt-2.5">
                <span>Memory usage: <strong>85%</strong></span>
                <span>Uptime: <strong>100%</strong></span>
                <span>Cache Hits: <strong>98%</strong></span>
              </div>
            </div>

            {/* API (AgroMaître SaaS) */}
            <div className="bg-white border border-[#e1d5c1] rounded-sm p-4 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start border-b border-stone-150 pb-1.5">
                  <div>
                    <h3 className="text-sm font-bold text-[#451e09] font-mono">API (AgroMaître SaaS)</h3>
                    <p className="text-[9.5px] font-mono text-stone-400 mt-0.5">Status: <span className="text-emerald-700 font-bold">Healthy</span></p>
                  </div>
                  <span className="text-[9px] font-bold text-[#BC542B] bg-[#BC542B]/10 rounded-sm px-1.5 py-0.5 font-mono select-none uppercase">Brick Orange</span>
                </div>

                {/* Sparkling visual heart monitor */}
                <div className="py-4 h-16 flex items-center justify-between">
                  <svg className="w-full h-full text-red-600" viewBox="0 0 100 30" preserveAspectRatio="none">
                    <path 
                      d="M 0 15 L 10 15 L 20 5 L 25 25 L 30 15 L 45 15 L 50 10 L 55 20 L 60 15 L 80 15 L 85 5 L 90 25 L 100 15" 
                      fill="none" 
                      stroke="#BA5834" 
                      strokeWidth="1.8" 
                    />
                    <circle cx="80" cy="15" r="2.5" fill="#BA5834" className="animate-ping" />
                  </svg>
                </div>
              </div>

              <div className="flex justify-between text-[10px] font-mono text-stone-500 border-t border-stone-100 pt-2.5">
                <span>Requests: <strong>450 req/s</strong></span>
                <span>Uptime: <strong>99.95%</strong></span>
                <span>Error Rate: <strong>0.01%</strong></span>
              </div>
            </div>

          </div>
        </div>

        {/* Lower layout Split - Tickets, CI/CD, Logs */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
          
          {/* GLPI support Tickets Table (col-span-7) */}
          <div className="xl:col-span-7 bg-white border border-[#e1d5c1] rounded-sm p-4 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4 border-b border-stone-250 pb-2.5">
                <h2 className="text-xs font-mono font-bold uppercase tracking-tight text-stone-600">IT Support Tickets (GLPI)</h2>
                <button 
                  onClick={handleClearCache}
                  className="bg-stone-50 hover:bg-stone-100 px-2.5 py-1 text-[10px] text-stone-500 border border-stone-200 rounded-xs font-mono uppercase tracking-wider transition cursor-pointer"
                >
                  Clear Redis Cache
                </button>
              </div>

              <div className="border border-stone-200 rounded-xs overflow-hidden">
                <table className="w-full text-left font-mono text-[10px]">
                  <thead className="bg-[#FAF8F5] text-stone-600 border-b border-stone-200 uppercase font-bold">
                    <tr>
                      <th className="p-2.5">Ticket ID</th>
                      <th className="p-2.5">Subject</th>
                      <th className="p-2.5">Status</th>
                      <th className="p-2.5">Assigned</th>
                      <th className="p-2.5">Due</th>
                      <th className="p-2.5 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.map((t, idx) => (
                      <tr key={idx} className="border-b border-stone-100 last:border-0 hover:bg-[#FAF8F5]">
                        <td className="p-2.5 text-[#BC542B] font-bold">{t.id}</td>
                        <td className="p-2.5 font-bold text-stone-850 truncate max-w-[160px]">{t.subject}</td>
                        <td className="p-2.5">
                          {t.status === 'Open' ? (
                            <span className="inline-block px-1.5 py-0.5 rounded-sm bg-red-800 text-white font-mono text-[8px] uppercase select-none">
                              {t.status}
                            </span>
                          ) : t.status === 'In Progress' ? (
                            <span className="inline-block px-1.5 py-0.5 rounded-sm bg-amber-100 text-amber-805 font-mono text-[8px] uppercase border border-amber-300 select-none">
                              {t.status}
                            </span>
                          ) : (
                            <span className="inline-block px-1.5 py-0.5 rounded-sm bg-stone-100 text-stone-500 font-mono text-[8px] uppercase border border-stone-200 select-none">
                              {t.status}
                            </span>
                          )}
                        </td>
                        <td className="p-2.5 text-stone-600">{t.assigned}</td>
                        <td className="p-2.5 text-stone-500 text-[9px]">{t.due}</td>
                        <td className="p-2.5 text-center">
                          <button 
                            onClick={() => onAddLog('info', `TICKET: Accès au ticket GLPI ${t.id} demandé.`)}
                            className="bg-stone-50 hover:bg-stone-100 p-1 border border-stone-250 rounded-xs text-stone-700 font-mono text-[8px] uppercase hover:text-black transition cursor-pointer flex items-center justify-center gap-1 mx-auto"
                          >
                            <span className="font-bold">View</span>
                            <ChevronRight className="w-2.5 h-2.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-4 p-2 bg-[#FAF8F5] border border-stone-200 rounded-sm flex items-center justify-between text-[11px] font-mono text-stone-600">
              <span>Total Support Tickets: <strong>3 Active</strong></span>
              <span className="text-[#BC542B] font-bold cursor-pointer hover:underline flex items-center gap-1">
                <span>Access GLPI Desk</span>
                <ExternalLink className="w-3 h-3" />
              </span>
            </div>
          </div>

          {/* DevOps Status column (col-span-5) */}
          <div className="xl:col-span-5 bg-white border border-[#e1d5c1] rounded-sm p-4 shadow-xs flex flex-col justify-between">
            <div>
              <div className="border-b border-stone-250 pb-2 mb-3">
                <h2 className="text-xs font-mono font-bold uppercase tracking-tight text-stone-600">DevOps Deployment Status</h2>
              </div>

              {/* Steps visual track */}
              <div className="space-y-4 py-2 relative">
                
                {/* Connecting track line */}
                <div className="absolute left-4.5 top-5 bottom-5 w-0.5 bg-stone-200" />

                {/* Step 1 */}
                <div className="flex gap-3 relative z-10">
                  <div className="w-9 h-9 rounded-full bg-emerald-50 border-2 border-emerald-500 flex items-center justify-center text-emerald-800 shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold font-mono text-stone-850">Build (v2.4.1)</h3>
                    <p className="text-[9.5px] text-stone-500 font-mono mt-0.5">Success (10:00 AM)</p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-3 relative z-10 cursor-pointer hover:bg-stone-50/50 p-1.5 rounded-xs" onClick={runDevOpsTests}>
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border-2 ${
                    isRunningTests 
                      ? 'border-[#BC542B] bg-orange-50 animate-pulse' 
                      : 'border-amber-500 bg-amber-50 text-amber-800'
                  }`}>
                    <RefreshCw className={`w-5 h-5 ${isRunningTests ? 'animate-spin text-[#BC542B]' : 'text-amber-700'}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-xs font-bold font-mono text-stone-850">Test Pipeline</h3>
                      <span className="text-[8px] font-mono bg-amber-100 text-amber-800 px-1 rounded-sm">RUNNING</span>
                    </div>
                    <p className="text-[9.5px] text-stone-505 font-mono mt-0.5">
                      Running ({testProgress}%) - Unit & Integration Tests
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-3 relative z-10">
                  <div className="w-9 h-9 rounded-full bg-stone-50 border-2 border-stone-200 flex items-center justify-center text-stone-400 shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold font-mono text-stone-400">Deploy to Staging</h3>
                    <p className="text-[9.5px] text-stone-400 font-mono mt-0.5">Pending Approval</p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex gap-3 relative z-10">
                  <div className="w-9 h-9 rounded-full bg-stone-50 border-2 border-stone-200 flex items-center justify-center text-stone-400 shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold font-mono text-stone-400">Deploy to Prod</h3>
                    <p className="text-[9.5px] text-stone-400 font-mono mt-0.5">Pending</p>
                  </div>
                </div>

              </div>
            </div>

            <button 
              onClick={runDevOpsTests}
              disabled={isRunningTests}
              className="mt-3 w-full bg-[#BC542B] text-white hover:bg-[#8F3E1E] py-2 text-xs font-mono font-bold uppercase rounded-xs transition tracking-wide flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{isRunningTests ? `Running: ${testProgress}%` : 'Re-run integration test suit'}</span>
            </button>
          </div>

        </div>

        {/* Dynamic Activity Log CLI Box */}
        <div className="bg-[#100D0B] text-[#4DE082] p-4 rounded-xs font-mono text-xs border border-stone-800 relative shadow-inner">
          <div className="flex justify-between items-center text-transparent bg-clip-text bg-gradient-to-r from-stone-550 to-stone-400 border-b border-stone-800 pb-2 mb-3">
            <span className="text-stone-400 font-bold tracking-widest text-[10px]">SYSTEM_ACTIVITY_LOG (TERMINAL) // SHADOW_STREAM</span>
            <span className="text-[9px] bg-stone-800 text-stone-400 border border-stone-700 px-2 py-0.5 rounded-sm">SHELL CONNECTION ACTIVE</span>
          </div>
          
          <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
            {logs.map((lg, idx) => (
              <p key={idx} className="leading-relaxed hover:bg-stone-900/40 p-0.5 rounded-xs transition-colors">
                <span className="text-stone-500 mr-2">[{lg.time}]</span>
                <span className={`font-bold mr-2 ${
                  lg.type === 'ERROR' ? 'text-red-500' : lg.type === 'WARN' ? 'text-amber-500' : 'text-emerald-500'
                }`}>{lg.type}:</span>
                <span className="text-stone-300">{lg.msg}</span>
                <span className="text-stone-500 italic ml-2">{lg.service}</span>
              </p>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
