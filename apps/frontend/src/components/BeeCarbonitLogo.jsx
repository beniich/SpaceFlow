export default function BeeCarbonatLogo({ size = 36, showText = true, className = '' }) {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Icon Badge */}
      <div
        className="relative shrink-0 flex items-center justify-center rounded-xl overflow-hidden"
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-[0_0_8px_rgba(0,219,231,0.3)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="badgeBorder" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#f38020" />
              <stop offset="100%" stopColor="#00dbe7" />
            </linearGradient>
            <linearGradient id="towerGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ffb787" />
              <stop offset="50%" stopColor="#f38020" />
              <stop offset="100%" stopColor="#00dbe7" />
            </linearGradient>
          </defs>

          {/* Rounded Box Frame */}
          <rect
            x="6"
            y="6"
            width="88"
            height="88"
            rx="20"
            stroke="url(#badgeBorder)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Center Tower Spire */}
          <line x1="50" y1="16" x2="50" y2="24" stroke="#00dbe7" strokeWidth="2.5" strokeLinecap="round" />
          
          {/* Main Tower Roof */}
          <path
            d="M36 36 L50 24 L64 36"
            stroke="url(#towerGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Main Center Building */}
          <path
            d="M36 36 L36 84 M64 36 L64 84"
            stroke="url(#towerGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Left Wing */}
          <path
            d="M24 52 L36 52 M24 52 L24 84"
            stroke="#f38020"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Right Wing */}
          <path
            d="M64 52 L76 52 M76 52 L76 84"
            stroke="#00dbe7"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Left Hexagonal Honeycomb pattern (Orange) */}
          <path
            d="M44 42 L48 44.5 L48 49.5 L44 52 L40 49.5 L40 44.5 Z"
            stroke="#f38020"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M44 54 L48 56.5 L48 61.5 L44 64 L40 61.5 L40 56.5 Z"
            stroke="#f38020"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M44 66 L48 68.5 L48 73.5 L44 76 L40 73.5 L40 68.5 Z"
            stroke="#f38020"
            strokeWidth="1.5"
            fill="none"
          />

          {/* Right Circuit Traces (Cyan) */}
          <path
            d="M56 42 L56 50 L60 54 L60 62"
            stroke="#00dbe7"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="60" cy="62" r="1.5" fill="#00dbe7" />

          <path
            d="M56 56 L56 68 L52 72 L52 80"
            stroke="#00dbe7"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="52" cy="80" r="1.5" fill="#00dbe7" />

          {/* Base line */}
          <line x1="20" y1="84" x2="80" y2="84" stroke="url(#badgeBorder)" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>

      {/* Brand Text */}
      {showText && (
        <div className="flex items-center text-xl font-bold tracking-tight">
          <span className="text-[#f38020]">Bee</span>
          <span className="text-[#00dbe7]">Carbonat</span>
        </div>
      )}
    </div>
  );
}

export { BeeCarbonatLogo as BeeCarbonatLogo };

