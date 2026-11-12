import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { sectionMeta, type ProfileId, type SectionId } from '../data/portfolio';
import { useSmoothScroll } from '../hooks/smoothScroll';
import { EASE } from './fx';

type NavbarProps = {
  order: SectionId[];
  profileId?: ProfileId;
  onSwitch?: (id: ProfileId) => void;
  onEnquire?: () => void;
};

type NavItem = { id: string; label: string };

const PRIMARY_NAV_IDS = new Set(['top', 'reels', 'showcase', 'about', 'originals', 'moments']);

export default function Navbar({ order, onEnquire }: NavbarProps) {
  const { scrollY, scrollYProgress } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [active, setActive] = useState<string>('top');
  const [navItems, setNavItems] = useState<NavItem[]>([{ id: 'top', label: 'Home' }]);
  const { scrollTo } = useSmoothScroll();
  const headerRef = useRef<HTMLElement>(null);

  useMotionValueEvent(scrollY, 'change', (y) => {
    setScrolled(y > 20);
    if (y < 140) setActive('top');
  });

  // Collect only sections currently rendered on the page
  useEffect(() => {
    const extras: NavItem[] = [
      { id: 'reels', label: 'Reels' },
      { id: 'showcase', label: 'Archive' },
      { id: 'deck', label: 'Deck' },
      { id: 'instagram', label: 'Instagram' },
    ].filter((item) => Boolean(document.getElementById(item.id)));

    const present = order
      .filter((id) => Boolean(document.getElementById(id)))
      .map((id) => ({ id, label: sectionMeta[id].nav }));

    const items: NavItem[] = [{ id: 'top', label: 'Home' }, ...extras, ...present];
    setNavItems(items);

    const ids = [...items.map((i) => i.id), 'contact'];
    const io = new IntersectionObserver(
      (entries) => {
        if (window.scrollY < 140) {
          setActive('top');
          return;
        }
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: '-40% 0px -50% 0px' },
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [order]);

  useEffect(() => {
    if (!mobileNav && !moreOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileNav(false);
        setMoreOpen(false);
      }
    };
    const onOutside = (e: PointerEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) {
        setMobileNav(false);
        setMoreOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerdown', onOutside);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerdown', onOutside);
    };
  }, [mobileNav, moreOpen]);

  const { primaryItems, moreItems } = useMemo(() => {
    const primary = navItems.filter((item) => PRIMARY_NAV_IDS.has(item.id));
    const more = navItems.filter((item) => !PRIMARY_NAV_IDS.has(item.id));
    return { primaryItems: primary, moreItems: more };
  }, [navItems]);

  const isMoreActive = moreItems.some((item) => item.id === active);

  const go = (id: string) => {
    setMobileNav(false);
    setMoreOpen(false);
    setActive(id);
    scrollTo(`#${id}`, { offset: id === 'top' ? 0 : -76 });
  };

  return (
    <header
      ref={headerRef}
      className={`fixed inset-x-0 top-0 z-[70] transition-all duration-300 ${
        scrolled || mobileNav
          ? 'border-b border-white/[0.1] bg-[#07070a]/92 shadow-[0_10px_30px_rgba(0,0,0,0.6)] backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div
        className={`gutter flex items-center justify-between gap-8 transition-all duration-300 ${
          scrolled || mobileNav ? 'h-14 md:h-[58px]' : 'h-[76px] md:h-[84px]'
        }`}
      >
        {/* Left: Clean Brand Logo */}
        <button
          type="button"
          onClick={() => go('top')}
          aria-label="Career HQ — Back to top"
          className="group flex shrink-0 items-center rounded-sm text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-crimson/70"
        >
          <img
            src="/assets/careerhq-logo.png"
            alt="Career HQ — Connecting Dots Worldwide"
            width={998}
            height={276}
            decoding="async"
            className={`w-auto select-none object-contain transition-all duration-300 group-hover:opacity-85 ${
              scrolled || mobileNav ? 'h-7' : 'h-9 sm:h-10'
            }`}
          />
        </button>

        {/* Center: Clean Editorial Navigation Links */}
        <nav aria-label="Primary navigation" className="hidden items-center gap-6 lg:flex xl:gap-8">
          {primaryItems.map((item) => {
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => go(item.id)}
                aria-current={isActive ? 'location' : undefined}
                className={`relative whitespace-nowrap font-medium tracking-[0.01em] transition-all duration-300 ${
                  scrolled ? 'py-1.5 text-[12.5px]' : 'py-2 text-[13.5px]'
                } ${isActive ? 'text-bone' : 'text-bone/75 hover:text-bone'}`}
              >
                {item.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-underline"
                    transition={{ duration: 0.3, ease: EASE }}
                    className="absolute inset-x-0 bottom-0 h-[1.5px] rounded-full bg-crimson"
                  />
                )}
              </button>
            );
          })}

          {moreItems.length > 0 && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setMoreOpen((v) => !v)}
                aria-expanded={moreOpen}
                aria-haspopup="menu"
                className={`relative flex items-center gap-1.5 whitespace-nowrap font-medium tracking-[0.01em] transition-all duration-300 ${
                  scrolled ? 'py-1.5 text-[12.5px]' : 'py-2 text-[13.5px]'
                } ${isMoreActive || moreOpen ? 'text-bone' : 'text-bone/75 hover:text-bone'}`}
              >
                <span>More</span>
                <svg
                  viewBox="0 0 12 12"
                  className={`h-2.5 w-2.5 transition-transform duration-200 ${moreOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  aria-hidden
                >
                  <path d="M2.5 4.5L6 8l3.5-3.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {isMoreActive && (
                  <motion.span
                    layoutId="nav-underline"
                    transition={{ duration: 0.3, ease: EASE }}
                    className="absolute inset-x-0 bottom-0 h-[1.5px] rounded-full bg-crimson"
                  />
                )}
              </button>

              <AnimatePresence>
                {moreOpen && (
                  <motion.div
                    role="menu"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.18, ease: EASE }}
                    className="absolute right-0 top-[calc(100%+12px)] w-44 rounded-xl border border-white/10 bg-[#0b0b10]/95 p-1.5 shadow-[0_18px_40px_rgba(0,0,0,0.75)] backdrop-blur-xl"
                  >
                    {moreItems.map((item) => {
                      const isActive = active === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          role="menuitem"
                          onClick={() => go(item.id)}
                          className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-[13px] font-medium transition-colors ${
                            isActive
                              ? 'bg-white/[0.08] text-bone'
                              : 'text-mist hover:bg-white/[0.04] hover:text-bone'
                          }`}
                        >
                          <span>{item.label}</span>
                          {isActive && <span className="h-1.5 w-1.5 rounded-full bg-crimson" />}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </nav>

        {/* Right: Refined Monochrome CTA + Mobile Toggle */}
        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={() => (onEnquire ? onEnquire() : go('contact'))}
            className={`hidden whitespace-nowrap rounded-md font-semibold tracking-[0.04em] transition-all duration-300 lg:inline-flex ${
              scrolled ? 'px-3.5 py-1.5 text-[11.5px]' : 'px-5 py-2.5 text-[13px]'
            } ${
              active === 'contact'
                ? 'bg-white text-ink'
                : 'bg-bone text-ink hover:bg-white'
            }`}
          >
            Let&apos;s Build
          </button>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileNav((v) => !v)}
            aria-label={mobileNav ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileNav}
            className="flex h-10 w-10 flex-col items-end justify-center gap-1.5 lg:hidden"
          >
            <motion.span
              className="block h-[1.5px] w-6 bg-bone"
              animate={{ rotate: mobileNav ? 45 : 0, y: mobileNav ? 3.75 : 0 }}
              transition={{ duration: 0.2 }}
            />
            <motion.span
              className="block h-[1.5px] w-4 bg-bone"
              animate={{
                width: mobileNav ? 24 : 16,
                rotate: mobileNav ? -45 : 0,
                y: mobileNav ? -3.75 : 0,
              }}
              transition={{ duration: 0.2 }}
            />
          </button>
        </div>
      </div>

      {/* Subtle hairline scroll indicator (visible once scrolled) */}
      <motion.div
        aria-hidden
        style={{ scaleX: scrollYProgress }}
        className={`h-[1px] origin-left bg-crimson/70 transition-opacity duration-300 ${
          scrolled ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileNav && (
          <motion.nav
            aria-label="Mobile navigation"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: EASE }}
            className="gutter max-h-[calc(100svh-76px)] overflow-y-auto border-t border-white/[0.08] bg-[#07070a]/96 backdrop-blur-xl lg:hidden"
          >
            <div className="flex flex-col gap-1 py-4">
              {[...navItems, { id: 'contact', label: "Let's Build" }].map((item) => {
                const isActive = active === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      if (item.id === 'contact' && onEnquire) {
                        setMobileNav(false);
                        onEnquire();
                      } else {
                        go(item.id);
                      }
                    }}
                    className={`flex items-center justify-between py-2.5 text-left text-base font-medium transition-colors ${
                      isActive ? 'text-bone' : 'text-mist hover:text-bone'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && <span className="h-1.5 w-1.5 rounded-full bg-crimson" />}
                  </button>
                );
              })}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
