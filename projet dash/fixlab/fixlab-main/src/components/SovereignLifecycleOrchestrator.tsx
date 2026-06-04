import React, { useState, useEffect } from "react";
import { 
  Shield, Key, Sparkles, RefreshCw, Lock, CreditCard, Layers, 
  Activity, CheckCircle2, ChevronRight, Server, Landmark, Users, HelpCircle 
} from "lucide-react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../utils/firebaseDb";
import { googleSignIn } from "../utils/firebaseAuth";
import { User as FirebaseUser } from "firebase/auth";

// --- Beautiful CSS 3D Cube for Landing Page ---
export const SovereignCube: React.FC = () => {
  return (
    <div className="relative w-36 h-36 perspective-1000 my-12 mx-auto select-none">
      <div className="absolute inset-0 w-full h-full transform-style-3d animate-cube-rotate opacity-90">
        {/* Front Face */}
        <div className="absolute inset-0 bg-[#22d3ee]/10 border-2 border-cyan-400/80 backdrop-blur-md rounded-lg flex items-center justify-center transform translate-z-[18px]">
          <Activity className="w-8 h-8 text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
        </div>
        {/* Back Face */}
        <div className="absolute inset-0 bg-purple-950/20 border-2 border-purple-500/80 backdrop-blur-md rounded-lg flex items-center justify-center transform rotate-y-180 translate-z-[-18px]">
          <Shield className="w-8 h-8 text-purple-400" />
        </div>
        {/* Left Face */}
        <div className="absolute inset-0 bg-stone-950/40 border-2 border-cyan-500/50 backdrop-blur-md rounded-lg flex items-center justify-center transform rotate-y-[-90deg] translate-z-[18px]">
          <span className="text-[10px] font-black tracking-widest text-[#22d3ee]">NXS</span>
        </div>
        {/* Right Face */}
        <div className="absolute inset-0 bg-stone-950/40 border-2 border-purple-500/50 backdrop-blur-md rounded-lg flex items-center justify-center transform rotate-y-[90deg] translate-z-[18px]">
          <span className="text-[10px] font-black tracking-widest text-purple-400">COR</span>
        </div>
        {/* Top Face */}
        <div className="absolute inset-0 bg-purple-500/10 border-2 border-cyan-500/40 backdrop-blur-sm rounded-lg flex items-center justify-center transform rotate-x-[90deg] translate-z-[18px]">
          <div className="w-4 h-4 rounded-full bg-cyan-400 animate-ping" />
        </div>
        {/* Bottom Face */}
        <div className="absolute inset-0 bg-[#0c0523]/60 border-2 border-stone-800 rounded-lg flex items-center justify-center transform rotate-x-[-90deg] translate-z-[18px]" />
      </div>
    </div>
  );
};

// ==========================================
// 1. PUBLIC LANDING COMPONENT (The Gateway)
// ==========================================
interface PublicLandingProps {
  onInitiateLogin: () => void;
  onInitiateRegister: () => void;
}

