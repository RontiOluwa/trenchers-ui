'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface SnipeBreakdown {
    lpBurned: number; // 0-30
    volVelocity: number; // 0-25
    buyPressure: number; // 0-10
    holderSpread: number; // 0-15
    devWallet: number; // 0-20
}

export interface LiveToken {
    id: string;
    symbol: string;
    name: string;
    address: string;
    pairAddress: string;
    age: string;
    ageMs: number;
    volumeUsd: number;
    volumeFmt: string;
    marketCapUsd: number;
    marketCapFmt: string;
    liquidityUsd: number;
    priceUsd: number;
    change5m: number;
    change1h: number;
    buys5m: number;
    sells5m: number;
    snipeScore: number;
    snipeBreak: SnipeBreakdown;
    dexId: string;
    avatarColor: string;
    url: string;
}

export type FlashDir = 'up' | 'down';
export type FlashMap = Record<string, FlashDir>;

// ── Helpers ───────────────────────────────────────────────────────────────────

export function formatUsd(n: number): string {
    if (!n || isNaN(n)) return '$0';
    if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2)}B`;
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
    if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
    return `$${n.toFixed(2)}`;
}

export function formatAge(createdAt: number): string {
    const s = Math.floor((Date.now() - createdAt) / 1_000);
    if (s < 60) return `${s}s`;
    const m = Math.floor(s / 60);
    if (m < 60) return `${m}m`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h`;
    return `${Math.floor(h / 24)}d`;
}

// Deterministic value from string — avoids Math.random() for stable scores
function hashNum(str: string, max: number): number {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
        h = ((h * 31) + str.charCodeAt(i)) & 0xffffffff;
    }
    return Math.abs(h) % max;
}

const COLORS = [
    'bg-violet-500', 'bg-orange-500', 'bg-red-500', 'bg-emerald-600',
    'bg-sky-500', 'bg-amber-500', 'bg-pink-500', 'bg-green-600',
    'bg-indigo-500', 'bg-purple-500', 'bg-blue-500', 'bg-teal-500',
    'bg-cyan-600', 'bg-yellow-600', 'bg-rose-500',
];
function avatarColor(str: string) { return COLORS[hashNum(str, COLORS.length)]; }

// ── Snipe Score ───────────────────────────────────────────────────────────────

function calcSnipeScore(t: {
    id: string; volumeUsd: number; marketCapUsd: number;
    liquidityUsd: number; buys5m: number; sells5m: number;
    dexId: string; ageMs: number;
}): { score: number; snipeBreak: SnipeBreakdown } {
    // LP Burned (0-30): Raydium = LP likely burned, pump.fun = not yet
    const lpBurned = t.dexId === 'raydium'
        ? 22 + hashNum(t.id + 'lp', 9)            // 22-30
        : t.ageMs < 3_600_000
            ? 2 + hashNum(t.id + 'lp', 8)          // 2-9  (brand new)
            : 10 + hashNum(t.id + 'lp', 11);        // 10-20 (older pump)

    // Volume Velocity (0-25): volume relative to market cap
    const ratio = t.marketCapUsd > 0 ? t.volumeUsd / t.marketCapUsd : 0;
    const volVelocity = Math.min(25, Math.floor(ratio * 20));

    // Buy Pressure (0-10): 5m buys vs sells
    const total = t.buys5m + t.sells5m;
    const buyPressure = total > 0
        ? Math.floor((t.buys5m / total) * 10)
        : 4 + hashNum(t.id + 'bp', 3);

    // Holder Spread (0-15): log scale of market cap
    const holderSpread = Math.min(15, Math.max(2,
        Math.floor(Math.log10(Math.max(t.marketCapUsd, 100)) * 2)
    ));

    // Dev Wallet (0-20): deterministic from id
    const devWallet = 8 + hashNum(t.id + 'dw', 13);

    const score = Math.min(100, lpBurned + volVelocity + buyPressure + holderSpread + devWallet);
    return { score, snipeBreak: { lpBurned, volVelocity, buyPressure, holderSpread, devWallet } };
}

// ── DexScreener API types ─────────────────────────────────────────────────────

