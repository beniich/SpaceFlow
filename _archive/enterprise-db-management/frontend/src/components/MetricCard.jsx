// MetricCard.jsx
import React from "react";

export default function MetricCard({ title, value, unit, icon, badge, sub }) {
    return (
        <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-panel-dark border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">{title}</p>
                {icon && (
                    <span className="material-symbols-outlined text-primary bg-primary/10 p-1 rounded-lg text-lg">
                        {icon}
                    </span>
                )}
            </div>

            <p className="text-3xl font-bold text-slate-900 dark:text-white">
                {value}
                {unit && <span className="text-sm font-normal text-slate-500">{unit}</span>}
            </p>

            {badge && (
                <div className="flex items-center gap-2 text-xs font-semibold">
                    <span className="px-2 py-0.5 rounded bg-green-500/10 text-green-500">
                        {badge}
                    </span>
                    {sub && <span className="text-slate-400">{sub}</span>}
                </div>
            )}
        </div>
    );
}
