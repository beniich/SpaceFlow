import React, { useState } from "react";
import { UserCheck, KeyRound, Fingerprint, Lock, Layers, Eye, EyeOff, ShieldCheck, ArrowRight, Cloud, Mail, FileText, CheckCircle2 } from "lucide-react";

interface BadgeData {
  id: string;
  name: string;
  email: string;
  keyCode: string;
  clearance: string;
  avatarColor: string;
  regDate: string;
}

interface SecurityProps {
  isLightMode: boolean;
  onNavigate: (tabId: string) => void;
  showToast: (msg: string) => void;
  // Auth state handlers from parent
  isLoggedIn: boolean;
  setIsLoggedIn: (val: boolean) => void;
  loginId: string;
  setLoginId: (val: string) => void;
  loginKey: string;
  setLoginKey: (val: string) => void;
  handleLoginBadge: (e: React.FormEvent) => void;
  // Creator form handlers from parent
  regName: string;
  setRegName: (val: string) => void;
  regEmail: string;
  setRegEmail: (val: string) => void;
  regClearance: string;
  setRegClearance: (val: string) => void;
  regKey: string;
  setRegKey: (val: string) => void;
  handleGenerateRegCryptKey: () => void;
  handleRegisterBadge: (e: React.FormEvent) => void;
}

