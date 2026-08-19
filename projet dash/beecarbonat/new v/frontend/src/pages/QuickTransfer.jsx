import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function QuickTransfer() {
  const navigate = useNavigate();
  return (
    <div className="antialiased min-h-screen flex flex-col font-body-md text-body-md relative overflow-x-hidden bg-surface text-on-surface">
      <header className="fixed top-0 w-full z-50 bg-surface dark:bg-surface-dim border-b border-border-muted flat no-shadows transition-colors duration-200 active:scale-95 flex items-center justify-between px-margin-page h-header-height">
        <button onClick={() => navigate(-1)} className="text-primary dark:text-primary-fixed hover:bg-surface-container-high dark:hover:bg-surface-variant p-2 rounded-full transition-colors flex items-center justify-center">
          <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0"}}>arrow_back</span>
        </button>
        <h1 className="font-headline-md text-headline-md font-bold text-primary dark:text-primary-fixed">Transfert Rapide</h1>
        <div className="w-10"></div>
      </header>
      
      <main className="flex-grow pt-[80px] pb-[100px] px-container-padding flex flex-col gap-widget-gap max-w-md mx-auto w-full relative z-10">
        <button className="w-full bg-surface-container hover:bg-surface-container-high active:bg-surface-container-highest border border-border-muted hover:border-border-active transition-all duration-200 rounded-xl p-6 flex flex-col items-center justify-center gap-4 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="p-4 rounded-full bg-primary-container text-on-primary-container shadow-[0_0_15px_rgba(192,193,255,0.2)]">
            <span className="material-symbols-outlined text-4xl" style={{fontVariationSettings: "'FILL' 1"}}>qr_code_scanner</span>
          </div>
          <div className="text-center">
            <span className="block font-headline-sm text-headline-sm text-on-surface mb-1">Scan Part Barcode</span>
            <span className="block font-body-sm text-body-sm text-on-surface-variant">Align QR or Barcode in frame</span>
          </div>
        </button>
        
        <div className="rounded-lg p-4 relative mt-2 border border-border-muted" style={{background: "linear-gradient(180deg, rgba(15, 23, 42, 0.8) 0%, rgba(15, 23, 42, 0.6) 100%)", backdropFilter: "blur(12px)"}}>
          <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-primary shadow-[0_0_8px_theme('colors.primary')] rounded-l-lg"></div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1 block">Scanned Item</span>
              <h2 className="font-headline-sm text-headline-sm text-on-surface">Primary Control Board V2</h2>
              <span className="font-label-md text-label-md text-primary mt-1 block">SKU: PCB-8892-V2</span>
            </div>
            <div className="bg-surface-container-low px-2 py-1 rounded border border-border-muted">
              <span className="font-label-sm text-label-sm text-success">In Stock: 4</span>
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-border-muted pt-4 mt-2">
            <span className="font-body-sm text-body-sm text-on-surface-variant">Transfer Qty</span>
            <div className="flex items-center bg-surface-container rounded-lg border border-border-muted p-1">
              <button aria-label="Decrease quantity" className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-variant rounded transition-colors">
                <span className="material-symbols-outlined">remove</span>
              </button>
              <span className="w-12 text-center font-label-md text-label-md text-on-surface">1</span>
              <button aria-label="Increase quantity" className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-variant rounded transition-colors">
                <span className="material-symbols-outlined">add</span>
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-surface-container-lowest rounded-lg border border-border-muted p-4 mt-2 relative">
          <div className="flex items-center gap-4 relative z-10">
            <div className="flex flex-col items-center justify-center gap-1 w-12">
              <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant border border-border-muted">
                <span className="material-symbols-outlined text-[16px]">local_shipping</span>
              </div>
              <div className="h-8 w-px bg-border-muted my-1"></div>
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary border border-primary/30">
                <span className="material-symbols-outlined text-[16px]">location_on</span>
              </div>
            </div>
            <div className="flex flex-col gap-6 w-full">
              <div className="h-8 flex flex-col justify-center">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">From</span>
                <span className="font-body-md text-body-md text-on-surface">Vehicle Stock (Van 42)</span>
              </div>
              <div className="h-8 flex flex-col justify-center">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">To</span>
                <button className="flex items-center justify-between w-full text-left font-body-md text-body-md text-on-surface hover:text-primary transition-colors focus:outline-none">
                  <span>On-site Locker (Zone A)</span>
                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant">expand_more</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <div className="fixed bottom-0 left-0 w-full z-50 bg-surface/90 backdrop-blur-md border-t border-border-muted p-4 pb-6 shadow-[0_-10px_20px_rgba(5,20,36,0.8)]">
        <div className="max-w-md mx-auto w-full">
          <button className="w-full bg-surface-tint hover:bg-primary text-on-primary-fixed font-headline-sm text-headline-sm py-4 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg active:scale-[0.98]">
            <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
            Confirm Movement
          </button>
        </div>
      </div>
    </div>
  );
}
