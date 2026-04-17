'use client';

import {
    createContext, useCallback, useContext,
    useEffect, useRef, useState,
} from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// ── Types ─────────────────────────────────────────────────────────────────────

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastItem {
    id: string;
    message: string;
    type: ToastType;
    duration: number;
}

interface ToastCtx {
    toast: (message: string, type?: ToastType, duration?: number) => void;
}

const Ctx = createContext<ToastCtx>({ toast: () => { } });

// ── Icon per type ──────────────────────────────────────────────────────────────

function ToastIcon({ type }: { type: ToastType }) {
    if (type === 'success') return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
        </svg>
    );
    if (type === 'error') return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
    );
    if (type === 'warning') return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
    );
    // info
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
    );
}

const STYLES: Record<ToastType, { icon: string; bar: string; border: string }> = {
    success: { icon: 'text-green-400', bar: 'bg-green-500', border: 'border-green-500/30' },
    error: { icon: 'text-red-400', bar: 'bg-red-500', border: 'border-red-500/30' },
    warning: { icon: 'text-yellow-400', bar: 'bg-yellow-500', border: 'border-yellow-500/30' },
    info: { icon: 'text-blue-400', bar: 'bg-blue-500', border: 'border-blue-500/30' },
};

// ── Single toast card ─────────────────────────────────────────────────────────

function ToastCard({
    toast, onDismiss,
}: {
    toast: ToastItem;
    onDismiss: () => void;
}) {
    const [progress, setProgress] = useState(100);
    const rafRef = useRef<number>(0);
    const startTs = useRef(Date.now());
    const s = STYLES[toast.type];

    useEffect(() => {
        function tick() {
            const elapsed = Date.now() - startTs.current;
            const remaining = Math.max(0, 100 - (elapsed / toast.duration) * 100);
            setProgress(remaining);
            if (remaining > 0) rafRef.current = requestAnimationFrame(tick);
            else onDismiss();
        }
        rafRef.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafRef.current);
    }, [toast.duration, onDismiss]);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: 60, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.9, transition: { duration: 0.15 } }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className={`relative flex items-start gap-3 w-80 rounded-xl
        bg-[#1a1a1a] border ${s.border}
        px-4 py-3.5 shadow-2xl shadow-black/40
        overflow-hidden cursor-pointer`}
            onClick={onDismiss}
        >
            {/* Icon */}
            <div className={`shrink-0 mt-0.5 ${s.icon}`}>
                <ToastIcon type={toast.type} />
            </div>

            {/* Message */}
            <p className="text-sm text-white/90 leading-snug flex-1 pr-2">{toast.message}</p>

            {/* Close */}
            <button className="shrink-0 text-white/30 hover:text-white/70 transition-colors mt-0.5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M18 6L6 18M6 6l12 12" />
                </svg>
            </button>

            {/* Progress bar */}
            <div
                className={`absolute bottom-0 left-0 h-[2px] ${s.bar} transition-none`}
                style={{ width: `${progress}%` }}
            />
        </motion.div>
    );
}

// ── Provider + renderer ───────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const dismiss = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const toast = useCallback(
        (message: string, type: ToastType = 'success', duration = 3500) => {
            const id = `${Date.now()}-${Math.random()}`;
            setToasts(prev => [...prev.slice(-4), { id, message, type, duration }]);
        },
        []
    );

    return (
        <Ctx.Provider value={{ toast }}>
            {children}

            {/* Toast portal — fixed bottom-right */}
            <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 items-end">
                <AnimatePresence mode="popLayout">
                    {toasts.map(t => (
                        <ToastCard key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
                    ))}
                </AnimatePresence>
            </div>
        </Ctx.Provider>
    );
}

export function useToast() { return useContext(Ctx); }