import React, { useState } from 'react';
import { Shield, Lock, User, Fingerprint, ArrowRight, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PartnerPortal() {
  const [partnerId, setPartnerId] = useState('');
  const [password, setPassword] = useState('');
  const [isBiometricActive, setIsBiometricActive] = useState(false);

  const handlePartnerLogin = (e) => {
    e.preventDefault();
    if (!partnerId || !password) {
      toast.error("Veuillez saisir votre identifiant partenaire et mot de passe");
      return;
    }
    toast.success(`Authentification partenaire réussie : ${partnerId}`);
  };

  const handleBiometricScan = () => {
    setIsBiometricActive(true);
    setTimeout(() => {
      setIsBiometricActive(false);
      toast.success("Empreinte biométrique vérifiée avec succès !");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#060a0e] text-foreground flex items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Laser Cyan Network Background Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,219,231,0.2)_0,transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      {/* Main Glass Card Box */}
      <div className="relative z-10 w-full max-w-md p-8 rounded-3xl bg-surface/70 border border-[#00dbe7]/30 shadow-[0_0_50px_rgba(0,219,231,0.2)] backdrop-blur-2xl space-y-6">
        {/* Hexagonal Shield Logo & Portal Title */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-[#f38020] to-orange-500 p-0.5 shadow-lg shadow-orange-500/30 flex items-center justify-center">
            <div className="w-full h-full bg-background rounded-[14px] flex items-center justify-center text-[#f38020]">
              <Shield className="w-8 h-8" />
            </div>
          </div>

          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#00dbe7]">
              BEECARBONAT PARTNER PORTAL
            </span>
            <h2 className="text-2xl font-black tracking-tight text-foreground mt-1">
              PARTNER LOGIN
            </h2>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handlePartnerLogin} className="space-y-4">
          <div>
            <label className="text-xs font-mono text-muted-foreground block mb-1">Partner ID / Email</label>
            <div className="relative">
              <User className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
              <input
                type="text"
                placeholder="PARTNER-8842-X"
                value={partnerId}
                onChange={(e) => setPartnerId(e.target.value)}
                className="w-full bg-background/80 border border-border rounded-xl pl-9 pr-3 py-2.5 text-sm text-foreground font-mono focus:outline-none focus:border-[#f38020]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-mono text-muted-foreground block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
              <input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-background/80 border border-border rounded-xl pl-9 pr-3 py-2.5 text-sm text-foreground font-mono focus:outline-none focus:border-[#f38020]"
              />
            </div>
          </div>

          {/* Biometric Scan Button */}
          <div className="p-3 rounded-xl bg-background/60 border border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-[#00dbe7] ${isBiometricActive ? 'animate-ping bg-cyan-500/20' : 'bg-surface'}`}>
                <Fingerprint className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-foreground">Biometric Authentication</div>
                <div className="text-[10px] text-muted-foreground font-mono">Scan your secure passkey</div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleBiometricScan}
              className="px-3 py-1.5 rounded-lg bg-surface-alt hover:bg-slate-700 text-[11px] font-mono text-[#00dbe7] border border-border transition"
            >
              Scan
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#f38020] to-orange-600 hover:opacity-90 text-xs font-extrabold text-foreground transition tracking-wider uppercase font-mono shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2"
          >
            <span>ACCESS PORTAL</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Links */}
        <div className="text-center space-y-2 pt-2 border-t border-border/80 text-xs font-mono">
          <div>
            <button onClick={() => toast.info("Demande de réinitialisation envoyée")} className="text-muted-foreground hover:text-foreground transition">
              Forgot Credentials?
            </button>
          </div>
          <div>
            <button onClick={() => toast.info("Formulaire de demande de partenariat B2B")} className="text-[#00dbe7] hover:underline font-semibold">
              Request New Partner Access
            </button>
          </div>
        </div>

        {/* Security Footer Notice */}
        <div className="p-3 rounded-xl bg-background/40 border border-border/60 text-[10px] font-mono text-muted-foreground text-center space-y-1">
          <div className="flex items-center justify-center gap-1 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" /> Quantum Encryption Active
          </div>
          <p>Secure access authorized for B2B partners only. Unauthorized entry is monitored.</p>
        </div>
      </div>
    </div>
  );
}
