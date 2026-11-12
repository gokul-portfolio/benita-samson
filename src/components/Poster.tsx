import type { ReactNode } from 'react';
import type { Palette, Project } from '../data/portfolio';

/**
 * Generated "key art" for thumbnails — layered gradients, light falloff and a motif.
 * No stock imagery: every card is art-directed from its palette.
 */
export function PosterBackdrop({ palette, children, className = '' }: { palette: Palette; children?: ReactNode; className?: string }) {
  return (
    <div
      className={`absolute inset-0 overflow-hidden ${className}`}
      style={{
        background: `radial-gradient(110% 85% at 85% 15%, ${palette.via} 0%, transparent 62%),
          radial-gradient(85% 75% at 10% 100%, ${palette.from} 0%, transparent 72%),
          linear-gradient(155deg, ${palette.from} 0%, ${palette.to} 100%)`,
      }}
    >
      <div
        aria-hidden
        className="absolute -right-1/4 -top-1/3 h-[140%] w-[70%] rotate-[18deg] opacity-40 blur-2xl"
        style={{ background: `linear-gradient(90deg, transparent, ${palette.accent}55, transparent)` }}
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.16) 1px, transparent 1px)',
          backgroundSize: '18px 18px',
        }}
      />
      <div aria-hidden className="absolute inset-0 opacity-[0.14] [background-image:repeating-linear-gradient(0deg,rgba(255,255,255,0.06)_0px,rgba(255,255,255,0.06)_1px,transparent_1px,transparent_4px)]" />
      {children}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
    </div>
  );
}

/** Atmospheric studio backdrop for each venture card (kept clean behind featured logos). */
export function ProjectArt({ project, className = '' }: { project: Project; className?: string }) {
  const a = project.palette.accent;
  return (
    <PosterBackdrop palette={project.palette} className={className}>
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <radialGradient id={`g-${project.id}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={a} stopOpacity="0.48" />
            <stop offset="100%" stopColor={a} stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="305" cy="115" r="155" fill={`url(#g-${project.id})`} />
        <g fill="none" stroke={a}>
          <circle cx="305" cy="115" r="78" strokeWidth="1" strokeOpacity="0.14" />
          <circle cx="305" cy="115" r="118" strokeWidth="1" strokeOpacity="0.08" strokeDasharray="4 6" />
          <circle cx="305" cy="115" r="160" strokeWidth="1" strokeOpacity="0.05" />
          <path d="M22 22 h14 M22 22 v14" strokeWidth="1.2" strokeOpacity="0.22" />
          <path d="M378 22 h-14 M378 22 v14" strokeWidth="1.2" strokeOpacity="0.22" />
          <path d="M22 278 h14 M22 278 v-14" strokeWidth="1.2" strokeOpacity="0.18" />
          <path d="M378 278 h-14 M378 278 v-14" strokeWidth="1.2" strokeOpacity="0.18" />
        </g>
      </svg>
    </PosterBackdrop>
  );
}

/** Small fictional platform mark used in the nav and on cards. */
export function SeriesMark({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <svg viewBox="0 0 24 32" className="h-[1.1em] w-auto" aria-hidden>
        <path d="M18 6c-1.8-1.8-4-2.6-6.5-2.6C7.6 3.4 5 5.6 5 9c0 7.6 14 4.6 14 11.6 0 3-2.8 5-6.4 5-3 0-5.4-1.2-7.2-3" fill="none" stroke="#e5132b" strokeWidth="4" strokeLinecap="round" />
      </svg>
      <span className="font-sans text-[0.62em] font-bold tracking-[0.36em] text-mist">SERIES</span>
    </span>
  );
}
