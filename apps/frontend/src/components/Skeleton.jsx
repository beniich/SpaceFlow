import React from 'react';

export function Skeleton({ className = '', variant = 'rectangular', ...props }) {
  const baseClasses = "bg-zinc-800/50 animate-pulse border border-zinc-700/30";
  
  const variants = {
    rectangular: "rounded",
    circular: "rounded-full",
    text: "rounded h-4 w-full"
  };

  return (
    <div 
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...props}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-xl flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Skeleton variant="circular" className="w-12 h-12" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" className="w-1/3" />
          <Skeleton variant="text" className="w-1/4" />
        </div>
      </div>
      <div className="space-y-2 mt-4">
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <Skeleton variant="text" className="w-5/6" />
      </div>
      <div className="mt-4 pt-4 border-t border-zinc-800 flex justify-between">
        <Skeleton variant="text" className="w-1/4" />
        <Skeleton variant="rectangular" className="w-20 h-8" />
      </div>
    </div>
  );
}
