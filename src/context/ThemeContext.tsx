'use client';

import React, {
    createContext, useContext, useState,
    useEffect, useCallback, ReactNode,
} from 'react';

interface ThemeContextType {
    isDark: boolean
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
    isDark: false,
    toggleTheme: () => { },
});

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [isDark, setIsDark] = useState<boolean>(false);

    // On mount: read the class that the inline script already set on <html>
    // This is the single source of truth — the inline script runs before React
    useEffect(() => {
        const dark = document.documentElement.classList.contains('dark');
        setIsDark(dark);
    }, []);

    const toggleTheme = useCallback(() => {
        setIsDark(prev => {
            const next = !prev;

            // ── Apply to <html> so Tailwind dark: classes respond ──
            if (next) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }

            // ── Persist — must match what layout.tsx inline script reads ──
            // layout script: if (t === 'light') remove('dark'); else add('dark')
            localStorage.setItem('trenchers-theme', next ? 'dark' : 'light');

            return next;
        });
    }, []);

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}