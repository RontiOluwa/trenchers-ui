type SortKey = 'volume' | 'age' | 'change' | 'mcap' | 'snipe';
type SortDir = 'desc' | 'asc';
interface Sort { key: SortKey; dir: SortDir }
const SORT_OPTIONS: { key: SortKey; label: string }[] = [
    { key: 'snipe', label: '⚡' },
    { key: 'volume', label: 'Vol' },
    { key: 'age', label: 'Age' },
    { key: 'change', label: 'Chg' },
];

export function SortBar({
    sort, onSort, isDark,
}: {
    sort: Sort;
    onSort: (k: SortKey) => void;
    isDark: boolean;
}) {
    return (
        <div className="flex items-center gap-1">
            {SORT_OPTIONS.map(opt => (
                <button
                    key={opt.key}
                    onClick={() => onSort(opt.key)}
                    className={`text-[9px] font-semibold px-1.5 py-0.5 rounded transition-colors
            ${sort.key === opt.key
                            ? 'bg-[#7c3aed] text-white'
                            : isDark ? 'text-gray-600 hover:text-gray-400' : 'text-gray-400 hover:text-gray-600'
                        }`}
                >
                    {opt.label}
                    {sort.key === opt.key && (
                        <span className="ml-0.5">{sort.dir === 'desc' ? '↓' : '↑'}</span>
                    )}
                </button>
            ))}
        </div>
    );
}
