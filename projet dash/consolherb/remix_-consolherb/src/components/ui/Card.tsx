import React from 'react';

interface CardProps {
  title?: string;
  subtitle?: string;
  badge?: string;
  children: React.ReactNode;
  className?: string;
  headerRight?: React.ReactNode;
}

export function Card({ title, subtitle, badge, children, className = '', headerRight }: CardProps) {
  const hasHeader = title || subtitle || badge || headerRight;

  return (
    <div
      className={[
        'bg-[#122131] border border-[#334155] rounded-[4px] shadow-md',
        className,
      ].join(' ')}
    >
      {hasHeader && (
        <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4 border-b border-[#334155]/60">
          <div className="flex-1 min-w-0">
            {title && (
              <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-white leading-tight truncate">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-xs text-[#c5c6cd] mt-1 leading-relaxed">{subtitle}</p>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {badge && (
              <span className="text-[10px] font-mono px-2 py-1 bg-[#0a192f] border border-slate-700 text-teal-400 rounded-sm uppercase">
                {badge}
              </span>
            )}
            {headerRight}
          </div>
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}
