'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

interface StatItem {
  value: string;
  label: string;
  highlight: boolean;
  // parsed for count-up
  prefix: string;
  numeric: number | null;
  suffix: string;
}

const STATS: StatItem[] = [
  { value: '$2.4B+', label: 'Trading Volume', highlight: false, prefix: '$', numeric: 2.4, suffix: 'B+' },
  { value: '150K+', label: 'Active Traders', highlight: false, prefix: '', numeric: 150, suffix: 'K+' },
  { value: '<0.1s', label: 'Execution Speed', highlight: true, prefix: '<', numeric: null, suffix: '0.1s' },
  { value: '24/7', label: 'Uptime', highlight: false, prefix: '', numeric: null, suffix: '24/7' },
];

function useCountUp(target: number | null, inView: boolean, duration = 1500) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!inView || target === null) return;
    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(eased * target);
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [inView, target, duration]);

  return display;
}

function StatCard({ stat, index }: { stat: StatItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const count = useCountUp(stat.numeric, inView);

  // Format the counted value
  function formatValue() {
    if (stat.numeric === null) return stat.value;
    const formatted = stat.numeric >= 100
      ? Math.round(count).toLocaleString()
      : count.toFixed(1);
    return `${stat.prefix}${formatted}${stat.suffix}`;
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
      className="flex flex-col items-center md:items-start text-center md:text-left"
    >
      <span
        className={`text-3xl sm:text-4xl font-extrabold leading-none mb-1.5 tabular-nums
          ${stat.highlight ? 'text-[#7c3aed]' : 'dark:text-white text-gray-900'}`}
      >
        {formatValue()}
      </span>
      <span className="text-sm dark:text-gray-500 text-gray-400 font-medium">
        {stat.label}
      </span>
    </motion.div>
  );
}

export function Stats() {
  return (
    <section className="border-y dark:border-white/[0.08] border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {STATS.map((s, i) => (
            <StatCard key={s.label} stat={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}