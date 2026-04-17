'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const STEPS = [
  {
    num: '1',
    title: 'Connect Wallet',
    desc: 'Link your Phantom or Solflare wallet in one click. No KYC, no signups.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2" /><path d="M16 12h2" />
      </svg>
    ),
  },
  {
    num: '2',
    title: 'Set Your Strategy',
    desc: 'Configure whale alerts, sniper parameters, and auto-buy rules to match your style.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
  {
    num: '3',
    title: 'Start Trading',
    desc: 'Execute trades in under 100ms. Track PnL, manage positions, and dominate the trenches.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
      </svg>
    ),
  },
];

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-20 md:py-28 dark:bg-[#080808] bg-gray-50/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14 md:mb-20"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold dark:text-white text-gray-900">
            Get Started in 3 Steps
          </h2>
        </motion.div>

        {/* Steps */}
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 relative">

          {/* Connecting line — desktop, animates width */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            style={{ originX: 0 }}
            className="hidden md:block absolute top-7 left-[calc(16.6%+28px)] right-[calc(16.6%+28px)] h-px dark:bg-white/10 bg-gray-200 z-0"
          />

          {STEPS.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.15, ease: 'easeOut' }}
              className="flex flex-col items-center text-center relative z-10"
            >
              {/* Number circle */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="w-14 h-14 rounded-full bg-[#7c3aed] flex items-center justify-center text-white text-xl font-extrabold mb-5 shadow-lg shadow-[#7c3aed]/30"
              >
                {step.num}
              </motion.div>

              {/* Icon */}
              <div className="text-[#7c3aed] mb-3">{step.icon}</div>

              <h3 className="text-lg font-bold dark:text-white text-gray-900 mb-3">
                {step.title}
              </h3>
              <p className="text-sm dark:text-gray-400 text-gray-500 leading-relaxed max-w-[220px]">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}