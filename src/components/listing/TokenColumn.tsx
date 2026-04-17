import { type LiveToken, type FlashMap, } from '@/hooks/useLiveTokens';
import { useState } from 'react';
import { SortBar } from '@/components/listing/SortBar';
import { SkeletonRow } from '@/components/listing/SkeletonRow';
import { EmptyState } from '@/components/listing/EmptyState';
import { HotSnipeCard } from '@/components/listing/HotSnipeCard';
import { DarkRow, LightRow } from '@/components/listing/TokenRow';

type SortKey = 'volume' | 'age' | 'change' | 'mcap' | 'snipe';
type SortDir = 'desc' | 'asc';
interface Sort { key: SortKey; dir: SortDir }

function sortTokens(tokens: LiveToken[], sort: Sort): LiveToken[] {
    return [...tokens].sort((a, b) => {
        let aV = 0, bV = 0;
        switch (sort.key) {
            case 'volume': aV = a.volumeUsd; bV = b.volumeUsd; break;
            case 'age': aV = a.ageMs; bV = b.ageMs; break;
            case 'change': aV = a.change5m; bV = b.change5m; break;
            case 'mcap': aV = a.marketCapUsd; bV = b.marketCapUsd; break;
            case 'snipe': aV = a.snipeScore; bV = b.snipeScore; break;
        }
        return sort.dir === 'desc' ? bV - aV : aV - bV;
    });
}

export function TokenColumn({
    title, tokens, hotToken, isDark, flashMap,
    favorites, onFavorite, isLoading, search,
}: {
    title: string;
    tokens: LiveToken[];
    hotToken?: LiveToken;
    isDark: boolean;
    flashMap: FlashMap;
    favorites: Set<string>;
    onFavorite: (id: string) => void;
    isLoading: boolean;
    search: string;
}) {
    const [sort, setSort] = useState<Sort>({ key: 'snipe', dir: 'desc' });

    function toggleSort(key: SortKey) {
        setSort(prev =>
            prev.key === key
                ? { key, dir: prev.dir === 'desc' ? 'asc' : 'desc' }
                : { key, dir: 'desc' }
        );
    }

    const bd = isDark ? 'border-white/[0.07]' : 'border-gray-200';

    // Apply search filter
    const filtered = tokens.filter(t =>
        !search ||
        t.symbol.toLowerCase().includes(search.toLowerCase()) ||
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.address.toLowerCase().includes(search.toLowerCase())
    );

    // Apply sort
    const sorted = sortTokens(filtered, sort);

    return (
        <div className={`flex flex-col border-r last:border-r-0 ${bd} min-h-0`}>
            {/* Column header */}
            <div className={`flex items-center justify-between px-3 py-2.5 border-b ${bd} shrink-0`}>
                <div className="flex items-center gap-2">
                    <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {title}
                    </span>
                    {/* Live indicator */}
                    <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7c3aed] opacity-75" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#7c3aed]" />
                    </span>
                </div>
                <SortBar sort={sort} onSort={toggleSort} isDark={isDark} />
            </div>

            {/* HOT SNIPE card — new tokens column only */}
            {hotToken && <HotSnipeCard token={hotToken} isDark={isDark} />}

            {/* Token list */}
            <div className="flex-1 overflow-y-auto">
                {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} isDark={isDark} />)
                ) : sorted.length === 0 ? (
                    <EmptyState query={search} isDark={isDark} />
                ) : (
                    sorted.map(t =>
                        isDark ? (
                            <DarkRow
                                key={t.id}
                                token={t}
                                flashDir={flashMap[t.id]}
                                isFavorite={favorites.has(t.id)}
                                onFavorite={() => onFavorite(t.id)}
                            />
                        ) : (
                            <LightRow
                                key={t.id}
                                token={t}
                                flashDir={flashMap[t.id]}
                                isFavorite={favorites.has(t.id)}
                                onFavorite={() => onFavorite(t.id)}
                            />
                        )
                    )
                )}
            </div>
        </div>
    );
}
