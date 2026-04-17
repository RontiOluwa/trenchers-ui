import type { Token } from './types';
import { useRouter } from 'next/navigation';
import { type LiveToken } from '@/hooks/useLiveTokens';
import { SnipeBadge } from '@/components/listing/SnipeBadge';

export function DarkRow({
    token, flashDir, isFavorite, onFavorite,
}: {
    token: LiveToken;
    flashDir?: 'up' | 'down';
    isFavorite: boolean;
    onFavorite: () => void;
}) {
    const router = useRouter();

    return (
        <div className={`group relative flex items-start gap-2 px-3 py-2.5
      border-b border-white/[0.05] cursor-pointer
      hover:bg-white/[0.03] transition-colors
      ${flashDir === 'up' ? 'flash-up' : flashDir === 'down' ? 'flash-down' : ''}`}
            onClick={() => {
                router.push('/token');
            }}
        >
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-lg shrink-0 ${token.avatarColor}
        flex items-center justify-center text-white text-[10px] font-bold`}>
                {token.symbol[0]}
            </div>

            <div className="flex-1 min-w-0">
                {/* Name row */}
                <div className="flex items-start justify-between gap-1.5">
                    <div className="min-w-0 flex items-center gap-1.5 flex-wrap">
                        <span className="text-white text-xs font-semibold">{token.symbol}</span>
                        <span className="text-gray-500 text-[10px] truncate max-w-[80px]">{token.name}</span>
                        <SnipeBadge score={token.snipeScore} breakdown={token.snipeBreak} />
                    </div>
                    <div className="text-right shrink-0">
                        <div className="text-white text-[11px] font-medium">{token.volumeFmt}</div>
                        <div className="text-gray-500 text-[9px]">MC {token.marketCapFmt}</div>
                    </div>
                </div>

                {/* Stats row */}
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-violet-400 text-[10px]">{token.age}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded
            ${token.change5m >= 0
                            ? 'bg-green-500/15 text-green-400'
                            : 'bg-red-500/15 text-red-400'
                        }`}>
                        {token.change5m >= 0 ? '+' : ''}{token.change5m.toFixed(1)}%
                    </span>
                    <span className="text-[9px] text-gray-600">
                        B{token.buys5m} S{token.sells5m}
                    </span>
                </div>
            </div>

            {/* Favorite button */}
            <button
                onClick={(e) => { e.stopPropagation(); onFavorite(); }}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 shrink-0"
            >
                <svg width="12" height="12" viewBox="0 0 24 24"
                    fill={isFavorite ? '#7c3aed' : 'none'}
                    stroke={isFavorite ? '#7c3aed' : '#6b7280'}
                    strokeWidth="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
            </button>
        </div>
    );
}

export function LightRow({
    token, flashDir, isFavorite, onFavorite,
}: {
    token: LiveToken;
    flashDir?: 'up' | 'down';
    isFavorite: boolean;
    onFavorite: () => void;
}) {
    const router = useRouter();

    return (
        <div className={`group relative flex items-start gap-2.5 px-3 py-3
      border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors
      ${flashDir === 'up' ? 'flash-up' : flashDir === 'down' ? 'flash-down' : ''}`}
            onClick={() => {
                router.push('/token');
            }}
        >
            <div className={`w-9 h-9 rounded-xl shrink-0 ${token.avatarColor}
        flex items-center justify-center text-white text-sm font-bold`}>
                {token.symbol[0]}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex items-center gap-1.5 flex-wrap">
                        <span className="text-gray-900 text-sm font-semibold">{token.symbol}</span>
                        <span className="text-gray-400 text-xs truncate max-w-[70px]">{token.name}</span>
                        <SnipeBadge score={token.snipeScore} breakdown={token.snipeBreak} />
                    </div>
                    <div className="text-right shrink-0">
                        <div className="text-gray-900 text-sm font-semibold">{token.volumeFmt}</div>
                        <div className="text-gray-400 text-xs">MC {token.marketCapFmt}</div>
                    </div>
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-gray-400 text-xs">{token.age}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded
            ${token.change5m >= 0
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-600'
                        }`}>
                        {token.change5m >= 0 ? '+' : ''}{token.change5m.toFixed(1)}%
                    </span>
                    <div className="ml-auto flex items-center gap-1">
                        <span className="text-[10px] font-bold bg-green-100 text-green-700 px-1.5 py-0.5 rounded">
                            B {token.buys5m}
                        </span>
                        <span className="text-[10px] font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded">
                            S {token.sells5m}
                        </span>
                    </div>
                </div>
            </div>

            <button
                onClick={(e) => { e.stopPropagation(); onFavorite(); }}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 shrink-0 self-start mt-1"
            >
                <svg width="13" height="13" viewBox="0 0 24 24"
                    fill={isFavorite ? '#7c3aed' : 'none'}
                    stroke={isFavorite ? '#7c3aed' : '#9ca3af'}
                    strokeWidth="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
            </button>
        </div>
    );
}
