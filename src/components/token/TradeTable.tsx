import { useState } from 'react';

const TRADES = [
    { time: '2s ago', type: 'Buy', usd: '$142.50', sol: '0.95', price: '$0.00305', maker: '7xF3...kQ2' },
    { time: '5s ago', type: 'Sell', usd: '$89.20', sol: '0.60', price: '$0.00298', maker: '3aB2...mR9' },
    { time: '12s ago', type: 'Buy', usd: '$1,205', sol: '8.12', price: '$0.00310', maker: '9kL1...vX7' },
    { time: '18s ago', type: 'Buy', usd: '$56.80', sol: '0.38', price: '$0.00302', maker: '2mN8...pK4' },
    { time: '25s ago', type: 'Sell', usd: '$320.00', sol: '2.15', price: '$0.00295', maker: '5xR4...nH1' },
    { time: '34s ago', type: 'Buy', usd: '$780.00', sol: '5.20', price: '$0.00308', maker: '8jL2...wP5' },
    { time: '41s ago', type: 'Buy', usd: '$45.30', sol: '0.30', price: '$0.00301', maker: '1kF9...mN3' },
    { time: '58s ago', type: 'Sell', usd: '$210.00', sol: '1.42', price: '$0.00296', maker: '6rT4...bV8' },
];



export function TradeTable({ isDark }: { isDark: boolean }) {
    const [tab, setTab] = useState('Trades');
    const TABS = ['Trades', 'My Positions', 'Orders', 'Holders', 'Top Traders'];
    const COL = { gridTemplateColumns: '110px 90px 1fr 1fr 1fr 1fr' };
    const bd = isDark ? 'border-white/[0.07]' : 'border-gray-200';
    const mu = isDark ? 'text-gray-500' : 'text-gray-400';
    const tx = isDark ? 'text-white' : 'text-gray-900';

    return (
        <div className={`flex flex-col border-t ${bd} overflow-hidden`}>
            {/* Tabs */}
            <div className={`flex items-center border-b ${bd} px-4 shrink-0`}>
                {TABS.map(t => (
                    <button key={t} onClick={() => setTab(t)}
                        className={`text-xs font-medium px-3 py-3 border-b-2 -mb-px transition-colors whitespace-nowrap
              ${tab === t ? 'text-[#7c3aed] border-[#7c3aed]' : `${mu} border-transparent`}`}>
                        {t}
                    </button>
                ))}
            </div>

            <div className="overflow-y-auto flex-1">
                {/* Column headers */}
                <div className={`grid px-4 py-2 text-xs ${mu} border-b ${bd} sticky top-0 ${isDark ? 'bg-[#0d0d0d]' : 'bg-white'}`}
                    style={COL}>
                    {['Time', 'Type', 'USD', 'SOL', 'Price', 'Maker'].map(h => <span key={h}>{h}</span>)}
                </div>
                {/* Rows */}
                {TRADES.map((row, i) => (
                    <div key={i}
                        className={`grid px-4 py-2.5 text-xs border-b ${bd} transition-colors ${isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-gray-50'}`}
                        style={COL}>
                        <span className={mu}>{row.time}</span>
                        <span className={row.type === 'Buy' ? 'text-green-500' : 'text-red-500'}>{row.type}</span>
                        <span className={tx}>{row.usd}</span>
                        <span className={tx}>{row.sol}</span>
                        <span className={tx}>{row.price}</span>
                        <span className="text-[#7c3aed]">{row.maker}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}