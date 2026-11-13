import { useEffect, useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { EASE } from './fx';
import { useScrollLock } from '../hooks/smoothScroll';

const TOPICS = [
  'General Enquiry',
  'Career HQ',
  'Industry Connect',
  'A T O M',
  'DNA',
  'The Blind Spot',
  'Career with Beni',
  'Mic & Mentors',
  'TRP - The Reality Project (Show)',
  'Partnership & Collaboration',
] as const;

type Status = 'idle' | 'submitting' | 'sent' | 'error';

/**
 * Split-layout enquiry popup modal shown when the visitor reaches the end of the page.
 * Left: Benita Samson portrait; Right: themed enquiry form backed by /api/enquiry.
 */
export default function EnquiryModal({ onClose }: { onClose: () => void }) {
  useScrollLock(true);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [topic, setTopic] = useState<string>(TOPICS[0]);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (status !== 'sent') return;
    const t = window.setTimeout(onClose, 2600);
    return () => clearTimeout(t);
  }, [status, onClose]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');

    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, topic, message }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) {
        throw new Error(json.error || 'Could not send your enquiry. Please try again.');
      }
      setStatus('sent');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong.');
    }
  };

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Enquiry Form"
      className="fixed inset-0 z-[115] grid place-items-center overflow-y-auto bg-black/80 p-3 backdrop-blur-md sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ duration: 0.45, ease: EASE }}
        onClick={(e) => e.stopPropagation()}
        className="relative grid w-full max-w-4xl overflow-hidden rounded-3xl border border-crimson-2/35 bg-[#0b0b10] shadow-[0_40px_100px_-20px_rgba(229,19,43,0.45)] md:grid-cols-[0.88fr_1.12fr]"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 z-20 h-px bg-gradient-to-r from-transparent via-crimson-2/80 to-transparent"
        />

        <button
          type="button"
          onClick={onClose}
          aria-label="Close enquiry modal"
          data-cursor="link"
          className="focus-ring glass absolute right-4 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-full text-lg text-bone transition hover:bg-white/20"
        >
          ✕
        </button>

        {/* Left: Founder Portrait */}
        <div className="relative hidden min-h-[460px] overflow-hidden bg-[#12070c] md:block">
          <img
            src="/assets/images/DSC03858.jpg"
            alt="Benita Samson — Founder & CEO"
            className="h-full w-full object-cover object-[center_32%]"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-[#0b0b10] via-[#0b0b10]/25 to-transparent"
          />
          <div className="absolute inset-x-0 bottom-0 p-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-crimson-2">
              CONNECTING DOTS WORLDWIDE
            </p>
            <p className="mt-1 font-display text-2xl tracking-wide text-bone">BENITA SAMSON</p>
            <p className="mt-1 text-xs text-mist">
              Education, ventures, media &amp; purposeful collaborations.
            </p>
          </div>
        </div>

        {/* Right: Themed Enquiry Form */}
        <div className="relative p-6 sm:p-8">
          <div className="mb-5 flex items-center gap-3 md:hidden">
            <img
              src="/assets/images/DSC03858.jpg"
              alt="Benita Samson"
              className="h-12 w-12 rounded-full object-cover object-[center_28%] ring-1 ring-crimson-2/50"
            />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-crimson-2">
                DIRECT ENQUIRY
              </p>
              <p className="font-display text-xl tracking-wide text-bone">BENITA SAMSON</p>
            </div>
          </div>

          <p className="hidden text-[10px] font-bold uppercase tracking-[0.32em] text-crimson-2 md:block">
            DIRECT ENQUIRY
          </p>
          <h3 className="mt-1 font-display text-3xl leading-none tracking-wide text-bone sm:text-4xl">
            START A CONVERSATION
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-mist sm:text-sm">
            Share your enquiry below — we’ll get back to you shortly.
          </p>

          {status === 'sent' ? (
            <div className="mt-8 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-6 text-center">
              <p className="font-display text-2xl tracking-wide text-bone">ENQUIRY SENT ✓</p>
              <p className="mt-2 text-sm text-mist">
                Thank you for reaching out. Your message has been delivered successfully.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
              <div className="grid gap-3.5 sm:grid-cols-2">
                <div>
                  <label htmlFor="enq-name" className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.18em] text-mist">
                    Full Name *
                  </label>
                  <input
                    id="enq-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full rounded-lg border border-white/15 bg-white/[0.04] px-3.5 py-2.5 text-sm text-bone placeholder:text-smoke focus:border-crimson-2 focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="enq-email" className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.18em] text-mist">
                    Email *
                  </label>
                  <input
                    id="enq-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-lg border border-white/15 bg-white/[0.04] px-3.5 py-2.5 text-sm text-bone placeholder:text-smoke focus:border-crimson-2 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-3.5 sm:grid-cols-2">
                <div>
                  <label htmlFor="enq-phone" className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.18em] text-mist">
                    Phone / WhatsApp
                  </label>
                  <input
                    id="enq-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 / +61 ..."
                    className="w-full rounded-lg border border-white/15 bg-white/[0.04] px-3.5 py-2.5 text-sm text-bone placeholder:text-smoke focus:border-crimson-2 focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="enq-topic" className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.18em] text-mist">
                    Topic
                  </label>
                  <select
                    id="enq-topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full rounded-lg border border-white/15 bg-[#121218] px-3.5 py-2.5 text-sm text-bone focus:border-crimson-2 focus:outline-none"
                  >
                    {TOPICS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="enq-message" className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.18em] text-mist">
                  Message *
                </label>
                <textarea
                  id="enq-message"
                  rows={3}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us how we can help or collaborate..."
                  className="w-full resize-none rounded-lg border border-white/15 bg-white/[0.04] px-3.5 py-2.5 text-sm text-bone placeholder:text-smoke focus:border-crimson-2 focus:outline-none"
                />
              </div>

              {status === 'error' && (
                <p className="rounded-lg border border-crimson-2/40 bg-crimson/15 px-3 py-2 text-xs text-crimson-2">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'submitting'}
                data-cursor="view"
                className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-crimson to-crimson-2 px-6 text-sm font-bold tracking-wide text-white shadow-[0_12px_30px_rgba(229,19,43,0.35)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === 'submitting' ? 'Sending...' : 'Send Enquiry →'}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
