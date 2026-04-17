'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet, shortAddr } from '@/context/WalletContext';
import { useToast } from '@/context/ToastContext';
import { useRouter } from 'next/navigation';

// ── Wallet chip + dropdown ────────────────────────────────────────────────────

export function WalletChip({ isDark }: { isDark: boolean }) {
    const { address, walletName, disconnect } = useWallet();
    const { toast } = useToast();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // Close on outside click
    useEffect(() => {
        function handler(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        }
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    if (!address) return null;

    function copyAddress() {
        navigator.clipboard.writeText(address!).then(() => {
            toast('Wallet address copied!', 'success');
            setOpen(false);
        });
    }

    function handleDisconnect() {
        disconnect();
        toast('Wallet disconnected', 'info');
        setOpen(false);
        router.push('/signin');
    }

    return (
        <div ref={ref} className="relative">
            <motion.button
                onClick={() => setOpen(v => !v)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors
          ${isDark
                        ? 'bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/15'
                        : 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100'
                    }`}
            >
                {/* Green dot */}
                <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
                </span>
                <span className="font-mono">{shortAddr(address)}</span>
                <motion.svg
                    width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    animate={{ rotate: open ? 180 : 0 }}
                    transition={{ duration: 0.15 }}
                >
                    <polyline points="6 9 12 15 18 9" />
                </motion.svg>
            </motion.button>

            {/* Dropdown */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.97 }}
                        transition={{ duration: 0.12, ease: 'easeOut' }}
                        className={`absolute right-0 top-full mt-2 w-52 rounded-xl border shadow-xl z-50
              ${isDark ? 'bg-[#1a1a1a] border-white/[0.08]' : 'bg-white border-gray-200'}`}
                    >
                        {/* Address display */}
                        <div className={`px-4 py-3 border-b ${isDark ? 'border-white/[0.06]' : 'border-gray-100'}`}>
                            <p className={`text-[10px] mb-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                {walletName ? walletName.charAt(0).toUpperCase() + walletName.slice(1) : 'Wallet'}
                            </p>
                            <p className={`text-xs font-mono break-all ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                {address}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="p-1.5">
                            <button
                                onClick={copyAddress}
                                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left
                  ${isDark ? 'hover:bg-white/[0.06] text-gray-300' : 'hover:bg-gray-50 text-gray-700'}`}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                </svg>
                                Copy address
                            </button>
                            <button
                                onClick={handleDisconnect}
                                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium
                  transition-colors text-left text-red-500 hover:bg-red-500/10"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                    <polyline points="16 17 21 12 16 7" />
                                    <line x1="21" y1="12" x2="9" y2="12" />
                                </svg>
                                Disconnect
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}