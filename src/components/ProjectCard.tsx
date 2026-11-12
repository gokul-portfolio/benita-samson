import { motion } from 'framer-motion';
import type { Project } from '../data/portfolio';
import { EASE, Tilt } from './fx';
import { ProjectArt } from './Poster';
import VentureLogo from './ui/VentureLogo';

export default function ProjectCard({ project, index, onOpen }: { project: Project; index: number; onOpen: () => void }) {
  const num = String(index + 1).padStart(2, '0');

  return (
    <motion.article
      className="w-[84vw] shrink-0 snap-start sm:w-[62vw] lg:w-[46vw] xl:w-[42vw]"
      initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '0px -10% 0px 0px' }}
      transition={{ duration: 0.9, delay: index * 0.08, ease: EASE }}
    >
      <Tilt max={5} className="group rounded-2xl">
        <div
          role="button"
          tabIndex={0}
          data-cursor="view"
          onClick={onOpen}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onOpen();
            }
          }}
          aria-label={`Open ${project.title}`}
          className="focus-ring relative flex min-h-[360px] flex-col justify-between overflow-hidden rounded-2xl p-5 ring-1 ring-white/15 transition duration-500 group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.85)] group-hover:ring-white/30 sm:min-h-[380px] sm:p-7 lg:h-[46vh] lg:min-h-[390px] lg:max-h-[450px]"
        >
          <motion.div layoutId={`art-${project.id}`} className="absolute inset-0 overflow-hidden rounded-2xl">
            <div className="absolute inset-0 transition-transform duration-[1.4s] ease-[var(--ease-cine)] group-hover:scale-[1.07]">
              <ProjectArt project={project} />
            </div>
          </motion.div>

          {/* Diagonal hover sheen */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-y-10 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/[0.07] to-transparent opacity-0 transition-all duration-1000 group-hover:left-[120%] group-hover:opacity-100"
          />

          <div className="relative z-10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.28em] text-bone/85">
              <span className="font-display text-base tracking-normal text-crimson-2">B</span>
              <span>VENTURE</span>
              <span className="text-white/30">·</span>
              <span className="text-mist">{num}</span>
            </div>
            <span
              className="rounded-full border px-2.5 py-1 text-[10px] font-bold tracking-wider text-bone backdrop-blur-md"
              style={{
                borderColor: `${project.palette.accent}55`,
                backgroundColor: 'rgba(10, 10, 15, 0.55)',
              }}
            >
              {project.year}
            </span>
          </div>

          <div className="pointer-events-none relative z-10 my-2 flex items-center justify-between gap-4 [transform:translateZ(30px)]">
            <span
              aria-hidden
              className="font-display text-4xl leading-none tracking-tight text-white/10 transition-colors duration-500 group-hover:text-white/20 sm:text-5xl"
            >
              {num}
            </span>
            <div className="shrink-0">
              <VentureLogo project={project} size="showcase" />
            </div>
          </div>

          <div className="relative z-10 [transform:translateZ(40px)]">
            <div
              aria-hidden
              className="mb-2.5 h-px w-12 transition-all duration-500 group-hover:w-20"
              style={{ backgroundColor: project.palette.accent }}
            />
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-mist sm:mb-1.5 sm:text-[11px]">{project.genre}</p>
            <motion.h3 layoutId={`title-${project.id}`} className="font-display text-[clamp(1.65rem,3vw,2.75rem)] leading-[0.94] tracking-wide text-bone">
              {project.title}
            </motion.h3>
            <p className="mt-2 max-w-md text-xs leading-relaxed text-bone/75 sm:text-sm">{project.logline}</p>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap gap-1.5">
                {project.stack.map((t) => (
                  <span key={t} className="rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-medium text-bone/90 ring-1 ring-white/10 backdrop-blur">
                    {t}
                  </span>
                ))}
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-bone/60 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-bone">
                Explore <span aria-hidden>→</span>
              </span>
            </div>
            {project.github && (
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <a
                  href={project.github}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="link"
                  onClick={(e) => e.stopPropagation()}
                  className="flex min-h-10 items-center gap-2 rounded-md border border-white/25 bg-black/30 px-4 text-xs font-semibold text-bone backdrop-blur transition hover:border-bone"
                >
                  GitHub ↗
                </a>
              </div>
            )}
          </div>
        </div>
      </Tilt>
    </motion.article>
  );
}
