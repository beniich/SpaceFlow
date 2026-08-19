import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function CloseWorkOrderPhoto() {
  const navigate = useNavigate();
  return (
    <div className="bg-surface text-on-surface font-body-md antialiased min-h-screen flex flex-col pt-16 pb-24">
      <header className="bg-surface-container-low text-primary fixed top-0 w-full z-50 h-16 border-b border-border-muted flex items-center justify-between px-margin-page transition-colors duration-200">
        <button onClick={() => navigate(-1)} className="flex items-center justify-center p-2 rounded-full hover:bg-surface-container-highest transition-colors active:scale-95 duration-100">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="font-headline-sm text-headline-sm-mobile md:text-headline-sm text-on-surface truncate">Close Work Order</h1>
        <button className="flex items-center justify-center p-2 rounded-full hover:bg-surface-container-highest transition-colors active:scale-95 duration-100">
          <span className="material-symbols-outlined">more_vert</span>
        </button>
      </header>
      
      <main className="flex-grow px-margin-page flex flex-col gap-6 pt-6">
        <section className="flex flex-col gap-2">
          <h2 className="font-headline-md text-headline-md text-on-surface">Photo Evidence</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">Please upload or capture photos demonstrating the completed work on Asset ID: CRYO-77B.</p>
        </section>
        
        <section className="bg-surface-card border border-border-muted rounded-xl p-4 flex flex-col items-center justify-center gap-4 hover:border-border-active transition-colors cursor-pointer relative overflow-hidden group">
          <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-primary-fixed-dim/5 to-transparent pointer-events-none"></div>
          <div className="w-1 absolute left-0 top-0 h-full bg-primary-fixed-dim opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <div className="bg-surface-container-highest rounded-full p-4 flex items-center justify-center">
            <span className="material-symbols-outlined text-4xl text-primary-fixed-dim">add_a_photo</span>
          </div>
          <div className="text-center">
            <span className="block font-label-md text-label-md text-primary-fixed-dim uppercase">Capture / Upload</span>
            <span className="block font-body-sm text-body-sm text-on-surface-variant mt-1">Minimum 2 photos required</span>
          </div>
        </section>
        
        <section className="grid grid-cols-2 gap-widget-gap">
          <div className="relative aspect-square rounded-xl overflow-hidden border border-border-muted group">
            <div className="w-full h-full bg-cover bg-center absolute inset-0" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAcTfYvmlNl0lAA41L7-hXYKfOa0OXC6fNDTYUdoqKIy4eY06UxEphxdgA9exdElNaHB9KP8eGlDgar05QgJVHQqPxkgVW3RxE0VU8HnmkY9aETR6njm6c_npZ-9Owa6cT2vHFi6qtn4uXTCEUjdFVTtc-FPPMmTq99dolRFt5zWVOd2TnY9P9HFlHx_rSmndVoa1r_gH66KZuzuviNr3x_kEHEV9LwEKuhAOjMufUuz8BGhepkt1RS')"}}></div>
            <div className="absolute inset-0 bg-surface/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button className="bg-surface-container-highest p-2 rounded-full border border-border-muted text-on-surface hover:text-critical transition-colors">
                <span className="material-symbols-outlined">delete</span>
              </button>
            </div>
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-surface to-transparent p-2">
              <span className="font-label-sm text-label-sm text-on-surface block truncate">IMG_20231027_0912.jpg</span>
              <span className="font-body-sm text-body-sm text-success flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">check_circle</span> Verified
              </span>
            </div>
          </div>
          
          <div className="relative aspect-square rounded-xl overflow-hidden border border-border-muted group">
            <div className="w-full h-full bg-cover bg-center absolute inset-0" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAF8uRChy63BkuDICG3gcLyt45223jE2Ed6gNgmBrk7Qr2c61PaNf2RIQJT0FLK9WtMaN7XkQqCBDafnnehRxGlhmsLU-v3iQAdruK5wJuy3s13ujLcc1jYdfAs9BSGEtGynXafhSZ02ovZXBoDW5J1DRmWn5m7nwONtu1ZiKSbX5izGQJjTKeb98ux1AtWCtm0MfzKDv6Tlopl43vcjI6cuoyZv2QeVMFAj3y_1Q4CaUrvfm2PlT4b')"}}></div>
            <div className="absolute inset-0 bg-surface/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button className="bg-surface-container-highest p-2 rounded-full border border-border-muted text-on-surface hover:text-critical transition-colors">
                <span className="material-symbols-outlined">delete</span>
              </button>
            </div>
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-surface to-transparent p-2">
              <span className="font-label-sm text-label-sm text-on-surface block truncate">IMG_20231027_0915.jpg</span>
              <span className="font-body-sm text-body-sm text-success flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">check_circle</span> Verified
              </span>
            </div>
          </div>
          
          <div className="relative aspect-square rounded-xl border border-dashed border-outline-variant flex items-center justify-center bg-surface-container-lowest/50 text-on-surface-variant">
            <span className="font-label-sm text-label-sm">+ Add More</span>
          </div>
        </section>
      </main>
      
      <div className="fixed bottom-0 left-0 w-full bg-surface-container border-t border-border-muted p-container-padding z-40">
        <button onClick={() => navigate('/close-work-order-signature')} className="w-full bg-primary-fixed-dim text-on-primary-fixed font-headline-sm text-headline-sm py-4 rounded-lg flex items-center justify-center gap-2 hover:bg-primary-fixed transition-colors active:scale-[0.98]">
          <span>Next: Final Signature</span>
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}
