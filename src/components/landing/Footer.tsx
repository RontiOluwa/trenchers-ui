'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const FOOTER_COLS = [
  {
    heading: 'Product',
    links: ['Trading', 'Whale Tracker', 'Sniper', 'Portfolio'],
  },
  {
    heading: 'Resources',
    links: ['Documentation', 'API', 'Changelog'],
  },
  {
    heading: 'Community',
    links: ['Twitter / X', 'Discord', 'Telegram'],
  },
];

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5 }}
      className="dark:bg-black bg-white dark:border-t dark:border-white/[0.06] border-t border-gray-100"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <Image src="/logo.png" alt="Trenchers" width={28} height={28} className="w-7 h-7" />
              <span className="font-bold text-sm dark:text-white text-gray-900 tracking-wide">
                TRENCHERS
              </span>
            </div>
            <p className="text-xs dark:text-gray-500 text-gray-400 leading-relaxed max-w-[160px]">
              The fastest Solana trading terminal. Built for degens.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3 mt-4">
              {[
                { label: 'Twitter', path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
                { label: 'Discord', path: 'M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.1 18.08.11 18.1.131 18.115a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z' },
              ].map((s) => (
                <Link key={s.label} href="#"
                  className="w-8 h-8 rounded-full dark:bg-white/[0.06] bg-gray-100 flex items-center justify-center dark:text-gray-400 text-gray-500 dark:hover:text-white hover:text-gray-900 dark:hover:bg-white/10 hover:bg-gray-200 transition-all"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d={s.path} />
                  </svg>
                </Link>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_COLS.map((col) => (
            <div key={col.heading}>
              <h4 className="text-xs font-semibold dark:text-white text-gray-900 tracking-widest uppercase mb-4">
                {col.heading}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-sm dark:text-gray-500 text-gray-400 dark:hover:text-white hover:text-gray-900 transition-colors"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t dark:border-white/[0.06] border-gray-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs dark:text-gray-600 text-gray-400">
            © 2025 Trenchers.ai. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {['Privacy', 'Terms'].map((item) => (
              <Link key={item} href="#"
                className="text-xs dark:text-gray-600 text-gray-400 dark:hover:text-white hover:text-gray-900 transition-colors">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </motion.footer>
  );
}