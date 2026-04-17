export function BottomNav({ isDark }: { isDark: boolean }) {
    const TABS = [
        { label: 'Positions', active: false, icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg> },
        { label: 'Alerts', active: false, icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg> },
        { label: 'Trenches', active: true, icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="3" /><line x1="12" y1="2" x2="12" y2="6" /><line x1="12" y1="18" x2="12" y2="22" /><line x1="2" y1="12" x2="6" y2="12" /><line x1="18" y1="12" x2="22" y2="12" /></svg> },
        { label: 'Tracker', active: false, icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg> },
        { label: 'PnL', active: false, icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg> },
    ];

    return (
        <div className={`flex items-stretch border-t shrink-0
      ${isDark ? 'bg-[#111] border-white/[0.07]' : 'bg-white border-gray-200'}`}>
            {TABS.map(tab => (
                <button key={tab.label}
                    className={`flex-1 flex flex-col items-center justify-center py-2 gap-1 text-[10px] font-medium transition-colors
            ${tab.active
                            ? 'text-[#7c3aed]'
                            : isDark ? 'text-gray-600 hover:text-gray-400' : 'text-gray-400 hover:text-gray-600'
                        }`}>
                    {tab.icon}
                    {tab.label}
                </button>
            ))}
        </div>
    );
}