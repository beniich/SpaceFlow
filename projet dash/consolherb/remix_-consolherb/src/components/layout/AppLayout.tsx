import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import SocCertificateModal from '../SocCertificateModal';
import { useDataStream } from '../../hooks/useDataStream';
import ToastContainer from '../ui/ToastContainer';
import MinimalistHeader from './MinimalistHeader';
import RightSidebar from './RightSidebar';

export default function AppLayout() {
  const [isSocModalOpen, setIsSocModalOpen] = useState(false);
  const location = useLocation();

  // Mount the SSE data stream — feeds real-time data into the Zustand store
  useDataStream();

  return (
    <>
      <div className="flex h-screen w-screen bg-[#051424] text-[#d4e4fa] overflow-hidden selection:bg-[#38BDF8] selection:text-black">
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 relative">
          <MinimalistHeader />
          
          <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 bg-[#051424] relative">
            {/* Dynamic scanline effect overlay */}
            <div className="fixed inset-0 grid-overlay opacity-[0.03] pointer-events-none z-0"></div>
            {/* Decorative cyber backdrop grid lights */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#38BDF8]/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="max-w-7xl mx-auto relative z-10 pb-16">
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
            </div>
            
            {/* FOOTER BAR */}
            <footer className="mt-8 pt-6 border-t border-[#334155] flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono text-[#8f9097] max-w-7xl mx-auto" id="main-footer">
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
          </main>
        </div>

        {/* Minimalist Right Sidebar */}
        <RightSidebar />

        {/* COMPLIANCE SOC 2 CERTIFICATE MODAL */}
        <SocCertificateModal
          isOpen={isSocModalOpen}
          onClose={() => setIsSocModalOpen(false)}
          auditNodesLength={4}
        />
      </div>

      {/* GLOBAL TOAST NOTIFICATION CONTAINER — outside scroll area */}
      <ToastContainer />
    </>
  );
}
