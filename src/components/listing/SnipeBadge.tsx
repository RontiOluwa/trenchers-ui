import { type SnipeBreakdown } from '@/hooks/useLiveTokens';


export function SnipeBadge({ score, breakdown }: { score: number; breakdown: SnipeBreakdown }) {
    const color = score >= 75
        ? 'text-green-400 bg-green-500/15 border-green-500/30'
        : score >= 50
            ? 'text-yellow-400 bg-yellow-500/15 border-yellow-500/30'
            : 'text-gray-400 bg-white/[0.06] border-white/10';

    const rows = [
        { label: 'LP Burned', val: breakdown.lpBurned, max: 30 },
        { label: 'Vol Velocity', val: breakdown.volVelocity, max: 25 },
        { label: 'Buy Pressure', val: breakdown.buyPressure, max: 10 },
        { label: 'Holder Spread', val: breakdown.holderSpread, max: 15 },
        { label: 'Dev Wallet', val: breakdown.devWallet, max: 20 },
    ];

    return (
        <div className="relative group/tip">
            {/* Badge */}
            <div className={`inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded border ${color} cursor-help select-none`}>
                ⚡{score}
            </div>

            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50
        w-44 bg-[#1a1a1a] border border-white/10 rounded-xl p-3 shadow-xl
        opacity-0 group-hover/tip:opacity-100 pointer-events-none
        transition-opacity duration-150">
                <div className="text-[10px] font-bold text-white mb-2 flex items-center justify-between">
                    <span>Snipe Score</span>
                    <span className={score >= 75 ? 'text-green-400' : score >= 50 ? 'text-yellow-400' : 'text-gray-400'}>
                        {score}/100
                    </span>
                </div>
                {rows.map(r => (
                    <div key={r.label} className="mb-1.5">
                        <div className="flex justify-between text-[9px] text-gray-400 mb-0.5">
                            <span>{r.label}</span>
                            <span className="text-white">{r.val}/{r.max}</span>
                        </div>
                        <div className="w-full h-1 bg-white/[0.08] rounded-full overflow-hidden">
                            <div
                                className="h-full bg-[#7c3aed] rounded-full"
                                style={{ width: `${(r.val / r.max) * 100}%` }}
                            />
                        </div>
                    </div>
                ))}
                {/* Arrow */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1a1a1a]" />
            </div>
        </div>
    );
}