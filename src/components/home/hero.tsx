"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowDown, BookOpen, Flame, Sparkles } from "lucide-react";
import { ButtonLink } from "@/components/ui";
import { streak, type Verse } from "@/lib/data";

const particles = [
  { left: "8%", top: "22%", size: 8, delay: 0 },
  { left: "16%", top: "68%", size: 5, delay: 1.2 },
  { left: "30%", top: "12%", size: 6, delay: 2.1 },
  { left: "58%", top: "8%", size: 5, delay: 0.6 },
  { left: "76%", top: "18%", size: 9, delay: 1.7 },
  { left: "88%", top: "48%", size: 6, delay: 0.3 },
  { left: "70%", top: "78%", size: 7, delay: 2.5 },
  { left: "42%", top: "86%", size: 5, delay: 1.0 },
];

export function Hero({ verse: todaysVerse }: { verse: Verse }) {
  return (
    <section className="relative overflow-hidden pt-16" aria-label="Welcome">
      {/* Animated gradient wash */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 h-[480px] w-[480px] rounded-full bg-sky-mist opacity-70 blur-3xl motion-safe:animate-drift" />
        <div className="absolute -right-40 top-24 h-[520px] w-[520px] rounded-full bg-sky-mist opacity-60 blur-3xl motion-safe:animate-drift [animation-delay:-9s]" />
        <div className="absolute bottom-0 left-1/3 h-[360px] w-[520px] rounded-full bg-sky-tint blur-3xl" />
        {/* Floating particles */}
        {particles.map((p, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-primary/25 motion-safe:animate-float"
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-14 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-10 lg:px-8 lg:pb-28 lg:pt-24">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.21, 0.66, 0.29, 0.99] }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-sky-mist bg-surface/80 px-4 py-1.5 text-xs font-bold text-primary-700 shadow-soft">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              Kay Kristo Buong Buhay, Habambuhay!
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-6xl">
              Meet God in His Word,{" "}
              <span className="bg-gradient-to-r from-primary to-[#33c0ff] bg-clip-text text-transparent">
                every morning.
              </span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-soft">
              Daily verses, gentle devotionals, reading plans, and a praying
              community — built by Christ&apos;s Youth in Action to help your
              generation grow one quiet morning at a time.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ButtonLink href="/verse" size="lg">
                <BookOpen className="h-5 w-5" aria-hidden />
                Read today&apos;s verse
              </ButtonLink>
              <ButtonLink href="/plans" variant="outline" size="lg">
                Start a reading plan
              </ButtonLink>
            </div>
            <dl className="mt-10 flex flex-wrap gap-8 text-sm">
              <div>
                <dt className="text-ink-faint">Community streak</dt>
                <dd className="mt-1 flex items-center gap-1.5 text-xl font-extrabold text-ink">
                  <Flame className="h-5 w-5 text-warning" aria-hidden />
                  {streak.best} days
                </dd>
              </div>
              <div>
                <dt className="text-ink-faint">Verses shared</dt>
                <dd className="mt-1 text-xl font-extrabold text-ink">12,400+</dd>
              </div>
              <div>
                <dt className="text-ink-faint">Young readers</dt>
                <dd className="mt-1 text-xl font-extrabold text-ink">2,300+</dd>
              </div>
            </dl>
          </motion.div>
        </div>

        {/* Verse preview card + community photo */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.21, 0.66, 0.29, 0.99] }}
        >
          <div className="glass relative z-10 rounded-[2rem] p-8 shadow-lift sm:p-10">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
              Verse of the day
            </p>
            <blockquote className="verse-text mt-5 text-xl text-ink sm:text-2xl">
              “{todaysVerse.text.split(".")[0]}.”
            </blockquote>
            <p className="mt-5 text-sm font-bold text-primary-700">
              {todaysVerse.reference} · {todaysVerse.version}
            </p>
            <div className="mt-6 h-px bg-line" aria-hidden />
            <p className="mt-5 text-sm text-ink-soft">
              Take 60 quiet seconds. Read it slowly. Let it carry you into the day.
            </p>
          </div>
          <div className="absolute -bottom-10 -left-6 z-20 hidden w-44 rotate-[-4deg] overflow-hidden rounded-3xl border-4 border-surface shadow-lift motion-safe:animate-float-slow sm:block">
            <Image
              src="/media/member-joy.jpg"
              alt="A CYA member laughing during fellowship"
              width={176}
              height={220}
              className="h-full w-full object-cover"
            />
          </div>
          <div
            aria-hidden
            className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br from-primary to-[#66ccff] opacity-20 blur-xl"
          />
        </motion.div>
      </div>

      <a
        href="#today"
        aria-label="Scroll to today's verse"
        className="relative z-10 mx-auto mb-6 flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface text-ink-faint shadow-soft transition-colors hover:text-primary motion-safe:animate-float"
      >
        <ArrowDown className="h-4.5 w-4.5" aria-hidden />
      </a>
    </section>
  );
}
