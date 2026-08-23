import React from 'react';
import { ShieldAlert, AlertTriangle, Info, CheckSquare, PhoneCall, HelpCircle } from 'lucide-react';
import { useSiteConfig } from '../context/SiteConfigContext';

export default function DynamicFormIndications({ customValues = {}, onChangeCustomValue, className = '' }) {
  const { formConfig } = useSiteConfig();
  const activeBanners = formConfig?.banners?.filter(b => b.enabled) || [];
  const activeCustomFields = formConfig?.customFields?.filter(f => f.enabled) || [];

  if (activeBanners.length === 0 && activeCustomFields.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-4 font-mono ${className}`}>
      {/* Superadmin Banner Instructions */}
      {activeBanners.length > 0 && (
        <div className="space-y-2">
          {activeBanners.map((banner) => {
            const isWarning = banner.type === 'warning';
            const isImportant = banner.type === 'important';

            return (
              <div
                key={banner.id}
                className={`p-3.5 rounded-xl border flex items-start gap-3 transition-all ${
                  isImportant
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                    : isWarning
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                    : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
                }`}
              >
                {isImportant ? (
                  <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5 animate-pulse" />
                ) : isWarning ? (
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                ) : (
                  <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                )}

                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold uppercase tracking-wider">{banner.title}</span>
                    <span className="text-[9px] uppercase px-1.5 py-0.5 bg-black/40 rounded font-bold tracking-widest text-zinc-400 border border-white/10">
                      Consigne Superadmin
                    </span>
                  </div>
                  <p className="text-[11px] leading-relaxed opacity-90">{banner.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Superadmin Dynamic Custom Fields */}
      {activeCustomFields.length > 0 && (
        <div className="p-4 bg-zinc-950/80 border border-zinc-800 rounded-xl space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-orange flex items-center gap-1.5">
              <CheckSquare className="w-3.5 h-3.5 text-brand-orange" />
              Indications &amp; Exigences Superadmin
            </span>
            <span className="text-[9px] text-zinc-500">Champs requis pour la conformité</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {activeCustomFields.map((field) => {
              const value = customValues[field.id] !== undefined ? customValues[field.id] : (field.type === 'checkbox' ? false : '');

              return (
                <div
                  key={field.id}
                  className={`space-y-1 ${field.type === 'checkbox' ? 'md:col-span-2 flex items-start gap-3 bg-zinc-900/50 p-2.5 rounded border border-zinc-800' : ''}`}
                >
                  {field.type === 'checkbox' ? (
                    <>
                      <input
                        type="checkbox"
                        id={field.id}
                        checked={Boolean(value)}
                        required={field.required}
                        onChange={(e) => onChangeCustomValue && onChangeCustomValue(field.id, e.target.checked)}
                        className="mt-1 w-4 h-4 rounded border-zinc-700 text-brand-orange focus:ring-brand-orange bg-zinc-950 cursor-pointer"
                      />
                      <label htmlFor={field.id} className="cursor-pointer space-y-0.5">
                        <span className="font-bold text-zinc-200 block text-xs">
                          {field.label} {field.required && <span className="text-rose-400">*</span>}
                        </span>
                        {field.helpText && (
                          <span className="text-[10px] text-zinc-400 block">{field.helpText}</span>
                        )}
                      </label>
                    </>
                  ) : (
                    <>
                      <label className="block text-[10px] uppercase text-zinc-400 font-bold">
                        {field.label} {field.required && <span className="text-rose-400">*</span>}
                      </label>
                      <input
                        type={field.type === 'number' ? 'number' : 'text'}
                        value={value}
                        required={field.required}
                        placeholder={field.placeholder || ''}
                        onChange={(e) => onChangeCustomValue && onChangeCustomValue(field.id, e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 px-3 py-2 rounded text-xs font-mono focus:border-brand-orange focus:outline-none transition"
                      />
                      {field.helpText && (
                        <p className="text-[10px] text-zinc-500 flex items-center gap-1">
                          <HelpCircle className="w-3 h-3 text-zinc-500" /> {field.helpText}
                        </p>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
