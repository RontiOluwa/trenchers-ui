import { DERIV_SYMBOLS, } from '@/hooks/useDerivChart';
import { Select } from '@/components/ui/Select';

export function ChartToolbar({
    isDark, tf, setTf, symbol, setSymbol,
}: {
    isDark: boolean;
    tf: string;
    setTf: (v: string) => void;
    symbol: string;
    setSymbol: (v: string) => void;
}) {
    const bd = isDark ? 'border-white/[0.07]' : 'border-gray-200';
    const mu = isDark ? 'text-gray-500' : 'text-gray-400';
    const bg = isDark ? 'bg-[#111]' : 'bg-white';
    const sel = isDark
        ? 'bg-[#1a1a1a] border-white/[0.08] text-gray-200'
        : 'bg-gray-50 border-gray-200 text-gray-700';

    return (
        <div className={`flex items-center gap-0 px-3 py-2 border-b shrink-0 overflow-x-auto scrollbar-none ${bd} ${bg}`}>
            {['1m', '5m', '15m', '1h', '4h'].map(t => (
                <button key={t} onClick={() => setTf(t)}
                    className={`text-xs px-2.5 py-1 rounded transition-colors font-medium shrink-0
            ${tf === t ? 'bg-[#7c3aed] text-white' : `${mu} hover:${isDark ? 'text-white' : 'text-gray-900'}`}`}>
                    {t}
                </button>
            ))}

            <div className={`h-4 w-px mx-2 shrink-0 ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />

            {/* Symbol selector */}
            <Select
                symbol={symbol}
                func={setSymbol}
                data={DERIV_SYMBOLS}
                className={`text-xs px-2 py-1 rounded border outline-none cursor-pointer shrink-0 font-mono tracking-wide ${sel}`}
            />

            <div className="ml-auto flex items-center gap-3 shrink-0">
                <button className={`text-xs px-2 py-1 ${mu} flex items-center gap-1`}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                    </svg>
                    Indicators
                </button>
                <span className={`text-xs ${mu}`}>USD / SOL</span>
            </div>
        </div>
    );
}