import React, { useState } from "react";
import { Check, X, Shield, Award, HelpCircle, UserCheck, KeyRound, Fingerprint, Lock, Layers } from "lucide-react";

interface BadgeData {
  id: string;
  name: string;
  email: string;
  keyCode: string;
  clearance: string;
  avatarColor: string;
  regDate: string;
}

interface ClientProps {
  isLightMode: boolean;
  onNavigate: (tabId: string) => void;
  showToast: (msg: string) => void;
  // User badge data from parent
  isLoggedIn: boolean;
  activeBadge: BadgeData;
  setIsLoggedIn: (val: boolean) => void;
}

export function NexusClient({ isLightMode, onNavigate, showToast, isLoggedIn, activeBadge, setIsLoggedIn }: ClientProps) {
  const [selectedPlanDetails, setSelectedPlanDetails] = useState<string | null>(null);

  const planOptions = [
    {
      id: "starter",
      title: "Starter Plan",
      price: "€99",
      period: "/month",
      tagline: "Ideal for growing startups.",
      perks: ["✓ Secure Device Identity", "✓ Real-time Monitoring"],
      absents: ["Advanced Analytics", "24/7 Support", "API Access", "Custom Integration"]
    },
    {
      id: "professional",
      title: "Professional Plan",
      price: "€299",
      period: "/month",
      tagline: "Perfect for scaling businesses.",
      isBest: true,
      perks: ["✓ Secure Device Identity", "✓ Real-time Monitoring", "✓ Advanced Analytics", "✓ 24/7 Support"],
      absents: ["API Access", "Custom Integration"]
    },
    {
      id: "enterprise",
      title: "Enterprise Plan",
      price: "€599",
      period: "/month",
      tagline: "For highly demanding operators.",
      perks: ["✓ Secure Device Identity", "✓ Real-time Monitoring", "✓ Advanced Analytics", "✓ 24/7 Support", "✓ API Access", "✓ Custom Integration"],
      absents: []
    }
  ];

  const handleSubscribe = (title: string) => {
    setSelectedPlanDetails(title);
    showToast(`Affiliation finalized for plan: ${title}`);
  };

  return (
    <div className="space-y-10 relative z-10 animate-fade-in text-left">
      
      {/* 1. PLANS HEADER (Matching Image 7) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-8">
          <span className="font-mono text-[9px] text-[#ff5a00] uppercase font-black tracking-widest">[ SAAS SERVICE OFFERS ]</span>
          <h2 className="text-3xl font-black text-white font-sans uppercase tracking-tight mt-1">
            Nexus Pro Pricing Plans
          </h2>
          <p className="text-stone-500 text-xs">
            FixLab - SaaS Pricing and Plans. Orchestration slots tailored for all scales of operation.
          </p>
        </div>

        {/* Floating operative logout or sign indicator */}
        <div className="lg:col-span-4 flex justify-end">
          {isLoggedIn ? (
            <div className="flex items-center gap-3 bg-[#ff5a00]/5 border border-[#ff5a00]/20 p-3.5 rounded-2xl">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <div className="text-left font-mono text-[9px]">
                <div className="font-bold text-white uppercase">{activeBadge.name}</div>
                <div className="text-stone-500">ID_REF: {activeBadge.id}</div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => { onNavigate("security"); showToast("Certification screen required."); }}
              className="bg-neutral-900 border border-neutral-800 text-zinc-300 font-mono text-[9.5px] font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl hover:text-[#ff5a00]"
            >
              Link Operative Badge
            </button>
          )}
        </div>
      </div>

      {/* 2. THREE SAAS PLAN CARDS GRID (Image 7 Layout) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        
        {planOptions.map(plan => (
          <div
            key={plan.id}
            className={`p-8 rounded-[2.2rem] flex flex-col justify-between text-left relative overflow-hidden transition-all duration-300 shadow-xl ${
              plan.isBest 
                ? "bg-[#0f0923] border border-[#ff5a00]/50 shadow-[0_4px_30px_rgba(255,90,0,0.15)] scale-[1.02]" 
                : "bg-neutral-950/70 border border-neutral-900"
            }`}
          >
            
            {/* Standard "Best option/Most Popular" sticker banner from screen */}
            {plan.isBest && (
              <div className="absolute top-4 right-4 bg-[#ff5a00] text-white font-mono text-[8px] font-black uppercase px-2.5 py-1 rounded-md tracking-wider">
                Recommended
              </div>
            )}

            <div>
              <div className="text-[#ff5a00] font-sans font-black text-sm uppercase tracking-wide">
                {plan.title}
              </div>

              <div className="flex items-baseline gap-1 mt-4">
                <span className="text-4xl font-extrabold text-white tracking-tight">{plan.price}</span>
                <span className="text-stone-500 text-xs font-mono">{plan.period}</span>
              </div>

              <p className="text-stone-500 text-xs mt-1.5 font-sans">
                {plan.tagline}
              </p>

              {/* Perks checking list */}
              <div className="space-y-2.5 mt-6 pt-6 border-t border-neutral-900">
                {plan.perks.map((perk, pi) => (
                  <div key={pi} className="flex items-center gap-2.5 text-xs text-stone-300">
                    <Check className="w-4 h-4 text-[#ff5a00] shrink-0" />
                    <span>{perk.replace("✓ ", "")}</span>
                  </div>
                ))}
                
                {plan.absents.map((abs, ai) => (
                  <div key={ai} className="flex items-center gap-2.5 text-xs text-stone-600">
                    <X className="w-4 h-4 text-stone-850 shrink-0" />
                    <span className="line-through">{abs}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleSubscribe(plan.title)}
              className="mt-8 w-full font-mono text-[9px] font-black uppercase tracking-widest bg-gradient-to-r from-[#ff7e00] to-[#ff5a00] text-white py-4 rounded-xl hover:shadow-[0_4px_20px_rgba(255,90,0,0.3)] transition-all cursor-pointer"
            >
              SUBSCRIBE TO PLAN
            </button>

          </div>
        ))}

      </div>

      {/* 3. COMPARISON MATRIX FEATURE DETAILS TABLE (Image 7 bottom table block) */}
      <div className="pt-6 text-left space-y-4">
        <h3 className="text-xs font-mono font-black text-white uppercase tracking-widest text-center">// Exhaustive Feature Matrix //</h3>
        
        <div className="overflow-x-auto rounded-3xl border border-neutral-900 bg-[#090715]/40 backdrop-blur-md">
          <table className="w-full text-left font-sans text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-900/80 bg-neutral-950 font-mono text-[9px] text-[#ff5a00] uppercase font-bold tracking-widest">
                <th className="p-4 pl-6">Technical Features</th>
                <th className="p-4">Starter</th>
                <th className="p-4">Professional</th>
                <th className="p-4">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              
              {/* Row 1: Limit */}
              <tr className="border-b border-neutral-900/60 hover:bg-[#ff5a00]/5 transition-colors">
                <td className="p-4 pl-6 font-bold text-white">Device Limit</td>
                <td className="p-4 text-stone-400 font-mono">10 Devices</td>
                <td className="p-4 text-[#ff5a00] font-mono font-bold">100 Devices</td>
                <td className="p-4 text-emerald-400 font-mono font-black">Unlimited</td>
              </tr>

              {/* Row 2: Basic telemetry */}
              <tr className="border-b border-neutral-900/60 hover:bg-[#ff5a00]/5 transition-colors">
                <td className="p-4 pl-6 font-bold text-white">Basic Analytics</td>
                <td className="p-4"><Check className="w-4 h-4 text-[#ff5a00]" /></td>
                <td className="p-4"><Check className="w-4 h-4 text-[#ff5a00]" /></td>
                <td className="p-4"><Check className="w-4 h-4 text-[#ff5a00]" /></td>
              </tr>

              {/* Row 3: Advanced analytics */}
              <tr className="border-b border-neutral-900/60 hover:bg-[#ff5a00]/5 transition-colors">
                <td className="p-4 pl-6 font-bold text-white">Advanced Analytics</td>
                <td className="p-4"><X className="w-4 h-4 text-stone-700" /></td>
                <td className="p-4"><Check className="w-4 h-4 text-[#ff5a00]" /></td>
                <td className="p-4"><Check className="w-4 h-4 text-[#ff5a00]" /></td>
              </tr>

              {/* Row 4: Support */}
              <tr className="border-b border-neutral-900/60 hover:bg-[#ff5a00]/5 transition-colors">
                <td className="p-4 pl-6 font-bold text-white">24/7 Support</td>
                <td className="p-4 font-mono text-zinc-500">Email Only</td>
                <td className="p-4 font-mono text-[#ff5a00] font-bold">Priority Response</td>
                <td className="p-4 font-mono text-emerald-400 font-black">Dedicated Hotline</td>
              </tr>

              {/* Row 5: API Access */}
              <tr className="border-b border-neutral-900/60 hover:bg-[#ff5a00]/5 transition-colors">
                <td className="p-4 pl-6 font-bold text-white">API Access</td>
                <td className="p-4"><X className="w-4 h-4 text-stone-700" /></td>
                <td className="p-4"><X className="w-4 h-4 text-stone-700" /></td>
                <td className="p-4"><Check className="w-4 h-4 text-[#ff5a00]" /></td>
              </tr>

              {/* Row 6: Dedicated manager */}
              <tr className="border-b border-neutral-900/60 hover:bg-[#ff5a00]/5 transition-colors">
                <td className="p-4 pl-6 font-bold text-white">Dedicated Account Manager</td>
                <td className="p-4"><X className="w-4 h-4 text-stone-700" /></td>
                <td className="p-4"><X className="w-4 h-4 text-stone-700" /></td>
                <td className="p-4"><Check className="w-4 h-4 text-[#ff5a00]" /></td>
              </tr>

              {/* Row 7: Custom integrations */}
              <tr className="border-b border-neutral-900/60 hover:bg-[#ff5a00]/5 transition-colors">
                <td className="p-4 pl-6 font-bold text-white">Custom Integrations</td>
                <td className="p-4"><X className="w-4 h-4 text-stone-700" /></td>
                <td className="p-4 font-mono text-zinc-500">Self-serve</td>
                <td className="p-4"><Check className="w-4 h-4 text-[#ff5a00]" /></td>
              </tr>

              {/* Row 8: Security Audit */}
              <tr className="hover:bg-[#ff5a00]/5 transition-colors">
                <td className="p-4 pl-6 font-bold text-white">Security Audits</td>
                <td className="p-4 font-mono text-zinc-500">Annual</td>
                <td className="p-4 font-mono text-[#ff5a00]">Bi-Annual</td>
                <td className="p-4 font-mono text-emerald-400">Continuous</td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>

      {/* Subscription confirmation popup modal overlay */}
      {selectedPlanDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in text-left">
          <div className="w-full max-w-sm rounded-[2rem] border border-[#ff5a00]/30 bg-[#070512] p-6 text-center space-y-4">
            
            <div className="w-12 h-12 rounded-full bg-[#ff5a00]/10 border border-[#ff5a00]/25 flex items-center justify-center text-[#ff5a00] mx-auto">
              <Shield className="w-6 h-6 animate-pulse" />
            </div>

            <h3 className="text-base font-black text-white uppercase tracking-tight">
              Subscription Validated
            </h3>
            
            <p className="text-stone-400 text-xs">
              Your affiliation to the <span className="text-[#ff5a00] font-bold">{selectedPlanDetails}</span> plan has been successfully recorded on the local frame.
            </p>

            <button
              onClick={() => setSelectedPlanDetails(null)}
              className="w-full font-mono text-[9px] font-black uppercase tracking-widest bg-[#ff5a00] text-white py-3 rounded-xl transition-all hover:bg-[#ff7e00]"
            >
              Close notification
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

