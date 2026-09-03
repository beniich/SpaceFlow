export default function BeeCarbonatLogo({ size = 36, showText = true, className = '' }) {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Icon Badge - Vercel Monochrome Bee */}
      <div
        className="relative shrink-0 flex items-center justify-center rounded-lg overflow-hidden bg-[#000000] border border-[#222222]"
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-[85%] h-[85%]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="beeVercelMain" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#ededed" />
            </linearGradient>
            <linearGradient id="beeVercelLight" x1="0" y1="100" x2="100" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#a1a1a1" />
              <stop offset="100%" stopColor="#ededed" />
            </linearGradient>
          </defs>

          <g stroke="url(#beeVercelMain)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none">
            {/* Tête */}
            <circle cx="50" cy="30" r="8" fill="url(#beeVercelMain)" />
            {/* Antennes */}
            <path d="M46 24 L40 16 M54 24 L60 16" />
            
            {/* Corps (Abdomen rayé) */}
            <path d="M42 42 L58 42" strokeWidth="5" />
            <path d="M40 52 L60 52" strokeWidth="5" />
            <path d="M42 62 L58 62" strokeWidth="5" />
            <path d="M40 36 Q50 90 50 85 Q50 90 60 36 Z" fill="url(#beeVercelMain)" fillOpacity="0.1" strokeWidth="3" />
            <path d="M50 85 L50 92" strokeWidth="3" stroke="url(#beeVercelLight)" /> {/* Dard */}
            
            {/* Ailes Gauche */}
            <path d="M40 40 Q20 30 25 50 Q30 70 40 50 Z" stroke="url(#beeVercelLight)" strokeWidth="3" />
            <path d="M40 40 Q25 20 15 35 Q10 50 40 45 Z" stroke="url(#beeVercelLight)" strokeWidth="2" />
            
            {/* Ailes Droite */}
            <path d="M60 40 Q80 30 75 50 Q70 70 60 50 Z" stroke="url(#beeVercelLight)" strokeWidth="3" />
            <path d="M60 40 Q75 20 85 35 Q90 50 60 45 Z" stroke="url(#beeVercelLight)" strokeWidth="2" />
          </g>
        </svg>
      </div>

      {/* Brand Text */}
      {showText && (
        <div className="flex flex-col whitespace-nowrap overflow-hidden transition-all duration-300">
          <div className="flex items-center gap-1.5">
            <span className="font-sans font-bold text-[15px] tracking-tight text-[#ededed] leading-none">
              BeeCarbonat
            </span>
          </div>
          <span className="font-mono text-[9px] font-medium text-[#707070] uppercase tracking-[0.12em] leading-tight mt-0.5">
            Spider CAFM
          </span>
        </div>
      )}
    </div>
  );
}
