export function EmptyState({ query, isDark }: { query: string; isDark: boolean }) {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
                stroke={isDark ? '#374151' : '#d1d5db'} strokeWidth="1.5"
                className="mb-3">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
            </svg>
            <p className={`text-sm font-medium mb-1 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                No tokens found
            </p>
            {query && (
                <p className={`text-xs ${isDark ? 'text-gray-700' : 'text-gray-300'}`}>
                    No results for &quot;{query}&quot;
                </p>
            )}
        </div>
    );
}