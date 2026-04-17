'use client';

import { useDerivChart } from '@/hooks/useDerivChart';
import { CandleChart } from '@/components/token/CandleChart';
import { ChartSkeleton } from '@/components/token/ChartSkeleton';

interface Props {
    symbol: string;
    timeframe: string;
    isDark: boolean;
}

export function DerivCandleChart({
    symbol, timeframe, isDark,
}: {
    symbol: string;
    timeframe: string;
    isDark: boolean;
}) {
    const { candles, status, error, retry } = useDerivChart(symbol, timeframe);

    const isLoading = status === 'connecting' || status === 'loading';
    const isReady = status === 'live' && candles.length > 1;
    const isError = status === 'error' || status === 'closed';
    const mu = isDark ? 'text-gray-500' : 'text-gray-400';

    return (
        <div className="relative w-full h-full">
            {/* Chart — rendered always so canvas sizes correctly */}
            <div className={`w-full h-full transition-opacity duration-500 ${isReady ? 'opacity-100' : 'opacity-0'}`}>
                <CandleChart candles={candles} isDark={isDark} />
            </div>

            {/* Skeleton while loading */}
            {isLoading && <ChartSkeleton status={status} isDark={isDark} />}

            {/* Error state with retry */}
            {isError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                    <div className={`p-3 rounded-xl ${isDark ? 'bg-red-500/10 border border-red-500/20' : 'bg-red-50 border border-red-200'}`}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                    </div>
                    <p className="text-xs text-red-500 max-w-[200px] text-center">{error ?? 'Connection closed'}</p>
                    <button
                        onClick={retry}
                        className="flex items-center gap-2 text-xs font-semibold
              bg-[#7c3aed] hover:bg-[#6d28d9] text-white
              px-4 py-2 rounded-lg transition-all active:scale-95
              hover:shadow-lg hover:shadow-[#7c3aed]/30"
                    >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                            <path d="M3 3v5h5" />
                        </svg>
                        Retry Connection
                    </button>
                </div>
            )}

            {/* Live pulse badge */}
            {isReady && (
                <div className="absolute top-2 left-2 flex items-center gap-1.5 pointer-events-none">
                    <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7c3aed] opacity-75" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#7c3aed]" />
                    </span>
                    <span className={`font-mono text-[9px] tracking-widest ${mu}`}>
                        LIVE · {symbol}
                    </span>
                </div>
            )}

            {/* Candle count */}
            {isReady && (
                <p className={`absolute bottom-9 right-20 font-mono text-[8px] opacity-30 pointer-events-none ${isDark ? 'text-white' : 'text-gray-700'}`}>
                    {candles.length} candles
                </p>
            )}
        </div>
    );
}