import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useSpring } from 'framer-motion';
import { useFinePointer, useReducedMotionPref } from '../../hooks/useMedia';

export type GazeDirection = 'front' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'down';

export type GazeSources = Record<GazeDirection, string>;

const ALL_DIRECTIONS: ReadonlyArray<GazeDirection> = [
  'front',
  'topLeft',
  'topRight',
  'bottomLeft',
  'bottomRight',
  'down',
];

const SPRING_CFG = { stiffness: 110, damping: 24, mass: 0.65 };

function resolveGazeDirection(dx: number, dy: number): GazeDirection {
  const dist = Math.hypot(dx, dy);
  if (dist < 85) return 'front';

  if (dy > 85 && Math.abs(dx) < dy * 0.36) {
    return 'down';
  }

  if (dy <= 28) {
    return dx < 0 ? 'topLeft' : 'topRight';
  }

  return dx < 0 ? 'bottomLeft' : 'bottomRight';
}

export default function GazePortrait({
  sources,
  alt,
}: {
  sources: GazeSources;
  alt: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const finePointer = useFinePointer();
  const reduced = useReducedMotionPref();

  const [gaze, setGaze] = useState<GazeDirection>('front');
  const [inView, setInView] = useState(true);
  const pendingRef = useRef<{ dir: GazeDirection; timer: number | null }>({
    dir: 'front',
    timer: null,
  });

  const springX = useSpring(0, SPRING_CFG);
  const springY = useSpring(0, SPRING_CFG);
  const springRot = useSpring(0, SPRING_CFG);

  // Preload all directional frames immediately so pose switches never flicker
  useEffect(() => {
    Object.values(sources).forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [sources]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: '120px 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const commitGaze = useCallback((next: GazeDirection, immediate = false) => {
    if (pendingRef.current.timer !== null) {
      window.clearTimeout(pendingRef.current.timer);
      pendingRef.current.timer = null;
    }

    if (immediate) {
      pendingRef.current.dir = next;
      setGaze(next);
      return;
    }

    pendingRef.current.dir = next;
    pendingRef.current.timer = window.setTimeout(() => {
      setGaze(pendingRef.current.dir);
      pendingRef.current.timer = null;
    }, 65);
  }, []);

  const resetToFront = useCallback(() => {
    springX.set(0);
    springY.set(0);
    springRot.set(0);
    commitGaze('front', true);
  }, [commitGaze, springRot, springX, springY]);

  const updateFromClientPoint = useCallback(
    (clientX: number, clientY: number) => {
      const el = containerRef.current;
      if (!el || reduced) return;
      const rect = el.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const eyeX = rect.left + rect.width * 0.5;
      const eyeY = rect.top + rect.height * 0.36;
      const dx = clientX - eyeX;
      const dy = clientY - eyeY;

      const nx = Math.max(-1, Math.min(1, dx / 440));
      const ny = Math.max(-1, Math.min(1, dy / 340));

      springX.set(nx * 7);
      springY.set(ny * 5);
      springRot.set(nx * 1.0);

      const dir = resolveGazeDirection(dx, dy);
      if (dir !== pendingRef.current.dir) {
        commitGaze(dir);
      }
    },
    [commitGaze, reduced, springRot, springX, springY],
  );

  // Desktop viewport-wide pointer tracking while Founder Introduction is visible
  useEffect(() => {
    if (!finePointer || reduced || !inView) {
      resetToFront();
      return;
    }

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
      updateFromClientPoint(e.clientX, e.clientY);
    };

    const onMouseLeave = () => resetToFront();

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('blur', onMouseLeave);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('blur', onMouseLeave);
      if (pendingRef.current.timer !== null) {
        window.clearTimeout(pendingRef.current.timer);
      }
    };
  }, [finePointer, inView, reduced, resetToFront, updateFromClientPoint]);

  return (
    <div
      ref={containerRef}
      onPointerDown={(e) => {
        if (!reduced && e.pointerType === 'touch') {
          updateFromClientPoint(e.clientX, e.clientY);
        }
      }}
      onPointerMove={(e) => {
        if (!reduced && e.pointerType === 'touch') {
          updateFromClientPoint(e.clientX, e.clientY);
        }
      }}
      onPointerUp={(e) => {
        if (e.pointerType === 'touch') resetToFront();
      }}
      onPointerCancel={(e) => {
        if (e.pointerType === 'touch') resetToFront();
      }}
      className="pointer-events-auto absolute inset-0 [mask-image:linear-gradient(to_bottom,black_80%,transparent_100%)]"
    >
      <motion.div
        style={reduced ? undefined : { x: springX, y: springY, rotate: springRot }}
        className="relative h-full w-full will-change-transform"
      >
        {reduced ? (
          <img
            src={sources.front}
            alt={alt}
            draggable={false}
            loading="eager"
            className="pointer-events-none absolute bottom-0 left-1/2 h-[92%] w-auto max-w-none -translate-x-1/2 select-none object-contain object-bottom"
          />
        ) : (
          ALL_DIRECTIONS.map((dir) => (
            <img
              key={dir}
              src={sources[dir]}
              alt={dir === 'front' ? alt : ''}
              aria-hidden={dir !== 'front'}
              draggable={false}
              loading="eager"
              style={{ opacity: gaze === dir ? 1 : 0 }}
              className="pointer-events-none absolute bottom-0 left-1/2 h-[92%] w-auto max-w-none -translate-x-1/2 select-none object-contain object-bottom transition-opacity duration-[320ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[opacity]"
            />
          ))
        )}
      </motion.div>
    </div>
  );
}
