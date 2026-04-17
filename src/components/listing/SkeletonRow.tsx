export function SkeletonRow({ isDark }: { isDark: boolean }) {
    const bg = isDark ? 'bg-white/[0.06]' : 'bg-gray-200';
    return (
        <div className={`flex items-start gap-2.5 px-3 py-3 border-b ${isDark ? 'border-white/[0.05]' : 'border-gray-100'} animate-pulse`}>
            <div className={`w-9 h-9 rounded-lg shrink-0 ${bg}`} />
            <div className="flex-1 space-y-2">
                <div className="flex justify-between">
                    <div className={`h-3 w-24 rounded ${bg}`} />
                    <div className={`h-3 w-16 rounded ${bg}`} />
                </div>
                <div className={`h-2.5 w-32 rounded ${bg}`} />
                <div className="flex gap-2">
                    <div className={`h-2.5 w-8 rounded ${bg}`} />
                    <div className={`h-2.5 w-12 rounded ${bg}`} />
                </div>
            </div>
        </div>
    );
}