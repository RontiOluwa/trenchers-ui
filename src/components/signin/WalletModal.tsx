'use client';

import { useState } from 'react';
import { useWallet, type WalletName } from '@/context/WalletContext';
import { motion } from 'framer-motion';
import { useToast } from '@/context/ToastContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


const WALLETS: {
    id: WalletName;
    name: string;
    desc: string;
    color: string;
    installUrl: string;
    logo: React.ReactNode;
}[] = [
        {
            id: 'phantom',
            name: 'Phantom',
            desc: 'Most popular Solana wallet',
            color: 'hover:border-purple-500/40 hover:bg-purple-500/5',
            installUrl: 'https://phantom.app/',
            logo: (
                <svg width="28" height="28" viewBox="0 0 128 128" fill="none">
                    <rect width="128" height="128" rx="24" fill="#AB9FF2" />
                    <path d="M110.584 64.9142H99.142C99.142 41.8335 80.5481 23 57.7727 23C35.2425 23 16.7993 41.491 16.4224 64.0544C16.0315 87.4043 35.8178 108 59.2191 108H63.7512C84.423 108 110.584 89.2472 110.584 68.5437V64.9142Z" fill="white" />
                    <ellipse cx="80" cy="59" rx="6" ry="6" fill="#AB9FF2" />
                    <ellipse cx="60" cy="59" rx="6" ry="6" fill="#AB9FF2" />
                </svg>
            ),
        },
        {
            id: 'metamask',
            name: 'MetaMask',
            desc: 'Via Solana Snaps extension',
            color: 'hover:border-amber-500/40 hover:bg-amber-500/5',
            installUrl: 'https://metamask.io/download/',
            logo: (
                <svg width="28" height="28" viewBox="0 0 128 128" fill="none">
                    <rect width="128" height="128" rx="24" fill="#1B1B1B" />
                    <path d="M104 24L67 50L74 36L104 24Z" fill="#E17726" />
                    <path d="M24 24L60.7 50.3L54 36L24 24Z" fill="#E27625" />
                    <path d="M90 83L80 97L102 103L108 84L90 83Z" fill="#E27625" />
                    <path d="M20 84L26 103L48 97L38 83L20 84Z" fill="#E27625" />
                    <path d="M47 58L41 67L63 68L62 45L47 58Z" fill="#E27625" />
                    <path d="M81 58L65.8 44.6L65 68L87 67L81 58Z" fill="#E27625" />
                    <path d="M48 97L61 90L50 84L48 97Z" fill="#D5BFB2" />
                    <path d="M67 90L80 97L78 84L67 90Z" fill="#D5BFB2" />
                </svg>
            ),
        },
        {
            id: 'walletconnect',
            name: 'WalletConnect',
            desc: 'Connect any mobile wallet',
            color: 'hover:border-blue-500/40 hover:bg-blue-500/5',
            installUrl: 'https://walletconnect.com/',
            logo: (
                <svg width="28" height="28" viewBox="0 0 128 128" fill="none">
                    <rect width="128" height="128" rx="24" fill="#3B99FC" />
                    <path d="M39.7 50.3C53.3 36.7 75.7 36.7 89.3 50.3L91.3 52.3C92 53 92 54.1 91.3 54.8L85.5 60.6C85.2 60.9 84.6 60.9 84.3 60.6L81.5 57.8C72.2 48.5 56.8 48.5 47.5 57.8L44.5 60.8C44.2 61.1 43.6 61.1 43.3 60.8L37.5 55C36.8 54.3 36.8 53.2 37.5 52.5L39.7 50.3ZM100.7 61.7L105.9 66.9C106.6 67.6 106.6 68.7 105.9 69.4L81.5 93.8C80.8 94.5 79.7 94.5 79 93.8L61.5 76.3C61.35 76.15 61.05 76.15 60.9 76.3L43.5 93.8C42.8 94.5 41.7 94.5 41 93.8L16.5 69.4C15.8 68.7 15.8 67.6 16.5 66.9L21.7 61.7C22.4 61 23.5 61 24.2 61.7L41.7 79.2C41.85 79.35 42.15 79.35 42.3 79.2L59.8 61.7C60.5 61 61.6 61 62.3 61.7L79.8 79.2C79.95 79.35 80.25 79.35 80.4 79.2L97.9 61.7C98.5 61 99.6 61 100.7 61.7Z" fill="white" />
                </svg>
            ),
        },
    ];

