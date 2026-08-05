import React, { useState, useEffect } from 'react';
import { PageId, Language, ArchNode } from '../../types';
import { ARCHITECTURE_NODES } from '../../data/mockData';
import { useTranslation } from '../../hooks/useTranslation';
import {
  Cpu,
  Server,
  LayoutDashboard,
  CheckCircle2,
  Terminal,
  Activity,
  X,
  Play,
  Pause,
} from 'lucide-react';

interface ArchitecturePageProps {
  onNavigate: (page: PageId) => void;
  language: Language;
}

export const ArchitecturePage: React.FC<ArchitecturePageProps> = ({ onNavigate, language: propLang }) => {
  const { t, language } = useTranslation(propLang);
  const [selectedNode, setSelectedNode] = useState<ArchNode | null>(null);
  const [simulatingStream, setSimulatingStream] = useState(true);
  const [logs, setLogs] = useState<string[]>([
    '[SYSTEM] Booting Zero-Trust Handshake Engine...',
    '[AGENT] Encrypting packet #8942 with AES-256-GCM...',
    '[SERVER] Received packet #8942 from Gateway #10-PARIS',
    '[SERVER] AI Predictive Anomaly Score: 0.002 (NORMAL)',
    '[DASHBOARD] Pushed live telemetry update to 142 clients',
  ]);

  useEffect(() => {
    if (!simulatingStream) return;
    const interval = setInterval(() => {
      const packetId = Math.floor(1000 + Math.random() * 9000);
      const latency = Math.floor(8 + Math.random() * 12);
      const newLog = `[${new Date().toLocaleTimeString()}] [PACKET #${packetId}] Transmitted via TLS 1.3 | Latency: ${latency}ms | Status: VERIFIED`;
      setLogs((prev) => [newLog, ...prev.slice(0, 7)]);
    }, 2500);
    return () => clearInterval(interval);
  }, [simulatingStream]);

  return (
    <div className="space-y-12 animate-fade-in">
      
      {/* Title & Header Banner */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight uppercase">
          {t('archHeaderTitle', language)}
        </h1>
        <p className="text-sm sm:text-base font-mono text-orange-400 tracking-widest uppercase">
          {t('archHeaderSubtitle', language)}
        </p>
      </div>

      {/* Main Glassmorphism Frame containing the 3-Node Circuit Architecture */}
      <div className="glass-card-purple outer-frame rounded-3xl p-8 sm:p-12 border border-white/10 shadow-2xl relative overflow-hidden">
        
        {/* Background Circuit Grid Overlay */}
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <pattern id="archGrid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#ff8a3d" strokeWidth="0.5" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#archGrid)" />
          </svg>
        </div>

        {/* The 3 Main Interactive Architecture Nodes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10 items-center py-6">
          
          {/* Node 1: AGENT */}
          <div
            onClick={() => setSelectedNode(ARCHITECTURE_NODES[0])}
            className="group cursor-pointer glass-card p-8 rounded-full border-2 border-orange-500/50 hover:border-orange-500 glow-border transition-all transform hover:scale-105 flex flex-col items-center text-center aspect-square justify-center relative bg-purple-950/40"
          >
            <div className="w-16 h-16 rounded-2xl btn-gradient-orange flex items-center justify-center text-white mb-4 glow-orange group-hover:rotate-12 transition-transform">
              <Cpu className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-black text-white tracking-widest group-hover:text-orange-400 transition-colors">
              {t('archAgent', language)}
            </h2>
            <div className="text-xs font-mono font-bold text-gray-300 mt-2 space-y-1">
              <div>LOCAL PROCESSING</div>
              <div>DATA ENCRYPTION</div>
              <div>SECURE TRANSMISSION</div>
            </div>
            <span className="mt-4 text-[11px] font-mono text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/30">
              {t('clickInspect', language)}
            </span>
          </div>

          {/* Flow Arrow 1 -> 2 */}
          <div className="hidden lg:flex items-center justify-center relative pointer-events-none -mx-8 z-20">
            <div className="w-full h-1 bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500 relative">
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-orange-500 animate-ping" />
            </div>
          </div>

          {/* Node 2: SERVER */}
          <div
            onClick={() => setSelectedNode(ARCHITECTURE_NODES[1])}
            className="group cursor-pointer glass-card p-8 rounded-full border-2 border-orange-500/60 hover:border-orange-500 glow-border transition-all transform hover:scale-105 flex flex-col items-center text-center aspect-square justify-center relative bg-purple-950/50"
          >
            <div className="w-16 h-16 rounded-2xl btn-gradient-orange flex items-center justify-center text-white mb-4 glow-orange group-hover:rotate-12 transition-transform">
              <Server className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-black text-white tracking-widest group-hover:text-orange-400 transition-colors">
              {t('archServer', language)}
            </h2>
            <div className="text-xs font-mono font-bold text-gray-300 mt-2 space-y-1">
              <div>SECURE DATA STORAGE</div>
              <div>AI/ML ENGINE</div>
              <div>ACCESS CONTROL</div>
              <div>BLOCKCHAIN INTEGRATION</div>
            </div>
            <span className="mt-4 text-[11px] font-mono text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/30">
              {t('clickInspect', language)}
            </span>
          </div>

          {/* Flow Arrow 2 -> 3 */}
          <div className="hidden lg:flex items-center justify-center relative pointer-events-none -mx-8 z-20">
            <div className="w-full h-1 bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500 relative">
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-orange-500 animate-ping" />
            </div>
          </div>

          {/* Node 3: DASHBOARD */}
          <div
            onClick={() => setSelectedNode(ARCHITECTURE_NODES[2])}
            className="group cursor-pointer glass-card p-8 rounded-full border-2 border-orange-500/50 hover:border-orange-500 glow-border transition-all transform hover:scale-105 flex flex-col items-center text-center aspect-square justify-center relative bg-purple-950/40"
          >
            <div className="w-16 h-16 rounded-2xl btn-gradient-orange flex items-center justify-center text-white mb-4 glow-orange group-hover:rotate-12 transition-transform">
              <LayoutDashboard className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-black text-white tracking-widest group-hover:text-orange-400 transition-colors">
              {t('archDashboard', language)}
            </h2>
            <div className="text-xs font-mono font-bold text-gray-300 mt-2 space-y-1">
              <div>REAL-TIME MONITORING</div>
              <div>ANALYTICS & REPORTING</div>
              <div>USER INTERFACE</div>
              <div>ALERT SYSTEM</div>
            </div>
            <span className="mt-4 text-[11px] font-mono text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/30">
              {t('clickInspect', language)}
            </span>
          </div>

        </div>

        {/* Bottom copyright style banner matching image 1 */}
        <div className="mt-10 border-t border-white/10 pt-4 text-center text-xs font-mono text-gray-400">
          © 2026 SOVEREIGN DEVICE NEXUS. {t('footerRights', language)}
        </div>
      </div>

      {/* Live Stream Terminal Packet Inspector */}
      <div className="glass-card-purple p-6 rounded-2xl border border-orange-500/30 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-orange-400" />
            <h3 className="text-sm font-mono font-bold text-white uppercase">
              {t('livePacketStream', language)}
            </h3>
          </div>
          <button
            onClick={() => setSimulatingStream(!simulatingStream)}
            className="px-3 py-1 rounded-lg glass-card text-xs font-mono text-gray-300 hover:text-white flex items-center gap-1.5 cursor-pointer"
          >
            {simulatingStream ? <Pause className="w-3.5 h-3.5 text-orange-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
            <span>{simulatingStream ? t('pauseStream', language) : t('resumeStream', language)}</span>
          </button>
        </div>

        <div className="bg-[#080214] p-4 rounded-xl font-mono text-xs text-emerald-400 space-y-1 max-h-48 overflow-y-auto border border-white/5">
          {logs.map((log, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="text-orange-500">❯</span>
              <span>{log}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Modal for Selected Node */}
      {selectedNode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="glass-card-purple w-full max-w-2xl rounded-3xl p-8 border border-orange-500/50 shadow-2xl relative space-y-6 glow-border">
            <button
              onClick={() => setSelectedNode(null)}
              className="absolute top-6 right-6 p-2 rounded-xl glass-card text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl btn-gradient-orange flex items-center justify-center text-white glow-orange">
                {selectedNode.id === 'agent' && <Cpu className="w-7 h-7" />}
                {selectedNode.id === 'server' && <Server className="w-7 h-7" />}
                {selectedNode.id === 'dashboard' && <LayoutDashboard className="w-7 h-7" />}
              </div>
              <div>
                <h2 className="text-3xl font-black text-white tracking-wider">{selectedNode.title}</h2>
                <p className="text-xs font-mono text-orange-400">{selectedNode.subtitle}</p>
              </div>
            </div>

            <p className="text-sm text-gray-300 leading-relaxed">{selectedNode.description}</p>

            {/* Key Capabilities */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono font-bold text-orange-400 uppercase tracking-wider">
                Key Technical Capabilities
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-200">
                {selectedNode.details.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 glass-card p-2.5 rounded-xl border border-white/10">
                    <CheckCircle2 className="w-4 h-4 text-orange-400 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Metrics */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono font-bold text-orange-400 uppercase tracking-wider">
                Live Metrics
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {selectedNode.metrics.map((m, idx) => (
                  <div key={idx} className="glass-card p-3 rounded-xl border border-white/10 text-center">
                    <div className="text-xs text-gray-400 font-mono">{m.label}</div>
                    <div className="text-sm font-bold font-mono text-white mt-0.5">{m.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setSelectedNode(null)}
              className="w-full btn-gradient-orange text-white py-3 rounded-xl font-bold text-sm uppercase tracking-wider glow-orange"
            >
              Close Technical Inspector
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
