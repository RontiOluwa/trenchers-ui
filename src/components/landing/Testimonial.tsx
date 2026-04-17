'use client';

import { motion } from 'framer-motion';

export function Testimonial() {
  return (
    <section className="py-20 md:py-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">

        {/* Quote mark — grows in */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="text-6xl font-serif leading-none dark:text-[#7c3aed]/40 text-[#7c3aed]/30 mb-6 select-none"
        >
          &ldquo;
        </motion.div>

        {/* Quote */}
        <motion.blockquote
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-xl sm:text-2xl md:text-3xl font-medium dark:text-white text-gray-800 leading-snug italic mb-8"
        >
          Trenchers changed the way I trade. The whale radar alone paid for itself
          in the first hour. I&apos;ve tried Axiom, GMGN, Trojan — nothing comes close
          to this speed.
        </motion.blockquote>

        {/* Attribution */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center justify-center gap-3"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#4f46e5] flex items-center justify-center text-white text-sm font-bold shrink-0">
            C
          </div>
          <div className="text-left">
            <div className="text-sm font-semibold dark:text-white text-gray-900">
              @CryptoWhaleX
            </div>
            <div className="text-xs dark:text-gray-500 text-gray-400">
              Top 50 Solana Trader · $4.2M+ Volume
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}