export function WalletModal({
    isDark,
    onClose,
}: {
    isDark: boolean;
    onClose: () => void;
}) {
    const { connect, isConnecting } = useWallet();
    const { toast } = useToast();
    const [connecting, setConnecting] = useState<WalletName | null>(null);
    const router = useRouter();

    async function handleConnect(wallet: typeof WALLETS[number]) {
        setConnecting(wallet.id);
        try {
            await connect(wallet.id);
            toast(`${wallet.name} connected successfully`, 'success');
            onClose();
            router.push('/listing');
        } catch (err: any) {
            const msg: string = err?.message ?? 'Connection failed. Please try again.';
            // If the wallet isn't installed, the connect fn already opened the install page
            const isNotInstalled = msg.toLowerCase().includes('not installed');
            toast(
                isNotInstalled
                    ? `${wallet.name} not found — opening install page…`
                    : msg,
                'error'
            );
        } finally {
            setConnecting(null);
        }
    }

    const bd = isDark ? 'border-white/[0.08]' : 'border-gray-200';
    const bg = isDark ? 'bg-[#111]' : 'bg-white';
    const tx = isDark ? 'text-white' : 'text-gray-900';
    const mu = isDark ? 'text-gray-400' : 'text-gray-500';

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 wallet-backdrop bg-black/60"
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 16 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className={`w-full max-w-sm rounded-2xl border ${bd} ${bg} shadow-2xl overflow-hidden`}
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className={`flex items-center justify-between px-6 py-5 border-b ${bd}`}>
                    <div>
                        <h2 className={`text-base font-bold ${tx}`}>Connect Wallet</h2>
                        <p className={`text-xs mt-0.5 ${mu}`}>Choose your Solana wallet</p>
                    </div>
                    <button
                        onClick={onClose}
                        className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors
              ${isDark ? 'text-gray-500 hover:text-white hover:bg-white/10' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'}`}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Wallet list */}
                <div className="p-3 space-y-1.5">
                    {WALLETS.map(wallet => {
                        const isThisConnecting = connecting === wallet.id;
                        return (
                            <motion.button
                                key={wallet.id}
                                onClick={() => !isConnecting && handleConnect(wallet)}
                                disabled={!!isConnecting}
                                whileHover={!isConnecting ? { x: 2 } : {}}
                                whileTap={!isConnecting ? { scale: 0.98 } : {}}
                                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl border
                  transition-all duration-200 text-left disabled:opacity-60 disabled:cursor-wait
                  ${isDark
                                        ? `border-white/[0.06] bg-white/[0.03] ${wallet.color}`
                                        : `border-gray-100 bg-gray-50/50 ${wallet.color}`
                                    }`}
                            >
                                {/* Logo */}
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                                    {wallet.logo}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className={`text-sm font-semibold ${tx}`}>{wallet.name}</div>
                                    <div className={`text-xs ${mu}`}>{wallet.desc}</div>
                                </div>

                                {/* Right side: spinner or arrow */}
                                <div className="shrink-0">
                                    {isThisConnecting ? (
                                        <div className="w-4 h-4 border-2 border-[#7c3aed] border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                            stroke={isDark ? '#4b5563' : '#9ca3af'} strokeWidth="2">
                                            <path d="M9 18l6-6-6-6" />
                                        </svg>
                                    )}
                                </div>
                            </motion.button>
                        );
                    })}
                </div>

                {/* Footer */}
                <div className={`px-6 py-4 border-t ${bd}`}>
                    <p className={`text-[11px] text-center ${mu} leading-relaxed`}>
                        By connecting, you agree to our{' '}
                        <Link href="#" className="text-[#7c3aed] hover:underline">Terms</Link>
                        {' & '}
                        <Link href="#" className="text-[#7c3aed] hover:underline">Privacy Policy</Link>
                    </p>
                </div>
            </motion.div>
        </motion.div>
    );
}
