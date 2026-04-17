'use client';

import { useState } from 'react';
import { useThemeToggle } from '@/hooks/useTheme';
import { AnimatePresence } from 'framer-motion';
import { SignInForm } from '@/components/signin/SignInForm';
import { LeftPanel } from '@/components/signin/LeftPanel';
import { WalletModal } from '@/components/signin/WalletModal';


export function SignInPage() {
    const [walletModalOpen, setWalletModalOpen] = useState(false);
    const { isDark, toggleTheme } = useThemeToggle();

    return (
        <>
            <div className={`min-h-screen grid md:grid-cols-[60%_40%] ${isDark ? 'bg-[#0d0d0d]' : 'bg-white'}`}>
                <LeftPanel isDark={isDark} />
                <SignInForm
                    isDark={isDark}
                    toggleTheme={toggleTheme}
                    onConnectWallet={() => setWalletModalOpen(true)}
                />
            </div>

            {/* Wallet modal */}
            <AnimatePresence>
                {walletModalOpen && (
                    <WalletModal
                        isDark={isDark}
                        onClose={() => setWalletModalOpen(false)}
                    />
                )}
            </AnimatePresence>
        </>
    );
}