import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSmoothScroll } from '../../hooks/smoothScroll';
import { EASE } from '../fx';

/**
 * Floating Back-to-Top button with live circular scroll-progress ring.
 * Appears smoothly once the user scrolls past the opening hero.
 */
export default function BackToTop() {
  const { scrollTo } = useSmoothScroll();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const y = window.scrollY;
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      setVisible(y > 360);
      setProgress(Math.min(1, Math.max(0, y / max)));
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={() => scrollTo(0, { offset: 0 })}
          aria-label="Scroll back to top"
          data-cursor="view"
          initial={{ opacity: 0, y: 20, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.85 }}
          whileHover={{ y: -3, scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          transition={{ duration: 0.35, ease: EASE }}
          className="focus-ring group fixed bottom-6 right-5 z-[120] flex h-12 w-12 items-center justify-center rounded-full bg-[#0c0c12]/85 text-bone shadow-[0_14px_34px_rgba(0,0,0,0.65),0_0_24px_rgba(229,19,43,0.22)] ring-1 ring-white/15 backdrop-blur-xl transition-shadow hover:shadow-[0_18px_40px_rgba(0,0,0,0.75),0_0_30px_rgba(255,61,90,0.4)] hover:ring-crimson-2/50 sm:bottom-8 sm:right-8 sm:h-13 sm:w-13"
        >
          <svg
            viewBox="0 0 48 48"
            className="pointer-events-none absolute inset-0 h-full w-full -rotate-90"
            aria-hidden
          >
            <circle
              cx="24"
              cy="24"
              r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="2"
            />
            <circle
              cx="24"
              cy="24"
              r={radius}
              fill="none"
              stroke="#ff3d5a"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              style={{ transition: 'stroke-dashoffset 80ms linear' }}
            />
          </svg>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="relative h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 sm:h-[18px] sm:w-[18px]"
            aria-hidden
          >
            <path d="M12 19V5" />
            <path d="m5 12 7-7 7 7" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

