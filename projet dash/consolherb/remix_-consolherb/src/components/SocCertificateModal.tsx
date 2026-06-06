import { useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, CheckCircle, FileText, Download, X, Award, AlertCircle } from 'lucide-react';

interface SocCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  auditNodesLength: number;
}

export default function SocCertificateModal({ isOpen, onClose, auditNodesLength }: SocCertificateModalProps) {
  const downloadReport = () => {
    // Elegant client-side mock download
    const reportText = `CYBER-COMPLIANCE COMMAND CENTER
===================================
SOC 2 TYPE II COMPLIANCE REPORT
Generated on: ${new Date().toISOString()}
Compliance Status: SECURED & VERIFIED
Encryption: SHA-256 / AES-256-GCM
Active Monitored Nodes: ${auditNodesLength}

VERIFICATION CHECKPOINTS:
-------------------------
[PASS] Node-A1: Firewall Block rules integrity verified.
[PASS] Node-B2: PostgreSQL Database schema encryption checked.
[PASS] Node-C3: API Gateway latency normalizer online.
[PASS] Node-D4: Authentication Server token rotation active.

This system conforms to the SOC 2 trust principles of security, confidentiality, and processing integrity.`;
    
    const element = document.createElement("a");
    const file = new Blob([reportText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "SOC2_Compliance_Audit_Report.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="soc-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="w-full max-w-2xl bg-[#09192f] border border-[#273647] rounded-md overflow-hidden glow-blue"
            id="soc-modal-container"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e293b] bg-[#122131]">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#4de082]" />
                <h2 className="text-sm font-mono font-bold tracking-tight uppercase text-white">
                  SOC 2 Trust Services Criteria
                </h2>
              </div>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-white transition p-1"
                id="close-soc-modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 text-sm">
              <div className="flex items-start gap-4 p-4 bg-[#0a192f] border border-emerald-900/40 rounded-sm">
                <div className="p-2 bg-emerald-500/10 text-[#4de082] rounded-full">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-mono text-xs font-bold text-white uppercase">AUTHENTIC COMPLIANCE STATUS</h3>
                  <p className="text-xs text-[#c5c6cd] mt-1 space-y-1">
                    Continuous monitoring of the target namespace shows zero unresolved critical violations. 
                    Encryption protocol <code className="bg-[#122131] text-[#38BDF8] px-1 py-0.5 rounded font-mono">AES-256</code> is active on the kernel transport layer.
                  </p>
                </div>
              </div>

              {/* Checklist */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-semibold text-[#8f9097] uppercase">COMPLIANCE STATS & POLICIES</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                  <div className="p-3 bg-[#122131] border border-[#273647] rounded flex items-center justify-between">
                    <span className="text-[#c5c6cd]">Security Standard</span>
                    <span className="text-[#4de082] py-0.5 px-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded">SOC 2 Type II</span>
                  </div>
                  <div className="p-3 bg-[#122131] border border-[#273647] rounded flex items-center justify-between">
                    <span className="text-[#c5c6cd]">Log Auditing</span>
                    <span className="text-[#38BDF8]">Continuous 24/7</span>
                  </div>
                  <div className="p-3 bg-[#122131] border border-[#273647] rounded flex items-center justify-between">
                    <span className="text-[#c5c6cd]">ISO Cert Status</span>
                    <span className="text-[#4de082]">ISO 27001 Ready</span>
                  </div>
                  <div className="p-3 bg-[#122131] border border-[#273647] rounded flex items-center justify-between">
                    <span className="text-[#c5c6cd]">Encryption Standard</span>
                    <span className="text-white">HMAC-SHA256</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-mono font-semibold text-[#8f9097] uppercase">MANDATED CONTROLS CHECK</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs p-2 bg-[#0d1c2d] border border-[#1e293b] rounded-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#4de082]" />
                      <span>CC1.1: Security Policy Enforcement</span>
                    </div>
                    <span className="text-[10px] text-gray-400 font-mono">VERIFIED</span>
                  </div>
                  <div className="flex items-center justify-between text-xs p-2 bg-[#0d1c2d] border border-[#1e293b] rounded-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#4de082]" />
                      <span>CC2.3: Multi-Factor Authentication</span>
                    </div>
                    <span className="text-[10px] text-gray-400 font-mono">ENFORCED</span>
                  </div>
                  <div className="flex items-center justify-between text-xs p-2 bg-[#0d1c2d] border border-[#1e293b] rounded-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#4de082]" />
                      <span>CC6.4: Intrusions Prevention Normalizer</span>
                    </div>
                    <span className="text-[10px] text-gray-400 font-mono">ACTIVE</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-4 bg-[#122131] border-t border-[#1e293b]">
              <div className="flex items-center gap-1.5 text-xs font-mono text-[#c5c6cd]">
                <AlertCircle className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>Next audit: Dec 2026</span>
              </div>
              <button
                onClick={downloadReport}
                className="flex items-center gap-1.5 text-xs font-mono font-bold bg-[#38BDF8] hover:bg-white text-[#051424] px-4 py-2 rounded-sm transition uppercase cursor-pointer"
                id="download-soc-report"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Policy PDF</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
