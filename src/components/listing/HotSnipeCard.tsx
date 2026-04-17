
import { type LiveToken, } from '@/hooks/useLiveTokens';

export function HotSnipeCard({ token, isDark }: { token: LiveToken; isDark: boolean }) {
    return (
        <a href={token.url} target="_blank" rel="noreferrer"
            className="block mx-2 my-2 p-2.5 rounded-xl border border-[#7c3aed]/50
        bg-[#7c3aed]/10 hover:bg-[#7c3aed]/15 transition-all cursor-pointer">
            <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[9px] font-black text-[#7c3aed] tracking-[0.15em] uppercase">
                    🔥 Hot Snipe
                </span>
                <span className="text-[9px] font-bold bg-[#7c3aed] text-white px-1.5 py-0.5 rounded-full">
                    {token.snipeScore}
                </span>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                    <div className={`w-5 h-5 rounded ${token.avatarColor} flex items-center justify-center text-white text-[8px] font-bold shrink-0`}>
                        {token.symbol[0]}
                    </div>
                    <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {token.symbol}
                    </span>
                    <span className="text-[10px] text-gray-500 truncate max-w-[80px]">{token.name}</span>
                </div>
                <div className="text-right">
                    <div className="text-[10px] font-semibold text-green-400">{token.volumeFmt}</div>
                    <div className={`text-[9px] ${token.change5m >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {token.change5m >= 0 ? '+' : ''}{token.change5m.toFixed(1)}%
                    </div>
                </div>
            </div>
        </a>
    );
}