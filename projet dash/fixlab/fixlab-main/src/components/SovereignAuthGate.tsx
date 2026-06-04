import React, { useState } from "react";
import { Shield, Key, Sparkles, Terminal, Activity, ChevronRight, Check } from "lucide-react";
import { googleSignIn } from "../utils/firebaseAuth";
import { db } from "../utils/firebaseDb";
import { doc, getDoc, setDoc } from "firebase/firestore";

interface SovereignAuthGateProps {
  onAuthSuccess: (userId: string, role: string) => void;
}

export const SovereignAuthGate: React.FC<SovereignAuthGateProps> = ({ onAuthSuccess }) => {
  const [selectedRole, setSelectedRole] = useState<"super-admin" | "client">("super-admin");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  const handleSignIn = async () => {
    setIsLoggingIn(true);
    setErrorDetails(null);
    try {
      const result = await googleSignIn();
      if (result) {
        // Safe onboard/update role inside Firestore
        const userDocRef = doc(db, "users", result.user.uid);
        const uDoc = await getDoc(userDocRef);
        
        let activeRole = selectedRole;
        if (!uDoc.exists()) {
          // If first-time user, register with custom selected role
          const profileData = {
            uid: result.user.uid,
            email: result.user.email,
            role: selectedRole,
            plan: selectedRole === "super-admin" ? "sovereign" : "tactical",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          await setDoc(userDocRef, profileData);
        } else {
          // If existing user, preserve or update to selected role
          const existingData = uDoc.data();
          if (existingData?.role) {
            activeRole = existingData.role as any;
          } else {
            await setDoc(userDocRef, { role: selectedRole }, { merge: true });
          }
        }
        
        onAuthSuccess(result.user.uid, activeRole);
      }
    } catch (err: any) {
      console.error("Auth Gate Login Error:", err);
      setErrorDetails(err.message || "The connection was rejected or interrupted.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div id="sovereign-auth-gate" className="min-h-screen w-full flex flex-col justify-center items-center p-4 bg-[#0a041f] text-purple-100 font-mono relative overflow-hidden">
      
      {/* Background visual graphics */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-purple-600/5 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-cyan-600/5 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,10,36,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(18,10,36,0.5)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
      </div>

      {/* Main Login Card - Industrial Frame styled */}
      <div className="w-full max-w-lg bg-[#0f072c]/90 border border-purple-500/20 rounded-2xl relative z-10 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-lg">
        
        {/* Decorative corner brackets */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-cyan-400 rounded-tl-lg" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-cyan-400 rounded-tr-lg" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-cyan-400 rounded-bl-lg" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-cyan-400 rounded-br-lg" />

        {/* Portal Branding */}
        <div className="text-center space-y-3 mb-8">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-purple-500/10 border border-[#22d3ee]/30 shadow-[0_0_20px_rgba(34,211,238,0.15)] flex items-center justify-center">
            <Shield className="w-8 h-8 text-cyan-400 animate-pulse" />
          </div>
          <div>
            <h1 className="text-sm font-black tracking-widest text-[#22d3ee] uppercase italic">SANTÉ CORE OPERATING SYSTEM</h1>
            <p className="text-[9.5px] uppercase font-bold tracking-widest text-stone-400">Sovereign Registry & Identity Interface</p>
          </div>
        </div>

        {/* Form Container */}
        <div className="space-y-6">
          
          {/* Identity/Role Clearance Selection Block */}
          <div className="space-y-3 text-left">
            <span className="text-[10px] font-black text-purple-300 uppercase tracking-widest flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              01 • Security Accord Selection
            </span>
            <p className="text-[10.5px] text-stone-400 leading-normal">
              Specify your clearance credential before authorizing with Google verification.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
              
              {/* Option Admin */}
              <button
                type="button"
                onClick={() => setSelectedRole("super-admin")}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer relative ${
                  selectedRole === "super-admin"
                    ? "bg-purple-950/40 border-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.1)]"
                    : "bg-[#0b0424]/60 border-stone-850 text-stone-500 hover:text-stone-300 hover:border-stone-800"
                }`}
              >
                {selectedRole === "super-admin" && (
                  <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-purple-500 flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-white" />
                  </div>
                )}
                <div className="text-xs font-black uppercase tracking-wider mb-1">👑 Administrators</div>
                <div className="text-[9px] text-stone-400 leading-relaxed">
                  Command Center access, biometric device monitoring, and core audit logs.
                </div>
              </button>

              {/* Option Client */}
              <button
                type="button"
                onClick={() => setSelectedRole("client")}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer relative ${
                  selectedRole === "client"
                    ? "bg-emerald-950/20 border-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                    : "bg-[#0b0424]/60 border-stone-850 text-stone-500 hover:text-stone-300 hover:border-stone-800"
                }`}
              >
                {selectedRole === "client" && (
                  <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-white" />
                  </div>
                )}
                <div className="text-xs font-black uppercase tracking-wider mb-1">🏥 Hospital Clients</div>
                <div className="text-[9px] text-stone-400 leading-relaxed">
                  Guest access hub, secure communications, mTLS health files, and diagnostics.
                </div>
              </button>

            </div>
          </div>

          {/* Line separator */}
          <div className="border-t border-purple-500/10" />

          {/* Connection Trigger */}
          <div className="space-y-4 text-center">
            <span className="text-[10px] font-black text-purple-300 uppercase tracking-widest flex items-center justify-start gap-1.5 text-left mb-1">
              <Key className="w-3.5 h-3.5 text-cyan-400" />
              02 • Cryptographic Validation
            </span>

            {errorDetails && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/25 rounded-xl text-rose-400 text-[10px] font-bold text-left leading-normal">
                ⚠ ACCESS DENIED: {errorDetails}
              </div>
            )}

            <button
              onClick={handleSignIn}
              disabled={isLoggingIn}
              className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white shadow-[0_4px_25px_rgba(168,85,247,0.3)] disabled:opacity-50"
            >
              {isLoggingIn ? (
                <span>Authorizing mTLS secure handshake...</span>
              ) : (
                <>
                  <span>Initiate Secured Identity Session</span>
                  <ChevronRight className="w-4 h-4 stroke-[3]" />
                </>
              )}
            </button>
          </div>

        </div>

        {/* Footer Technical Metadata bar */}
        <div className="mt-8 pt-4 border-t border-purple-500/10 flex justify-between items-center text-[8px] text-stone-500 tracking-wider">
          <span>PORT_PROTOCOL: HTTPS/mTLS</span>
          <span>STATUS: ENFORCEMENT LIVE</span>
        </div>

      </div>
    </div>
  );
};
