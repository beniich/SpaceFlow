export default function BeeCarbonatLogo({ size = 36, showText = true, className = '' }) {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Icon Badge - Golden Bee */}
      <div
        className="relative shrink-0 flex items-center justify-center rounded-xl overflow-hidden bg-[#0D0E12] border border-amber-900/30"
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-[85%] h-[85%] drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="beeGoldMain" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FBBF24" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
            <linearGradient id="beeGoldLight" x1="0" y1="100" x2="100" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FDE68A" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
          </defs>

          <g stroke="url(#beeGoldMain)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none">
            {/* Tête */}
            <circle cx="50" cy="30" r="8" fill="url(#beeGoldMain)" />
            {/* Antennes */}
            <path d="M46 24 L40 16 M54 24 L60 16" />
            
            {/* Corps (Abdomen rayé) */}
            <path d="M42 42 L58 42" strokeWidth="5" />
            <path d="M40 52 L60 52" strokeWidth="5" />
            <path d="M42 62 L58 62" strokeWidth="5" />
            <path d="M40 36 Q50 90 50 85 Q50 90 60 36 Z" fill="url(#beeGoldMain)" fillOpacity="0.2" strokeWidth="3" />
            <path d="M50 85 L50 92" strokeWidth="3" stroke="url(#beeGoldLight)" /> {/* Dard */}
            
            {/* Ailes Gauche */}
            <path d="M40 40 Q20 30 25 50 Q30 70 40 50 Z" stroke="url(#beeGoldLight)" strokeWidth="3" />
            <path d="M40 40 Q25 20 15 35 Q10 50 40 45 Z" stroke="url(#beeGoldLight)" strokeWidth="2" />
            
            {/* Ailes Droite */}
            <path d="M60 40 Q80 30 75 50 Q70 70 60 50 Z" stroke="url(#beeGoldLight)" strokeWidth="3" />
            <path d="M60 40 Q75 20 85 35 Q90 50 60 45 Z" stroke="url(#beeGoldLight)" strokeWidth="2" />
          </g>
        </svg>
      </div>

      {/* Brand Text */}
      {showText && (
        <div className="flex flex-col whitespace-nowrap overflow-hidden transition-all duration-300">
          <div className="flex items-center gap-1.5">
            <span className="font-sans font-extrabold text-[16px] tracking-tight text-white leading-none">
              BeeCarbonat
            </span>
            <div className="h-1.5 w-1.5 rounded-full bg-amber-500 shadow-[0_0_6px_#F59E0B]"></div>
          </div>
          <span className="font-mono text-[9px] font-bold text-amber-500/80 uppercase tracking-[0.1em] leading-tight">
            Spider CAFM
          </span>
        </div>
      )}
    </div>
  );
}
