import Image from 'next/image';

const BARS = [
    { h: 45, dark: false }, { h: 65, dark: false }, { h: 55, dark: false },
    { h: 90, dark: true }, { h: 70, dark: false }, { h: 58, dark: false },
    { h: 75, dark: false }, { h: 52, dark: false }, { h: 95, dark: true },
    { h: 62, dark: false }, { h: 48, dark: false }, { h: 80, dark: false },
    { h: 68, dark: false }, { h: 42, dark: false },
];

interface Props { isDark: boolean }

// ── Left brand panel ──────────────────────────────────────────────────────────

export function LeftPanel({ isDark }: { isDark: boolean }) {
    return (
        <div className={`hidden md:flex flex-col justify-between h-full px-12 py-10 relative overflow-hidden
      ${isDark ? 'bg-[#0d0d0d]' : 'bg-gradient-to-br from-[#ede9fe] via-[#f0ebff] to-[#e8e0ff]'}`}
        >
            <div className="flex items-center gap-2.5">
                <Image src="/logo.png" alt="Trenchers" width={36} height={36} className="w-9 h-9" />
                <span className={`font-bold tracking-widest text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {isDark ? 'Trenchers.ai' : 'TRENCHERS'}
                </span>
            </div>

            <div className="flex-1 flex flex-col justify-center py-12">
                {!isDark && (
                    <p className="text-xs font-bold tracking-[0.2em] text-[#7c3aed] uppercase mb-3">Built for the</p>
                )}
                <h1 className={`font-extrabold leading-tight mb-4
          ${isDark ? 'text-4xl xl:text-5xl text-white' : 'text-5xl xl:text-6xl text-gray-900'}`}
                >
                    {isDark ? <>Built for<br />the Trenches.</> : 'Trenches'}
                </h1>
                <p className={`text-sm leading-relaxed mb-8 max-w-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {isDark
                        ? 'Real-time DeFi analytics, sniper tools, and portfolio tracking — all in one terminal.'
                        : 'The fastest crypto trading terminal. Real-time charts, instant execution, and full portfolio control.'
                    }
                </p>
                <div className={isDark ? '' : 'bg-white/70 rounded-2xl p-5 border border-white/60'}>
                    <svg viewBox={`0 0 ${BARS.length * 54} 130`} className="w-full" preserveAspectRatio="none">
                        {!isDark && (
                            <polyline
                                points={BARS.map((b, i) => `${i * 54 + 20},${130 - b.h - 10}`).join(' ')}
                                fill="none" stroke="#7c3aed" strokeWidth="2"
                                strokeLinecap="round" strokeLinejoin="round"
                            />
                        )}
                        {BARS.map((bar, i) => (
                            <rect key={i} x={i * 54 + 4} y={130 - bar.h} width="36" height={bar.h} rx="4"
                                fill={isDark
                                    ? bar.dark ? '#6d28d9' : '#4c1d95'
                                    : bar.dark ? '#7c3aed' : '#a78bfa'
                                }
                            />
                        ))}
                    </svg>
                </div>
            </div>

            {isDark && (
                <div className="flex items-end gap-10">
                    {[
                        { val: '$2.4B+', label: 'Volume Tracked' },
                        { val: '140K+', label: 'Active Traders' },
                        { val: '50+', label: 'Chains Supported' },
                    ].map(s => (
                        <div key={s.label}>
                            <div className="text-2xl font-extrabold text-[#7c3aed] leading-none mb-1">{s.val}</div>
                            <div className="text-xs text-gray-500">{s.label}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}


