'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';

export type WalletName = 'phantom' | 'solflare' | 'metamask' | 'walletconnect';

interface WalletCtx {
    address: string | null;
    walletName: WalletName | null;
    isConnecting: boolean;
    connect: (name: WalletName) => Promise<void>;
    disconnect: () => void;
}

const Ctx = createContext<WalletCtx>({
    address: null,
    walletName: null,
    isConnecting: false,
    connect: async () => { },
    disconnect: () => { },
});

// ── Phantom ────────────────────────────────────────────────────────────────
async function connectPhantom(): Promise<string> {
    const phantom = (window as any)?.phantom?.solana ?? (window as any)?.solana;
    console.log(phantom)
    if (!phantom?.isPhantom) {
        window.open('https://phantom.app/', '_blank');
        throw new Error('Phantom not installed. Please install the extension and try again.');
    }
    const resp = await phantom.connect();
    return resp.publicKey.toString();
}


// ── MetaMask ───────────────────────────────────────────────────────────────
async function connectMetaMask(): Promise<string> {
    const ethereum = (window as any)?.ethereum;
    if (!ethereum) {
        window.open('https://metamask.io/download/', '_blank');
        throw new Error('MetaMask not installed. Please install the extension and try again.');
    }

    const accounts: string[] = await ethereum.request({ method: 'eth_requestAccounts' });
    if (!accounts || accounts.length === 0) {
        throw new Error('No accounts returned from MetaMask.');
    }

    // Attempt Solana Snap install silently (non-blocking)
    try {
        const snaps = await ethereum.request({ method: 'wallet_getSnaps' });
        const solanaSnapId = 'npm:@solana/solana-snap';
        if (!snaps?.[solanaSnapId]) {
            await ethereum.request({
                method: 'wallet_requestSnaps',
                params: { [solanaSnapId]: {} },
            }).catch(() => null);
        }
    } catch {
        // Snap support is optional
    }

    return accounts[0];
}

// ── WalletConnect ──────────────────────────────────────────────────────────
async function connectWalletConnect(): Promise<string> {
    // Check for WC-compatible injected wallets (Trust, Rainbow, etc.)
    const ethereum = (window as any)?.ethereum;
    if (ethereum?.isWalletConnect || ethereum?.isTrust || ethereum?.isRainbow) {
        const accounts: string[] = await ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts?.length) return accounts[0];
    }

    // Check for a WC provider already initialised at the app level
    const wcProvider = (window as any)?.__walletConnectProvider;
    if (wcProvider) {
        await wcProvider.connect();
        const accounts = wcProvider.accounts as string[];
        if (accounts?.length) return accounts[0];
    }

    // Inform the user that full WC requires a project-level setup
    throw new Error(
        'WalletConnect requires a Project ID and the @walletconnect/modal package. ' +
        'Add NEXT_PUBLIC_WC_PROJECT_ID to your .env and wrap the app with WalletConnectModal.'
    );
}

// ── Disconnect helpers ─────────────────────────────────────────────────────
async function disconnectWallet(name: WalletName) {
    try {
        if (name === 'phantom') {
            await (window as any)?.phantom?.solana?.disconnect?.();
        } else if (name === 'solflare') {
            await (window as any)?.solflare?.disconnect?.();
        }
        // EVM wallets don't expose a programmatic disconnect — clearing state is enough
    } catch {
        // Ignore
    }
}

// ── Provider ───────────────────────────────────────────────────────────────
export function WalletProvider({ children }: { children: React.ReactNode }) {
    const [address, setAddress] = useState<string | null>(null);
    const [walletName, setWalletName] = useState<WalletName | null>(null);
    const [isConnecting, setIsConnecting] = useState(false);

    // Restore session from localStorage
    useEffect(() => {
        try {
            const saved = localStorage.getItem('trenchers-wallet');
            if (saved) {
                const { address: a, walletName: w } = JSON.parse(saved);
                setAddress(a);
                setWalletName(w);
            }
        } catch { }
    }, []);

    // Listen for EVM account changes
    useEffect(() => {
        const ethereum = (window as any)?.ethereum;
        if (!ethereum) return;

        const handleAccountsChanged = (accounts: string[]) => {
            if (walletName === 'metamask' || walletName === 'walletconnect') {
                if (accounts.length === 0) {
                    setAddress(null);
                    setWalletName(null);
                    localStorage.removeItem('trenchers-wallet');
                } else {
                    setAddress(accounts[0]);
                    localStorage.setItem('trenchers-wallet', JSON.stringify({ address: accounts[0], walletName }));
                }
            }
        };

        ethereum.on?.('accountsChanged', handleAccountsChanged);
        return () => { ethereum.removeListener?.('accountsChanged', handleAccountsChanged); };
    }, [walletName]);

    const connect = useCallback(async (name: WalletName) => {
        setIsConnecting(true);
        try {
            let addr: string;
            switch (name) {
                case 'phantom': addr = await connectPhantom(); break;
                case 'metamask': addr = await connectMetaMask(); break;
                case 'walletconnect': addr = await connectWalletConnect(); break;
                default: throw new Error('Unknown wallet');
            }
            setAddress(addr);
            setWalletName(name);
            localStorage.setItem('trenchers-wallet', JSON.stringify({ address: addr, walletName: name }));
        } finally {
            setIsConnecting(false);
        }
    }, []);

    const disconnect = useCallback(async () => {
        if (walletName) await disconnectWallet(walletName);
        setAddress(null);
        setWalletName(null);
        localStorage.removeItem('trenchers-wallet');
    }, [walletName]);

    return (
        <Ctx.Provider value={{ address, walletName, isConnecting, connect, disconnect }}>
            {children}
        </Ctx.Provider>
    );
}

export function useWallet() { return useContext(Ctx); }

// Truncate address for display: 0x1234…abcd or So1A…bcd5
export function shortAddr(addr: string) {
    if (addr.startsWith('0x')) return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
}
