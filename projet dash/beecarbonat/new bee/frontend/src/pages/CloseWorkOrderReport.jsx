import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function CloseWorkOrderReport() {
  const navigate = useNavigate();
  return (
    <div className="bg-surface text-on-surface font-body-md h-screen flex flex-col antialiased relative overflow-hidden">
      <header className="bg-surface-container-low fixed top-0 w-full z-50 h-[64px] border-b border-border-muted flex items-center justify-between px-[24px]">
        <button onClick={() => navigate(-1)} className="text-on-surface-variant hover:bg-surface-container-highest transition-colors active:scale-95 duration-100 p-2 -ml-2 rounded-full flex items-center justify-center">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="font-headline-sm text-headline-sm text-on-surface">Close Work Order</h1>
        <button className="text-on-surface-variant hover:bg-surface-container-highest transition-colors active:scale-95 duration-100 p-2 -mr-2 rounded-full flex items-center justify-center">
          <span className="material-symbols-outlined">more_vert</span>
        </button>
      </header>
      
      <main className="flex-1 mt-[64px] mb-[88px] p-[16px] overflow-y-auto flex flex-col gap-6 w-full max-w-md mx-auto">
        <div className="relative bg-surface-card border border-border-muted rounded-xl p-4 overflow-hidden flex flex-col gap-1">
          <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-warning"></div>
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-warning/5 to-transparent pointer-events-none"></div>
          <span className="font-label-sm text-label-sm text-warning uppercase tracking-wider pl-2 z-10 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">warning</span> Priority Intervention
          </span>
          <div className="flex flex-col pl-2 z-10">
            <span className="font-label-md text-label-md text-on-surface-variant opacity-70">ID: WO-8492-AX</span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface mt-1">Primary Cooling Tower Flow Disruption</h2>
          </div>
        </div>
        
        <form className="flex flex-col gap-6">
          <div className="flex flex-col gap-2 relative">
            <label className="font-label-md text-label-md text-on-surface-variant flex items-center gap-2" htmlFor="outcome_status">
              <span className="material-symbols-outlined text-[16px]">check_circle</span> Outcome Status
            </label>
            <div className="relative group">
              <select className="w-full bg-surface-container border border-border-muted rounded-lg px-4 py-3.5 text-body-md text-on-surface focus:border-primary-fixed-dim focus:ring-1 focus:ring-primary-fixed-dim focus:outline-none appearance-none transition-colors group-hover:border-border-active" id="outcome_status" defaultValue="escalated">
                <option value="resolved">System Restored (Nominal Parameters)</option>
                <option value="mitigated">Mitigated (Temporary Fix Applied)</option>
                <option value="escalated">Escalated (Requires T3 Support)</option>
                <option value="parts">Pending Parts Procurement</option>
              </select>
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none group-hover:text-on-surface transition-colors">expand_more</span>
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="font-label-md text-label-md text-on-surface-variant flex items-center gap-2" htmlFor="duration_input">
              <span className="material-symbols-outlined text-[16px]">schedule</span> Active Intervention Time (Hrs)
            </label>
            <div className="flex items-center gap-3">
              <button className="w-14 h-14 rounded-lg bg-surface-container border border-border-muted flex items-center justify-center text-on-surface hover:bg-surface-container-highest active:scale-95 transition-all focus:outline-none focus:ring-1 focus:ring-primary-fixed-dim" type="button">
                <span className="material-symbols-outlined text-[20px]">remove</span>
              </button>
              <input className="flex-1 bg-surface-container border border-border-muted rounded-lg px-4 h-14 text-center text-headline-sm font-headline-sm text-on-surface focus:border-primary-fixed-dim focus:ring-1 focus:ring-primary-fixed-dim focus:outline-none transition-colors" id="duration_input" min="0" step="0.5" type="number" defaultValue="3.5"/>
              <button className="w-14 h-14 rounded-lg bg-surface-container border border-border-muted flex items-center justify-center text-on-surface hover:bg-surface-container-highest active:scale-95 transition-all focus:outline-none focus:ring-1 focus:ring-primary-fixed-dim" type="button">
                <span className="material-symbols-outlined text-[20px]">add</span>
              </button>
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-end">
              <label className="font-label-md text-label-md text-on-surface-variant flex items-center gap-2" htmlFor="work_description">
                <span className="material-symbols-outlined text-[16px]">notes</span> Work Description
              </label>
              <span className="font-label-sm text-label-sm text-error bg-error/10 px-2 py-0.5 rounded uppercase">Required</span>
            </div>
            <div className="relative group">
              <textarea className="w-full bg-surface-container border border-border-muted rounded-lg px-4 py-3 text-body-md text-on-surface focus:border-primary-fixed-dim focus:ring-1 focus:ring-primary-fixed-dim focus:outline-none transition-colors resize-none placeholder:text-on-surface-variant/40 group-hover:border-border-active" id="work_description" placeholder="Detail the root cause analysis, actions performed, and current operational state. Format clearly for shift handover logs." rows="5" defaultValue="Inspected primary manifold. Detected pressure anomaly at valve 4B resulting in flow constriction. Attempted manual override but actuator is unresponsive. Locked out tagged out unit. Escalated to Tier 3 mechanics for actuator replacement."></textarea>
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-border-muted rounded-br-lg pointer-events-none opacity-50 group-hover:border-border-active transition-colors"></div>
            </div>
          </div>
        </form>
      </main>
      
      <div className="fixed bottom-0 w-full bg-surface-container-low border-t border-border-muted px-[16px] py-[16px] z-50 shadow-[0_-10px_30px_-10px_rgba(0,0,0,0.5)]">
        <div className="max-w-md mx-auto">
          <button onClick={() => navigate('/close-work-order-photo')} className="w-full bg-primary-fixed-dim text-on-primary font-headline-sm text-headline-sm h-14 rounded-xl flex items-center justify-center gap-2 hover:bg-primary-fixed transition-colors active:scale-[0.98] duration-150 shadow-[0_0_15px_rgba(192,193,255,0.15)]">
            <span>Next: Attach Photos</span>
            <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>add_a_photo</span>
          </button>
        </div>
      </div>
    </div>
  );
}
