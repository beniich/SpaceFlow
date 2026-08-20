import { useEffect } from 'react';
import { X } from 'lucide-react';
import clsx from 'clsx';

/**
 * Modal de base réutilisable
 * @param {boolean} open - État d'ouverture
 * @param {function} onClose - Callback de fermeture
 * @param {string} title - Titre de la modal
 * @param {ReactNode} children - Contenu
 * @param {string} size - 'sm' | 'md' | 'lg' | 'xl'
 */
export default function Modal({ open, onClose, title, children, size = 'md', footer }) {
  useEffect(() => {
    if (!open) return;
    const handleEsc = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm" onClick={onClose}>
      <div
        className={clsx('bg-zinc-900 border border-zinc-800 rounded-xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl text-zinc-100', sizeClasses[size])}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/80">
          <h2 className="text-lg font-bold font-display uppercase tracking-widest text-zinc-50">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 rounded-lg transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1">{children}</div>
        {footer && <div className="p-5 border-t border-zinc-800 flex justify-end gap-2 bg-zinc-950/80">{footer}</div>}
      </div>
    </div>
  );
}
