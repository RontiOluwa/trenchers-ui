"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the shape of our state
type Theme = boolean;

interface ThemeContextType {
    isDark: Theme;
    setIsDark: React.Dispatch<React.SetStateAction<Theme>>;
}
// const persistValue = localStorage.getItem('trenchers-theme')

// const defaultTheme: boolean = Boolean(persistValue);

// 1. Create Context with the type
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);


// 2. Provider Component
export function ThemeProvider({ children }: { children: ReactNode }) {
    const [isDark, setIsDark] = useState<Theme>(false);

    useEffect(() => {
        const storedTheme = localStorage.getItem('trenchers-theme');
        const defaultTheme = storedTheme === 'true';
        setIsDark(defaultTheme);
    }, [])

    return (
        <ThemeContext.Provider value={{ isDark, setIsDark }}>
            {children}
        </ThemeContext.Provider>
    );
}

// 3. The "Consumer" hook
export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
