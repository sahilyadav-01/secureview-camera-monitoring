import React, { useEffect, useRef } from 'react';
import { AlertTriangle, X, Trash2 } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'default';
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel,
}) => {
  const cancelRef = useRef<HTMLButtonElement>(null);

  // Focus cancel button on open (safer default)
  useEffect(() => {
    if (isOpen) {
      cancelRef.current?.focus();
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      icon:    'text-rose-400',
      iconBg:  'bg-rose-500/10 border-rose-500/30',
      btn:     'bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/20',
      border:  'border-rose-800/60',
    },
    warning: {
      icon:    'text-amber-400',
      iconBg:  'bg-amber-500/10 border-amber-500/30',
      btn:     'bg-amber-500 hover:bg-amber-400 text-black shadow-amber-500/20',
      border:  'border-amber-800/60',
    },
    default: {
      icon:    'text-cyan-400',
      iconBg:  'bg-cyan-500/10 border-cyan-500/30',
      btn:     'bg-cyan-500 hover:bg-cyan-400 text-black shadow-cyan-500/20',
      border:  'border-cyan-800/60',
    },
  }[variant];

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <div
        className={`
          bg-[#131A26] border ${variantStyles.border} rounded-3xl w-full max-w-md
          shadow-2xl animate-scale-in
        `}
        onClick={(e) => e.stopPropagation()}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-message"
      >
        {/* Header */}
        <div className="p-6 flex items-start gap-4">
          <div className={`p-3 rounded-2xl border ${variantStyles.iconBg} shrink-0`}>
            {variant === 'danger' ? (
              <Trash2 className={`w-6 h-6 ${variantStyles.icon}`} />
            ) : (
              <AlertTriangle className={`w-6 h-6 ${variantStyles.icon}`} />
            )}
          </div>
          <div className="flex-1">
            <h2 id="confirm-title" className="text-base font-bold text-slate-100">
              {title}
            </h2>
            <p id="confirm-message" className="text-sm font-mono text-slate-400 mt-1.5 leading-relaxed">
              {message}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="p-1.5 text-slate-500 hover:text-slate-300 hover:bg-slate-800/60 rounded-xl transition shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex items-center justify-end gap-3">
          <button
            ref={cancelRef}
            onClick={onCancel}
            className="px-5 py-2.5 bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 text-xs font-semibold font-mono rounded-xl border border-slate-700 transition"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`px-5 py-2.5 text-xs font-bold font-mono rounded-xl shadow-lg transition ${variantStyles.btn}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
