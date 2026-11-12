import type { Project } from '../../data/portfolio';

/** Framed venture brand mark for dark cards & modals (adapts light vs dark logo assets). */
export default function VentureLogo({
  project,
  size = 'card',
}: {
  project: Project;
  size?: 'card' | 'modal' | 'showcase';
}) {
  const isShowcase = size === 'showcase';
  const heightCls = isShowcase
    ? 'h-20 sm:h-24'
    : size === 'modal'
      ? 'h-9 sm:h-11'
      : 'h-8 sm:h-9';
  const maxWidthCls = isShowcase
    ? 'max-w-[220px] sm:max-w-[260px]'
    : 'max-w-[132px] sm:max-w-[152px]';
  const radiusCls = isShowcase ? 'rounded-2xl p-3.5 sm:p-4' : 'rounded-xl px-2.5 py-1.5';

  if (project.logo) {
    const isLight = project.logoTheme === 'light';
    return (
      <div
        className={`relative inline-flex items-center gap-3 transition-transform duration-300 group-hover:scale-[1.04] ${
          isLight
            ? `${radiusCls} bg-white/95 shadow-[0_12px_32px_rgba(0,0,0,0.45)] ring-1 ring-white/40`
            : ''
        }`}
      >
        {isShowcase && !isLight && (
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-4 -z-10 rounded-full opacity-55 blur-2xl transition-opacity duration-500 group-hover:opacity-85"
            style={{ background: `radial-gradient(circle, ${project.palette.accent}45 0%, transparent 72%)` }}
          />
        )}
        <img
          src={project.logo}
          alt={`${project.title} logo`}
          loading="lazy"
          className={`${heightCls} ${maxWidthCls} w-auto rounded-xl object-contain drop-shadow-[0_14px_30px_rgba(0,0,0,0.7)]`}
        />
        {project.emblem && (
          <span
            className={`font-bold uppercase tracking-[0.22em] text-bone/90 drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)] ${
              isShowcase ? 'text-xs sm:text-sm' : 'text-[10px]'
            }`}
          >
            {project.emblem}
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-2.5 border border-white/20 bg-black/50 backdrop-blur-md ${
        isShowcase ? 'rounded-2xl px-5 py-3.5 sm:px-6 sm:py-4' : 'rounded-xl px-3 py-1.5'
      }`}
      style={
        isShowcase
          ? { boxShadow: `0 18px 44px rgba(0,0,0,0.55), 0 0 28px ${project.palette.accent}28` }
          : undefined
      }
    >
      <span className="h-2.5 w-2.5 rounded-full bg-crimson-2 shadow-[0_0_8px_rgba(255,61,90,0.85)]" />
      <span
        className={`font-display tracking-[0.26em] text-bone ${
          isShowcase ? 'text-xl sm:text-2xl' : 'text-base sm:text-lg'
        }`}
      >
        {project.emblem ?? 'VENTURE'}
      </span>
    </div>
  );
}