export const PublicLanding: React.FC<PublicLandingProps> = ({ 
  onInitiateLogin,
  onInitiateRegister
}) => {
  return (
    <div id="sovereign-public-gateway" className="min-h-screen w-full flex flex-col justify-between items-center p-6 bg-[#04010f] text-stone-100 font-mono relative overflow-hidden text-center select-none">
      {/* Visual background star particles */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-10 left-10 w-2 h-2 rounded-full bg-cyan-400/30 animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 rounded-full bg-purple-500/30 animate-ping" />
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 rounded-full bg-emerald-400/20 animate-pulse" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,10,36,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(18,10,36,0.3)_1px,transparent_1px)] bg-[size:45px_45px] opacity-20" />
      </div>

      {/* Dynamic Header */}
      <header className="w-full max-w-7xl mx-auto flex justify-between items-center py-4 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-purple-950/60 border border-purple-500/30 flex items-center justify-center">
            <Shield className="w-4 h-4 text-cyan-400" />
          </div>
          <span className="text-[10px] font-black tracking-widest text-white uppercase italic">SANTÉ CORE</span>
        </div>
        <div className="text-[8px] text-stone-500 uppercase tracking-widest">
          STATUS: INGRESS OPEN
        </div>
      </header>

      {/* Central Interactive Block */}
      <div className="relative z-10 max-w-xl mx-auto flex-1 flex flex-col justify-center items-center py-12">
        <span className="text-[8.5px] tracking-[0.4em] uppercase font-black text-cyan-400 bg-cyan-950/20 px-4 py-1.5 rounded-full border border-cyan-500/20 mb-3 animate-pulse">
          // SOVEREIGN SECURITY DECK V2
        </span>
        
        <h1 className="text-4xl sm:text-5xl font-black italic tracking-tighter text-white uppercase leading-none">
          SOVEREIGN <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">NEXUS</span>
        </h1>
        <p className="text-[11px] text-stone-400 uppercase tracking-widest max-w-sm mt-3.5 leading-relaxed text-justify">
          The ultimate zero-knowledge monitoring and identity platform. Command and control with absolute cryptographic encapsulation.
        </p>

        {/* CSS 3D Cube Showcase */}
        <SovereignCube />

        {/* Gateway Action Triggers */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md px-4 mt-4">
          <button
            onClick={onInitiateRegister}
            className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-black text-xs uppercase tracking-widest hover:from-purple-500 hover:to-cyan-400 active:scale-98 transition-all shadow-[0_0_30px_rgba(147,51,234,0.3)] hover:shadow-[0_0_40px_rgba(34,211,238,0.4)] cursor-pointer"
          >
            Register
          </button>
          
          <button
            onClick={onInitiateLogin}
            className="flex-1 py-3.5 rounded-xl bg-black/60 hover:bg-stone-900 border border-purple-500/30 text-cyan-400 hover:text-white font-black text-xs uppercase tracking-widest active:scale-98 transition-all cursor-pointer"
          >
            Sign In
          </button>
        </div>
      </div>

      {/* Footer System Credits */}
      <footer className="w-full max-w-7xl mx-auto py-4 border-t border-purple-950/30 flex justify-between items-center text-[8px] text-stone-500 tracking-wider relative z-10">
        <span>SOVEREIGN OPERATIONAL MATRIX V2</span>
        <span>SOVEREIGN SHIELD CORE ENGINE</span>
      </footer>
    </div>
  );
};


// ===============================================
// 2. NEURAL HANDSHAKE / CONFIRMATION DE LIEN
// ===============================================
interface NeuralHandshakeProps {
  currentUser: FirebaseUser | null;
  onAnalysisResult: (role: "super-admin" | "client", hasSubscription: boolean) => void;
}

export const NeuralHandshake: React.FC<NeuralHandshakeProps> = ({ 
  currentUser, 
  onAnalysisResult 
}) => {
  const [percent, setPercent] = useState(0);
  const [statusLog, setStatusLog] = useState<string>("INITIALIZING NEURAL TRANSMISSION...");

  useEffect(() => {
    // Stage-based simulation logging to build high-stakes tension!
    const logTimeline = [
      { p: 15, msg: "VERIFYING SECURE OAUTH ID_TOKEN INTEGRITY..." },
      { p: 35, msg: "NEGOTIATING MUTUAL TLS SECURE TRANSPORT KEY..." },
      { p: 55, msg: "RESOLVING IDENTITY DOCUMENT WITHIN ENVELOPE..." },
      { p: 75, msg: "EVALUATING CLINICAL ACCESS SUBSCRIPTION TIER..." },
      { p: 95, msg: "LAUNCHING ROLE-BASED DASHBOARD GUARDS..." },
      { p: 100, msg: "CONNECTION SECURED." }
    ];

    const interval = setInterval(() => {
      setPercent(prev => {
        const next = prev + 5;
        const currentLog = logTimeline.find(t => next >= t.p && next < t.p + 5 || (next === 100 && t.p === 100));
        if (currentLog) {
          setStatusLog(currentLog.msg);
        }
        if (next >= 100) {
          clearInterval(interval);
          handleCompletedAuthenticationCheck();
          return 100;
        }
        return next;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [currentUser]);

  const handleCompletedAuthenticationCheck = async () => {
    if (!currentUser) {
      onAnalysisResult("client", false);
      return;
    }

    try {
      // Query real profile from Firestore node
      const userRef = doc(db, "users", currentUser.uid);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const role = data.role === "super-admin" ? "super-admin" : "client";
        const hasSub = !!data.plan;
        onAnalysisResult(role, hasSub);
      } else {
        // Safe default for new user
        onAnalysisResult("client", false);
      }
    } catch (err) {
      console.warn("Firestore handshake access failed, bypassing to local mode:", err);
      onAnalysisResult("client", false);
    }
  };

  return (
    <div id="neural-handshake-screen" className="min-h-screen w-full flex flex-col justify-center items-center bg-[#050212] text-white font-mono p-4 select-none">
      <div className="w-full max-w-sm text-center space-y-8">
        
        {/* Animated Concentric Rings */}
        <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-purple-500/25 animate-ping-slow" />
          <div className="absolute inset-2 rounded-full border border-cyan-400/30 animate-spin" style={{ animationDuration: "3s" }} />
          <div className="absolute inset-4 rounded-full border-2 border-dashed border-purple-500/40 animate-spin-reverse" style={{ animationDuration: "6s" }} />
          <div className="absolute inset-8 rounded-full bg-cyan-950/20 border border-cyan-400/60 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.2)]">
            <span className="text-sm font-black text-cyan-400">{percent}%</span>
          </div>
        </div>

        {/* Dynamic Logging Feed */}
        <div className="space-y-2">
          <h2 className="text-xs font-black uppercase tracking-[0.25em] text-[#22d3ee]">THE NEURAL HANDSHAKE</h2>
          <div className="bg-black/60 border border-purple-950/80 p-3 rounded-lg text-[9px] min-h-[36px] flex items-center justify-center italic text-stone-400">
            <RefreshCw className="w-3.5 h-3.5 text-cyan-400 mr-2 animate-spin shrink-0" />
            <span className="truncate">{statusLog}</span>
          </div>
        </div>

        {/* Safe fast skip for clinical debug testing */}
        <button
          onClick={() => handleCompletedAuthenticationCheck()}
          className="text-[9px] uppercase tracking-widest text-stone-600 hover:text-stone-300 transition-colors cursor-pointer"
        >
          [ Skip Diagnostic Wait ]
        </button>

      </div>
    </div>
  );
};


// ==========================================
// 3. PRICING & SUBSCRIPTION (The Contract)
// ==========================================
interface SovereignPricingPageProps {
  currentUser: FirebaseUser | null;
  onPlanActivated: (plan: "tactical" | "sovereign" | "imperial") => void;
}

export const SovereignPricingPage: React.FC<SovereignPricingPageProps> = ({
  currentUser,
  onPlanActivated
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState<"tactical" | "sovereign" | "imperial" | null>(null);
  const [checkoutStep, setCheckoutStep] = useState<"catalog" | "checkout" | "authenticating" | "success">("catalog");
  
  // Simulated Secure Cardholder forms
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [signerAgreement, setSignerAgreement] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Auto layout values
  const catalog = [
    {
      id: "tactical" as const,
      name: "TACTICAL ACCESS",
      price: "99",
      description: "Intermediate clinical access for individual diagnostic backup nodes.",
      features: [
        "Up to 5 dynamic devices monitored",
        "Encrypted DNS logging streams",
        "Standard SMTP email templates",
        "Sovereign Contacts Directory"
      ],
      border: "border-stone-800",
      accent: "text-purple-400",
      bgGrad: "from-purple-950/10 to-transparent"
    },
    {
      id: "sovereign" as const,
      name: "SOVEREIGN HOST",
      price: "299",
      description: "Full Command capabilities with priority biometric and incident routing.",
      features: [
        "Up to 50 active telemetry nodes",
        "Automated critical incident mail composer",
        "SOC2 real-time auditing suite",
        "Priority google-contacts syncing",
        "Advanced Quantum node predictors"
      ],
      border: "border-cyan-500/40",
      accent: "text-cyan-400",
      bgGrad: "from-cyan-950/20 via-[#0a0429]/40 to-transparent"
    },
    {
      id: "imperial" as const,
      name: "IMPERIAL DECREE",
      price: "999",
      description: "Dedicated isolated cluster for unlimited operators and corporate auditing.",
      features: [
        "Unlimited hardware device monitoring",
        "On-premise HSM cryptographic key signing",
        "24/7 dedicated satellite backup lines",
        "Custom operational visual layouts",
        "Immutable logs validation guarantees"
      ],
      border: "border-amber-500/20",
      accent: "text-amber-400",
      bgGrad: "from-amber-950/10 to-transparent"
    }
  ];

  const handleOpenCheckout = (id: "tactical" | "sovereign" | "imperial") => {
    setSelectedPlanId(id);
    setCardName(currentUser?.displayName || "");
    setCheckoutStep("checkout");
  };

  const handleExecutePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlanId || !currentUser) return;

    if (!signerAgreement) {
      setErrorMessage("Please sign the encapsulation consent agreement.");
      return;
    }

    if (cardNumber.replace(/\s+/g, "").length < 16) {
      setErrorMessage("Invalid card identifier (16 digits required).");
      return;
    }

    setErrorMessage(null);
    setCheckoutStep("authenticating");

    // Persist real record in firestore database updating selected plan and role
    const userDocRef = doc(db, "users", currentUser.uid);

    setTimeout(async () => {
      try {
        await setDoc(userDocRef, {
          uid: currentUser.uid,
          email: currentUser.email,
          role: "client",
          plan: selectedPlanId,
          updatedAt: new Date().toISOString()
        }, { merge: true });

        setCheckoutStep("success");
      } catch (err: any) {
        setErrorMessage(err.message || "Failed to update Firestore registration.");
        setCheckoutStep("checkout");
      }
    }, 2000);
  };

  return (
    <div id="sovereign-pricing-funnel" className="min-h-screen w-full bg-[#03010b] text-stone-100 font-mono py-16 px-4 sm:px-6 relative overflow-hidden">
      
      {/* Visual background lights */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/3 w-80 h-80 rounded-full bg-cyan-500/5 blur-[100px]" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-purple-600/5 blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10 space-y-12">
        
        {/* Step-based view router */}
        {checkoutStep === "catalog" && (
          <>            <div className="text-center space-y-3.5 max-w-xl mx-auto">
              <span className="text-[8.5px] uppercase font-black tracking-widest text-[#22d3ee] bg-cyan-950/40 border border-cyan-500/20 px-3.5 py-1 rounded-full">
                Phase 3: Contract Activation
              </span>
              <h2 className="text-3xl font-black italic tracking-tighter text-white uppercase leading-none">
                SELECT YOUR SOVEREIGNTY
              </h2>
              <p className="text-[11px] text-stone-400 uppercase tracking-widest leading-relaxed">
                Operators, if this is your first connect, select a warranty plan to retroactively activate your sovereign satellite workspace.
              </p>
            </div>

            {/* Catalog Grids */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
              {catalog.map((tier) => (
                <div 
                  key={tier.id}
                  className={`border rounded-2xl p-6 bg-gradient-to-b ${tier.bgGrad} flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] bg-[#0c0525] group relative overflow-hidden ${
                    tier.id === "sovereign" 
                      ? "border-cyan-400 shadow-[0_0_25px_rgba(34,211,238,0.15)] md:-translate-y-2" 
                      : "border-stone-850 hover:border-purple-500/20"
                  }`}
                >
                  {tier.id === "sovereign" && (
                    <div className="absolute top-0 right-0 p-3 bg-cyan-400 text-black text-[7.5px] font-black uppercase tracking-widest rounded-bl-xl">
                      RECOMMENDED
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="space-y-1 text-left">
                      <span className={`text-[9px] font-black uppercase tracking-widest ${tier.accent}`}>{tier.name}</span>
                      <div className="flex items-baseline gap-1 text-white">
                        <span className="text-4xl font-black italic">${tier.price}</span>
                        <span className="text-[10px] text-stone-500 font-bold uppercase tracking-widest">/ month</span>
                      </div>
                    </div>

                    <p className="text-[10.5px] text-stone-450 leading-relaxed text-justify border-b border-stone-900 pb-4">
                      {tier.description}
                    </p>

                    <ul className="text-[10.5px] text-stone-300 space-y-2 text-left">
                      {tier.features.map((feat, i) => (
                        <li key={i} className="flex items-center gap-2">
                           <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span className="truncate">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => handleOpenCheckout(tier.id)}
                    className={`w-full mt-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer transition-all ${
                      tier.id === "sovereign"
                        ? "bg-[#22d3ee] text-black font-extrabold hover:bg-cyan-300 hover:scale-[1.03]"
                        : "bg-purple-950/20 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-950/40"
                    }`}
                  >
                    Activate {tier.id}
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Card Checkout Slide interface */}
        {checkoutStep === "checkout" && selectedPlanId && (
          <div className="max-w-md mx-auto bg-[#0d0726]/90 border border-cyan-400/30 p-6 sm:p-8 rounded-2xl relative shadow-2xl backdrop-blur-md text-left">
            
            <div className="border-b border-stone-850 pb-4 mb-5 flex justify-between items-center">
              <div>
                <span className="text-[8px] font-black uppercase tracking-widest text-cyan-400">PAYMENT GATEWAY</span>
                <h3 className="text-sm font-black text-white italic uppercase tracking-wider">SECURE AUTHORIZATION</h3>
              </div>
              <div className="px-2 py-1 rounded bg-cyan-950/50 text-cyan-400 border border-cyan-400/10 text-[8.5px] font-black uppercase tracking-widest">
                Tier: {selectedPlanId.toUpperCase()}
              </div>
            </div>

            <form onSubmit={handleExecutePayment} className="space-y-4 text-xs font-mono">
              {errorMessage && (
                <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-[10px] leading-relaxed">
                  ⚠ {errorMessage}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[8.5px] text-stone-400 uppercase tracking-wider block">Cardholder Name</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-stone-500">👤</span>
                  <input
                    type="text"
                    required
                    className="w-full bg-black/60 border border-stone-850 py-2.5 px-9 text-xs rounded text-stone-200 outline-none focus:border-cyan-400"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="e.g. ADAM BENIICH"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[8.5px] text-stone-400 uppercase tracking-wider block">Secure Card Number</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-3 w-3.5 h-3.5 text-stone-500" />
                  <input
                    type="text"
                    required
                    maxLength={19}
                    className="w-full bg-black/60 border border-stone-850 py-2.5 px-9 text-xs font-mono rounded text-stone-200 outline-none focus:border-cyan-400"
                    value={cardNumber}
                    onChange={(e) => {
                      let val = e.target.value.replace(/\D/g, "");
                      let formatted = val.match(/.{1,4}/g)?.join(" ") || val;
                      setCardNumber(formatted);
                    }}
                    placeholder="4000 1234 5678 9010"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[8.5px] text-stone-400 uppercase tracking-wider block">Expiration (MM/YY)</label>
                  <input
                    type="text"
                    required
                    maxLength={5}
                    className="w-full bg-black/60 border border-stone-850 py-2.5 px-3 text-xs text-center rounded text-stone-200 outline-none focus:border-cyan-400"
                    value={cardExpiry}
                    onChange={(e) => {
                      let val = e.target.value.replace(/\D/g, "");
                      if (val.length > 2) {
                        val = val.substring(0, 2) + "/" + val.substring(2, 4);
                      }
                      setCardExpiry(val);
                    }}
                    placeholder="08/29"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[8.5px] text-stone-400 uppercase tracking-wider block">CVV Security Code</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-3 h-3 text-stone-400" />
                    <input
                      type="password"
                      required
                      maxLength={3}
                      className="w-full bg-black/60 border border-stone-850 py-2.5 px-8 text-xs text-center rounded text-stone-200 outline-none focus:border-cyan-400"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ""))}
                      placeholder="•••"
                    />
                  </div>
                </div>
              </div>

              <div className="p-3 bg-cyan-950/20 border border-cyan-400/10 rounded-xl space-y-1.5 mt-2">
                <div className="flex justify-between text-[10px] text-stone-400">
                  <span>Monthly subscription:</span>
                  <span className="font-bold text-white">${catalog.find(c => c.id === selectedPlanId)?.price}/mo</span>
                </div>
                <div className="flex justify-between text-[10px] text-[#22d3ee] font-black border-t border-stone-850 pt-1.5">
                  <span>TOTAL REQUIRED:</span>
                  <span>${catalog.find(c => c.id === selectedPlanId)?.price}.00 USD</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="signerAgreement"
                  checked={signerAgreement}
                  onChange={(e) => setSignerAgreement(e.target.checked)}
                  className="mt-0.5 rounded accent-cyan-400"
                />
                <label htmlFor="signerAgreement" className="text-[9px] text-stone-400 leading-normal select-none">
                  I consent to the encrypted multi-tenant identity security encapsulation with Rabat University.
                </label>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all cursor-pointer"
                >
                  ✓ CONFIRM AND PAY
                </button>
                <button
                  type="button"
                  onClick={() => setCheckoutStep("catalog")}
                  className="px-4 py-3 bg-stone-900 border border-stone-800 text-stone-400 hover:text-stone-200 rounded-xl text-[10px] uppercase tracking-wider transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Dynamic Authenticating step */}
        {checkoutStep === "authenticating" && (
          <div className="max-w-md mx-auto text-center space-y-4 py-12">
            <RefreshCw className="w-10 h-10 text-cyan-400 animate-spin mx-auto" />
            <h3 className="text-xs font-black uppercase tracking-widest text-[#22d3ee]">SECURE PROTOCOL PROCESSING...</h3>
            <p className="text-[10px] text-stone-450 leading-relaxed max-w-xs mx-auto">
              We are negotiating the subscription plan write with your Cloud Firestore user document under cryptographic envelope.
            </p>
          </div>
        )}

        {/* Success complete screen */}
        {checkoutStep === "success" && (
          <div className="max-w-md mx-auto text-center space-y-6 bg-cyan-950/5 border border-cyan-400/30 p-8 rounded-2xl shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-cyan-400/10 border border-cyan-400 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(34,211,238,0.2)]">
              <CheckCircle2 className="w-6 h-6 text-cyan-400" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xs font-black uppercase tracking-widest text-[#22d3ee]">PLAN SECURITY COMPLETED</h3>
              <p className="text-[11px] text-stone-300 leading-normal text-justify">
                Congratulations. Your security tokens have been successfully issued and injected. Your Client subsystem role is officially catalogued.
              </p>
            </div>

            <button
               onClick={() => {
                 if (selectedPlanId) {
                   onPlanActivated(selectedPlanId);
                 }
               }}
              className="w-full py-3 bg-[#22d3ee] text-black font-black text-xs uppercase tracking-widest rounded-xl hover:bg-cyan-300 transition-all cursor-pointer"
            >
              Access Client Dashboard
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
