'use client';

import { WalletProvider } from '@/context/WalletContext';
import { ToastProvider } from '@/context/ToastContext';
import { PageTransition } from '@/components/PageTransition';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <WalletProvider>
            <ToastProvider>
                <PageTransition>
                    {children}
                </PageTransition>
            </ToastProvider>
        </WalletProvider>
    );
}