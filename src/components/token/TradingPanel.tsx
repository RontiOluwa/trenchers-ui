import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

export function TradingPanel({ isDark }: { isDark: boolean }) {
    const [side, setSide] = useState<'buy' | 'sell'>('buy');
    const [amount, setAmount] = useState('0.00');
    const [preset, setPreset] = useState('0.5');
    const [exitStrat, setExitStrat] = useState(false);
    const [loading, setLoading] = useState(false);
    const [confirmed, setConfirmed] = useState(false);

    const PRESETS = ['0.1', '0.2', '0.5', '1', 'X'];

    function handleTrade() {
        if (loading) return;
        setLoading(true);
        setTimeout(() => {
            setLoading(false); setConfirmed(true);
            setTimeout(() => setConfirmed(false), 2000);
        }, 1200);
    }

    const mu = isDark ? 'text-gray-500' : 'text-gray-400';
    const tx = isDark ? 'text-white' : 'text-gray-900';
    const inputBg = isDark ? 'bg-[#1a1a1a] border-white/[0.1] text-white' : 'bg-gray-50 border-gray-200 text-gray-900';
    const presBg = isDark ? 'bg-[#1a1a1a] hover:bg-[#252525] text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700';

    return (
        <div className={`w-inherit shrink-0 flex flex-col overflow-y-auto
      ${isDark ? 'bg-[#111] border-l border-white/[0.07]' : 'bg-white border-l border-gray-200'}`}
        >
            {/* Buy / Sell tabs */}
            <div className="flex m-3 gap-2">
                {(['buy', 'sell'] as const).map(s => (
                    <button key={s} onClick={() => setSide(s)}
                        className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors
              ${side === s
                                ? s === 'buy' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                                : isDark ? 'bg-[#1a1a1a] text-gray-400' : 'bg-gray-100 text-gray-500'
                            }`}>
                        {s === 'buy' ? 'Buy' : 'Sell'}
                    </button>
                ))}
            </div>

            {/* Market */}

            <Select
                symbol={'Market'}
                func={() => ('')}
                data={[{
                    value: 'Market',
                    label: 'Market',
                }]}
                className={`flex items-center justify-between mx-3 mb-3 px-3 py-2 rounded-lg border 
                ${isDark ? 'border-white/[0.08] bg-[#1a1a1a] text-white' : 'border-gray-200 bg-gray-50 text-gray-500'}`}
            />

            {/* Amount */}
            <div className={`mx-3 mb-2 flex items-center gap-2 px-3 py-2.5 rounded-lg border ${inputBg}`}>
                <span className="text-[#9966ff] text-xs font-bold">SOL</span>
                <Input
                    type="number"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    placeholder="0.00"
                    className={`flex-1 bg-transparent outline-none text-sm font-mono ${tx}`}
                />
            </div>

            {/* Presets */}
            <div className="grid grid-cols-5 gap-1.5 mx-3 mb-3">
                {PRESETS.map(p => (
                    <button key={p}
                        onClick={() => { setPreset(p); if (p !== 'X') setAmount(p); }}
                        className={`py-1.5 text-xs font-semibold rounded-lg transition-all
              ${preset === p ? 'bg-[#7c3aed] text-white' : presBg}`}>
                        {p}
                    </button>
                ))}
            </div>

            {/* Exit strategy */}
            <div className="flex items-center gap-2 mx-3 mb-3">
                <input type="checkbox" id="exit-strat" checked={exitStrat}
                    onChange={e => setExitStrat(e.target.checked)}
                    className="w-3.5 h-3.5 accent-[#7c3aed]"
                />
                <label htmlFor="exit-strat" className={`text-xs ${mu}`}>Exit Strategy</label>
            </div>

            {/* Priority fee */}
            <div className="flex items-center justify-between mx-3 mb-3 text-xs">
                <span className={mu}>Priority Fee</span>
                <span className={tx}>0.005 SOL</span>
            </div>

            {/* Trade button */}
            <button onClick={handleTrade} disabled={loading}
                className={`mx-3 mb-4 py-3 rounded-lg text-sm font-bold text-white transition-all disabled:opacity-70
          ${confirmed ? 'bg-green-400'
                        : side === 'buy' ? 'bg-green-500 hover:bg-green-600 active:scale-[0.98]'
                            : 'bg-red-500 hover:bg-red-600 active:scale-[0.98]'
                    }`}>
                {loading ? 'Confirming...' : confirmed ? '✓ Confirmed!' : `${side === 'buy' ? 'Buy' : 'Sell'} honeypot`}
            </button>

            {/* Period changes */}
            <div className="grid grid-cols-4 gap-1 mx-3 mb-4">
                {[
                    { p: '5M', v: '+2.4%', pos: true },
                    { p: '1H', v: '+12.8%', pos: true },
                    { p: '6H', v: '-5.2%', pos: false },
                    { p: '24H', v: '+45.1%', pos: true },
                ].map(s => (
                    <div key={s.p} className={`flex flex-col items-center py-2 rounded-lg ${isDark ? 'bg-[#1a1a1a]' : 'bg-gray-50'}`}>
                        <span className={`text-[9px] ${mu}`}>{s.p}</span>
                        <span className={`text-[11px] font-bold mt-0.5 ${s.pos ? 'text-green-500' : 'text-red-500'}`}>{s.v}</span>
                    </div>
                ))}
            </div>

            {/* Token Security */}
            <div className="mx-3 mb-4">
                <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-semibold ${tx}`}>Token Security</span>
                    <span className="text-[10px] font-bold bg-green-500/15 text-green-500 border border-green-500/30 px-2 py-0.5 rounded-full">
                        Safe
                    </span>
                </div>
                <div className="space-y-2">
                    {[
                        { label: 'Mint Auth', value: 'Revoked', green: true },
                        { label: 'Freeze Auth', value: 'Revoked', green: true },
                        { label: 'LP Burned', value: '100%', green: true },
                        { label: 'Top 10 Holders', value: '18.2%', green: false },
                    ].map(row => (
                        <div key={row.label} className="flex items-center justify-between text-xs">
                            <span className={mu}>{row.label}</span>
                            <span className={row.green ? 'text-green-500' : isDark ? 'text-gray-300' : 'text-gray-700'}>
                                {row.value}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}