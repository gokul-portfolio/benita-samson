import { useEffect, useRef, useState, type PointerEvent, type WheelEvent } from 'react';
import { motion, useAnimationFrame, useMotionValue } from 'framer-motion';
import { videoReels, type VideoReel } from '../data/portfolio';
import { useFinePointer, useReducedMotionPref } from '../hooks/useMedia';
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
  const finePointer = useFinePointer();
  const reduced = useReducedMotionPref();

  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isHoveringTrack, setIsHoveringTrack] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [brokenImg, setBrokenImg] = useState<Record<string, boolean>>({});
  const [brokenVid, setBrokenVid] = useState<Record<string, boolean>>({});

  const containerRef = useRef<HTMLDivElement>(null);
  const setRef = useRef<HTMLDivElement>(null);
  const singleSetWidthRef = useRef(0);
  const x = useMotionValue(0);

  // Drag tracking refs
  const isDraggingRef = useRef(false);
  const dragMovedRef = useRef(false);
  const dragStartRef = useRef({ x: 0, time: 0 });
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const velocityRef = useRef(0);
  const inertiaSpeedRef = useRef(0);

  // Measure the exact pixel width of one full set of reels
  useEffect(() => {
    const measure = () => {
      if (setRef.current) {
        singleSetWidthRef.current = setRef.current.offsetWidth;
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
  }, []);

  // Continuous auto-scroll loop with inertia momentum support
  useAnimationFrame((_, delta) => {
    if (paused || !singleSetWidthRef.current || reduced) return;
    const clampedDelta = Math.min(delta, 50) / 1000; // in seconds

    // If currently dragging with mouse, x is handled by onPointerMove
    if (isDraggingRef.current) return;

    const w = singleSetWidthRef.current;
    let next = x.get();

    // If there is momentum speed from flicking/dragging
    if (Math.abs(inertiaSpeedRef.current) > 1) {
      next += inertiaSpeedRef.current * clampedDelta;
      // Exponential decay of inertia
      inertiaSpeedRef.current *= Math.pow(0.92, clampedDelta * 60);
      if (Math.abs(inertiaSpeedRef.current) <= 1) {
        inertiaSpeedRef.current = 0;
      }
    } else {
      // Natural continuous auto-scroll: flows at 42px/s, gently slows to 20px/s on hover
      const cruiseSpeed = isHoveringTrack ? 20 : 42;
      next -= cruiseSpeed * clampedDelta;
    }

    // Seamless toroidal wrap
    while (next <= -w) next += w;
    while (next > 0) next -= w;

    x.set(next);
  });

  // Mouse / Pointer Drag Handlers
  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    isDraggingRef.current = true;
    dragMovedRef.current = false;
    dragStartRef.current = { x: e.clientX, time: performance.now() };
    lastXRef.current = e.clientX;
    lastTimeRef.current = performance.now();
    velocityRef.current = 0;
    inertiaSpeedRef.current = 0;
    setIsDragging(true);

    // Capture pointer events so dragging outside the element still tracks
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // safe fallback
    }
  };

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    const currentX = e.clientX;
    const currentTime = performance.now();
    const dx = currentX - lastXRef.current;
    const totalDist = Math.abs(currentX - dragStartRef.current.x);

    if (totalDist > 5) {
      dragMovedRef.current = true;
    }

    const w = singleSetWidthRef.current;
    let next = x.get() + dx;

    if (w > 0) {
      while (next <= -w) next += w;
      while (next > 0) next -= w;
    }
    x.set(next);

    const dt = currentTime - lastTimeRef.current;
    if (dt > 6) {
      velocityRef.current = (dx / dt) * 1000; // in px/sec
      lastXRef.current = currentX;
      lastTimeRef.current = currentTime;
    }
  };

  const handlePointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // safe fallback
    }

    // If thrown/flicked with noticeable speed, carry momentum
    if (Math.abs(velocityRef.current) > 60) {
      inertiaSpeedRef.current = velocityRef.current;
    }

    // Keep dragMoved true briefly so the button's onClick knows not to trigger
    window.setTimeout(() => {
      dragMovedRef.current = false;
    }, 60);
  };

  // Mouse Wheel / Trackpad Scroll
  const handleWheel = (e: WheelEvent<HTMLDivElement>) => {
    const delta = e.deltaX !== 0 ? e.deltaX : e.deltaY;
    if (Math.abs(delta) < 2) return;
    const w = singleSetWidthRef.current;
    if (!w) return;

    let next = x.get() - delta * 0.9;
    while (next <= -w) next += w;
    while (next > 0) next -= w;
    x.set(next);
  };

  const renderCard = (reel: VideoReel, copyKey: string) => {
    const key = `${copyKey}-${reel.id}`;
    const isHovered = hoveredId === key;
    const watchedPct = progressMap[reel.id] ?? 0;

    return (
      <div
        key={key}
        data-cursor="play"
        onClick={() => {
          if (dragMovedRef.current) return;
          onSelect(reel);
        }}
        onPointerEnter={() => finePointer && setHoveredId(key)}
        onPointerLeave={() => finePointer && setHoveredId(null)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect(reel);
          }
        }}
        className="group relative flex w-[64vw] min-w-[186px] max-w-[228px] shrink-0 select-none flex-col text-left sm:w-[230px] sm:max-w-none md:w-[244px] lg:w-[264px]"
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
                  draggable={false}
                  onError={() => setBrokenImg((prev) => ({ ...prev, [reel.id]: true }))}
                  className="pointer-events-none h-full w-full select-none object-cover object-top opacity-90 transition-opacity duration-500 group-hover:opacity-100"
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
                  draggable={false}
                  onError={() => setBrokenVid((prev) => ({ ...prev, [reel.id]: true }))}
                  className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover object-top"
                />
              )}
              {/* Bottom readability gradient keeping the upper face completely clear */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/95 via-black/25 to-transparent"
              />
            </PosterBackdrop>
          </motion.div>

          {/* Subtle sheen sweep on hover */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-full rotate-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-all duration-700 group-hover:translate-x-full group-hover:opacity-100"
          />

          {/* Top Episode Badge & Play Button */}
          <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-3 sm:p-3.5">
            <span className="rounded-full border border-white/15 bg-black/55 px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.2em] text-bone backdrop-blur-md sm:px-2.5 sm:py-1 sm:text-[9px] sm:tracking-[0.22em]">
              {reel.episode}
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/35 bg-black/45 text-[10px] text-bone backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:border-bone group-hover:bg-bone group-hover:text-ink sm:h-9 sm:w-9 sm:text-xs">
              ▶
            </span>
          </div>

          {/* Bottom Title & Metadata */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 p-3.5 sm:p-4">
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
      </div>
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
          <p className="mt-0.5 text-[11px] text-mist/75 sm:text-xs">Drag or swipe freely · Auto-scrolling</p>
        </div>

        <span className="hidden text-xs text-mist/60 sm:inline-block">Drag to scroll · Tap to watch</span>
      </div>

      {/* Infinite Draggable + Auto-Scrolling Reels Strip (No buttons required) */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={handleWheel}
        onPointerEnter={() => setIsHoveringTrack(true)}
        onPointerLeave={() => {
          setIsHoveringTrack(false);
          if (isDraggingRef.current) {
            isDraggingRef.current = false;
            setIsDragging(false);
          }
        }}
        className={`relative touch-pan-y overflow-hidden py-4 select-none [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)] ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        <motion.div style={{ x }} className="flex w-max items-stretch will-change-transform">
          <div ref={setRef} className="flex shrink-0 items-stretch gap-6 pr-6">
            {videoReels.map((reel) => renderCard(reel, 'a'))}
          </div>
          <div aria-hidden className="flex shrink-0 items-stretch gap-6 pr-6">
            {videoReels.map((reel) => renderCard(reel, 'b'))}
          </div>
          <div aria-hidden className="flex shrink-0 items-stretch gap-6 pr-6">
            {videoReels.map((reel) => renderCard(reel, 'c'))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
