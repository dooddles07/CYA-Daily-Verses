"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, HandHelping, Quote } from "lucide-react";
import { Badge, ButtonLink, Card } from "@/components/ui";
import { prayerWall, quotes } from "@/lib/data";

/* ---------------- Prayer wall preview ---------------- */

export function PrayerPreview() {
  const [prayed, setPrayed] = useState<Record<number, boolean>>({});

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {prayerWall.map((p, i) => {
        const done = prayed[i];
        return (
          <Card key={i} className="flex flex-col p-6">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-extrabold text-ink">{p.name}</p>
              <Badge tone="sky">{p.tag}</Badge>
            </div>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">
              {p.request}
            </p>
            <div className="mt-5 flex items-center justify-between">
              <span className="text-xs text-ink-faint">{p.time}</span>
              <motion.button
                type="button"
                whileTap={{ scale: 0.94 }}
                onClick={() => setPrayed((s) => ({ ...s, [i]: !s[i] }))}
                aria-pressed={done}
                className={`inline-flex h-10 cursor-pointer items-center gap-2 rounded-full px-4 text-sm font-bold transition-all duration-200 ${
                  done
                    ? "bg-primary text-white shadow-glow"
                    : "bg-sky-tint text-primary-700 hover:bg-sky-mist"
                }`}
              >
                <HandHelping className="h-4 w-4" aria-hidden />
                {done ? "Praying" : "I prayed"}
                <span
                  className={`rounded-full px-1.5 text-xs ${done ? "bg-white/20" : "bg-surface"}`}
                >
                  {p.prayedCount + (done ? 1 : 0)}
                </span>
              </motion.button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

/* ---------------- Quote carousel ---------------- */

export function QuoteCarousel() {
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % quotes.length),
      6000
    );
    return () => window.clearInterval(id);
  }, [reduce]);

  const go = (dir: 1 | -1) =>
    setIndex((i) => (i + dir + quotes.length) % quotes.length);

  return (
    <div className="relative mx-auto max-w-3xl text-center">
      <Quote className="mx-auto h-8 w-8 text-sky-mist" aria-hidden />
      <div className="relative mt-4 min-h-32 sm:min-h-28" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.figure
            key={index}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
          >
            <blockquote className="verse-text text-xl italic text-ink sm:text-2xl">
              “{quotes[index].text}”
            </blockquote>
            <figcaption className="mt-4 text-sm font-bold text-primary-700">
              — {quotes[index].author}
            </figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>
      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous quote"
          className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-line bg-surface text-ink-soft transition-colors hover:border-primary hover:text-primary"
        >
          <ChevronLeft className="h-4.5 w-4.5" aria-hidden />
        </button>
        <div className="flex gap-2" role="tablist" aria-label="Quotes">
          {quotes.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Quote ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-2 cursor-pointer rounded-full transition-all duration-300 ${
                i === index ? "w-6 bg-primary" : "w-2 bg-sky-mist hover:bg-primary/40"
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next quote"
          className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-line bg-surface text-ink-soft transition-colors hover:border-primary hover:text-primary"
        >
          <ChevronRight className="h-4.5 w-4.5" aria-hidden />
        </button>
      </div>
      <div className="mt-8">
        <ButtonLink href="/prayer" variant="secondary">
          Visit the prayer wall
        </ButtonLink>
      </div>
    </div>
  );
}

/* ---------------- Mood chips ---------------- */

export function MoodChips() {
  const feelings = [
    "I feel anxious",
    "I need hope",
    "I feel lonely",
    "I need strength",
    "I need forgiveness",
    "I need peace",
  ];
  return (
    <div className="flex flex-wrap justify-center gap-2.5">
      {feelings.map((f) => (
        <Link
          key={f}
          href={`/mood?feeling=${encodeURIComponent(f)}`}
          className="rounded-full border border-line bg-surface px-5 py-2.5 text-sm font-semibold text-ink-soft shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:text-primary-700 hover:shadow-lift"
        >
          {f}
        </Link>
      ))}
    </div>
  );
}
