"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bookmark,
  BookOpen,
  Check,
  Copy,
  HandHelping,
  Share2,
  Volume2,
} from "lucide-react";
import { todaysVerse } from "@/lib/data";

type Feedback = { msg: string } | null;

export function VerseToday() {
  const [saved, setSaved] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [speaking, setSpeaking] = useState(false);

  const toast = (msg: string) => {
    setFeedback({ msg });
    window.setTimeout(() => setFeedback(null), 2600);
  };

  const fullText = `“${todaysVerse.text}” — ${todaysVerse.reference} (${todaysVerse.version})`;

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullText);
      toast("Verse copied to clipboard");
    } catch {
      toast("Couldn't copy — select the text instead");
    }
  };

  const onShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "CYA Daily Verse", text: fullText });
      } catch {
        /* user cancelled */
      }
    } else {
      onCopy();
    }
  };

  const onListen = () => {
    if (!("speechSynthesis" in window)) {
      toast("Audio not supported on this browser");
      return;
    }
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const u = new SpeechSynthesisUtterance(
      `${todaysVerse.text} ${todaysVerse.reference}`
    );
    u.rate = 0.92;
    u.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(u);
    setSpeaking(true);
  };

  const actions = [
    { label: "Listen", icon: Volume2, onClick: onListen, active: speaking },
    {
      label: saved ? "Saved" : "Save",
      icon: saved ? Check : Bookmark,
      onClick: () => {
        setSaved((v) => !v);
        toast(saved ? "Removed from your verses" : "Saved to your verses");
      },
      active: saved,
    },
    { label: "Copy", icon: Copy, onClick: onCopy, active: false },
    { label: "Share", icon: Share2, onClick: onShare, active: false },
  ];

  return (
    <section id="today" className="relative scroll-mt-24" aria-label="Today's verse">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary via-[#0089ec] to-[#33b1ff] p-8 text-white shadow-glow sm:p-14">
          {/* artwork */}
          <div aria-hidden className="pointer-events-none absolute inset-0 opacity-60">
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/15 blur-2xl" />
            <div className="absolute -bottom-28 -left-16 h-72 w-72 rounded-full bg-[#005ea8]/40 blur-2xl" />
            <svg
              className="absolute right-8 top-8 h-24 w-24 text-white/20"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden
            >
              <path d="M6.5 10c-.8 1.5-1.2 3-1.2 4.6 0 2.6 1.6 4.4 3.8 4.4 2 0 3.5-1.5 3.5-3.5S11.1 12 9.2 12c-.3 0-.6 0-.9.1.3-1.2 1-2.5 2-3.7L8.6 6.7C7.7 7.7 7 8.8 6.5 10zm9 0c-.8 1.5-1.2 3-1.2 4.6 0 2.6 1.6 4.4 3.8 4.4 2 0 3.5-1.5 3.5-3.5S20.1 12 18.2 12c-.3 0-.6 0-.9.1.3-1.2 1-2.5 2-3.7l-1.7-1.7c-.9 1-1.6 2.1-2.1 3.3z" />
            </svg>
          </div>

          <div className="relative">
            <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-white/80">
              Today&apos;s Verse · July 17, 2026
            </p>
            <blockquote className="verse-text mt-6 text-2xl leading-snug sm:text-[2rem]">
              “{todaysVerse.text}”
            </blockquote>
            <p className="mt-6 text-sm font-extrabold tracking-wide text-white/90">
              {todaysVerse.reference} · {todaysVerse.version}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-2.5">
              <Link
                href="/verse"
                className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-full bg-white px-6 text-sm font-bold text-[#005ea8] shadow-soft transition-transform duration-200 hover:scale-[1.03] active:scale-[0.97]"
              >
                <BookOpen className="h-4.5 w-4.5" aria-hidden />
                Read reflection &amp; prayer
              </Link>
              {actions.map(({ label, icon: Icon, onClick, active }) => (
                <button
                  key={label}
                  type="button"
                  onClick={onClick}
                  className={`inline-flex h-11 cursor-pointer items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-all duration-200 active:scale-[0.96] ${
                    active
                      ? "border-white bg-white text-[#005ea8]"
                      : "border-white/40 bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  <Icon className="h-4 w-4" aria-hidden />
                  {label}
                </button>
              ))}
            </div>

            <div className="mt-8 flex items-start gap-3 rounded-2xl bg-white/12 p-4 backdrop-blur-sm">
              <HandHelping className="mt-0.5 h-5 w-5 shrink-0 text-white/80" aria-hidden />
              <p className="text-sm leading-relaxed text-white/90">
                <span className="font-bold">Short prayer:</span> Lord, when I am
                tired, teach me to wait on You. Renew my strength today, and let
                me walk without fainting. Amen.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* toast */}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex justify-center lg:bottom-10">
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.22 }}
              className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-bg shadow-lift"
            >
              {feedback.msg}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
