import { useLayoutEffect, useRef } from 'react';
import { achievements, teamMembers } from '../data/portfolio';
import { SectionHeading, Tilt } from './fx';
import { GSAP_EASE, gsap } from '../lib/gsap';

function Laurel({ side }: { side: 'l' | 'r' }) {
  return (
    <svg viewBox="0 0 30 64" className={`h-14 w-auto text-[#d9b46a] ${side === 'r' ? '-scale-x-100' : ''}`} aria-hidden>
      <path d="M26 62C10 52 4 36 8 4" fill="none" stroke="currentColor" strokeWidth="1.4" />
      {[10, 18, 26, 34, 42, 50].map((y, i) => (
        <ellipse key={y} cx={i < 2 ? 9 : 8 + i * 1.6} cy={y} rx="5" ry="2.2" fill="currentColor" opacity="0.85" transform={`rotate(-40 ${8 + i * 1.6} ${y})`} />
      ))}
    </svg>
  );
}

export default function Achievements() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const awards = el.querySelectorAll<HTMLElement>('[data-award-card]');

        if (awards.length) {
          gsap.fromTo(
            awards,
            { y: 48, opacity: 0, rotateX: 16, transformPerspective: 1200 },
            {
              y: 0,
              opacity: 1,
              rotateX: 0,
              duration: 0.85,
              stagger: 0.08,
              ease: GSAP_EASE,
              scrollTrigger: { trigger: awards[0], start: 'top 86%', once: true },
            },
          );
        }
      });
    }, el);

    return () => {
      ctx.revert();
      mm.revert();
    };
  }, []);

  return (
    <div ref={wrapRef}>
      <SectionHeading kicker="Ecosystem & People" title="Impact & Milestones" />

      <div className="gutter grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 [perspective:1400px]">
        {achievements.map((a) => (
          <div key={a.id} data-award-card>
            <Tilt max={8} className="group h-full rounded-2xl">
              <article className="relative flex h-full min-h-[340px] flex-col items-center overflow-hidden rounded-2xl bg-[radial-gradient(120%_80%_at_50%_0%,#2a1f10,#0d0b08_60%,#07070a)] px-5 pb-6 pt-8 text-center ring-1 ring-[#d9b46a]/20 transition duration-500 group-hover:ring-[#d9b46a]/60">
                <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d9b46a]/70 to-transparent" />
                <div aria-hidden className="absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-[#d9b46a]/10 blur-3xl transition duration-700 group-hover:bg-[#d9b46a]/25" />
                <div className="relative flex items-center gap-1">
                  <Laurel side="l" />
                  <div className="px-1">
                    <p className="text-[9px] font-bold uppercase leading-tight tracking-[0.24em] text-[#d9b46a]">{a.laurel}</p>
                  </div>
                  <Laurel side="r" />
                </div>
                <h3 className="relative mt-6 font-display text-[1.85rem] sm:text-[2.05rem] leading-[0.92] tracking-wide text-bone">{a.title}</h3>
                <p className="relative mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#d9b46a]">{a.org}</p>
                <p className="relative mt-4 text-[13px] leading-relaxed text-bone/70">{a.detail}</p>
                {a.link && (
                  <a
                    href={a.link}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="link"
                    className="relative mt-auto inline-flex min-h-10 items-center gap-1 pt-5 text-xs font-semibold tracking-wide text-bone underline decoration-[#d9b46a]/60 underline-offset-4 hover:decoration-[#d9b46a]"
                  >
                    View more ↗
                  </a>
                )}
              </article>
            </Tilt>
          </div>
        ))}
      </div>

      {/* Leadership & Team (Advanced Premium UI) */}
      <div className="gutter mt-16">

        {/* Enhanced Heading with sleek divider */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
          <h3 data-team-heading className="flex items-center gap-4 font-sans text-xl font-semibold tracking-tight text-bone sm:text-3xl">
            Leadership &amp; Team
            <span className="hidden h-px w-10 bg-gradient-to-r from-[#d9b46a]/60 to-transparent sm:block"></span>
            <span className="text-sm font-medium tracking-wide text-mist/70 sm:text-base">
              8 today <span className="mx-1 text-[#d9b46a]/80">→</span> 15 in the vision
            </span>
          </h3>
        </div>

        {/* Advanced Grid Cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {teamMembers.map((m) => (
            <div
              key={m.name}
              data-team-card /* Keep this for GSAP animation */
              className="group relative overflow-hidden rounded-2xl bg-[radial-gradient(120%_120%_at_50%_0%,#1a1510,#0a0806_70%,#000000)] p-5 ring-1 ring-white/10 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_rgba(217,180,106,0.15)] hover:ring-[#d9b46a]/50"
            >
              {/* Glassmorphism Top Highlight Line */}
              <div aria-hidden className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#d9b46a]/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              {/* Subtle Ambient Glow on Hover */}
              <div aria-hidden className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#d9b46a]/0 blur-[30px] transition-all duration-700 group-hover:bg-[#d9b46a]/20 group-hover:blur-[40px]" />

              {/* Card Content */}
              <div className="relative z-10">
                <p className="font-display text-2xl leading-tight tracking-wide text-bone drop-shadow-sm transition-colors duration-300 group-hover:text-white">
                  {m.name}
                </p>
                <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.25em] text-crimson-2/80 transition-colors duration-300 group-hover:text-crimson-2">
                  {m.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
