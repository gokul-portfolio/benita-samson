import { useLayoutEffect, useRef } from 'react';
import { education, experience, profile } from '../data/portfolio';
import { SectionHeading } from './fx';
import { GSAP_EASE, gsap } from '../lib/gsap';
import GsapSplitText from './ui/GsapSplitText';
import GazePortrait from './ui/GazePortrait';
import ParallaxLayer from './ui/ParallaxLayer';

export default function About() {
  const sectionBodyRef = useRef<HTMLDivElement>(null);
  const facts = [
    { k: 'Sales & Fundraising', v: 'Sales Course & Trust (Fundraising)', s: '2015 · Community fundraising & public trust' },
    { k: 'Australian Banking', v: `${education[0].score} · NAB & CBA`, s: 'Walked away to build her own path' },
    { k: 'Madurai Launch', v: experience[3]?.company ?? 'Hope Education & Migration', s: 'Feb 2025 · Founding team of 4' },
    // { k: 'Shared Brand', v: experience[1].company, s: '' },
    { k: ' Company', v: experience[0].company, s: '4 Companies: Career HQ · Industry Connect · A T O M · DNA' },
  ];

  useLayoutEffect(() => {
    const el = sectionBodyRef.current;
    if (!el) return;

    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const aura = el.querySelector<HTMLElement>('[data-about-aura]');
        const portrait = el.querySelector<HTMLElement>('[data-about-portrait]');
        const author = el.querySelector<HTMLElement>('[data-about-author]');
        const shimmer = el.querySelector<HTMLElement>('[data-about-grid-shimmer]');
        const factCards = el.querySelectorAll<HTMLElement>('[data-about-fact]');
        const pillarsLabel = el.querySelector<HTMLElement>('[data-about-pillars-label]');
        const interestPills = el.querySelectorAll<HTMLElement>('[data-about-interest]');

        const tl = gsap.timeline({
          scrollTrigger: { trigger: el, start: 'top 80%', once: true },
        });

        if (aura) {
          tl.fromTo(
            aura,
            { scale: 0.72, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.9, ease: GSAP_EASE },
            0.12,
          );
        }

        if (portrait) {
          tl.fromTo(
            portrait,
            { y: 26, scale: 0.96, opacity: 0 },
            { y: 0, scale: 1, opacity: 1, duration: 0.85, ease: GSAP_EASE },
            0.18,
          );
        }

        if (author) {
          tl.fromTo(
            author,
            { y: 10, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.55, ease: GSAP_EASE },
            0.42,
          );
        }

        if (shimmer) {
          tl.fromTo(
            shimmer,
            { scaleX: 0, opacity: 0.85, transformOrigin: 'left center' },
            { scaleX: 1, opacity: 0, duration: 0.85, ease: GSAP_EASE },
            0.46,
          );
        }

        if (factCards.length) {
          tl.fromTo(
            factCards,
            { y: 22, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.65, stagger: 0.09, ease: GSAP_EASE },
            0.46,
          );
        }

        if (pillarsLabel) {
          tl.fromTo(
            pillarsLabel,
            { y: 8, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.45, ease: GSAP_EASE },
            0.68,
          );
        }

        if (interestPills.length) {
          tl.fromTo(
            interestPills,
            { y: 12, opacity: 0, scale: 0.92 },
            { y: 0, opacity: 1, scale: 1, duration: 0.5, stagger: 0.06, ease: GSAP_EASE },
            0.74,
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
    <>
      <SectionHeading kicker="The Woman Beyond the Vision" title="Founder Introduction" showRule />
      <div
        ref={sectionBodyRef}
        className="gutter grid items-center gap-8 lg:grid-cols-[minmax(0,4.6fr)_minmax(0,6.4fr)] lg:items-center lg:gap-12"
      >
        <ParallaxLayer yPercent={[-4, 4]} desktopOnly className="mx-auto w-full max-w-[340px] sm:max-w-[390px] lg:max-w-[430px]">
          <div data-about-portrait className="relative aspect-[4/4.2] w-full overflow-visible">
            {/* Soft radial crimson studio aura without any hard box or border */}
            <div
              data-about-aura
              aria-hidden
              className="pointer-events-none absolute -inset-6 bg-[radial-gradient(62%_56%_at_50%_46%,rgba(140,14,38,0.42),rgba(42,6,14,0.16)_58%,transparent_80%)]"
            />
            <GazePortrait sources={profile.portraitGaze} alt={profile.portrait.alt} />
            {/* Soft bottom fade blending the cutout seamlessly into the dark canvas */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-ink via-ink/65 to-transparent"
            />
          </div>
        </ParallaxLayer>

        <div>
          <GsapSplitText
            as="p"
            text={`“${profile.quote}”`}
            mode="reveal"
            delay={0.34}
            stagger={0.025}
            duration={0.8}
            className="font-serif text-[clamp(1.35rem,2.4vw,2.05rem)] italic leading-[1.18] text-bone"
          />
          <p data-about-author className="mt-3 text-xs text-mist sm:text-sm">
            — {profile.fullName}, Founder &amp; CEO
          </p>

          <div className="relative mt-6 overflow-hidden rounded-xl">
            <div
              data-about-grid-shimmer
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-crimson via-crimson-2 to-transparent"
            />
            <dl className="grid gap-px bg-white/10 sm:grid-cols-2">
              {facts.map((f, i) => (
                <div
                  key={f.k}
                  data-about-fact
                  className={`bg-ink-2 p-4 ${i === 4 ? 'sm:col-span-2' : ''}`}
                >
                  <dt className="text-[10px] font-bold uppercase tracking-[0.26em] text-smoke">{f.k}</dt>
                  <dd className="mt-1.5 text-sm font-semibold text-bone sm:text-base">{f.v}</dd>
                  <dd className="mt-0.5 text-xs text-mist">{f.s}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-6">
            <p
              data-about-pillars-label
              className="mb-3 text-[10px] font-bold uppercase tracking-[0.28em] text-smoke"
            >
              Ecosystem Pillars
            </p>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((i) => (
                <span key={i} data-about-interest className="glass rounded-full px-3 py-1.5 text-xs font-medium text-bone">
                  {i}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
