import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  removing?: boolean;
}

interface ToastContextType {
  toasts: ToastItem[];
  toast: {
    success: (title: string, message?: string) => void;
    error:   (title: string, message?: string) => void;
    warning: (title: string, message?: string) => void;
    info:    (title: string, message?: string) => void;
  };
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const ICONS: Record<ToastType, React.FC<{ className?: string }>> = {
  success: CheckCircle2,
  error:   XCircle,
  warning: AlertTriangle,
  info:    Info,
};

const STYLES: Record<ToastType, { border: string; icon: string; bg: string }> = {
  success: { border: 'border-emerald-500/40', icon: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  error:   { border: 'border-rose-500/40',    icon: 'text-rose-400',    bg: 'bg-rose-500/10'    },
  warning: { border: 'border-amber-500/40',   icon: 'text-amber-400',   bg: 'bg-amber-500/10'   },
  info:    { border: 'border-cyan-500/40',    icon: 'text-cyan-400',    bg: 'bg-cyan-500/10'    },
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: string) => {
    // Trigger remove animation, then delete
    setToasts((p) => p.map((t) => (t.id === id ? { ...t, removing: true } : t)));
    setTimeout(() => {
      setToasts((p) => p.filter((t) => t.id !== id));
      timers.current.delete(id);
    }, 300);
  }, []);

  const addToast = useCallback(
    (type: ToastType, title: string, message?: string, duration = 4500) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((p) => [{ id, type, title, message, duration }, ...p].slice(0, 6));

      if (duration > 0) {
        const timer = setTimeout(() => dismiss(id), duration);
        timers.current.set(id, timer);
      }
    },
    [dismiss]
  );

  const toast = {
    success: (title: string, message?: string) => addToast('success', title, message),
    error:   (title: string, message?: string) => addToast('error',   title, message),
    warning: (title: string, message?: string) => addToast('warning', title, message),
    info:    (title: string, message?: string) => addToast('info',    title, message),
  };

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}

      {/* Toast Container */}
      <div
        className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none"
        aria-live="polite"
        aria-atomic="false"
      >
        {toasts.map((t) => {
          const Icon = ICONS[t.type];
          const style = STYLES[t.type];
          return (
            <div
              key={t.id}
              className={`
                pointer-events-auto w-80 max-w-[90vw] flex items-start gap-3 p-4 rounded-2xl
                border backdrop-blur-xl shadow-2xl
                bg-[#0D1220]/95 ${style.border}
                ${t.removing ? 'animate-toast-out' : 'animate-toast-in'}
              `}
            >
              <div className={`p-1.5 rounded-lg ${style.bg} shrink-0 mt-0.5`}>
                <Icon className={`w-4 h-4 ${style.icon}`} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-100 leading-snug">{t.title}</p>
                {t.message && (
                  <p className="text-xs font-mono text-slate-400 mt-0.5 leading-relaxed">{t.message}</p>
                )}
              </div>

              <button
                onClick={() => dismiss(t.id)}
                className="shrink-0 p-1 text-slate-500 hover:text-slate-300 rounded-lg hover:bg-slate-800/60 transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              {/* Progress bar */}
              {t.duration && t.duration > 0 && !t.removing && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl overflow-hidden"
                >
                  <div
                    className={`h-full ${style.icon.replace('text-', 'bg-')} opacity-60`}
                    style={{
                      animation: `shimmer ${t.duration}ms linear forwards`,
                      width: '100%',
                      transformOrigin: 'left',
                      animationName: 'toast-progress',
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes toast-progress {
          from { transform: scaleX(1); }
          to   { transform: scaleX(0); }
        }
      `}</style>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx.toast;
};

export const useToastContext = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToastContext must be used within ToastProvider');
  return ctx;
};
