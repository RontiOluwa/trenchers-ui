'use client';

import { useEffect, useState } from 'react';
import { useLiveTokens } from '@/hooks/useLiveTokens';
import { useThemeToggle } from '@/hooks/useTheme';
import { AppNav } from '@/components/shared/AppNav';
import { DarkRow, LightRow } from '@/components/listing/TokenRow';
import { HotSnipeCard } from '@/components/listing/HotSnipeCard';
import { BottomNav } from '@/components/shared/BottomNav'
import { EmptyState } from '@/components/listing/EmptyState';
import { SkeletonRow } from '@/components/listing/SkeletonRow';
import { TokenColumn } from '@/components/listing/TokenColumn';
import { Input } from '@/components/ui/Input';


export function TrenchesPage() {
    const [mobileTab, setMobileTab] = useState<'new' | 'migrate' | 'migrated'>('new');
    const [search, setSearch] = useState('');
    const [favorites, setFavorites] = useState<Set<string>>(new Set());
    const { isDark, toggleTheme } = useThemeToggle();

    const { newTokens, migratingTokens, migratedTokens,
        flashMap, isLoading, error, lastUpdate, refetch } = useLiveTokens();



    // Load favorites from localStorage
    useEffect(() => {
        try {
            const saved = localStorage.getItem('trenchers-favorites');
            if (saved) setFavorites(new Set(JSON.parse(saved)));
        } catch { }
    }, []);

    function toggleFavorite(id: string) {
        setFavorites(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id); else next.add(id);
            // localStorage.setItem('trenchers-favorites', JSON.stringify([...next]));
            localStorage.setItem('trenchers-favorites', JSON.stringify(Array.from(next)));
            return next;
        });
    }


    // Find the HOT SNIPE — highest scoring new token
    const hotToken = newTokens.length > 0
        ? newTokens.reduce((best, t) => t.snipeScore > best.snipeScore ? t : best, newTokens[0])
        : undefined;

    const bd = isDark ? 'border-white/[0.07]' : 'border-gray-200';

    // Mobile active tokens
    const mobileTokenMap = { new: newTokens, migrate: migratingTokens, migrated: migratedTokens };
    const activeMobileTokens = mobileTokenMap[mobileTab];
    const filteredMobile = search
        ? activeMobileTokens.filter(t =>
            t.symbol.toLowerCase().includes(search.toLowerCase()) ||
            t.name.toLowerCase().includes(search.toLowerCase())
        )
        : activeMobileTokens;

    return (
        <div className={`flex flex-col h-screen overflow-hidden ${isDark ? 'bg-[#111] text-white' : 'bg-white text-gray-900'}`}>

            <AppNav
                isDark={isDark}
                toggleTheme={toggleTheme}
                search={search}
                onSearch={setSearch}
                lastUpdate={lastUpdate}
            />

            {/* ── DESKTOP ── */}
            <div className="hidden md:flex flex-col flex-1 min-h-0">

                {/* Page header */}
                <div className={`flex items-center justify-between px-4 py-3 border-b shrink-0 ${bd}`}>
                    <div className="flex items-center gap-3">
                        <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Trenches
                        </h1>
                        {/* Error indicator */}
                        {error && (
                            <button onClick={refetch}
                                className="text-[10px] text-red-400 flex items-center gap-1 hover:text-red-300 transition-colors">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="8" x2="12" y2="12" />
                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                                API error — click to retry
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Favorites filter */}
                        {favorites.size > 0 && (
                            <button
                                className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border transition-colors
                  ${isDark
                                        ? 'border-[#7c3aed]/40 text-[#7c3aed] bg-[#7c3aed]/10 hover:bg-[#7c3aed]/20'
                                        : 'border-[#7c3aed]/30 text-[#7c3aed] bg-[#7c3aed]/5 hover:bg-[#7c3aed]/10'
                                    }`}
                            >
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="#7c3aed" stroke="#7c3aed" strokeWidth="2">
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                </svg>
                                {favorites.size} saved
                            </button>
                        )}

                        <button className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border transition-colors
              ${isDark
                                ? 'text-gray-400 hover:text-white border-white/[0.08] hover:border-white/20'
                                : 'text-gray-600 hover:text-gray-900 border-gray-200 hover:border-gray-300'
                            }`}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                                <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                            </svg>
                            Customize
                        </button>
                    </div>
                </div>

                {/* 3-column grid */}
                <div className="grid grid-cols-3 flex-1 min-h-0 overflow-hidden">
                    <TokenColumn
                        title="New Tokens"
                        tokens={newTokens}
                        hotToken={hotToken}
                        isDark={isDark}
                        flashMap={flashMap}
                        favorites={favorites}
                        onFavorite={toggleFavorite}
                        isLoading={isLoading}
                        search={search}
                    />
                    <TokenColumn
                        title="About to Migrate"
                        tokens={migratingTokens}
                        isDark={isDark}
                        flashMap={flashMap}
                        favorites={favorites}
                        onFavorite={toggleFavorite}
                        isLoading={isLoading}
                        search={search}
                    />
                    <TokenColumn
                        title="Migrated"
                        tokens={migratedTokens}
                        isDark={isDark}
                        flashMap={flashMap}
                        favorites={favorites}
                        onFavorite={toggleFavorite}
                        isLoading={isLoading}
                        search={search}
                    />
                </div>
            </div>

            {/* ── MOBILE ── */}
            <div className="flex flex-col flex-1 min-h-0 md:hidden">

                {/* Mobile search */}
                <div className={`flex items-center gap-2 px-3 py-2 border-b ${bd}
                    ${isDark ? 'bg-[#0d0d0d]' : 'bg-gray-50'}`}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                        stroke={isDark ? '#6b7280' : '#9ca3af'} strokeWidth="2">
                        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                    </svg>
                    <Input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search tokens..."
                        className={`flex-1 bg-transparent outline-none text-xs
              ${isDark ? 'text-white placeholder:text-gray-600' : 'text-gray-900 placeholder:text-gray-400'}`}
                    />

                    {search && (
                        <button onClick={() => setSearch('')}
                            className={isDark ? 'text-gray-600' : 'text-gray-400'}>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>

                {/* Mobile tabs */}
                <div className={`flex border-b shrink-0 ${bd}`}>
                    {([
                        { key: 'new' as const, label: 'New' },
                        { key: 'migrate' as const, label: 'Migrating' },
                        { key: 'migrated' as const, label: 'Migrated' },
                    ]).map(tab => (
                        <button key={tab.key} onClick={() => setMobileTab(tab.key)}
                            className={`flex-1 py-2.5 text-xs font-semibold border-b-2 -mb-px transition-colors
                ${mobileTab === tab.key
                                    ? 'text-[#7c3aed] border-[#7c3aed]'
                                    : isDark ? 'text-gray-500 border-transparent' : 'text-gray-400 border-transparent'
                                }`}>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Mobile HOT SNIPE — only on new tab */}
                {mobileTab === 'new' && hotToken && (
                    <HotSnipeCard token={hotToken} isDark={isDark} />
                )}

                {/* Mobile token list */}
                <div className="flex-1 overflow-y-auto">
                    {isLoading ? (
                        Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} isDark={isDark} />)
                    ) : filteredMobile.length === 0 ? (
                        <EmptyState query={search} isDark={isDark} />
                    ) : (
                        filteredMobile.map(t =>
                            isDark ? (
                                <DarkRow
                                    key={t.id}
                                    token={t}
                                    flashDir={flashMap[t.id]}
                                    isFavorite={favorites.has(t.id)}
                                    onFavorite={() => toggleFavorite(t.id)}
                                />
                            ) : (
                                <LightRow
                                    key={t.id}
                                    token={t}
                                    flashDir={flashMap[t.id]}
                                    isFavorite={favorites.has(t.id)}
                                    onFavorite={() => toggleFavorite(t.id)}
                                />
                            )
                        )
                    )}
                </div>

                <BottomNav isDark={isDark} />
            </div>
        </div>
    );
}