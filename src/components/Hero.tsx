import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
import { profile, type ProfileId } from '../data/portfolio';
import { useDesktop, useFinePointer, useReducedMotionPref } from '../hooks/useMedia';
import { EASE, Magnetic, Particles } from './fx';
import HeroCutoutVideo from './ui/HeroCutoutVideo';
import SoftAurora from './ui/SoftAurora';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.25 } } };
const item = {
  hidden: { opacity: 0, y: 28, filter: 'blur(10px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.9, ease: EASE } },
};

const HERO_ROLES = [
  'FOUNDER & CEO',
  'FOUNDER · THE BLIND SPOT',
  'CREATOR · CAREER WITH BENI',
  'HOST · MIC & MENTORS',
];

export default function Hero({
  pauseAudio = false,
}: {
  onPlay?: () => void;
  onResume?: () => void;
  profileId?: ProfileId;
  pauseAudio?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLVideoElement>(null);
  const fine = useFinePointer();
  const reduced = useReducedMotionPref();
  const isDesktop = useDesktop();

  const [isMuted, setIsMuted] = useState(true);
  const [isPaused, setIsPaused] = useState(Boolean(reduced));
  const [hasEnded, setHasEnded] = useState(false);
  const [userWantsSound, setUserWantsSound] = useState(true);
  const hasAutoStartedRef = useRef(false);

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const stageY = useTransform(scrollYProgress, [0, 1], ['0%', '6%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-18%']);
  const fade = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const blackout = useTransform(scrollYProgress, [0.4, 1], [0, 1]);

  // pointer parallax (desktop)
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const px = useSpring(mx, { stiffness: 60, damping: 18 });
  const py = useSpring(my, { stiffness: 60, damping: 18 });
  const chipX = useTransform(px, [-1, 1], [14, -14]);
  const chipY = useTransform(py, [-1, 1], [10, -10]);
  const glowX = useTransform(px, [-1, 1], ['-6%', '6%']);

  // Single-run initial playback on mount (plays once, no endless loop)
  useEffect(() => {
    const v = videoRef.current;
    const a = audioRef.current;
    if (!v || reduced || hasAutoStartedRef.current) return;
    hasAutoStartedRef.current = true;

    let cancelled = false;
    const startOnce = async () => {
      v.muted = true;
      v.currentTime = 0;
      try {
        await v.play();
      } catch {
        // Ignore if autoplay blocked
      }
      if (!cancelled) {
        setIsPaused(v.paused);
        setHasEnded(false);
      }

      if (!a || pauseAudio || !userWantsSound) {
        a?.pause();
        if (!cancelled) setIsMuted(true);
        return;
      }

      a.muted = false;
      a.volume = 1;
      a.currentTime = v.currentTime || 0;
      try {
        await a.play();
        if (!cancelled) setIsMuted(false);
      } catch {
        // Browser blocked unmuted autoplay (e.g. reload without gesture) — keep visual playing and show Tap for Voice
        a.muted = true;
        a.pause();
        if (!cancelled) setIsMuted(true);
      }
    };

    void startOnce();
    return () => {
      cancelled = true;
    };
  }, [pauseAudio, reduced, userWantsSound]);

  // Stop both video & voice immediately when user scrolls below Hero section
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          const v = videoRef.current;
          const a = audioRef.current;
          if (v && !v.paused) v.pause();
          if (a && !a.paused) a.pause();
          setIsPaused(true);
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Mute/pause hero audio when PlayIntro or VideoModal opens
  useEffect(() => {
    if (!pauseAudio) return;
    const v = videoRef.current;
    const a = audioRef.current;
    if (v && !v.paused) v.pause();
    if (a) {
      a.muted = true;
      a.pause();
    }
    setIsPaused(true);
    setIsMuted(true);
  }, [pauseAudio]);

  const syncAudioTime = useCallback(() => {
    const v = videoRef.current;
    const a = audioRef.current;
    if (!v || !a || a.muted || a.paused) return;
    if (Math.abs(a.currentTime - v.currentTime) > 0.18) {
      a.currentTime = v.currentTime;
    }
  }, []);

  const handleEnded = useCallback(() => {
    const v = videoRef.current;
    const a = audioRef.current;
    if (v) {
      v.pause();
      v.currentTime = 0.04;
    }
    if (a) {
      a.pause();
      a.currentTime = 0;
    }
    setHasEnded(true);
    setIsPaused(true);
  }, []);

  const replayFromStart = useCallback(async (withSound: boolean) => {
    const v = videoRef.current;
    const a = audioRef.current;
    if (!v) return;

    setHasEnded(false);
    v.currentTime = 0;
    try {
      await v.play();
      setIsPaused(false);
    } catch {
      return;
    }

    if (a && withSound && !pauseAudio) {
      a.currentTime = 0;
      a.muted = false;
      a.volume = 1;
      try {
        await a.play();
        setIsMuted(false);
      } catch {
        a.muted = true;
        a.pause();
        setIsMuted(true);
      }
    }
  }, [pauseAudio]);

  const toggleVoice = useCallback(async () => {
    const v = videoRef.current;
    const a = audioRef.current;
    if (!v || !a) return;

    if (hasEnded || v.ended) {
      setUserWantsSound(true);
      await replayFromStart(true);
      return;
    }

    if (isMuted || a.muted || a.paused) {
      setUserWantsSound(true);
      a.muted = false;
      a.volume = 1;
      a.currentTime = v.currentTime || 0;
      if (v.paused) {
        try {
          await v.play();
          setIsPaused(false);
        } catch {
          // ignore
        }
      }
      try {
        await a.play();
        setIsMuted(false);
      } catch {
        a.muted = true;
        setIsMuted(true);
      }
    } else {
      setUserWantsSound(false);
      a.muted = true;
      a.pause();
      setIsMuted(true);
    }
  }, [hasEnded, isMuted, replayFromStart]);

  const togglePlayPause = useCallback(async () => {
    const v = videoRef.current;
    const a = audioRef.current;
    if (!v) return;

    if (hasEnded || v.ended) {
      setUserWantsSound(true);
      await replayFromStart(true);
      return;
    }

    if (v.paused) {
      setUserWantsSound(true);
      try {
        await v.play();
        setIsPaused(false);
        if (a && !pauseAudio) {
          a.currentTime = v.currentTime || 0;
          a.muted = false;
          a.volume = 1;
          try {
            await a.play();
            setIsMuted(false);
          } catch {
            a.muted = true;
            setIsMuted(true);
          }
        }
      } catch {
        // ignore
      }
    } else {
      v.pause();
      a?.pause();
      setIsPaused(true);
    }
  }, [hasEnded, pauseAudio, replayFromStart]);

  const handleVideoClick = useCallback(async () => {
    await togglePlayPause();
  }, [togglePlayPause]);

  const meta = [
    'Australia & India',
    '50,000+ Followers',
    'Team of 8 → 15',
  ];

  const floating = [
    { text: '50,000+ Followers', sub: 'Career with Beni · 120+ Videos', pos: 'bottom-[24%] left-0 xl:-left-4', depth: 1 },
    { text: 'Connecting Dots', sub: 'Registered in Australia · 2025', pos: 'top-[12%] right-0 xl:right-2', depth: -1 },
  ];

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex min-h-[100svh] items-end overflow-hidden bg-[#120308] lg:items-center"
      onPointerMove={(e) => {
        if (!fine) return;
        mx.set((e.clientX / window.innerWidth) * 2 - 1);
        my.set((e.clientY / window.innerHeight) * 2 - 1);
      }}
    >
      {/* Layer 0 (z-0): Unified crimson-obsidian hero backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(80%_90%_at_18%_48%,rgba(229,19,43,0.48),rgba(128,10,28,0.34)_44%,rgba(10,3,6,0.98)_82%)]"
      />
      <div className="pointer-events-none absolute inset-0 z-0">
        <SoftAurora
          speed={0.55}
          scale={1.45}
          brightness={1.02}
          color1="#ff3d5a"
          color2="#a80b2a"
          bandHeight={0.56}
          bandSpread={1.15}
          spectrum={0.42}
          tilt={-8}
          opacity={0.48}
          enableMouseInteraction={fine}
          mouseInfluence={0.2}
        />
      </div>
      <motion.div aria-hidden className="pointer-events-none absolute inset-0 z-0" style={{ x: glowX }}>
        <div className="absolute left-[-8%] top-[8%] h-[78vh] w-[52vw] rounded-full bg-[radial-gradient(closest-side,rgba(229,19,43,0.42),rgba(165,12,38,0.16)_58%,transparent)] blur-3xl" />
        <div className="absolute right-[6%] top-[16%] h-[72vh] w-[46vw] rounded-full bg-[radial-gradient(closest-side,rgba(229,19,43,0.34),rgba(140,10,28,0.12)_58%,transparent_75%)] blur-3xl" />
      </motion.div>

      {/* Layer 1 (z-[5]): Ambient particles + light streaks behind content */}
      <Particles className="z-[5]" />
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[5] overflow-hidden">
        <span className="light-streak left-[40%] top-[22%] w-[50vw]" style={{ animationDelay: '1.2s' }} />
        <span className="light-streak left-[30%] top-[64%] w-[40vw]" style={{ animationDelay: '3.6s' }} />
        <span className="light-streak left-[55%] top-[44%] w-[30vw]" style={{ animationDelay: '5.2s' }} />
      </div>

      {/* Main two-column stage cleanly below fixed header */}
      <div className="gutter relative z-[20] w-full pb-0 pt-[88px] sm:pt-[96px] lg:pt-[84px]">
        <div className="grid grid-cols-1 items-center gap-6 sm:gap-8 lg:grid-cols-12 lg:gap-6 xl:gap-10">
          {/* Layer 5 (z-[30]): Left-column Editorial Founder Copy + CTA (always foreground above particles & right stage) */}
          <motion.div
            className="relative z-[30] flex flex-col items-start pb-2 text-left sm:pb-4 lg:col-span-6 lg:pb-12 xl:col-span-5"
            style={{ y: isDesktop ? textY : 0, opacity: fade }}
            variants={container}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={item} className="mb-2.5 sm:mb-3">
              <span className="inline-flex flex-wrap items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-crimson-2 sm:gap-2 sm:text-[11px] sm:tracking-[0.3em]">
                Connecting Dots Worldwide <span className="text-mist/60">·</span> The Blind Spot
              </span>
            </motion.div>

            <motion.h1
              variants={item}
              className="font-display leading-[0.84] tracking-[0.02em] text-bone"
              style={{ fontSize: 'clamp(3.75rem, 15vw, 8.75rem)' }}
            >
              <span className="shimmer-text">{profile.firstName}</span>
            </motion.h1>

            <motion.p variants={item} className="mt-2 min-h-[1.5rem] whitespace-nowrap font-sans text-[11px] font-bold uppercase tracking-[0.16em] text-crimson-2 sm:text-sm sm:tracking-[0.42em]">
              <TypewriterRole roles={HERO_ROLES} reduced={reduced} fallback={profile.seriesTag} />
            </motion.p>

            <motion.div variants={item} className="mt-4 flex flex-wrap items-center gap-x-2.5 gap-y-2 text-[12px] font-medium text-mist sm:mt-5 sm:gap-x-3 sm:text-[13px]">
              <span className="rounded border border-crimson-2/40 bg-crimson/15 px-2 py-0.5 text-[10px] font-bold tracking-[0.14em] text-crimson-2">
                VISION
              </span>
              {meta.map((m, i) => (
                <span key={m} className="flex items-center gap-2.5 sm:gap-3">
                  {i > 0 && <span className="h-1 w-1 rounded-full bg-smoke" />}
                  {m}
                </span>
              ))}
            </motion.div>

            <motion.p variants={item} className="mt-4 max-w-lg text-[14px] leading-[1.68] text-bone/85 sm:mt-5 sm:text-base sm:leading-[1.7]">
              {profile.intro}
            </motion.p>

            <motion.div variants={item} className="mt-6 sm:mt-8">
              <Magnetic>
                <a
                  href="https://careerhq.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-2.5 rounded-md bg-bone px-6 py-2.5 text-[13.5px] font-bold tracking-wide text-ink shadow-[0_12px_36px_rgba(229,19,43,0.28)] transition hover:bg-white sm:min-h-12 sm:px-8 sm:py-3 sm:text-[14px]"
                >
                  <span>Visit Career HQ</span>
                  <span aria-hidden className="text-sm text-crimson">↗</span>
                </a>
              </Magnetic>
            </motion.div>
          </motion.div>

          {/* Right column (z-[20]): Halo (10) -> Arch (12) -> Chips (18) -> Benita (25) -> Stage Fade (28) -> Sound (35) */}
          <motion.div
            className="relative z-[20] flex items-end justify-center lg:col-span-6 lg:self-end xl:col-span-7"
            style={{ y: isDesktop ? stageY : 0, opacity: fade }}
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
          >
            {/* Layer 2 (z-[10]): Ambient outer crimson halo behind portal */}
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-[8%] z-[10] h-[84%] w-[86%] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(229,19,43,0.42),rgba(135,10,28,0.18)_58%,transparent_80%)] blur-3xl lg:w-[82%]"
            />

            {/* Layer 2b (z-[12]): Frosted Studio Light Arch Portal directly behind Benita */}
            <div
              aria-hidden
              className="pointer-events-none absolute bottom-0 left-1/2 z-[12] h-[90%] w-[min(86%,300px)] -translate-x-1/2 overflow-hidden rounded-t-[999px] border border-b-0 border-white/[0.14] bg-[linear-gradient(180deg,rgba(255,236,240,0.16)_0%,rgba(229,19,43,0.22)_46%,rgba(14,3,8,0.5)_100%)] shadow-[0_0_80px_rgba(229,19,43,0.26),inset_0_1px_0_rgba(255,255,255,0.28)] backdrop-blur-md [mask-image:linear-gradient(to_bottom,black_76%,transparent_100%)] sm:h-[88%] sm:w-[min(78%,410px)] lg:w-[min(84%,480px)]"
            >
              {/* Softbox studio backlight glow positioned right behind her hair & shoulders */}
              <div className="absolute inset-0 bg-[radial-gradient(72%_58%_at_50%_34%,rgba(255,228,234,0.34),rgba(229,19,43,0.2)_56%,transparent_84%)]" />
              {/* Subtle vertical editorial studio hairline accent */}
              <div className="absolute inset-x-4 top-4 bottom-10 rounded-t-[999px] border border-b-0 border-white/[0.06] sm:inset-x-6 sm:top-6 sm:bottom-12" />
            </div>

            {/* Layer 3 (z-[18]): Mid-ground floating milestone chips (above arch z-[12], behind Benita z-[25]) */}
            <div className="pointer-events-none hidden lg:block">
              {floating.map((f, i) => (
                <FloatChip key={f.text} {...f} index={i} mx={chipX} my={chipY} />
              ))}
            </div>

            {/* Layer 4 (z-[25]): Foreground GPU-cleaned & sharpened Benita cutout video */}
            <div className="relative z-[25] h-[340px] w-full overflow-hidden sm:h-[430px] md:h-[480px] lg:h-[min(84svh,760px)] [mask-image:linear-gradient(to_bottom,black_84%,transparent_100%)]">
              <HeroCutoutVideo
                videoRef={videoRef}
                primarySrc={profile.bannerVideo}
                fallbackSrc={profile.bannerVideoFallback}
                autoPlay={!reduced}
                onClick={handleVideoClick}
                onTimeUpdate={syncAudioTime}
                onEnded={handleEnded}
                cursor={isPaused || hasEnded ? 'play' : undefined}
                title={isPaused || hasEnded ? 'Click to play intro' : 'Click to pause'}
                ariaLabel="Benita Samson founder introduction video"
              />
              {/* Synced voice audio track from original MP4 (WebM BG-removed export has silent Opus track) */}
              <video
                ref={audioRef}
                src={profile.bannerAudio}
                playsInline
                preload="auto"
                aria-hidden
                className="hidden"
              />
            </div>

            {/* Stage bottom dissolve (z-[28]): multi-stop fade blending both arch (12) & waist (25) seamlessly into #07070a */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 z-[28] h-16 bg-[linear-gradient(to_top,#07070a_0%,rgba(7,7,10,0.68)_35%,rgba(7,7,10,0.22)_72%,transparent_100%)] sm:h-24 lg:h-32"
            />

            {/* Layer 7 (z-[35]): Interactive corner voice mute/unmute icon above stage fade & portrait */}
            {!isPaused && (
              <button
                type="button"
                onClick={toggleVoice}
                aria-label={isMuted ? 'Enable video voice audio' : 'Mute video voice audio'}
                title={isMuted ? 'Tap for Voice' : 'Mute Voice'}
                className={`absolute bottom-4 right-2 z-[35] flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-md transition sm:bottom-5 sm:right-6 ${
                  isMuted
                    ? 'border-crimson-2/60 bg-crimson text-white shadow-[0_0_20px_rgba(229,19,43,0.55)] hover:bg-crimson-2'
                    : 'border-white/15 bg-[#100408]/75 text-bone hover:border-white/35 hover:bg-[#100408]/95'
                }`}
              >
                {isMuted ? (
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
                    <path d="M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 0 0 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4 9.91 6.09 12 8.18V4z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current text-crimson-2" aria-hidden>
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                  </svg>
                )}
              </button>
            )}
          </motion.div>
        </div>
      </div>

      {/* Section floor fade (z-[12]): anchors Hero bottom seamlessly before Continue Exploring */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-[12] h-24 bg-gradient-to-t from-ink to-transparent" />

      {/* Layer 8 (z-[40]): Scroll-out darkening curtain */}
      <motion.div aria-hidden className="pointer-events-none absolute inset-0 z-[40] bg-ink" style={{ opacity: blackout }} />
    </section>
  );
}

type MV = ReturnType<typeof useTransform<number, number>>;

function TypewriterRole({
  roles,
  reduced,
  fallback,
}: {
  roles: string[];
  reduced: boolean;
  fallback: string;
}) {
  const [roleIndex, setRoleIndex] = useState(0);
  const [charCount, setCharCount] = useState(fallback.length);
  const [deleting, setDeleting] = useState(false);

  const current = roles[roleIndex] ?? fallback;

  useEffect(() => {
    if (reduced) return;

    let delay = deleting ? 32 : 58;
    if (!deleting && charCount === current.length) delay = 2100;
    else if (deleting && charCount === 0) delay = 320;

    const timer = window.setTimeout(() => {
      if (!deleting) {
        if (charCount < current.length) {
          setCharCount((c) => c + 1);
        } else {
          setDeleting(true);
        }
      } else if (charCount > 0) {
        setCharCount((c) => c - 1);
      } else {
        setDeleting(false);
        setRoleIndex((i) => (i + 1) % roles.length);
      }
    }, delay);

    return () => window.clearTimeout(timer);
  }, [charCount, current.length, deleting, reduced, roles.length]);

  if (reduced) return <span>{fallback}</span>;

  return (
    <span className="inline-flex items-center">
      <span className="sr-only">{fallback}</span>
      <span aria-hidden>{current.slice(0, charCount)}</span>
      <span
        aria-hidden
        className="ml-0.5 inline-block h-[1em] w-[2px] animate-pulse bg-crimson-2 align-middle shadow-[0_0_8px_rgba(255,61,90,0.8)]"
      />
    </span>
  );
}

function FloatChip({ text, sub, pos, depth, index, mx, my }: { text: string; sub: string; pos: string; depth: number; index: number; mx: MV; my: MV }) {
  const x = useTransform(mx, (n: number) => n * depth);
  const y = useTransform(my, (n: number) => n * depth);
  return (
    <motion.div
      className={`absolute z-[18] hidden rounded-xl border border-crimson-2/25 bg-[#12060a]/85 px-4 py-2.5 shadow-[0_14px_36px_rgba(0,0,0,0.6),0_0_24px_rgba(229,19,43,0.14)] backdrop-blur-md md:block ${pos}`}
      style={{ x, y }}
      initial={{ opacity: 0, filter: 'blur(6px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      transition={{ duration: 0.9, delay: 1.2 + index * 0.18, ease: EASE }}
    >
      <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 5 + index, repeat: Infinity, ease: 'easeInOut' }}>
        <p className="text-sm font-semibold text-bone">{text}</p>
        <p className="text-[10px] uppercase tracking-[0.2em] text-mist">{sub}</p>
      </motion.div>
    </motion.div>
  );
}
