import { type ChartStatus } from '@/hooks/useDerivChart';

const SKE = [38, 52, 44, 68, 48, 72, 55, 62, 50, 76, 54, 70, 60, 78, 65, 58, 74, 46, 66, 56, 72, 48, 64, 58, 70, 52, 78, 62, 56, 72, 68, 50, 76, 60, 55, 70, 64, 48, 74, 58];

export function ChartSkeleton({ status, isDark }: { status: ChartStatus; isDark: boolean }) {
    return (
        <div className="absolute inset-0 flex flex-col">
            {/* Fake candle bars */}
            <div className="flex-1 flex items-end gap-px px-2 pt-4 pb-8">
                {SKE.map((h, i) => (
                    <div
                        key={i}
                        className={`flex-1 rounded-sm animate-pulse ${isDark ? 'bg-white/[0.06]' : 'bg-gray-100'}`}
                        style={{ height: `${h}%`, animationDelay: `${i * 30}ms` }}
                    />
                ))}
            </div>
            {/* Status text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="w-5 h-5 border-2 border-[#7c3aed] border-t-transparent rounded-full animate-spin mb-3" />
                <p className={`text-[10px] font-mono tracking-widest ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                    {status === 'connecting' ? 'Connecting to Deriv...' : 'Loading chart data...'}
                </p>
            </div>
        </div>
    );
}
