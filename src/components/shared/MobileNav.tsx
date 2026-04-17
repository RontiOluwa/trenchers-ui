import React from 'react'
import Image from 'next/image';
import { useThemeToggle } from '@/hooks/useTheme';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

function MobileNav() {
    const { isDark } = useThemeToggle();
    const bd = isDark ? 'border-white/[0.07]' : 'border-gray-200';


    return (
        <div className={`flex items-center justify-between px-4 py-2 border-b shrink-0 ${bd}`}>
            <div className="flex items-center gap-2">
                <Image src="/logo.png" alt="Trenchers" width={24} height={24} />
                <span className={`font-bold text-sm tracking-widest ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    TRENCHERS
                </span>
            </div>
            <div className="flex items-center gap-3">
                <button className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                    </svg>
                </button>
                <ThemeToggle size={18} className="w-8 h-8" />
                <button className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
                    </svg>
                </button>
            </div>
        </div>

    )
}

export default MobileNav