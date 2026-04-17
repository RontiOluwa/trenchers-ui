'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/context/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';


export function SignInForm({
    isDark,
    toggleTheme,
    onConnectWallet,
}: {
    isDark: boolean;
    toggleTheme: () => void;
    onConnectWallet: () => void;
}) {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!email) {
            setError('Enter a valid email address.')
            return
        };
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            toast('Magic link sent! Check your email.', 'success');
        }, 1500);
        router.push('/listing');
    }

    const socialCls = isDark
        ? 'w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-[#1e1e1e] hover:bg-[#252525] text-white text-sm font-medium border border-white/[0.08] transition-all duration-200 active:scale-[0.98]'
        : 'w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium transition-all duration-200 active:scale-[0.98]';

    return (
        <div className={`flex flex-col h-full px-8 md:px-12 py-10 ${isDark ? 'bg-[#141414]' : 'bg-white'}`}>
            {/* Theme toggle */}
            <div className="flex justify-end mb-auto">
                <button onClick={toggleTheme} aria-label="Toggle theme"
                    className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors overflow-hidden
            ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-900'}`}
                >
                    <AnimatePresence mode="wait" initial={false}>
                        {isDark ? (
                            <motion.svg key="sun" width="18" height="18" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                                <circle cx="12" cy="12" r="5" />
                                <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                                <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                            </motion.svg>
                        ) : (
                            <motion.svg key="moon" width="18" height="18" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                            </motion.svg>
                        )}
                    </AnimatePresence>
                </button>
            </div>

            <div className="flex-1 flex flex-col justify-center max-w-sm w-full mx-auto">
                {/* Mobile logo */}
                <div className="flex md:hidden items-center justify-center gap-2.5 mb-8">
                    <Image src="/logo.png" alt="Trenchers" width={32} height={32} className="w-8 h-8" />
                    <span className={`font-bold tracking-widest text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        TRENCHERS
                    </span>
                </div>

                <h2 className={`text-2xl md:text-3xl font-bold mb-2 text-center md:text-left ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Sign In
                </h2>
                <p className={`text-sm mb-8 text-center md:text-left ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Sync your settings, watchlists, and alerts across all your devices.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1.5">
                        <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            Email Address
                        </label>
                        <Input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className={`w-full px-4 py-3 rounded-xl text-sm outline-none transition-all
                focus:ring-2 focus:ring-[#7c3aed]/50
                ${isDark
                                    ? 'bg-[#1e1e1e] border border-white/[0.08] text-white placeholder:text-gray-600 focus:border-[#7c3aed]/50'
                                    : 'bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-[#7c3aed]/50'
                                }`}
                            error={error}
                        />
                    </div>
                    <Button type="submit" disabled={loading}
                        className="w-full py-3 rounded-xl bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold text-sm
              transition-all duration-200 hover:shadow-lg hover:shadow-[#7c3aed]/30
              active:scale-[0.98] disabled:opacity-70 disabled:cursor-wait mt-1">
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Sending link...
                            </span>
                        ) : 'Sign In with Email'}
                    </Button>
                </form>

                {/* Divider */}
                <div className="flex items-center gap-3 my-5">
                    <div className={`flex-1 h-px ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />
                    <span className={`text-xs font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>OR</span>
                    <div className={`flex-1 h-px ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />
                </div>

                {/* Social + wallet buttons */}
                <div className="flex flex-col gap-2.5">
                    {/* Google */}
                    <button className={socialCls}>
                        <svg width="18" height="18" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Continue with Google
                    </button>


                    {/* Connect Wallet — highlighted */}
                    <motion.button
                        onClick={onConnectWallet}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl
              font-semibold text-sm transition-all duration-200
              border border-[#7c3aed]/40 bg-[#7c3aed]/10
              hover:bg-[#7c3aed]/20 hover:border-[#7c3aed]/60
              text-[#7c3aed] hover:shadow-lg hover:shadow-[#7c3aed]/20`}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="5" width="20" height="14" rx="2" />
                            <path d="M16 12h2" />
                        </svg>
                        Connect Wallet
                    </motion.button>
                </div>

                <div className="mt-6 text-center space-y-2">
                    <p className={`text-xs ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                        <Link href="#" className="hover:underline">Terms of Service</Link>
                        <span className="mx-2">·</span>
                        <Link href="#" className="hover:underline">Privacy Policy</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}