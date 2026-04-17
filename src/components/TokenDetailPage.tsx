'use client';

import { useState } from 'react';
import { DERIV_SYMBOLS, } from '@/hooks/useDerivChart';
import { useThemeToggle } from '@/hooks/useTheme';
import { DerivCandleChart } from '@/components/token/DerivCandleChart';
import { TradeTable } from '@/components/token/TradeTable';
import { TradingPanel } from '@/components/token/TradingPanel';
import { AppNav } from '@/components/shared/AppNav';
import { TokenHeader } from '@/components/token/TokenHeader';
import { ChartToolbar } from '@/components/token/ChartToolbar';
import { Select } from '@/components/ui/Select';



export function TokenDetailPage() {
    const [tf, setTf] = useState('5m');
    const [symbol, setSymbol] = useState('R_100');
    const { isDark, toggleTheme } = useThemeToggle();


    const bg = isDark ? 'bg-[#0d0d0d]' : 'bg-white';
    const bd = isDark ? 'border-white/[0.07]' : 'border-gray-200';
    const mu = isDark ? 'text-gray-500' : 'text-gray-400';
    const tx = isDark ? 'text-white' : 'text-gray-900';

    return (
        <div className={`flex flex-col h-screen overflow-hidden ${bg}`}>

            <AppNav isDark={isDark} toggleTheme={toggleTheme} />

            {/* ── DESKTOP ── */}
            <div className="hidden md:flex flex-col flex-1 min-h-0">
                <TokenHeader isDark={isDark} />
                <div className="flex flex-1 min-h-0">
                    <div className="flex-1 flex flex-col min-h-0 min-w-0">
                        <ChartToolbar
                            isDark={isDark}
                            tf={tf} setTf={setTf}
                            symbol={symbol} setSymbol={setSymbol}
                        />
                        {/* Chart area */}
                        <div className={`flex-1 min-h-0 ${bg}`}>
                            <DerivCandleChart symbol={symbol} timeframe={tf} isDark={isDark} />
                        </div>
                        {/* Trade table */}
                        <div className="h-64 shrink-0 flex flex-col">
                            <TradeTable isDark={isDark} />
                        </div>
                    </div>
                    <TradingPanel isDark={isDark} />
                </div>
            </div>

            {/* ── MOBILE ── */}
            <div className="flex flex-col flex-1 min-h-0 md:hidden overflow-y-auto">

                {/* Mobile token header */}
                <div className={`px-4 py-3 border-b ${bd} ${isDark ? 'bg-[#111]' : 'bg-white'}`}>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-sm font-bold shrink-0">H</div>
                        <span className={`text-sm font-semibold ${tx}`}>honeypot/SOL</span>
                        <span className={`ml-auto text-xl font-extrabold ${tx}`}>$3.03K</span>
                    </div>
                    <div className={`flex items-center gap-3 text-[10px] ${mu}`}>
                        <span>Liq <span className={tx}>$6.44K</span></span>
                        <span>Supply <span className={tx}>996M</span></span>
                        <span>MCap <span className={tx}>$3.03K</span></span>
                        <span>B.Curve <span className="text-green-500">2%</span></span>
                    </div>
                </div>

                {/* Mobile TF + symbol */}
                <div className={`flex items-center gap-2 px-3 py-2 border-b ${bd} ${isDark ? 'bg-[#111]' : 'bg-white'}`}>
                    {['1m', '5m', '15m', '1h'].map(t => (
                        <button key={t} onClick={() => setTf(t)}
                            className={`text-xs px-2.5 py-1 rounded font-medium transition-colors
                ${tf === t ? 'bg-[#7c3aed] text-white' : mu}`}>
                            {t}
                        </button>
                    ))}

                    <Select
                        symbol={symbol}
                        func={setSymbol}
                        data={DERIV_SYMBOLS}
                        className={`ml-auto text-xs px-2 py-1 rounded border outline-none font-mono
              ${isDark ? 'bg-[#1a1a1a] border-white/[0.08] text-gray-200' : 'bg-gray-50 border-gray-200 text-gray-700'}`}
                    />
                </div>

                {/* Mobile chart */}
                <div className={`h-56 shrink-0 ${bg}`}>
                    <DerivCandleChart symbol={symbol} timeframe={tf} isDark={isDark} />
                </div>

                <TradingPanel isDark={isDark} />

                {/* Mobile trade rows */}
                <div className="h-64 shrink-0 flex flex-col">
                    <TradeTable isDark={isDark} />
                </div>
            </div>
        </div>
    );
}