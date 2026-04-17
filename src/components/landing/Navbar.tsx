'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useThemeToggle } from '@/hooks/useTheme';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useThemeToggle();


  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);


  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${scrolled
          ? 'dark:bg-black/90 bg-white/90 backdrop-blur-md shadow-lg shadow-black/10'
          : 'dark:bg-transparent bg-transparent'
        }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <motion.div whileHover={{ rotate: 5 }} transition={{ type: 'spring', stiffness: 300 }}>
            <Image src="/logo.png" alt="Trenchers" width={32} height={32} className="w-8 h-8" />
          </motion.div>
          <span className="font-bold text-base tracking-wide dark:text-white text-gray-900">
            TRENCHERS
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {['Features', 'About', 'Docs'].map((item, i) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05, duration: 0.3 }}
            >
              <Link
                href={`#${item.toLowerCase()}`}
                className="text-sm font-medium dark:text-gray-300 text-gray-600 dark:hover:text-white hover:text-gray-900 transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#7c3aed] transition-all duration-300 group-hover:w-full" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            suppressHydrationWarning
            className="w-9 h-9 flex items-center justify-center rounded-full dark:text-gray-400 text-gray-500 dark:hover:text-white hover:text-gray-900 transition-colors"
          >
            {isDark === null ? (
              <span className="w-[18px] h-[18px]" />
            ) : isDark ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          {/* Launch App — desktop */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25, duration: 0.3 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            <Link
              href="/signin"
              className="hidden md:inline-flex items-center gap-1.5 bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-[#7c3aed]/40 hover:shadow-lg"
            >
              Launch App
            </Link>
          </motion.div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(v => !v)}
            className="md:hidden w-9 h-9 flex items-center justify-center dark:text-gray-300 text-gray-600"
          >
            <AnimatePresence mode="wait" initial={false}>
              {menuOpen ? (
                <motion.svg key="close" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"
                  initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}>
                  <path d="M18 6L6 18M6 6l12 12" />
                </motion.svg>
              ) : (
                <motion.svg key="open" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"
                  initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}>
                  <path d="M3 12h18M3 6h18M3 18h18" />
                </motion.svg>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="md:hidden overflow-hidden dark:bg-black/95 bg-white/95 backdrop-blur-md border-t dark:border-white/10 border-gray-100"
          >
            <div className="px-4 py-4 flex flex-col gap-4">
              {['Features', 'About', 'Docs'].map((item) => (
                <Link
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setMenuOpen(false)}
                  className="text-sm font-medium dark:text-gray-200 text-gray-700"
                >
                  {item}
                </Link>
              ))}
              <Link
                href="/signin"
                className="inline-flex items-center justify-center bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
              >
                Launch App
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}