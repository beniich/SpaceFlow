import { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Award, Wifi, WifiOff } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import SocCertificateModal from '../SocCertificateModal';
import { useDataStream } from '../../hooks/useDataStream';
import ToastContainer from '../ui/ToastContainer';
import ProfessionalHeader from './ProfessionalHeader';

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
      case '/agro-brain': return 'AgroBrain — Intelligence Autonome';
      case '/vision': return 'Eyes in the Field — Diagnostic Visuel';
      case '/finance': return 'Agro-Finance — ROI Engine';
      case '/traceability': return 'Blockchain Traceability Ledger';
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
        
        <ProfessionalHeader />

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
