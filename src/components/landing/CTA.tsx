'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/Input';

export function CTA() {
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
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 900);
  }

  return (
    <section className="relative overflow-hidden">
      <div className="dark:bg-cta-dark bg-cta-light">
        {/* Animated background glow */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 pointer-events-none flex items-center justify-center"
        >
          <div className="w-[600px] h-[400px] rounded-full bg-[#7c3aed]/20 blur-3xl dark:opacity-100 opacity-0" />
        </motion.div>

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-20 md:py-28 text-center">

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold dark:text-white text-gray-900 leading-tight mb-5"
          >
            Ready to Dominate<br />the Trenches?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-base dark:text-gray-300 text-gray-600 mb-8"
          >
            Join 3,000+ traders already on the early access list. No spam, ever.
          </motion.p>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-md mx-auto"
          >
            {!submitted ? (
              <>
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    placeholder="you@example.com"
                    className={`flex-1 px-4 py-3 rounded-xl text-sm outline-none transition-all
                      dark:bg-white/[0.08] bg-white
                      dark:text-white text-gray-900
                      dark:placeholder:text-gray-500 placeholder:text-gray-400
                      border dark:border-white/[0.12] border-gray-200
                      focus:ring-2 focus:ring-[#7c3aed]/50 focus:border-[#7c3aed]/50
                      ${error ? 'border-red-500' : ''}`} />

                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="relative shrink-0 inline-flex items-center justify-center gap-2
                      bg-[#7c3aed] hover:bg-[#6d28d9] disabled:opacity-70 disabled:cursor-wait
                      text-white font-semibold px-6 py-3 rounded-xl text-sm
                      transition-all duration-200 overflow-hidden
                      hover:shadow-xl hover:shadow-[#7c3aed]/40"
                  >
                    {/* Pulse ring */}
                    <span className="absolute inset-0 rounded-xl animate-ping bg-[#7c3aed]/30 pointer-events-none" />
                    <span className="relative z-10 flex items-center gap-2">
                      {loading ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Joining...
                        </>
                      ) : 'Join Waitlist →'}
                    </span>
                  </motion.button>
                </form>
                {error && (
                  <p className="text-xs text-red-500 mt-2 text-left pl-1">{error}</p>
                )}
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center gap-3 py-4 px-6 rounded-xl
                  dark:bg-green-500/10 bg-green-50 border dark:border-green-500/20 border-green-200"
              >
                <span className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <span className="text-sm font-medium text-green-600 dark:text-green-400">
                  You&apos;re on the list! We&apos;ll reach out soon.
                </span>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}