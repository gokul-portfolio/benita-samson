import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { archiveMedia, profile, type VideoReel } from '@/data/portfolio';
import { useDesktop, useFinePointer, useReducedMotionPref } from '@/hooks/useMedia';
import { PosterBackdrop } from '@/components/Poster';
import { EASE } from '@/components/fx';

interface TunnelCardData {
  reel: VideoReel;
  offsetXFactor: number;
  offsetYFactor: number;
  rotationZ: number;
  index: number;
}

// Balanced left & right perimeter lanes keep the center headline clear while preserving 3D depth.
const TUNNEL_SLOTS: ReadonlyArray<{ x: number; y: number; rot: number }> = [
  { x: 0.36, y: 0.14, rot: 4 },
  { x: -0.36, y: -0.14, rot: -4 },
  { x: 0.31, y: -0.27, rot: -5 },
  { x: -0.31, y: 0.27, rot: 5 },
  { x: 0.33, y: 0.28, rot: -3 },
  { x: -0.33, y: -0.28, rot: 3 },
  { x: 0.39, y: -0.04, rot: 5 },
  { x: -0.39, y: 0.05, rot: -5 },
];

const TUNNEL_CARDS: TunnelCardData[] = archiveMedia.map((reel, i) => {
  const slot = TUNNEL_SLOTS[i % TUNNEL_SLOTS.length];
  return {
    reel,
    offsetXFactor: slot.x,
    offsetYFactor: slot.y,
    rotationZ: slot.rot,
    index: i,
  };
});

const SPRING_CONFIG = { stiffness: 60, damping: 25, mass: 0.5 };

interface StageDimensions {
  width: number;
  height: number;
}

