import { useEffect, useRef, useState } from 'react';
import { motion, useAnimationFrame, useMotionValue } from 'framer-motion';
import { videoReels, type VideoReel } from '../data/portfolio';
import { useDesktop, useFinePointer, useReducedMotionPref } from '../hooks/useMedia';
import { EASE, RevealText } from './fx';
import { PosterBackdrop } from './Poster';

export default function ContinueWatching({
  onSelect,
  progressMap = {},
  paused = false,
}: {
  onSelect: (reel: VideoReel) => void;
  progressMap?: Record<string, number>;
  paused?: boolean;
}) {
  const isDesktop = useDesktop();
  const finePointer = useFinePointer();
  const reduced = useReducedMotionPref();
  const useMarquee = isDesktop && !reduced;

  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isHoveringTrack, setIsHoveringTrack] = useState(false);
  const [brokenImg, setBrokenImg] = useState<Record<string, boolean>>({});
  const [brokenVid, setBrokenVid] = useState<Record<string, boolean>>({});

  const railRef = useRef<HTMLDivElement>(null);
  const setRef = useRef<HTMLDivElement>(null);
  const halfWidthRef = useRef(0);
  const x = useMotionValue(0);
  const speedRef = useRef(46);

  useEffect(() => {
    if (!useMarquee) return;
    const measure = () => {
      if (setRef.current) {
        halfWidthRef.current = setRef.current.offsetWidth;
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (setRef.current) ro.observe(setRef.current);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [useMarquee]);

  useAnimationFrame((_, delta) => {
    if (!useMarquee || !halfWidthRef.current) return;
    const clampedDelta = Math.min(delta, 50);
    const targetSpeed = isHoveringTrack || paused ? 0 : 46;
    // Smoothly brake on hover and accelerate when leaving
    speedRef.current += (targetSpeed - speedRef.current) * Math.min(1, clampedDelta * 0.008);

    if (speedRef.current < 0.2) return;
    let next = x.get() - (speedRef.current * clampedDelta) / 1000;
    if (next <= -halfWidthRef.current) {
      next += halfWidthRef.current;
    }
    x.set(next);
  });

  const scrollRailBy = (dir: -1 | 1) => {
    const el = railRef.current;
    if (!el) return;
    const step = Math.max(220, Math.round(el.clientWidth * 0.72));
    el.scrollBy({ left: dir * step, behavior: reduced ? 'auto' : 'smooth' });
  };

  const renderCard = (reel: VideoReel, copyKey: string, snap = false) => {
    const key = `${copyKey}-${reel.id}`;
    const isHovered = hoveredId === key;
    const watchedPct = progressMap[reel.id] ?? 0;

    return (
      <motion.button
        key={key}
        type="button"
        data-cursor="play"
        onClick={() => onSelect(reel)}
        onHoverStart={() => finePointer && setHoveredId(key)}
        onHoverEnd={() => finePointer && setHoveredId(null)}
        onFocus={() => setHoveredId(key)}
        onBlur={() => setHoveredId(null)}
        whileHover={finePointer ? { y: -10, scale: 1.035 } : undefined}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.35, ease: EASE }}
        className={`group relative flex w-[64vw] min-w-[186px] max-w-[228px] shrink-0 flex-col text-left sm:w-[230px] sm:max-w-none md:w-[244px] lg:w-[264px] ${
          snap ? 'snap-start' : ''
        }`}
      >
        {/* Tall 9:16 Vertical Reel Card so faces are never cropped */}
        <div className="relative aspect-[9/16] w-full overflow-hidden rounded-xl bg-ink-2 ring-1 ring-white/12 transition-all duration-500 group-hover:ring-crimson-2/75 group-hover:shadow-[0_26px_65px_-12px_rgba(229,19,43,0.42),0_0_0_1px_rgba(255,61,90,0.45)] sm:rounded-2xl">
          <motion.div
            className="absolute inset-0"
            animate={{ scale: isHovered && finePointer ? 1.07 : 1 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <PosterBackdrop palette={reel.palette}>
              {!brokenImg[reel.id] && (
                <img
                  src={reel.posterUrl}
                  alt={reel.title}
                  loading="lazy"
                  onError={() => setBrokenImg((prev) => ({ ...prev, [reel.id]: true }))}
                  className="h-full w-full object-cover object-top opacity-90 transition-opacity duration-500 group-hover:opacity-100"
                />
              )}
              {isHovered && finePointer && !reduced && !paused && !brokenVid[reel.id] && (
                <video
                  src={reel.previewUrl}
                  poster={reel.posterUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  onError={() => setBrokenVid((prev) => ({ ...prev, [reel.id]: true }))}
                  className="absolute inset-0 h-full w-full object-cover object-top"
                />
              )}
              {/* Bottom readability gradient keeping the upper face completely clear */}
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/25 to-transparent"
              />
            </PosterBackdrop>
          </motion.div>

          {/* Subtle sheen sweep on hover */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-full rotate-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-all duration-700 group-hover:translate-x-full group-hover:opacity-100"
          />

          {/* Top Episode Badge & Play Button */}
          <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3 sm:p-3.5">
            <span className="rounded-full border border-white/15 bg-black/55 px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.2em] text-bone backdrop-blur-md sm:px-2.5 sm:py-1 sm:text-[9px] sm:tracking-[0.22em]">
              {reel.episode}
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/35 bg-black/45 text-[10px] text-bone backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:border-bone group-hover:bg-bone group-hover:text-ink sm:h-9 sm:w-9 sm:text-xs">
              ▶
            </span>
          </div>

          {/* Bottom Title & Metadata */}
          <div className="absolute inset-x-0 bottom-0 p-3.5 sm:p-4">
            <span className="block font-display text-[1.35rem] leading-[0.95] tracking-wide text-bone transition-transform duration-300 group-hover:-translate-y-0.5 sm:text-2xl lg:text-[1.75rem]">
              {reel.title}
            </span>
            <span className="mt-1 block text-[10px] font-medium text-mist transition-colors group-hover:text-bone/90 sm:mt-1.5 sm:text-[11px]">
              {reel.meta}
            </span>
          </div>
        </div>

        {/* Watch Progress Indicator */}
        <div className="mt-2 h-[3px] w-full overflow-hidden rounded-full bg-white/12 sm:mt-2.5">
          <motion.div
            className="h-full origin-left bg-crimson"
            animate={{ scaleX: Math.max(0.08, watchedPct) }}
            transition={{ duration: 0.4, ease: EASE }}
          />
        </div>
      </motion.button>
    );
  };

  return (
    <section
      id="reels"
      aria-label="Continue Exploring"
      className="relative z-30 mt-2 scroll-mt-20 pb-12 sm:-mt-8 sm:scroll-mt-24 sm:pb-16 lg:-mt-12 lg:pb-20"
    >
      <div className="gutter mb-4 flex flex-wrap items-center justify-between gap-3 sm:mb-5">
        <div>
          <RevealText
            as="h2"
            text="Continue Exploring"
            className="font-sans text-lg font-semibold tracking-tight text-bone sm:text-2xl"
          />
          {!useMarquee && (
            <p className="mt-0.5 text-[11px] text-mist/75 sm:text-xs">Swipe or tap any reel to watch</p>
          )}
        </div>

        {useMarquee ? (
          <span className="text-xs text-mist/75">Hover to pause · Click any reel to watch</span>
        ) : (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollRailBy(-1)}
              aria-label="Scroll reels left"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/[0.05] text-sm text-bone/90 transition-colors hover:border-white/30 hover:bg-white/[0.12] active:scale-95"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => scrollRailBy(1)}
              aria-label="Scroll reels right"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/[0.05] text-sm text-bone/90 transition-colors hover:border-white/30 hover:bg-white/[0.12] active:scale-95"
            >
              ›
            </button>
          </div>
        )}
      </div>

      {/* Desktop: Continuous Auto-Scrolling Marquee · Mobile/Tablet/Reduced Motion: Native Touch Snap Rail */}
      {useMarquee ? (
        <div
          className="relative overflow-hidden py-4 [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]"
          onPointerEnter={() => setIsHoveringTrack(true)}
          onPointerLeave={() => setIsHoveringTrack(false)}
        >
          <motion.div style={{ x }} className="flex w-max items-stretch will-change-transform">
            <div ref={setRef} className="flex shrink-0 items-stretch gap-6 pr-6">
              {videoReels.map((reel) => renderCard(reel, 'a'))}
            </div>
            <div aria-hidden className="flex shrink-0 items-stretch gap-6 pr-6">
              {videoReels.map((reel) => renderCard(reel, 'b'))}
            </div>
          </motion.div>
        </div>
      ) : (
        <div
          ref={railRef}
          className="rail gutter flex snap-x snap-mandatory gap-3.5 overflow-x-auto py-3 scroll-pl-[var(--gutter)] sm:gap-5 sm:py-4"
        >
          {videoReels.map((reel) => renderCard(reel, 'static', true))}
        </div>
      )}
    </section>
  );
}
