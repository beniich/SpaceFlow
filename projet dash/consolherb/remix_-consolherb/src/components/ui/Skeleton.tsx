import React from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
type SkeletonVariant = 'text' | 'card' | 'chart' | 'circular' | 'rect';

interface SkeletonProps {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
  className?: string;
  lines?: number; // for 'text' variant: number of lines
}

/**
 * Generic skeleton shimmer component.
 * Uses a pure CSS animation — no extra dependencies.
 */
export function Skeleton({
  variant = 'rect',
  width,
  height,
  className = '',
  lines = 3,
}: SkeletonProps) {
  const base =
    'bg-white/5 rounded-lg overflow-hidden relative before:absolute before:inset-0 ' +
    'before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent ' +
    'before:animate-[shimmer_1.5s_infinite] before:translate-x-[-100%]';

  if (variant === 'circular') {
    const size = width ?? height ?? '2.5rem';
    return (
      <span
        className={`${base} rounded-full block shrink-0 ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  if (variant === 'text') {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, i) => (
          <span
            key={i}
            className={`${base} block h-3 rounded`}
            style={{ width: i === lines - 1 ? '60%' : '100%' }}
          />
        ))}
      </div>
    );
  }

  return (
    <span
      className={`${base} block ${className}`}
      style={{
        width: width ?? '100%',
        height: height ?? (variant === 'card' ? '7rem' : variant === 'chart' ? '10rem' : '1rem'),
      }}
    />
  );
}

/**
 * Full dashboard loading skeleton — mirrors the real dashboard grid layout.
 */
export function DashboardSkeleton() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton variant="text" lines={2} width="12rem" />
        <Skeleton variant="rect" width="6rem" height="2rem" />
      </div>

      {/* 4-column node cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white/5 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Skeleton variant="circular" width="2rem" height="2rem" />
              <Skeleton variant="text" lines={1} width="5rem" />
            </div>
            <Skeleton variant="rect" height="3rem" />
            <Skeleton variant="text" lines={2} />
          </div>
        ))}
      </div>

      {/* Chart + terminal row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Skeleton variant="chart" className="rounded-2xl" />
        <Skeleton variant="chart" className="rounded-2xl" />
      </div>
    </div>
  );
}

// ─── Add shimmer keyframe to global CSS (inject once) ────────────────────────
if (typeof document !== 'undefined') {
  const styleId = 'agromaitre-skeleton-keyframes';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      @keyframes shimmer {
        0%   { transform: translateX(-100%); }
        100% { transform: translateX(100%);  }
      }
    `;
    document.head.appendChild(style);
  }
}

export default Skeleton;