export function NexusSecurity({
  isLightMode,
  onNavigate,
  showToast,
  isLoggedIn,
  setIsLoggedIn,
  loginId,
  setLoginId,
  loginKey,
  setLoginKey,
  handleLoginBadge,
  regName,
  setRegName,
  regEmail,
  setRegEmail,
  regClearance,
  setRegClearance,
  regKey,
  setRegKey,
  handleGenerateRegCryptKey,
  handleRegisterBadge
}: SecurityProps) {
  const [activePortalGate, setActivePortalGate] = useState<"login" | "register">("register");
  const [registerWizardStep, setRegisterWizardStep] = useState<1 | 2 | 3>(1);
  const [showPasswordText, setShowPasswordText] = useState(false);
  
  // Login input values
  const [loginEmailVal, setLoginEmailVal] = useState("");
  const [loginPassVal, setLoginPassVal] = useState("");

  const executeLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmailVal.trim() || !loginPassVal.trim()) {
      showToast("Veuillez saisir vos identifiants d'accostage.");
      return;
    }
    // Simulate logging in
    setIsLoggedIn(true);
    showToast("Authentification réussie. Liaison synchronisée active.");
    onNavigate("atrium");
  };

  const handleStepOneNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim()) {
      showToast("Veuillez compléter votre identité d'agent.");
      return;
    }
    setRegisterWizardStep(2);
    showToast("Étape 1 validée : Génération de votre signature cryptographique requise.");
  };

  const handleStepTwoNext = () => {
    if (!regKey) {
      showToast("Générez d'abord une clé cryptomagnétique en cliquant sur le bouton.");
      return;
    }
    setRegisterWizardStep(3);
    showToast("Étape 2 validée : Impression physique de votre badge.");
  };

  const handleStepThreeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleRegisterBadge(e);
    // Automatically log in and take to home
    setIsLoggedIn(true);
    showToast("Identité nominale enregistrée. Bienvenue parmi nous !");
    onNavigate("atrium");
  };

  return (
    <div className="space-y-8 relative z-10 animate-fade-in text-left">
      
      {/* Selector tab selection bar for mode toggling */}
      <div className="flex justify-center">
        <div className="inline-flex bg-neutral-900/60 p-1 rounded-2xl border border-neutral-800">
          <button
            onClick={() => setActivePortalGate("register")}
            className={`px-6 py-2.5 rounded-xl font-mono text-[9.5px] font-black uppercase tracking-wider transition-all cursor-pointer ${
              activePortalGate === "register" 
                ? "bg-[#ff5a00] text-white shadow-md font-extrabold" 
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            [⚙️ Register Wizard ]
          </button>
          
          <button
            onClick={() => setActivePortalGate("login")}
            className={`px-6 py-2.5 rounded-xl font-mono text-[9.5px] font-black uppercase tracking-wider transition-all cursor-pointer ${
              activePortalGate === "login" 
                ? "bg-[#ff5a00] text-white shadow-md font-extrabold" 
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            [🔒 Login Portal ]
          </button>
        </div>
      </div>

      {/* ==================== GATE 1: USER SECURE LOGIN PORTAL (Image 4) ==================== */}
      {activePortalGate === "login" && (
        <div className="relative rounded-[2.5rem] bg-[#0c051e]/50 border border-neutral-950 p-8 flex items-center justify-center min-h-[460px] overflow-hidden">
          
          {/* Integrated Circuit trace paths absolute background SVG from Image 4 */}
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <svg className="w-full h-full text-[#ff5a00]" viewBox="0 0 600 400" fill="none">
              <path d="M 50 50 L 150 150 L 450 150 L 550 50" stroke="currentColor" strokeWidth="1.5" />
              <path d="M 50 350 L 150 250 L 450 250 L 550 350" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3,3" />
              <circle cx="150" cy="150" r="4" fill="currentColor" />
              <circle cx="450" cy="150" r="4" fill="currentColor" />
              <circle cx="150" cy="250" r="4" fill="currentColor" />
              <circle cx="450" cy="250" r="4" fill="currentColor" />
              {/* Central glowing link */}
              <line x1="300" y1="0" x2="300" y2="400" stroke="currentColor" strokeWidth="1" strokeDasharray="5,10" />
            </svg>
          </div>

          <div className="relative z-10 w-full max-w-sm rounded-3xl bg-[#080315] border border-[#ff5a00]/30 shadow-2xl p-8 space-y-6 text-center">
            
            {/* Header branding logo */}
            <div className="space-y-1.5">
              <div className="w-12 h-12 rounded-2xl bg-[#ff5a00]/10 border border-[#ff5a00]/25 flex items-center justify-center mx-auto">
                <Cloud className="w-6 h-6 text-[#ff5a00] animate-pulse" />
              </div>
              <h3 className="text-xl font-sans font-black text-white uppercase tracking-tight">
                Secure User Login
              </h3>
              <p className="text-stone-500 text-[11px]">
                FixLab Credentials Gateway
              </p>
            </div>

            {/* Input elements matching Image 4 */}
            <form onSubmit={executeLoginSubmit} className="space-y-4 text-left">
              <div>
                <label className="text-[9px] font-mono text-zinc-500 block uppercase mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="nom@company.local"
                  value={loginEmailVal}
                  onChange={(e) => setLoginEmailVal(e.target.value)}
                  className="w-full bg-[#070512] border border-neutral-900 rounded-xl p-3.5 text-xs text-white placeholder-zinc-750 focus:outline-none focus:border-[#ff5a00]/50"
                />
              </div>

              <div>
                <label className="text-[9px] font-mono text-zinc-500 block uppercase mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPasswordText ? "text" : "password"}
                    required
                    placeholder="Saisissez la clé agent crypté..."
                    value={loginPassVal}
                    onChange={(e) => setLoginPassVal(e.target.value)}
                    className="w-full bg-[#070512] border border-neutral-900 rounded-xl pl-3.5 pr-10 py-3.5 text-xs text-white placeholder-zinc-750 focus:outline-none focus:border-[#ff5a00]/50"
                  />
                  
                  {/* Eyes visibility toggle element */}
                  <button
                    type="button"
                    onClick={() => setShowPasswordText(!showPasswordText)}
                    className="absolute right-3 top-3.5 text-neutral-500 hover:text-white cursor-pointer"
                  >
                    {showPasswordText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full font-mono text-[9px] font-black uppercase tracking-widest bg-[#ff5a00] hover:bg-[#ff7e00] text-white py-4 rounded-xl transition-all shadow-md mt-6"
              >
                CONNEXION
              </button>
            </form>

            <button
              onClick={() => setActivePortalGate("register")}
              className="font-mono text-[8px] text-zinc-500 block uppercase tracking-wide hover:underline cursor-pointer pt-2 mx-auto"
            >
              Don't have an account? Sign Up
            </button>

          </div>

        </div>
      )}

      {/* ==================== GATE 2: PROGRESSIVE SIGNUP STEP ACCOUNTS WIZARD (Image 3) ==================== */}
      {activePortalGate === "register" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left panel informational blocks from Image 3 */}
          <div className="lg:col-span-5 p-8 rounded-[2.5rem] bg-[#0c0a1a]/60 border border-neutral-900 flex flex-col justify-between text-left">
            <div className="space-y-4">
              <span className="font-mono text-[9px] tracking-widest text-[#ff5a00] font-black uppercase block">[ ACCÈS NOMINAUX SOUVERAINS ]</span>
              <h2 className="text-3xl font-black text-white uppercase tracking-tight">
                Join Sovereign <br />
                Device Nexus
              </h2>
              <p className="text-stone-500 text-xs leading-relaxed font-sans">
                Create your permanent digital credentials card to acquire a secure clearance badge. Our onboard process uses hardware encryption hashes to bind your device telemetry.
              </p>

              <div className="py-4 space-y-2">
                <div className="flex items-center gap-3 text-xs text-stone-300 font-sans">
                  <CheckCircle2 className="w-4 h-4 text-[#ff5a00]" />
                  <span>Sovereign Identity Ledger Registration</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-stone-300 font-sans">
                  <CheckCircle2 className="w-4 h-4 text-[#ff5a00]" />
                  <span>QKD Cryptographic key assignment</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-stone-300 font-sans">
                  <CheckCircle2 className="w-4 h-4 text-[#ff5a00]" />
                  <span>Access on Atrium, Lab and Reports</span>
                </div>
              </div>
            </div>

            {/* Simulated registration date stamp */}
            <div className="bg-black/45 p-4 rounded-xl border border-neutral-90 * text-left mt-6">
              <span className="text-[7.5px] font-mono text-zinc-500 block uppercase">CADRAN DE CONTRÔLE SYSTEM</span>
              <p className="text-[9.5px] font-mono text-emerald-500 block mt-1">
                Liaison d'accueil active // Prêt pour l'initialisation.
              </p>
            </div>
          </div>

          {/* Right progressive form container from Image 3 */}
          <div className="lg:col-span-7 p-6 rounded-[2.5rem] bg-[#0c0a1a]/80 border border-neutral-950/80 flex flex-col justify-between text-left">
            
            <div>
              {/* Steppers visualization bar matching Image 3 */}
              <div className="flex justify-between items-center bg-black/60 px-5 py-4 rounded-2xl border border-neutral-900/60 mb-8 font-mono text-[9px]">
                
                {/* Step 1 marker */}
                <div className="flex items-center gap-2">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center font-black ${
                    registerWizardStep >= 1 ? "bg-[#ff5a00] text-white" : "bg-neutral-900 text-neutral-600"
                  }`}>1</div>
                  <span className={`${registerWizardStep === 1 ? "text-white font-bold" : "text-zinc-500"}`}>Details</span>
                </div>
                
                <div className="flex-1 mx-4 h-[1px] bg-neutral-900" />

                {/* Step 2 marker */}
                <div className="flex items-center gap-2">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center font-black ${
                    registerWizardStep >= 2 ? "bg-[#ff5a00] text-white" : "bg-neutral-900 text-neutral-600"
                  }`}>2</div>
                  <span className={`${registerWizardStep === 2 ? "text-white font-bold" : "text-zinc-500"}`}>Cipher Key</span>
                </div>

                <div className="flex-1 mx-4 h-[1px] bg-neutral-900" />

                {/* Step 3 marker */}
                <div className="flex items-center gap-2">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center font-black ${
                    registerWizardStep >= 3 ? "bg-[#ff5a00] text-white" : "bg-neutral-900 text-neutral-600"
                  }`}>3</div>
                  <span className={`${registerWizardStep === 3 ? "text-white font-bold" : "text-zinc-500"}`}>Print Badge</span>
                </div>
              </div>

              {/* STEP 1: ACCOUNT DETAILS */}
              {registerWizardStep === 1 && (
                <form onSubmit={handleStepOneNext} className="space-y-4 animate-fade-in text-left">
                  <div className="space-y-1">
                    <h3 className="text-sm font-sans font-black uppercase text-white tracking-wide">
                      Step 1 of 3: Account Details
                    </h3>
                    <p className="text-xs text-stone-500 leading-normal">
                      Provide your full name and security address to anchor credentials.
                    </p>
                  </div>

                  <div>
                    <label className="text-[9px] font-mono text-zinc-500 block uppercase mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Alexander Pierce"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full bg-black/40 border border-neutral-800 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-[#ff5a00]/50"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] font-mono text-zinc-500 block uppercase mb-1">Professional Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="alex.p@secure.local"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full bg-black/40 border border-neutral-800 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-[#ff5a00]/50"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] font-mono text-zinc-500 block uppercase mb-1">Company Role</label>
                    <select
                      value={regClearance}
                      onChange={(e) => setRegClearance(e.target.value)}
                      className="w-full bg-[#08090b] border border-neutral-800 rounded-xl p-3.5定位 text-xs text-white focus:outline-none focus:border-[#ff5a00]/50"
                    >
                      <option value="atrium">ALPHA ARCHITECT</option>
                      <option value="laboratoire">SYSTEM MODULATOR</option>
                      <option value="omega">OMEGA SUPERVISOR</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full font-mono text-[9px] font-black uppercase tracking-widest bg-gradient-to-r from-[#ff7e00] to-[#ff5a00] text-white py-4 rounded-xl hover:shadow-[0_4px_15px_rgba(255,90,0,0.2)] transition-all cursor-pointer flex items-center justify-center gap-1"
                  >
                    Proceed to Step 2 
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}

              {/* STEP 2: CIPHER KEY GENERATION */}
              {registerWizardStep === 2 && (
                <div className="space-y-4 animate-fade-in text-left">
                  <div className="space-y-1">
                    <h3 className="text-sm font-sans font-black uppercase text-white tracking-wide">
                      Step 2 of 3: Cryptographic Secret Key
                    </h3>
                    <p className="text-xs text-stone-500 leading-normal">
                      We require a secure signing hash to shield your telemetry reports. Click to generate.
                    </p>
                  </div>

                  <div className="bg-[#080515] p-6 rounded-2xl border border-neutral-900 border-dashed text-center space-y-4">
                    {regKey ? (
                      <div className="space-y-2">
                        <span className="text-[8px] font-mono text-emerald-400 font-bold block uppercase">KEY ENCRYPTION KEY G_SEC_A9</span>
                        <span className="font-mono text-base font-black text-white tracking-widest block animate-pulse">
                          {regKey}
                        </span>
                      </div>
                    ) : (
                      <span className="text-stone-500 font-mono text-[10px] block">AUCUNE CLÉ GÉNÉRÉE. CLIQUEZ CI-DESSOUS.</span>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        handleGenerateRegCryptKey();
                        showToast("Tracé d'encryptage généré.");
                      }}
                      className="bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-[#ff5a00] font-mono text-[9px] py-2.5 px-4 rounded-xl transition-all font-bold inline-flex items-center gap-1.5"
                    >
                      <KeyRound className="w-4 h-4 text-[#ff5a00]" />
                      FORGER UNE SÉCURITÉ CRYPTOCELLULAIRE
                    </button>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => setRegisterWizardStep(1)}
                      className="w-1/3 border border-neutral-800 text-stone-400 font-mono text-[9px] font-bold uppercase rounded-xl py-4 hover:bg-neutral-900"
                    >
                      Retour
                    </button>
                    
                    <button
                      onClick={handleStepTwoNext}
                      className="w-2/3 bg-gradient-to-r from-[#ff7e00] to-[#ff5a00] text-white font-mono text-[9px] font-black uppercase tracking-widest rounded-xl py-4 hover:shadow-[0_4px_15px_rgba(255,90,0,0.2)]"
                    >
                      Verify & Proceed
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: PRINT BADGE */}
              {registerWizardStep === 3 && (
                <form onSubmit={handleStepThreeSubmit} className="space-y-6 animate-fade-in text-left">
                  <div className="space-y-1">
                    <h3 className="text-sm font-sans font-black uppercase text-white tracking-wide">
                      Step 3 of 3: Holographic Security Badge
                    </h3>
                    <p className="text-xs text-stone-500 leading-normal">
                      Excellent. Your credentials are fully integrated. Verify your dynamic printable badge below.
                    </p>
                  </div>

                  {/* High fidelity interactive holograph card render */}
                  <div className="relative w-full h-[220px] rounded-3xl bg-[#0a0523] border border-neutral-900 overflow-hidden flex flex-col justify-between p-6 shadow-2xl">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-tr from-[#ff5a00]/10 to-transparent rounded-bl-full pointer-events-none" />

                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[7.5px] text-zinc-500 block uppercase tracking-widest">SOVEREIGN IDENTITY NEXUS</span>
                        <span className="text-[10px] font-black text-[#ff5a00] block mt-0.5">VISION ARCHITECT</span>
                      </div>
                      <Fingerprint className="w-6 h-6 text-[#ff5a00] animate-pulse" />
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-[#ff5a00]/10 border border-[#ff5a00]/25 flex items-center justify-center font-mono font-black text-white text-lg">
                        {regName ? regName.charAt(0).toUpperCase() : "A"}
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-white uppercase tracking-tight leading-tight">
                          {regName || "Alexander Pierce"}
                        </h4>
                        <span className="text-[8.5px] font-mono text-zinc-500 block mt-0.5">
                          {regEmail || "alex.p@secure.local"}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-end border-t border-neutral-900/40 pt-3 text-[8.5px] font-mono text-zinc-500">
                      <div>CLEARANCE: <span className="font-bold text-emerald-500 uppercase">{regClearance} ACCÈS</span></div>
                      <span>SECRET_KEY_OK</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setRegisterWizardStep(2)}
                      className="w-1/3 border border-neutral-800 text-stone-400 font-mono text-[9px] font-bold uppercase rounded-xl py-4 hover:bg-neutral-900"
                    >
                      Retour
                    </button>
                    
                    <button
                      type="submit"
                      className="w-2/3 bg-emerald-500 text-black font-mono text-[9px] font-black uppercase tracking-widest rounded-xl py-4 hover:bg-emerald-400"
                    >
                      IMPRIMER & ENREGISTRER L'IDENTITÉ
                    </button>
                  </div>
                </form>
              )}

            </div>

            <button
              onClick={() => setActivePortalGate("login")}
              className="font-mono text-[8.5px] text-zinc-500 block uppercase tracking-wide hover:underline cursor-pointer pt-6 mx-auto text-center"
            >
              Already have an account? Log In
            </button>

          </div>

        </div>
      )}

    </div>
  );
}