interface DexPair {
    chainId: string;
    dexId: string;
    url: string;
    pairAddress: string;
    baseToken: { address: string; name: string; symbol: string };
    priceUsd?: string;
    txns: { m5: { buys: number; sells: number }; h1: { buys: number; sells: number } };
    volume: { h24: number; h1: number; m5: number };
    priceChange: { m5: number; h1: number; h24: number };
    liquidity?: { usd: number };
    marketCap?: number;
    fdv?: number;
    pairCreatedAt: number;
}

function toToken(p: DexPair): LiveToken {
    const ageMs = Date.now() - (p.pairCreatedAt ?? 0);
    const mcap = p.marketCap ?? p.fdv ?? 0;
    const liq = p.liquidity?.usd ?? 0;
    const buys5m = p.txns?.m5?.buys ?? 0;
    const sells5m = p.txns?.m5?.sells ?? 0;

    const { score, snipeBreak } = calcSnipeScore({
        id: p.pairAddress, volumeUsd: p.volume?.h24 ?? 0,
        marketCapUsd: mcap, liquidityUsd: liq,
        buys5m, sells5m, dexId: p.dexId, ageMs,
    });

    return {
        id: p.pairAddress,
        symbol: p.baseToken.symbol,
        name: p.baseToken.name,
        address: p.baseToken.address,
        pairAddress: p.pairAddress,
        age: formatAge(p.pairCreatedAt ?? Date.now()),
        ageMs,
        volumeUsd: p.volume?.h24 ?? 0,
        volumeFmt: formatUsd(p.volume?.h24 ?? 0),
        marketCapUsd: mcap,
        marketCapFmt: formatUsd(mcap),
        liquidityUsd: liq,
        priceUsd: parseFloat(p.priceUsd ?? '0'),
        change5m: p.priceChange?.m5 ?? 0,
        change1h: p.priceChange?.h1 ?? 0,
        buys5m,
        sells5m,
        snipeScore: score,
        snipeBreak,
        dexId: p.dexId,
        avatarColor: avatarColor(p.pairAddress),
        url: p.url,
    };
}

// ── Fetch ─────────────────────────────────────────────────────────────────────

async function fetchDexScreener(): Promise<LiveToken[]> {
    const results: DexPair[] = [];
    const seen = new Set<string>();

    // Two queries that reliably return recent Solana meme pairs
    const queries = ['bonk', 'pump'];

    await Promise.allSettled(queries.map(async (q) => {
        const res = await fetch(
            `https://api.dexscreener.com/latest/dex/search?q=${q}`,
            { next: { revalidate: 0 } }
        );
        if (!res.ok) return;
        const data = await res.json();
        const pairs: DexPair[] = data.pairs ?? [];
        pairs
            .filter(p => p.chainId === 'solana' && p.pairCreatedAt)
            .forEach(p => {
                if (!seen.has(p.pairAddress)) {
                    seen.add(p.pairAddress);
                    results.push(p);
                }
            });
    }));

    if (results.length === 0) throw new Error('No data from DexScreener');
    return results.map(toToken);
}

// ── Micro-update simulation (keeps UI alive between fetches) ──────────────────

function simulateUpdate(tokens: LiveToken[]): {
    tokens: LiveToken[];
    changedIds: Map<string, FlashDir>;
} {
    const changedIds = new Map<string, FlashDir>();

    const updated = tokens.map(t => {
        if (Math.random() > 0.35) return t; // only update ~35% each tick

        const priceDelta = (Math.random() - 0.42) * 0.06;
        const volDelta = Math.random() * 0.025;
        const newPrice = t.priceUsd * (1 + priceDelta);
        const newVol = t.volumeUsd * (1 + volDelta);
        const newBuys = t.buys5m + Math.floor(Math.random() * 3);
        const newSells = t.sells5m + Math.floor(Math.random() * 2);

        changedIds.set(t.id, priceDelta >= 0 ? 'up' : 'down');

        const { score, snipeBreak } = calcSnipeScore({
            ...t, volumeUsd: newVol, buys5m: newBuys, sells5m: newSells,
        });

        return {
            ...t,
            priceUsd: newPrice,
            volumeUsd: newVol,
            volumeFmt: formatUsd(newVol),
            change5m: t.change5m + priceDelta * 100,
            buys5m: newBuys,
            sells5m: newSells,
            snipeScore: score,
            snipeBreak,
        };
    });

    return { tokens: updated, changedIds };
}

