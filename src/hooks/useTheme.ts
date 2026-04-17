"use client";

import { useTheme } from '@/context/ThemeContext';

export function useThemeToggle() {
    const { isDark, setIsDark } = useTheme();

    const toggleTheme = () => {
        const next = !isDark;
        setIsDark((prev) => (prev === false ? true : false));

        localStorage.setItem('trenchers-theme', String(next));

    };

    return { isDark, toggleTheme };
}