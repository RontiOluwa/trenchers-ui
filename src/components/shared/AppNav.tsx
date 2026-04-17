'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Input } from '@/components/ui/Input';
import { useWallet, shortAddr } from '@/context/WalletContext';
import { useToast } from '@/context/ToastContext';
import { WalletChip } from '@/components/shared/WalletChip';

export function AppNav({
    isDark, toggleTheme, search, onSearch, lastUpdate,
}: {
    isDark: boolean;
    toggleTheme: () => void;
    search?: string;
    onSearch?: (v: string) => void | undefined;
    lastUpdate?: Date | null;
}) {

    const { address, walletName, disconnect } = useWallet();
    const { toast } = useToast();

    return (
        <nav className={`flex items-center px-4 h-14 gap-1 border-b shrink-0
      ${isDark ? 'bg-[#111] border-white/[0.07]' : 'bg-white border-gray-200'}`}>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 mr-2 shrink-0">
                <Image src="/logo.png" alt="Trenchers" width={28} height={28} className="w-7 h-7" />
                <span className={`font-bold text-sm tracking-wide ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    TRENCHERS
                </span>
            </Link>

            {/* Nav */}
            <div className="hidden md:flex items-center gap-1">
                {['Trenches', 'Trending', 'Portfolio', 'Track', 'Rewards'].map((item) => (
                    <Link key={item} href="#"
                        className={`text-sm px-3 py-1.5 rounded-full font-medium transition-colors
              ${item === 'Trenches'
                                ? 'bg-[#7c3aed] text-white'
                                : isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                            }`}>
                        {item}
                    </Link>
                ))}
            </div>

            <div className="ml-auto flex items-center gap-2">
                {/* Last update */}
                {lastUpdate && (
                    <span className={`hidden md:inline text-[10px] font-mono ${isDark ? 'text-gray-600' : 'text-gray-300'}`}>
                        {lastUpdate.toLocaleTimeString()}
                    </span>
                )}

                {/* Search bar */}
                <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg
          ${isDark ? 'bg-white/[0.06]' : 'bg-gray-100'}`}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                        stroke={isDark ? '#6b7280' : '#9ca3af'} strokeWidth="2">
                        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                    </svg>
                    <Input
                        type="text"
                        value={search}
                        onChange={(e) => onSearch ? onSearch(e.target.value) : ('')}
                        placeholder="Search tokens..."
                        className={`bg-transparent outline-none text-xs w-40
                        ${isDark ? 'text-white placeholder:text-gray-600' : 'text-gray-900 placeholder:text-gray-400'}`} />

                    {search && (
                        <button onClick={(e) => ('')}
                            className={isDark ? 'text-gray-600 hover:text-gray-400' : 'text-gray-400 hover:text-gray-600'}>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>


                {/* <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.06] text-xs text-white">
                    <div className="w-3.5 h-3.5 rounded-full bg-purple-500" />
                    <span className="font-medium">SOL</span>
                </div> */}

                {address && <WalletChip isDark={isDark} />}

                {/* Theme toggle */}
                <button onClick={toggleTheme} aria-label="Toggle theme"
                    className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors
            ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-900'}`}>
                    {isDark ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="5" />
                            <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                            <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                        </svg>
                    ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                        </svg>
                    )}
                </button>
            </div>
        </nav>
    );
}