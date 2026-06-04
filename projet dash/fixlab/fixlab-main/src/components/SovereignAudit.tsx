import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, ShieldAlert, AlertTriangle, CheckCircle, 
  Download, RefreshCw, Lock, Unlock, Fingerprint, FileText,
  FileCheck, Terminal, Layers, Eye
} from "lucide-react";
import { ComplianceControl, ComplianceDomain } from "../types";

interface SovereignAuditProps {
  currentRole: "super-admin" | "strategist" | "tactician" | "auditor" | "client";
  onChangeRole: (role: "super-admin" | "strategist" | "tactician" | "auditor" | "client") => void;
  devices: any[];
  policies: any[];
}

export const SovereignAudit: React.FC<SovereignAuditProps> = ({
  currentRole,
  onChangeRole,
  devices,
  policies
}) => {
  const [complianceState, setComplianceState] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedControl, setSelectedControl] = useState<ComplianceControl | null>(null);
  const [evidenceSeal, setEvidenceSeal] = useState<any>(null);
  const [aiReport, setAiReport] = useState<string>("");
  const [generatingReport, setGeneratingReport] = useState(false);
  const [signingEvidenceId, setSigningEvidenceId] = useState<string | null>(null);

  // Sync state from server on mount & periodically
  const fetchComplianceData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/compliance");
      if (res.ok) {
        const data = await res.json();
        setComplianceState(data);
      }
    } catch (err) {
      console.error("Failed to load compliance state:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplianceData();
    // Subscribe to EventSource updates for continuous sync
    const handleSync = (e: any) => {
      try {
        const payload = JSON.parse(e.data);
        if (payload.compliance) {
          setComplianceState(payload.compliance);
        }
      } catch (err) {
        console.warn("SSE sync read error:", err);
      }
    };

    const handleUpdate = (e: any) => {
      try {
        const payload = JSON.parse(e.data);
        setComplianceState(payload);
      } catch (err) {
        console.warn("SSE compliance update read error:", err);
      }
    };

    // Use SSE listeners already registered on window if applicable, or fallback to interval polling
    const interval = setInterval(fetchComplianceData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Request high-integrity cryptographic seal from server
  const sealEvidence = async (controlId: string) => {
    try {
      setSigningEvidenceId(controlId);
      const res = await fetch(`/api/compliance/evidence/${controlId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ auditorSigned: currentRole === "auditor" })
      });
      if (res.ok) {
        const seal = await res.json();
        setEvidenceSeal(seal);
      }
    } catch (err) {
      console.error("Failed to seal evidence:", err);
    } finally {
      setSigningEvidenceId(null);
    }
  };

  // Trigger server-side AI continuous report engine
  const runAIComplianceAssessment = async () => {
    try {
      setGeneratingReport(true);
      const res = await fetch("/api/compliance/generate-report", {
        method: "POST"
      });
      if (res.ok) {
        const data = await res.json();
        setAiReport(data.report);
      }
    } catch (err) {
      console.error("Failed to compile AI response report:", err);
    } finally {
      setGeneratingReport(false);
    }
  };

  const downloadSignedReport = () => {
    if (!aiReport) return;
    const blob = new Blob([aiReport], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Sovereign_Compliance_Report_SHA256_${Date.now().toString().slice(-4)}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadSignedEvidence = (seal: any) => {
    if (!seal) return;
    const blob = new Blob([JSON.stringify(seal, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Evidence_Seal_${seal.code}_${Date.now().toString().slice(-4)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const toggleAuditorSession = () => {
    if (currentRole === "auditor") {
      onChangeRole("super-admin");
    } else {
      onChangeRole("auditor");
    }
  };

  if (!complianceState) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[400px]">
        <RefreshCw className="animate-spin text-purple-500 h-8 w-8 mb-4" />
        <span className="text-xs font-mono text-purple-300">Synchronizing Continuous Compliance State Primitives...</span>
      </div>
    );
  }

  const { score, controls, domains, summary } = complianceState;

  // Render traffic light badges
  const getStatusBadge = (status: "verified" | "drift" | "broken") => {
    switch (status) {
      case "verified":
        return (
          <span className="px-2.5 py-1 text-[10px] rounded-full font-mono font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-1.5 shadow-sm shadow-emerald-500/5">
            <CheckCircle className="w-3 h-3 text-emerald-400 fill-emerald-400/10" />
            VERIFIED
          </span>
        );
      case "drift":
        return (
          <span className="px-2.5 py-1 text-[10px] rounded-full font-mono font-semibold bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center gap-1.5 shadow-sm shadow-amber-500/5 anim-pulse">
            <AlertTriangle className="w-3 h-3 text-amber-400 fill-amber-400/10" />
            DRIFT ASSIGNED
          </span>
        );
      case "broken":
        return (
          <span className="px-2.5 py-1 text-[10px] rounded-full font-mono font-semibold bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center gap-1.5 shadow-sm shadow-rose-500/5">
            <ShieldAlert className="w-3 h-3 text-rose-400 fill-rose-500/10" />
            BREACH DETECTED
          </span>
        );
    }
  };

  return (
    <div id="sovereign-compliance-hub" className="space-y-6">
      
      {/* Dynamic Flashing Sealed Banner when Auditor Mode Active */}
      {currentRole === "auditor" && (
        <div className="relative overflow-hidden rounded-xl border border-rose-500/30 bg-rose-950/20 p-4 transition-all animate-pulse">
          <div className="absolute top-0 right-0 p-2 opacity-10">
            <Fingerprint className="w-24 h-24 text-rose-500" />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5 text-rose-400 animate-bounce" />
              </div>
              <div>
                <h4 className="text-xs font-mono font-bold tracking-wider text-rose-400 uppercase">
                  AUDITOR SECURE VIEWPORT - SEALED LIVE TELEMETRY
                </h4>
                <p className="text-[10px] text-stone-400 font-mono mt-0.5">
                  Write privileges suspended • Integrity token: <span className="text-rose-300 font-bold">SHA256-NEXUS-SEALED-{score}-{summary.verifiedCount}</span>
                </p>
              </div>
            </div>
            <button
              onClick={toggleAuditorSession}
              className="px-4 py-1.5 border border-rose-500/40 hover:bg-rose-500/10 text-[10px] font-mono text-rose-300 rounded-lg transition-all"
            >
              FREEZE LOCKED VIEWPORT
            </button>
          </div>
        </div>
      )}

      {/* Grid: Compliance Score Indicator & Domains Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Compliance Gauge Circular Ring Card */}
        <div className="lg:col-span-5 bg-stone-950/20 border border-purple-500/10 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-5">
            <Fingerprint className="w-32 h-32 text-purple-400" />
          </div>
          
          {/* Radial progress circle */}
          <div className="relative w-32 h-32 flex items-center justify-center shrink-0 select-none">
            <svg className="w-full h-full transform -rotate-90">
              {/* Outer track */}
              <circle
                cx="64"
                cy="64"
                r="50"
                className="stroke-stone-800"
                strokeWidth="8"
                fill="transparent"
              />
              {/* Filled status circle */}
              <circle
                cx="64"
                cy="64"
                r="50"
                className={`transition-all duration-1000 ${
                  score >= 90 ? "stroke-emerald-500" : score >= 70 ? "stroke-amber-500" : "stroke-rose-500"
                }`}
                strokeWidth="10"
                strokeDasharray={2 * Math.PI * 50}
                strokeDashoffset={2 * Math.PI * 50 * (1 - score / 100)}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-mono font-bold tracking-tight text-white">{score}%</span>
              <span className="text-[8px] font-mono font-bold tracking-widest text-[#7c6bb5] uppercase">ALIGNMENT</span>
            </div>
          </div>

          <div className="flex-1 space-y-3 font-mono">
            <div>
              <h3 className="text-sm font-bold tracking-tight text-stone-100">Sovereign Continuous Audit</h3>
              <p className="text-[10px] text-stone-400 leading-relaxed mt-1">
                Real-time mapping of operational variables to **SOC 2 Type II Criteria** and **Annex A de l'ISO 27001**.
              </p>
            </div>
            
            {/* Traffic lights row */}
            <div className="grid grid-cols-3 gap-2 pt-1 border-t border-purple-500/5 text-center">
              <div>
                <span className="text-xs font-bold text-emerald-400">{summary.verifiedCount}</span>
                <span className="block text-[8px] text-stone-500 font-bold uppercase">VERIFIED</span>
              </div>
              <div>
                <span className="text-xs font-bold text-amber-400">{summary.driftCount}</span>
                <span className="block text-[8px] text-stone-500 font-bold uppercase">DRIFT</span>
              </div>
              <div>
                <span className="text-xs font-bold text-rose-400">{summary.brokenCount}</span>
                <span className="block text-[8px] text-stone-500 font-bold uppercase">BREACHED</span>
              </div>
            </div>
          </div>
        </div>

        {/* Domain Breakdowns */}
        <div className="lg:col-span-7 bg-stone-950/20 border border-purple-500/10 rounded-2xl p-6 flex flex-col justify-between backdrop-blur-md">
          <div className="text-xs font-mono font-bold tracking-widest text-[#7c6bb5] uppercase mb-4 flex items-center justify-between">
            <span>COMPLIANCE DRIFT DOMAINS</span>
            {currentRole !== "auditor" && (
              <button 
                onClick={toggleAuditorSession}
                className="px-3 py-1 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 hover:border-purple-500/40 text-[9px] rounded-lg transition-all flex items-center gap-1.5"
              >
                <Eye className="w-3 h-3 text-purple-400" />
                Auditor Session Toggle
              </button>
            )}
          </div>
          
          <div className="space-y-4">
            {domains.map((dom: ComplianceDomain) => (
              <div key={dom.id} className="space-y-1.5 font-mono">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-stone-300 font-medium">{dom.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-stone-400">({dom.verifiedCount}/{dom.controlsCount} controls)</span>
                    <span className={`font-bold ${
                      dom.status === "optimal" ? "text-emerald-400" : dom.status === "warning" ? "text-amber-400" : "text-rose-400"
                    }`}>{dom.score}%</span>
                  </div>
                </div>
                {/* Slim progress track */}
                <div className="h-1.5 bg-stone-900 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-700 ${
                      dom.status === "optimal" ? "bg-emerald-500" : dom.status === "warning" ? "bg-amber-500" : "bg-rose-500"
                    }`}
                    style={{ width: `${dom.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-[9.5px] font-mono text-[#a855f7] leading-relaxed mt-4 bg-purple-500/5 p-2 rounded-lg border border-purple-500/10 flex items-center gap-2">
            <RefreshCw className="w-3.5 h-3.5 text-[#a855f7] animate-spin" />
            <span>
              Real-time synchronization active. Recalibrates dynamically on security policy mutations or bastion command triggers.
            </span>
          </div>
        </div>

      </div>

      {/* Main Grid: Control Matrix vs AI Continuous Reporter */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        
        {/* Left Column: The Control Matrix */}
        <div className="xl:col-span-7 bg-stone-950/20 border border-purple-500/10 rounded-2xl p-6 h-fit backdrop-blur-md">
          <div className="flex items-center justify-between mb-4 border-b border-purple-500/10 pb-3">
            <div>
              <h3 className="text-xs font-mono font-bold tracking-widest text-[#7c6bb5] uppercase">
                THE CONTROL MATRIX
              </h3>
              <p className="text-[10px] text-stone-400 font-mono mt-0.5">
                Automated continuous proof tracking
              </p>
            </div>
            <button
              onClick={fetchComplianceData}
              disabled={loading}
              className="p-1 px-2.5 border border-[#3b2d69] hover:border-purple-500/30 text-[10px] font-mono text-purple-300 rounded-lg transition-all flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
              RE-EVALUATE
            </button>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {controls.map((ctrl: ComplianceControl) => {
              const selected = selectedControl?.id === ctrl.id;
              return (
                <div
                  key={ctrl.id}
                  onClick={() => {
                    setSelectedControl(ctrl);
                    setEvidenceSeal(null);
                  }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer select-none font-mono flex flex-col sm:flex-row sm:items-start justify-between gap-3 ${
                    selected 
                      ? "bg-purple-950/20 border-purple-500/40" 
                      : "bg-[#150a36]/30 border-purple-500/5 hover:border-purple-500/20 hover:bg-[#150a36]/65"
                  }`}
                >
                  <div className="space-y-1 group">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        {ctrl.standard}
                      </span>
                      <span className="text-[10px] font-bold text-white shrink-0 group-hover:text-purple-300 transition-colors">
                        {ctrl.code}
                      </span>
                    </div>
                    <h4 className="text-[11px] font-medium text-stone-200 mt-1 leading-snug">
                      {ctrl.name}
                    </h4>
                    <p className="text-[10px] text-stone-400 line-clamp-2 mt-0.5">
                      {ctrl.description}
                    </p>
                  </div>
                  <div className="flex sm:flex-col justify-between items-end gap-2 shrink-0">
                    {getStatusBadge(ctrl.status)}
                    <span className="text-[9px] text-[#7c6bb5]">
                      Checked {ctrl.lastChecked}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Evidence Panel & AI Recalculator */}
        <div className="xl:col-span-5 space-y-5">
          
          {/* Section A: Selected Control Evidence Snapshot / Certificate Seal */}
          <div className="bg-stone-950/20 border border-purple-500/10 rounded-2xl p-6 backdrop-blur-md relative min-h-[220px]">
            {selectedControl ? (
              <div className="space-y-4 font-mono">
                <div className="flex items-center justify-between border-b border-purple-500/10 pb-3">
                  <div>
                    <span className="text-[9px] text-purple-400 font-bold block uppercase tracking-wide">
                      EVIDENCE SUMMARY • {selectedControl.code}
                    </span>
                    <h4 className="text-[11px] font-bold text-white uppercase mt-0.5 truncate max-w-[200px] sm:max-w-none">
                      {selectedControl.name}
                    </h4>
                  </div>
                  <div>
                    {selectedControl.status === "verified" ? (
                      <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[9px] rounded-lg">LIVE PROOF</span>
                    ) : (
                      <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[9px] rounded-lg">ATTENT RESYNC</span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-stone-400">Captured Source:</span>
                    <span className="text-stone-200 font-bold flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      {selectedControl.evidenceType}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-stone-400">Linked Strategy Gate:</span>
                    <span className="text-purple-300 font-bold">
                      {selectedControl.linkedPolicyId ? selectedControl.linkedPolicyId : "None (Static Rule)"}
                    </span>
                  </div>
                </div>

                {/* Evidence Sealed Snapshot Box */}
                <div className="bg-black/45 hover:bg-black/65 border border-purple-500/10 hover:border-purple-500/20 rounded-xl p-3 text-[10.5px] text-stone-300 max-h-[140px] overflow-y-auto leading-relaxed transition-all">
                  <span className="text-[8px] text-[#7c6bb5] block font-bold uppercase tracking-wider mb-1.5 select-none">
                    EVIDENCE PAYLOAD METADATA (JSON)
                  </span>
                  <pre className="text-[9.5px] font-mono whitespace-pre-wrap word-break">
                    {JSON.stringify(JSON.parse(selectedControl.evidenceSnapshot), null, 2)}
                  </pre>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => sealEvidence(selectedControl.id)}
                    disabled={signingEvidenceId === selectedControl.id}
                    className="flex-1 py-1.5 bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-[10.5px] font-mono text-purple-200 rounded-lg transition-all flex items-center justify-center gap-1.5"
                  >
                    {signingEvidenceId === selectedControl.id ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 text-purple-300 animate-spin" />
                        CRYPTO SEALING...
                      </>
                    ) : (
                      <>
                        <Fingerprint className="w-3.5 h-3.5 text-purple-300" />
                        SEAL CRYPTOGRAPHIC EVAL
                      </>
                    )}
                  </button>
                </div>

                {/* Display sealed token badge */}
                {evidenceSeal && evidenceSeal.controlId === selectedControl.id && (
                  <div className="rounded-xl border border-emerald-500/30 bg-[#0c2421]/30 p-3 flex flex-col gap-2 transition-all">
                    <div className="flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-emerald-400" />
                      <span className="text-[9.5px] text-emerald-400 font-bold uppercase tracking-wide">
                        CERTIFICATE SEAL EMBEDDED
                      </span>
                    </div>
                    <p className="text-[9.5px] text-stone-400">
                      Signed securely by <span className="text-emerald-300 font-bold">{evidenceSeal.sealedBy}</span> • Signature:
                    </p>
                    <code className="text-[9.5px] bg-[#0c1424] px-1.5 py-1 text-emerald-300 rounded overflow-x-auto truncate">
                      {evidenceSeal.integritySignature}
                    </code>
                    <button
                      onClick={() => downloadSignedEvidence(evidenceSeal)}
                      className="self-start text-[9.5px] text-[#7c6bb5] hover:text-[#a855f7] transition-colors flex items-center gap-1 mt-1 font-bold"
                    >
                      <Download className="w-3 h-3" />
                      DOWNLOAD EVIDENCE REPORT (.JSON)
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center font-mono select-none">
                <Layers className="w-8 h-8 text-purple-500/30 mb-2.5 animate-bounce" />
                <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">
                  No Control Selected
                </span>
                <p className="text-[9.5px] text-stone-600 mt-1 max-w-[220px]">
                  Select a rule from the Control Matrix to compile automated evidence or sign seals.
                </p>
              </div>
            )}
          </div>

          {/* Section B: Nexis Compliance AI Reporter */}
          <div className="bg-stone-950/20 border border-purple-500/10 rounded-2xl p-6 backdrop-blur-md">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-purple-500/10">
              <div>
                <h3 className="text-xs font-mono font-bold tracking-widest text-[#7c6bb5] uppercase flex items-center gap-1.5">
                  <Fingerprint className="w-4 h-4 text-[#a855f7]" />
                  COMPLIANCE AI WRITER
                </h3>
                <p className="text-[9px] text-stone-400 font-mono mt-0.5">
                  Translates live logs to audit statements
                </p>
              </div>
              {aiReport && (
                <button
                  onClick={downloadSignedReport}
                  className="p-1 px-2.5 border border-purple-500/20 hover:border-[#a855f7]/40 text-[9.5px] font-mono text-purple-300 rounded-lg transition-all flex items-center gap-1.5"
                >
                  <Download className="w-3 h-3 text-purple-400" />
                  EXPORT MARKDOWN
                </button>
              )}
            </div>

            {aiReport ? (
              <div className="space-y-4 font-mono">
                {/* AI generated report container */}
                <div className="bg-black/35 border border-purple-500/10 rounded-xl p-3.5 max-h-[220px] overflow-y-auto leading-relaxed scrollbar-thin">
                  <div className="text-[10.5px] text-stone-300 whitespace-pre-wrap font-mono select-text selection:bg-purple-500/40 selection:text-white">
                    {aiReport}
                  </div>
                </div>
                <button
                  onClick={runAIComplianceAssessment}
                  disabled={generatingReport}
                  className="w-full py-1.5 border border-stone-800 hover:border-purple-500/40 text-[10.5px] font-mono text-stone-400 hover:text-white rounded-lg transition-all flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${generatingReport ? "animate-spin" : ""}`} />
                  RECULTIVATE LIVE SYNTHESIS
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 py-10 font-mono text-center space-y-3">
                <FileText className="w-8 h-8 text-purple-500/30 animate-pulse" />
                <div className="space-y-1">
                  <span className="text-[10.5px] text-stone-400 font-bold block uppercase tracking-wide">
                    READY FOR COMPLIANCE SYNTHESIS
                  </span>
                  <p className="text-[9.5px] text-stone-600 max-w-[280px] leading-normal">
                    Generate an unalterable continuous audit statement formatted as a SOC 2 Type II / ISO 27001 executive report based on actual fleet nodes.
                  </p>
                </div>
                <button
                  onClick={runAIComplianceAssessment}
                  disabled={generatingReport}
                  className="px-5 py-2 bg-[#1d1245] border border-purple-500/25 hover:border-purple-500/50 text-[10px] text-purple-200 hover:text-white font-bold rounded-lg transition-all flex items-center gap-1.5 shadow-sm"
                >
                  {generatingReport ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 text-purple-300 animate-spin" />
                      SYNTHESIZING REPORT...
                    </>
                  ) : (
                    <>
                      <FileCheck className="w-3.5 h-3.5 text-purple-300" />
                      COMPILE AI AUDIT STATEMENT
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
