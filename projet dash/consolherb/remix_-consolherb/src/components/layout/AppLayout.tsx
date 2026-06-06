import { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Award, Wifi, WifiOff } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import SocCertificateModal from '../SocCertificateModal';
import { useDataStream } from '../../hooks/useDataStream';
import ToastContainer from '../ui/ToastContainer';

export default function AppLayout() {
  const [isSocModalOpen, setIsSocModalOpen] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const location = useLocation();

  // Mount the SSE data stream — feeds real-time data into the Zustand store
  useDataStream();

  // Show live indicator once the SSE connection emits data
  useEffect(() => {
    const timer = setTimeout(() => setIsLive(true), 3500);
    return () => clearTimeout(timer);
  }, []);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toISOString().replace('T', ' ').substring(0, 19));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getPageTitle = (path: string) => {
    switch (path) {
      case '/portails': return 'Console Applicative AgroMaître';
      case '/modules': return 'Industrial Control Center';
      case '/dashboard': return 'Security Posture Monitor';
      case '/infra': return 'Infrastructure Topology';
      case '/logs': return 'Central Compliance Audit Registry';
      case '/settings': return 'Systems Settings & Threshold Decouplers';
      default: return 'AgroMaître';
    }
  };

  return (
    <>
    <div className="min-h-screen text-[#d4e4fa] bg-[#051424] overflow-x-hidden selection:bg-[#38BDF8] selection:text-black">
      {/* Dynamic scanline effect overlay */}
      <div className="fixed inset-0 grid-overlay opacity-[0.03] pointer-events-none z-50"></div>
      
      {/* Decorative cyber backdrop grid lights */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#38BDF8]/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto p-2 sm:p-4 lg:p-6 pt-2 sm:pt-3 lg:pt-4 relative z-10">
        
        {/* NAVIGATION BAR - MINIMIZED TO LE PETIT POSSIBLE */}
        <nav className="flex flex-row justify-between items-center mb-6 border-b border-slate-800 pb-2 gap-2 text-[10px]" id="main-nav">
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="w-5 h-5 bg-[#4de082] rounded-xs flex items-center justify-center text-[#003919] font-bold font-mono text-[9px] tracking-tight shadow-sm select-none">
              CC
            </div>
            <span className="text-[11px] font-bold tracking-tight uppercase font-mono hidden xs:inline text-white">
              Cyber-Compliance <span className="text-[#4de082]">Arch</span>
            </span>
          </div>
          
          {/* Navigation Links - Ultra Compact Single Line */}
          <div className="flex flex-wrap items-center justify-center gap-1 text-[9.5px] font-semibold uppercase font-mono bg-[#0c1825]/80 border border-slate-800/80 p-0.5 rounded-xs shrink-1 max-w-full">
            <NavLink
              to="/portails"
              className={({ isActive }) => `px-1.5 py-0.5 rounded-xs transition-all pointer-events-auto cursor-pointer flex items-center gap-0.5 ${isActive ? 'bg-[#122131] border border-[#4de082]/50 text-[#4de082] shadow-xs font-bold' : 'text-[#4de082] hover:text-[#7bf0a6]'}`}
            >
              <span>🌾</span> Portails
            </NavLink>
            <NavLink
              to="/modules"
              className={({ isActive }) => `px-1.5 py-0.5 rounded-xs transition-all pointer-events-auto cursor-pointer ${isActive ? 'bg-[#122131] border border-slate-700 text-[#4de082] font-bold' : 'text-[#c5c6cd] hover:text-white'}`}
            >
              Modules
            </NavLink>
            <NavLink
              to="/dashboard"
              className={({ isActive }) => `px-1.5 py-0.5 rounded-xs transition-all pointer-events-auto cursor-pointer ${isActive ? 'bg-[#122131] border border-slate-700 text-white font-bold' : 'text-[#c5c6cd] hover:text-white'}`}
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/infra"
              className={({ isActive }) => `px-1.5 py-0.5 rounded-xs transition-all pointer-events-auto cursor-pointer ${isActive ? 'bg-[#122131] border border-slate-700 text-white font-bold' : 'text-[#c5c6cd] hover:text-white'}`}
            >
              Infra
            </NavLink>
            <NavLink
              to="/logs"
              className={({ isActive }) => `px-1.5 py-0.5 rounded-xs transition-all pointer-events-auto cursor-pointer ${isActive ? 'bg-[#122131] border border-slate-700 text-white font-bold' : 'text-[#c5c6cd] hover:text-white'}`}
            >
              Logs
            </NavLink>
            <NavLink
              to="/settings"
              className={({ isActive }) => `px-1.5 py-0.5 rounded-xs transition-all pointer-events-auto cursor-pointer ${isActive ? 'bg-[#122131] border border-slate-700 text-white font-bold' : 'text-[#c5c6cd] hover:text-white'}`}
            >
              Settings
            </NavLink>
          </div>
 
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Live SSE connection indicator */}
            <div
              title={isLive ? 'Flux de données temps réel actif' : 'Connexion au backend en cours...'}
              className={`flex items-center gap-0.5 text-[8px] font-mono px-1.5 py-0.5 rounded-xs border transition-all ${
                isLive
                  ? 'border-[#4de082]/50 text-[#4de082] bg-emerald-950/30'
                  : 'border-slate-700 text-slate-500 bg-transparent'
              }`}
            >
              {isLive ? (
                <><Wifi className="w-2.5 h-2.5" /><span className="hidden sm:inline">LIVE</span></>
              ) : (
                <><WifiOff className="w-2.5 h-2.5" /><span className="hidden sm:inline">OFF</span></>
              )}
              {isLive && <span className="w-1.5 h-1.5 bg-[#4de082] rounded-full animate-ping ml-0.5" />}
            </div>

            {/* Interactive Certificate Badge - Smaller */}
            <button
              onClick={() => setIsSocModalOpen(true)}
              className="text-[8.5px] font-mono bg-[#0a192f] px-1.5 py-0.5 border border-[#334155] text-[#4de082] rounded-xs hover:border-[#4de082] transition active:scale-95 cursor-pointer flex items-center gap-0.5"
              id="soc-compliance-badge"
            >
              <Award className="w-2.5 h-2.5 text-[#4de082]" />
              <span className="hidden sm:inline">SOC 2 CERTIFIED</span>
              <span className="sm:hidden text-[7.5px]">SOC 2</span>
            </button>
            
            {/* Admin Avatar Identity and Email Indicator - Smaller */}
            <div 
              className="w-5 h-5 rounded-full bg-[#1c2b3c] border border-slate-700 flex items-center justify-center font-mono text-[9px] text-white uppercase font-bold select-none cursor-help"
              title="Identity: Security Administrator // adambeniich7@gmail.com"
              id="admin-avatar"
            >
              AB
            </div>
          </div>
        </nav>

        {/* HEADER SECTION */}
        <header className="mb-8" id="dashboard-header">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <AnimatePresence mode="wait">
                <motion.h1
                  key={location.pathname}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.25 }}
                  className="text-3xl font-bold text-[#d4e4fa] tracking-tight leading-none"
                >
                  {getPageTitle(location.pathname)}
                </motion.h1>
              </AnimatePresence>
              <p className="text-[#c5c6cd] text-xs font-mono mt-2 uppercase tracking-wide">
                SYS_STATUS:{' '}
                <span className="text-[#4de082]">
                  ACTIVE_SECURED
                </span>{' '}
                // ENCRYPTION: AES-256 // NODES: 04/04 // STANDARD: SOC2
              </p>
            </div>

            {/* Live UTC indicator */}
            <div className="p-3 bg-[#0d1c2d] border border-slate-700/60 rounded-[3px] text-right font-mono text-xs text-emerald-400">
              <span className="text-gray-400 block text-[9px] uppercase tracking-wider mb-0.5">CURRENT TIMELINES (GMT)</span>
              <div>{currentTime} // ACTIVE</div>
            </div>
          </div>
        </header>

        {/* PAGE TRANSITION WRAPPER */}
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            className="relative z-20"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>

        {/* COMPLIANCE SOC 2 CERTIFICATE MODAL */}
        <SocCertificateModal
          isOpen={isSocModalOpen}
          onClose={() => setIsSocModalOpen(false)}
          auditNodesLength={4}
        />

        {/* FOOTER BAR */}
        <footer className="mt-12 pt-6 border-t border-[#334155] flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono text-[#8f9097]" id="main-footer">
          <div>
            &copy; 2026 CYBER-COMPLIANCE COMMAND CENTER. TOUS DROITS RÉSERVÉS.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-[#4de082] rounded-full animate-ping"></span>
              <span>LIAISON SEC SOC-A1 SECURED</span>
            </span>
            <span>AES-256-GCM CBC</span>
            <span>v4.11-STABLE</span>
          </div>
        </footer>
      </div>
    </div>

    {/* GLOBAL TOAST NOTIFICATION CONTAINER — outside scroll area */}
    <ToastContainer />
  </>
  );
}
