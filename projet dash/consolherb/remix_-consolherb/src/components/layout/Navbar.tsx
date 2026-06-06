import { NavLink } from 'react-router-dom';
import { Award } from 'lucide-react';

interface NavbarProps {
  onSocBadgeClick: () => void;
}

const navLinks = [
  { to: '/portails', label: 'Portails', emoji: '🌾' },
  { to: '/modules', label: 'Modules', emoji: null },
  { to: '/dashboard', label: 'Dashboard', emoji: null },
  { to: '/infra', label: 'Infra', emoji: null },
  { to: '/logs', label: 'Logs', emoji: null },
  { to: '/settings', label: 'Settings', emoji: null },
];

export function Navbar({ onSocBadgeClick }: NavbarProps) {
  return (
    <nav
      className="flex flex-row justify-between items-center mb-6 border-b border-slate-800 pb-2 gap-2 text-[10px]"
      id="main-nav"
    >
      {/* Brand identity */}
      <div className="flex items-center gap-1.5 shrink-0">
        <div className="w-5 h-5 bg-[#4de082] rounded-xs flex items-center justify-center text-[#003919] font-bold font-mono text-[9px] tracking-tight shadow-sm select-none">
          CC
        </div>
        <span className="text-[11px] font-bold tracking-tight uppercase font-mono hidden xs:inline text-white">
          Cyber-Compliance <span className="text-[#4de082]">Arch</span>
        </span>
      </div>

      {/* Navigation links */}
      <div className="flex flex-wrap items-center justify-center gap-1 text-[9.5px] font-semibold uppercase font-mono bg-[#0c1825]/80 border border-slate-800/80 p-0.5 rounded-xs shrink-1 max-w-full">
        {navLinks.map(({ to, label, emoji }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              [
                'px-1.5 py-0.5 rounded-xs transition-all pointer-events-auto cursor-pointer flex items-center gap-0.5',
                isActive
                  ? to === '/portails'
                    ? 'bg-[#122131] border border-[#4de082]/50 text-[#4de082] shadow-xs font-bold'
                    : 'bg-[#122131] border border-slate-700 text-white font-bold'
                  : to === '/portails'
                  ? 'text-[#4de082] hover:text-[#7bf0a6]'
                  : 'text-[#c5c6cd] hover:text-white',
              ].join(' ')
            }
          >
            {emoji && <span>{emoji}</span>}
            {label}
          </NavLink>
        ))}
      </div>

      {/* Right section: SOC badge + avatar */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={onSocBadgeClick}
          className="text-[8.5px] font-mono bg-[#0a192f] px-1.5 py-0.5 border border-[#334155] text-[#4de082] rounded-xs hover:border-[#4de082] transition active:scale-95 cursor-pointer flex items-center gap-0.5"
          id="soc-compliance-badge"
        >
          <Award className="w-2.5 h-2.5 text-[#4de082]" />
          <span className="hidden sm:inline">SOC 2 CERTIFIED</span>
          <span className="sm:hidden text-[7.5px]">SOC 2</span>
        </button>

        <div
          className="w-5 h-5 rounded-full bg-[#1c2b3c] border border-slate-700 flex items-center justify-center font-mono text-[9px] text-white uppercase font-bold select-none cursor-help"
          title="Identity: Security Administrator // adambeniich7@gmail.com"
          id="admin-avatar"
        >
          AB
        </div>
      </div>
    </nav>
  );
}
