'use client';

import { useTheme } from '@/context/ThemeContext';

// Thin re-export so existing components that import from here still work
export function useThemeToggle() {
    const { isDark, toggleTheme } = useTheme();
    return { isDark, toggleTheme };
}