// ── Hook ──────────────────────────────────────────────────────────────────────

const ONE_HOUR = 3_600_000;
const SIX_HOURS = 21_600_000;

export function useLiveTokens() {
    const [allTokens, setAllTokens] = useState<LiveToken[]>([]);
    const [flashMap, setFlashMap] = useState<FlashMap>({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

    const timeouts = useRef(new Map<string, ReturnType<typeof setTimeout>>());
    const fetchTimer = useRef<ReturnType<typeof setInterval>>();
    const simTimer = useRef<ReturnType<typeof setInterval>>();
    const mounted = useRef(true);

    // Apply flash then auto-clear after 700ms
    const triggerFlash = useCallback((ids: Map<string, FlashDir>) => {
        if (!ids.size) return;
        setFlashMap(prev => {
            const next = { ...prev };
            ids.forEach((dir, id) => { next[id] = dir; });
            return next;
        });
        ids.forEach((_, id) => {
            const old = timeouts.current.get(id);
            if (old) clearTimeout(old);
            const t = setTimeout(() => {
                if (!mounted.current) return;
                setFlashMap(prev => { const n = { ...prev }; delete n[id]; return n; });
            }, 700);
            timeouts.current.set(id, t);
        });
    }, []);

    const fetchData = useCallback(async () => {
        try {
            const tokens = await fetchDexScreener();
            if (!mounted.current) return;
            setAllTokens(prev => {
                // Detect changes vs previous data for flash
                if (prev.length) {
                    const prevMap = new Map(prev.map(t => [t.id, t]));
                    const changed = new Map<string, FlashDir>();
                    tokens.forEach(t => {
                        const old = prevMap.get(t.id);
                        if (old && Math.abs(t.volumeUsd - old.volumeUsd) > old.volumeUsd * 0.01) {
                            changed.set(t.id, t.volumeUsd > old.volumeUsd ? 'up' : 'down');
                        }
                    });
                    if (changed.size) triggerFlash(changed);
                }
                return tokens;
            });
            setError(null);
            setLastUpdate(new Date());
        } catch (e) {
            if (!mounted.current) return;
            setError(e instanceof Error ? e.message : 'Failed to fetch');
        } finally {
            if (mounted.current) setIsLoading(false);
        }
    }, [triggerFlash]);

    useEffect(() => {
        mounted.current = true;
        fetchData();

        // Re-fetch real data every 15s
        fetchTimer.current = setInterval(fetchData, 15_000);

        // Simulate micro-updates every 2s for live feel
        simTimer.current = setInterval(() => {
            if (!mounted.current) return;
            setAllTokens(prev => {
                if (!prev.length) return prev;
                const { tokens, changedIds } = simulateUpdate(prev);
                triggerFlash(changedIds);
                return tokens;
            });
        }, 2_000);

        return () => {
            mounted.current = false;
            clearInterval(fetchTimer.current);
            clearInterval(simTimer.current);
            timeouts.current.forEach(clearTimeout);
        };
    }, [fetchData, triggerFlash]);

    // Categorize by age + liquidity
    const newTokens = allTokens
        .filter(t => t.ageMs < ONE_HOUR)
        .sort((a, b) => a.ageMs - b.ageMs);

    const migratingTokens = allTokens
        .filter(t => t.ageMs >= ONE_HOUR && t.ageMs < SIX_HOURS)
        .sort((a, b) => b.snipeScore - a.snipeScore);

    const migratedTokens = allTokens
        .filter(t => t.ageMs >= SIX_HOURS || t.dexId === 'raydium')
        .sort((a, b) => b.volumeUsd - a.volumeUsd);

    return {
        newTokens, migratingTokens, migratedTokens,
        flashMap, isLoading, error, lastUpdate,
        refetch: fetchData,
    };
}