function useCameraParallax(enabled: boolean) {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, SPRING_CONFIG);
  const y = useSpring(rawY, SPRING_CONFIG);

  useEffect(() => {
    if (!enabled) return;
    const onMove = (e: PointerEvent) => {
      rawX.set((e.clientX / window.innerWidth - 0.5) * 2);
      rawY.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [enabled, rawX, rawY]);

  return { x, y };
}

interface TunnelCardProps {
  card: TunnelCardData;
  progress: MotionValue<number>;
  pointer: { x: MotionValue<number>; y: MotionValue<number> };
  total: number;
  stage: StageDimensions;
  onSelect?: (reel: VideoReel) => void;
}

function TunnelCard({ card, progress, pointer, total, stage, onSelect }: TunnelCardProps) {
  const staggerSpan = 0.56;
  const start = (card.index / total) * (1 - staggerSpan);
  const end = start + staggerSpan;

  const localProgress = useTransform(progress, [start, end], [0, 1]);

  const z = useTransform(localProgress, [0, 1], [-1350, 380]);
  const opacity = useTransform(localProgress, [0, 0.22, 0.82, 0.98], [0, 1, 1, 0]);

  const cardWidth = Math.max(168, Math.min(238, stage.width * 0.155));
  const baseX = stage.width * card.offsetXFactor;
  const baseY = Math.max(-270, Math.min(270, stage.height * card.offsetYFactor));
  const panStrength = 26;

  const transform = useTransform(
    [z, pointer.x, pointer.y],
    ([currZ, px, py]: number[]) => {
      const offsetX = baseX - px * panStrength;
      const offsetY = baseY - py * panStrength;
      return `translate3d(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px), ${currZ}px) rotateZ(${card.rotationZ}deg)`;
    },
  );

  return (
    <motion.button
      type="button"
      data-cursor="play"
      onClick={() => onSelect?.(card.reel)}
      style={{
        width: cardWidth,
        transform,
        opacity,
        zIndex: card.index + 1,
      }}
      aria-label={card.reel.kind === 'image' ? `View ${card.reel.title}` : `Watch ${card.reel.title}`}
      className="pointer-events-auto absolute left-1/2 top-1/2 aspect-[9/16] cursor-pointer select-none text-left will-change-transform"
    >
      <div className="group relative h-full w-full overflow-hidden rounded-2xl bg-ink-2 shadow-[0_25px_70px_rgba(0,0,0,0.85)] ring-1 ring-white/15 transition-all duration-500 hover:ring-crimson-2/75 hover:shadow-[0_25px_70px_rgba(229,19,43,0.35)]">
        <PosterBackdrop palette={card.reel.palette}>
          <img
            src={card.reel.posterUrl}
            alt={card.reel.title}
            draggable={false}
            loading="lazy"
            className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </PosterBackdrop>

        <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/90 via-black/15 to-transparent p-3.5 sm:p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="rounded-full border border-white/15 bg-black/50 px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.2em] text-bone/90 backdrop-blur-md">
              {card.reel.episode}
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/30 bg-black/50 text-[10px] text-bone backdrop-blur-md transition group-hover:border-bone group-hover:bg-bone group-hover:text-ink">
              {card.reel.kind === 'image' ? '⤢' : '▶'}
            </span>
          </div>

          <div>
            <span className="block font-display text-xl leading-[0.95] tracking-wide text-bone sm:text-2xl">
              {card.reel.title}
            </span>
            <span className="mt-1 block text-[10px] font-medium tracking-wider text-mist">
              {card.reel.meta}
            </span>
          </div>
        </div>
      </div>
    </motion.button>
  );
}

export default function PerspectiveTunnelHero({
  onSelect,
}: {
  onSelect?: (reel: VideoReel) => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const isDesktop = useDesktop();
  const reduce = useReducedMotionPref();
  const fine = useFinePointer();

  const [stage, setStage] = useState<StageDimensions>({
    width: typeof window !== 'undefined' ? window.innerWidth : 1440,
    height: typeof window !== 'undefined' ? window.innerHeight : 900,
  });

  useEffect(() => {
    const updateDimensions = () => {
      setStage({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 28,
    restDelta: 0.0001,
  });

  const pointer = useCameraParallax(isDesktop && !reduce && fine);

  const titleScale = useTransform(smoothProgress, [0, 0.5, 1], [0.88, 1, 1.14]);
  const titleOpacity = useTransform(smoothProgress, [0, 0.14, 0.86, 1], [0.45, 1, 1, 0]);
  const promptOpacity = useTransform(smoothProgress, [0, 0.16], [1, 0]);

  // Mobile, tablet (< 1024px), or reduced-motion: crisp, unobstructed grid archive
  if (!isDesktop || reduce) {
    return (
      <section
        id="showcase"
        aria-label="Visual Archive Showcase"
        className="relative scroll-mt-20 overflow-hidden bg-ink py-14 sm:scroll-mt-24 sm:py-20"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(229,19,43,0.18)_0%,transparent_65%)]"
        />

        <div className="gutter relative z-10">
          <div className="mx-auto max-w-xl text-center">
            <p className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.26em] text-crimson-2 sm:text-[11px] sm:tracking-[0.38em]">
              A Visual Archive · {profile.displayName}
            </p>
            <h2 className="font-display text-[clamp(2.65rem,11vw,4.75rem)] leading-[0.88] tracking-wide text-bone">
              THE JOURNEY <span className="shimmer-text">IN FRAMES.</span>
            </h2>
            <p className="mx-auto mt-3 max-w-[36ch] text-xs font-light leading-relaxed text-mist sm:mt-4 sm:text-sm">
              Moments of courage, reinvention, and purpose — from vision to impact.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3.5 sm:mt-10 sm:grid-cols-4 sm:gap-4 md:gap-5">
            {archiveMedia.map((reel, idx) => (
              <motion.button
                key={reel.id}
                type="button"
                data-cursor="play"
                onClick={() => onSelect?.(reel)}
                initial={reduce ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.45, delay: (idx % 4) * 0.05, ease: EASE }}
                whileTap={{ scale: 0.97 }}
                aria-label={reel.kind === 'image' ? `View ${reel.title}` : `Watch ${reel.title}`}
                className="group relative aspect-[9/16] w-full overflow-hidden rounded-xl bg-ink-2 text-left ring-1 ring-white/15 transition-colors hover:ring-crimson-2/75 sm:rounded-2xl"
              >
                <PosterBackdrop palette={reel.palette}>
                  <img
                    src={reel.posterUrl}
                    alt={reel.title}
                    loading="lazy"
                    className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                </PosterBackdrop>
                <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/92 via-black/20 to-transparent p-3 sm:p-3.5">
                  <div className="flex items-center justify-between gap-1.5">
                    <span className="rounded-full border border-white/15 bg-black/55 px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.18em] text-bone/90 backdrop-blur-md">
                      {reel.episode}
                    </span>
                    <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/30 bg-black/50 text-[10px] text-bone backdrop-blur-md">
                      {reel.kind === 'image' ? '⤢' : '▶'}
                    </span>
                  </div>
                  <div>
                    <span className="block font-display text-lg leading-[0.95] tracking-wide text-bone sm:text-xl">
                      {reel.title}
                    </span>
                    <span className="mt-1 block text-[10px] font-medium tracking-wide text-mist">
                      {reel.meta}
                    </span>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="showcase"
      ref={wrapRef}
      aria-label="3D Spatial Reel Showcase"
      className="relative h-[220vh] w-full scroll-mt-24"
    >
      <div className="sticky top-0 flex h-[100svh] w-full select-none items-center justify-center overflow-hidden bg-ink text-bone">
        {/* Clean Crimson Radial Spotlight without background line/grid overlays */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(229,19,43,0.22)_0%,transparent_70%)]"
        />

        {/* Top & Bottom Soft Vignettes for Seamless Page Blending */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-10 h-28 bg-gradient-to-b from-ink to-transparent" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-28 bg-gradient-to-t from-ink to-transparent" />

        {/* Central Anchor Typography kept cleanly above background depth cards */}
        <motion.div
          style={{ scale: titleScale, opacity: titleOpacity }}
          className="pointer-events-none relative z-20 flex max-w-lg flex-col items-center px-6 text-center"
        >
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.42em] text-crimson-2">
            A Visual Archive · {profile.displayName}
          </p>
          <h2 className="font-display text-[clamp(3.2rem,7.2vw,6.25rem)] leading-[0.86] tracking-wide text-bone drop-shadow-[0_12px_36px_rgba(7,7,10,0.85)]">
            THE JOURNEY
            <br />
            <span className="shimmer-text">IN FRAMES.</span>
          </h2>
          <p className="mt-4 max-w-[36ch] text-sm font-light text-mist sm:text-base">
            Moments of courage, reinvention, and purpose — from vision to impact.
          </p>
        </motion.div>

        {/* Scroll Prompt */}
        <motion.div
          style={{ opacity: promptOpacity }}
          className="pointer-events-none absolute bottom-8 z-20 flex flex-col items-center gap-2 text-[10px] font-bold uppercase tracking-[0.32em] text-smoke"
        >
          <span>Scroll to Fly Through</span>
          <div className="h-6 w-px bg-gradient-to-b from-crimson to-transparent" />
        </motion.div>

        {/* 3D Z-Space Plane */}
        <div
          className="pointer-events-none absolute inset-0 z-10"
          style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}
        >
          {TUNNEL_CARDS.map((card) => (
            <TunnelCard
              key={card.reel.id}
              card={card}
              progress={smoothProgress}
              pointer={pointer}
              total={TUNNEL_CARDS.length}
              stage={stage}
              onSelect={onSelect}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

