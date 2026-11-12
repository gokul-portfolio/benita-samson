import { useState } from 'react';
import { motion } from 'framer-motion';
import { achievements, archiveChapters, certifications, education, experience, founderStory, profile, projects, skillCategories } from '../data/portfolio';
import { EASE, SectionHeading } from './fx';
import ParallaxLayer from './ui/ParallaxLayer';

/** THE FULL STORY — a designed founder dossier. */
export default function ResumeSection({ onView: _onView }: { onView?: () => void }) {
  return (
    <>
      <SectionHeading kicker="Founder Dossier" title="The Full Story" />
      <div className="gutter">
        <ParallaxLayer yPercent={[3, -3]} desktopOnly>
          <motion.div
            initial={{ opacity: 0, y: 60, rotateX: 10 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 1.1, ease: EASE }}
            style={{ transformPerspective: 1600 }}
          >
            <CollapsibleSheet />
          </motion.div>
        </ParallaxLayer>
      </div>
    </>
  );
}

/** On phones the sheet starts as a teaser so the page keeps its pace; desktop shows it in full. */
function CollapsibleSheet() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <div className={`overflow-hidden transition-[max-height] duration-700 ease-[var(--ease-cine)] md:max-h-none ${open ? 'max-h-[4000px]' : 'max-h-[560px]'}`}>
        <ResumeSheet />
      </div>
      {!open && (
        <div className="absolute inset-x-0 bottom-0 flex h-48 items-end justify-center rounded-b-2xl bg-gradient-to-t from-ink via-ink/85 to-transparent pb-4 md:hidden">
          <button type="button" onClick={() => setOpen(true)} className="glass min-h-11 rounded-full px-5 text-sm font-semibold text-bone">
            Read the full story ↓
          </button>
        </div>
      )}
    </div>
  );
}

function H({ children }: { children: string }) {
  return <h4 className="mb-3 mt-7 border-b border-white/10 pb-1.5 text-[10px] font-bold uppercase tracking-[0.3em] text-crimson-2 first:mt-0">{children}</h4>;
}

export function ResumeSheet() {
  return (
    <article className="relative overflow-hidden rounded-2xl bg-[linear-gradient(180deg,#121218,#0c0c11)] p-6 ring-1 ring-white/10 sm:p-10">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-crimson-2/70 to-transparent" />
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <p className="text-[10px] font-bold tracking-[0.34em] text-smoke">FOUNDER &amp; CEO · CONNECTING DOTS WORLDWIDE</p>
          <h3 className="mt-1 font-display text-[clamp(1.9rem,4.4vw,3.2rem)] leading-[0.9] tracking-wide text-bone">{profile.fullName}</h3>
        </div>
        <div className="text-xs leading-relaxed text-mist sm:text-right">
          <a href={`mailto:${profile.email}`} className="block hover:text-bone">
            {profile.email} · {profile.phone}
          </a>
          <a href={profile.links.portfolio} target="_blank" rel="noreferrer" className="hover:text-bone">
            benitasamson.com ↗
          </a>
          {' · '}
          <a href={profile.links.careerhq} target="_blank" rel="noreferrer" className="hover:text-bone">
            www.careerhq.in ↗
          </a>
        </div>
      </header>

      <section className="mb-10 space-y-8 border-b border-white/10 pb-8">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-crimson-2">
            {founderStory.herStory.kicker}
          </p>
          <h4 className="mt-1.5 font-display text-[clamp(1.6rem,3vw,2.35rem)] leading-[0.95] tracking-wide text-bone">
            {founderStory.herStory.title}
          </h4>
          <div className="mt-4 grid gap-4 md:grid-cols-3 md:gap-6">
            {founderStory.herStory.paragraphs.map((para) => (
              <p key={para} className="text-sm leading-relaxed text-bone/80">
                {para}
              </p>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-crimson-2">
            {founderStory.visionFoundation.kicker}
          </p>
          <p className="mt-1 font-serif text-lg italic text-bone/90 sm:text-xl">
            {founderStory.visionFoundation.subtitle}
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {founderStory.visionFoundation.pillars.map((pillar) => (
              <div
                key={pillar.title}
                className="rounded-xl bg-white/[0.02] p-4 ring-1 ring-white/10"
              >
                <h5 className="text-sm font-semibold text-bone">{pillar.title}</h5>
                <p className="mt-1.5 text-[13px] leading-relaxed text-mist">{pillar.body}</p>
              </div>
            ))}
          </div>
          <blockquote className="mt-5 border-l-2 border-crimson-2/80 bg-white/[0.02] px-4 py-3 font-serif text-sm italic leading-relaxed text-bone/95 sm:text-base">
            “{founderStory.visionFoundation.quote}”
          </blockquote>
        </div>
      </section>

      <div className="grid gap-x-10 md:grid-cols-[1.4fr_1fr]">
        <div>
          <H>Banking Career · Australia</H>
          {education.map((e) => (
            <div key={e.school} className="mb-4">
              <div className="flex flex-wrap justify-between gap-x-3">
                <p className="text-sm font-semibold text-bone">
                  {e.school}, {e.place}
                </p>
                <p className="text-xs text-smoke">{e.period}</p>
              </div>
              <p className="text-xs text-mist">
                {e.degree} · <span className="text-bone/80">{e.score}</span>
              </p>
            </div>
          ))}

          <H>Entrepreneurial Journey</H>
          {experience.map((x) => (
            <div key={x.company} className="mb-5">
              <div className="flex flex-wrap justify-between gap-x-3">
                <p className="text-sm font-semibold text-bone">
                  {x.company} — {x.role}
                </p>
                <p className="text-xs text-smoke">{x.period}</p>
              </div>
              <ul className="mt-2 space-y-1.5">
                {x.points.map((p) => (
                  <li key={p} className="flex gap-2 text-xs leading-relaxed text-mist">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-crimson-2" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <H>Flagship Ventures</H>
          {projects.map((p) => (
            <div key={p.id} className="mb-3">
              <div className="flex flex-wrap justify-between gap-x-3">
                <p className="text-sm font-semibold text-bone">{p.title}</p>
                <p className="text-xs text-smoke">{p.year}</p>
              </div>
              <p className="text-xs text-mist">{p.stack.join(' · ')}</p>
            </div>
          ))}
        </div>

        <div>
          <H>Areas &amp; Initiatives</H>
          <div className="space-y-2">
            {skillCategories.map((c) => (
              <p key={c.id} className="text-xs leading-relaxed text-mist">
                <span className="font-semibold text-bone">{c.title}: </span>
                {c.skills.map((s) => s.name).join(', ')}
              </p>
            ))}
          </div>

          <H>Key Milestones</H>
          <ul className="space-y-2">
            {achievements.map((a) => (
              <li key={a.id} className="text-xs leading-relaxed text-mist">
                <span className="font-semibold text-bone">
                  {a.title} — {a.org}.
                </span>{' '}
                {a.detail}
              </li>
            ))}
          </ul>

          <H>The Journey in Frames</H>
          <ul className="space-y-1.5">
            {archiveChapters.map((ch) => (
              <li key={ch.title} className="text-xs leading-relaxed text-mist">
                <span className="font-semibold text-bone">{ch.title}:</span> {ch.detail}
              </li>
            ))}
          </ul>

          <H>Ecosystem Directory</H>
          <p className="text-xs leading-relaxed text-mist">
            {certifications.map((c) => c.name).join(' · ')}
          </p>
        </div>
      </div>
    </article>
  );
}
