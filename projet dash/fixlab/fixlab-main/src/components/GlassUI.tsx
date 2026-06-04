import React from "react";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = "", id }) => (
  <div 
    id={id}
    className={`bg-[#1a0e41]/85 backdrop-blur-md border border-[#3e2389]/40 rounded-[2rem] shadow-[0_12px_45px_rgba(76,29,149,0.25)] hover:border-[#22d3ee]/25 transition-all duration-300 ${className}`}
  >
    {children}
  </div>
);

interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "gold" | "red";
  className?: string;
}

export const NeonButton: React.FC<NeonButtonProps> = ({ 
  children, 
  variant = "primary", 
  className = "", 
  ...props 
}) => {
  const variants = {
    primary: "bg-[#24175e] border-cyan-400/30 text-[#22d3ee] hover:bg-[#2e1d7a] hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(34,211,238,0.25)]",
    secondary: "bg-white/5 border-purple-500/20 text-[#7c6bb5] hover:bg-white/10 hover:border-[#7c6bb5] hover:text-white",
    gold: "bg-amber-500/10 border-amber-400/35 text-amber-300 hover:bg-amber-500/25 hover:border-amber-400 hover:shadow-[0_0_15px_rgba(245,158,11,0.25)]",
    red: "bg-rose-500/10 border-rose-500/35 text-[#ff5c00] hover:bg-rose-500/25 hover:border-rose-400 hover:shadow-[0_0_15px_rgba(255,92,0,0.25)]"
  };
  return (
    <button 
      className={`px-6 py-2.5 border rounded-xl transition-all duration-350 font-mono text-xs font-bold tracking-wider uppercase cursor-pointer outline-none ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
