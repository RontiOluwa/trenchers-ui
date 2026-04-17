'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

function LightningIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}
function RadarIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="2" />
      <path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14" />
    </svg>
  );
}
function SniperIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="3" />
      <line x1="12" y1="2" x2="12" y2="5" /><line x1="12" y1="19" x2="12" y2="22" />
      <line x1="2" y1="12" x2="5" y2="12" /><line x1="19" y1="12" x2="22" y2="12" />
    </svg>
  );
}

const FEATURES = [
  {
    icon: <LightningIcon />,
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/10',
    glow: 'hover:shadow-yellow-500/10',
    title: 'Lightning Execution',
    desc: 'Sub-100ms trade execution with MEV protection. Front-run the front-runners with priority routing and optimized RPC nodes.',
    stat: '<100ms',
  },
  {
    icon: <RadarIcon />,
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
    glow: 'hover:shadow-purple-500/10',
    title: 'Whale Radar',
    desc: 'Track smart money in real-time. See what the top wallets are buying before the crowd catches on. Copy-trade with one click.',
    stat: '50K+ wallets',
  },
  {
    icon: <SniperIcon />,
    color: 'text-cyan-400',
    bg: 'bg-cyan-400/10',
    glow: 'hover:shadow-cyan-500/10',
    title: 'Launch Sniper',
    desc: 'Auto-detect new token launches and snipe them instantly. Set your parameters, sit back, and let the bot do the work.',
    stat: '<2s detection',
  },
];

export function Features() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="features" className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold dark:text-white text-gray-900 mb-4">
            Everything You Need to Win
          </h2>
          <p className="text-base dark:text-gray-400 text-gray-500 max-w-md mx-auto">
            Built for degens, by degens. Three tools that give you an unfair edge.
          </p>
        </motion.div>

        {/* Cards */}
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.12, ease: 'easeOut' }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className={`group dark:bg-[#111] bg-white
                dark:border-white/[0.08] border-gray-100 border rounded-2xl p-6 md:p-7
                transition-all duration-300
                hover:dark:border-[#7c3aed]/40 hover:border-[#7c3aed]/30
                hover:shadow-xl ${f.glow}
                cursor-default`}
            >
              {/* Icon */}
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className={`w-11 h-11 rounded-xl ${f.bg} ${f.color} flex items-center justify-center mb-5`}
              >
                {f.icon}
              </motion.div>

              <h3 className="text-lg font-bold dark:text-white text-gray-900 mb-2">
                {f.title}
              </h3>

              {/* Stat badge */}
              <span className={`inline-block text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full mb-3
                ${f.bg} ${f.color}`}>
                {f.stat}
              </span>

              <p className="text-sm dark:text-gray-400 text-gray-500 leading-relaxed">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}