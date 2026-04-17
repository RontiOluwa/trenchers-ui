'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/Input';

// Animation variants
const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
};

const mockup = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] } },
};

// Static waitlist count — no Math.random() to avoid hydration mismatch
const WAITLIST_COUNT = '3,241';

export function Hero() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Enter a valid email address.');
      return;
    }
    setError('');
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 900);
  }

  return (
    <section className="relative pt-24 pb-16 md:pt-36 md:pb-24 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] md:w-[900px] h-[500px] rounded-full bg-[#7c3aed]/10 blur-3xl dark:opacity-100 opacity-0 transition-opacity" />
      </div>

      <motion.div
        className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center relative z-10"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Badge pill */}
        <motion.div variants={item}
          className="inline-flex items-center gap-2 border dark:border-[#7c3aed]/50 border-[#7c3aed]/40 dark:bg-[#7c3aed]/10 bg-[#7c3aed]/8 rounded-full px-4 py-1.5 mb-6"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#7c3aed] animate-pulse" />
          <span className="text-xs font-semibold dark:text-purple-300 text-[#7c3aed] tracking-wide">
            Solana&apos;s Fastest Trading Terminal
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={item}
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold dark:text-white text-gray-900 leading-[1.08] tracking-tight mb-5 max-w-3xl"
        >
          Trade Solana<br />
          <span className="text-[#7c3aed]">At Light Speed</span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          variants={item}
          className="text-sm sm:text-lg dark:text-gray-400 text-gray-500 max-w-sm sm:max-w-md leading-relaxed mb-8 px-2"
        >
          Snipe launches in &lt;2s. Copy whale wallets. Track positions.
          One terminal — built for the trenches.
        </motion.p>

        {/* Waitlist form */}
        <motion.div variants={item} className="w-full max-w-md mb-4 px-2 sm:px-0">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 relative">

                <Input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  placeholder="you@example.com"
                  className={`w-full px-4 py-3 rounded-xl text-sm outline-none transition-all
                    dark:bg-white/[0.06] bg-gray-100
                    dark:text-white text-gray-900
                    dark:placeholder:text-gray-500 placeholder:text-gray-400
                    border dark:border-white/[0.1] border-gray-200
                    focus:ring-2 focus:ring-[#7c3aed]/50 focus:border-[#7c3aed]/50
                    ${error ? 'border-red-500 focus:ring-red-500/30' : ''}`} />
              </div>
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="shrink-0 inline-flex items-center justify-center gap-2 bg-[#7c3aed] hover:bg-[#6d28d9]
                  disabled:opacity-70 disabled:cursor-wait text-white font-semibold
                  px-6 py-3 rounded-xl text-sm transition-all duration-200
                  hover:shadow-lg hover:shadow-[#7c3aed]/30"
              >
                {loading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Joining...
                  </>
                ) : (
                  'Get Early Access'
                )}
              </motion.button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center gap-3 py-3 px-5 rounded-xl
                dark:bg-green-500/10 bg-green-50 border dark:border-green-500/20 border-green-200"
            >
              <span className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                You&apos;re on the list! We&apos;ll be in touch soon.
              </span>
            </motion.div>
          )}

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-red-500 mt-2 text-left pl-1"
            >
              {error}
            </motion.p>
          )}
        </motion.div>

        {/* Waitlist counter */}
        <motion.p variants={item} className="text-xs dark:text-gray-500 text-gray-400 mb-12">
          <span className="dark:text-white text-gray-700 font-semibold">{WAITLIST_COUNT}</span> traders already on the waitlist
        </motion.p>

        {/* Dashboard mockup */}
        <motion.div
          variants={mockup}
          className="relative w-full max-w-4xl"
        >
          {/* Floating glow */}
          <motion.div
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-20 bg-[#7c3aed]/20 blur-2xl rounded-full"
          />

          {/* Browser frame */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="relative rounded-2xl overflow-hidden border dark:border-white/10 border-gray-200 dark:bg-[#111] bg-gray-100 shadow-2xl dark:shadow-[#7c3aed]/10"
          >
            {/* Browser top bar */}
            <div className="flex items-center gap-1.5 px-4 py-3 dark:bg-[#0d0d0d] bg-gray-200/80 border-b dark:border-white/[0.06] border-gray-300/60">
              <span className="w-3 h-3 rounded-full bg-red-500/70" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <span className="w-3 h-3 rounded-full bg-green-500/70" />
              <span className="ml-3 text-xs dark:text-white/20 text-gray-400 font-mono">trenchers.app</span>
            </div>

            {/* Dashboard content */}
            <div className="dark:bg-[#0d0d12] bg-[#1a1a2e] p-3 sm:p-4 text-[10px] font-mono">
              {/* Stats row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                {[
                  { l: 'Portfolio Value', v: '$14,280.45', c: 'text-white' },
                  { l: 'Open Positions', v: '12', c: 'text-white' },
                  { l: '24H P&L', v: '+$1,240.30', c: 'text-green-400' },
                  { l: 'Win Rate', v: '73.2%', c: 'text-purple-400' },
                ].map((s) => (
                  <div key={s.l} className="bg-white/5 rounded-lg p-2.5">
                    <div className="text-white/40 mb-1 truncate">{s.l}</div>
                    <div className={`text-xs sm:text-sm font-bold ${s.c}`}>{s.v}</div>
                  </div>
                ))}
              </div>

              {/* Chart + Order Book */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
                <div className="sm:col-span-2 bg-white/5 rounded-lg p-3 h-32 sm:h-52 relative overflow-hidden">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/60">SOL/USDT</span>
                    <span className="text-green-400 font-bold">$185.42</span>
                  </div>
                  <svg viewBox="0 0 300 100" className="w-full h-24 sm:h-40" preserveAspectRatio="none">
                    {[25, 50, 75].map((y) => (
                      <line key={y} x1="0" y1={y} x2="300" y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
                    ))}
                    <defs>
                      <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d="M0,80 L20,75 L40,70 L60,65 L80,60 L100,55 L120,50 L140,40 L160,35 L180,38 L200,30 L220,25 L240,20 L260,15 L280,18 L300,12 L300,100 L0,100Z" fill="url(#chartGrad)" />
                    <path d="M0,80 L20,75 L40,70 L60,65 L80,60 L100,55 L120,50 L140,40 L160,35 L180,38 L200,30 L220,25 L240,20 L260,15 L280,18 L300,12" fill="none" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" />
                    {[
                      { x: 0, h: 4, buy: false }, { x: 20, h: 10, buy: true }, { x: 40, h: 7, buy: false },
                      { x: 60, h: 13, buy: false }, { x: 80, h: 16, buy: true }, { x: 100, h: 5, buy: false },
                      { x: 120, h: 19, buy: true }, { x: 140, h: 8, buy: false }, { x: 160, h: 11, buy: false },
                      { x: 180, h: 14, buy: true }, { x: 200, h: 6, buy: false }, { x: 220, h: 17, buy: true },
                      { x: 240, h: 9, buy: false }, { x: 260, h: 12, buy: true }, { x: 280, h: 15, buy: false },
                    ].map(({ x, h, buy }) => (
                      <rect key={x} x={x + 2} y={96 - h} width="14" height={h}
                        fill={buy ? 'rgba(124,58,237,0.4)' : 'rgba(255,255,255,0.1)'} />
                    ))}
                  </svg>
                </div>

                {/* Order book — hidden on mobile */}
                <div className="hidden sm:block bg-white/5 rounded-lg p-2.5">
                  <div className="text-white/50 mb-2">Order Book</div>
                  {[{ p: '185.80', q: '1.24' }, { p: '185.60', q: '3.80' }, { p: '185.40', q: '2.11' }, { p: '185.20', q: '4.67' }].map(({ p, q }) => (
                    <div key={p} className="flex justify-between mb-1">
                      <span className="text-red-400">{p}</span>
                      <span className="text-white/40">{q}</span>
                    </div>
                  ))}
                  <div className="text-center text-white/60 font-bold my-1">185.42</div>
                  {[{ p: '185.00', q: '2.93' }, { p: '184.80', q: '1.55' }, { p: '184.60', q: '3.22' }, { p: '184.40', q: '0.87' }].map(({ p, q }) => (
                    <div key={p} className="flex justify-between mb-1">
                      <span className="text-green-400">{p}</span>
                      <span className="text-white/40">{q}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent trades */}
              <div className="bg-white/5 rounded-lg p-2.5">
                <div className="text-white/50 mb-2">Recent Trades</div>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { pair: 'SOL/USDT', side: 'Buy', pnl: '+$124' },
                    { pair: 'WIF/SOL', side: 'Sell', pnl: '+$89' },
                    { pair: 'BONK/SOL', side: 'Buy', pnl: '-$12' },
                  ].map((t) => (
                    <div key={t.pair} className="flex flex-col">
                      <span className="text-white/60 truncate">{t.pair}</span>
                      <span className={t.side === 'Buy' ? 'text-green-400' : 'text-red-400'}>{t.side}</span>
                      <span className={t.pnl.startsWith('+') ? 'text-green-400' : 'text-red-400'}>{t.pnl}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}