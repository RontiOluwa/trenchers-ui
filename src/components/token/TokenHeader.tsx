export function TokenHeader({ isDark }: { isDark: boolean }) {
    const bd = isDark ? 'border-white/[0.07]' : 'border-gray-200';
    const mu = isDark ? 'text-gray-500' : 'text-gray-400';
    const tx = isDark ? 'text-white' : 'text-gray-900';

    return (
        <div className={`flex items-center gap-4 px-4 h-14 border-b shrink-0 overflow-x-auto scrollbar-none
      ${bd} ${isDark ? 'bg-[#111]' : 'bg-white'}`}>
            <div className="w-9 h-9 rounded-lg shrink-0 bg-green-500/20 border border-green-500/30 flex items-center justify-center text-green-400 text-sm font-bold">H</div>
            <div className="shrink-0">
                <div className="flex items-center gap-2">
                    <span className={`text-sm font-semibold ${tx}`}>honeypot/SOL</span>
                    <span className="text-[10px] font-bold bg-[#7c3aed]/20 text-[#9966ff] border border-[#7c3aed]/30 px-1.5 py-0.5 rounded">14s</span>
                </div>
                <div className={`text-[10px] ${mu}`}>pretend you can&apos;t sell</div>
            </div>
            <div className={`text-2xl font-extrabold shrink-0 ${tx}`}>$3.03K</div>
            <div className={`h-6 w-px shrink-0 ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />
            {[
                { label: 'Price', value: '$0.0,305' },
                { label: 'Liquidity', value: '$6.44K' },
                { label: 'Supply', value: '996M' },
            ].map(s => (
                <div key={s.label} className="shrink-0">
                    <div className={`text-[10px] ${mu}`}>{s.label}</div>
                    <div className={`text-xs font-semibold ${tx}`}>{s.value}</div>
                </div>
            ))}
            <div className="shrink-0">
                <div className={`text-[10px] ${mu}`}>B. Curve</div>
                <div className="text-xs font-semibold text-green-500">2%</div>
            </div>
        </div>
    );
}
