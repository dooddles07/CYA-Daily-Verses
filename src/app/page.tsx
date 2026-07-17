import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Brain,
  Calendar,
  Church,
  Clock,
  Compass,
  Droplets,
  Flame,
  HandHeart,
  Heart,
  HeartPulse,
  Home,
  Leaf,
  Lightbulb,
  MapPin,
  MessageCircleHeart,
  Mic,
  Mountain,
  PenLine,
  Smile,
  Sparkles,
  Sunrise,
} from "lucide-react";
import { Hero } from "@/components/home/hero";
import { VerseToday } from "@/components/home/verse-today";
import {
  MoodChips,
  PrayerPreview,
  QuoteCarousel,
} from "@/components/home/interactive";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import {
  Badge,
  ButtonLink,
  Card,
  ProgressBar,
  SectionHeading,
} from "@/components/ui";
import {
  categories,
  challenges,
  devotions,
  events,
  readingPlan,
  testimonials,
} from "@/lib/data";
import { getTodayLabel, getVerseOfTheDay } from "@/lib/bible-api";

// Refresh the verse of the day every 24h
export const revalidate = 86400;

const icons = {
  Sparkles, Sunrise, Heart, Lightbulb, Leaf, Mountain, HandHeart, Church,
  Droplets, Smile, HeartPulse, Home, Flame, Compass, MessageCircleHeart,
  Brain, PenLine,
} as const;

const days = ["M", "T", "W", "T", "F", "S", "S"];

export default async function HomePage() {
  const featured = devotions[0];
  const verseOfTheDay = await getVerseOfTheDay();
  return (
    <>
      <Hero verse={verseOfTheDay} />
      <VerseToday verse={verseOfTheDay} dateLabel={getTodayLabel()} />

      {/* ---- Verse categories ---- */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8" aria-label="Verse categories">
        <Reveal>
          <SectionHeading
            center
            eyebrow="Explore Scripture"
            title="Find a verse for every season"
            sub="Fifteen curated topics — from faith to family — so the right word finds you at the right time."
          />
        </Reveal>
        <Stagger className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((c) => {
            const Icon = icons[c.icon as keyof typeof icons] ?? Sparkles;
            return (
              <StaggerItem key={c.name}>
                <Link
                  href={`/search?topic=${encodeURIComponent(c.name)}`}
                  className="group flex items-center gap-3 rounded-2xl border border-line bg-surface p-4 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:border-sky-mist hover:shadow-lift"
                >
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-tint text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-white">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span>
                    <span className="block text-sm font-bold text-ink">{c.name}</span>
                    <span className="block text-xs text-ink-faint">{c.count} verses</span>
                  </span>
                </Link>
              </StaggerItem>
            );
          })}
        </Stagger>
      </section>

      {/* ---- Mood finder ---- */}
      <section className="bg-sky-soft py-24" aria-label="Mood verse finder">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading
              center
              eyebrow="How is your heart today?"
              title="Tell us how you feel — we'll find the verse"
              sub="God's Word speaks to real emotions. Pick what's true for you right now."
            />
          </Reveal>
          <Reveal delay={0.1} className="mt-10">
            <MoodChips />
          </Reveal>
        </div>
      </section>

      {/* ---- Featured devotion + reading plan ---- */}
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-24 sm:px-6 lg:grid-cols-2 lg:px-8" aria-label="Devotion and reading plan">
        <Reveal>
          <Card className="flex h-full flex-col overflow-hidden" hover={false}>
            <div className="relative h-52">
              <Image
                src="/media/community-group.jpg"
                alt="CYA youth group gathered after a devotion session"
                fill
                sizes="(min-width:1024px) 40vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" aria-hidden />
              <Badge tone="white" className="absolute left-4 top-4">Featured devotion</Badge>
            </div>
            <div className="flex flex-1 flex-col p-7">
              <div className="flex items-center gap-3 text-xs font-semibold text-ink-faint">
                <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" aria-hidden />{featured.readTime} read</span>
                <span aria-hidden>·</span>
                <span>{featured.date}</span>
              </div>
              <h3 className="mt-3 text-2xl font-extrabold tracking-tight text-ink">
                {featured.title}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">
                {featured.excerpt}
              </p>
              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm font-bold text-ink">{featured.author}</p>
                <ButtonLink href="/devotion" variant="secondary" size="sm">
                  Continue reading <ArrowRight className="h-4 w-4" aria-hidden />
                </ButtonLink>
              </div>
            </div>
          </Card>
        </Reveal>

        <Reveal delay={0.08}>
          <Card className="flex h-full flex-col p-7 sm:p-9" hover={false}>
            <Badge tone="green">Reading plan · Day {readingPlan.day} of {readingPlan.totalDays}</Badge>
            <h3 className="mt-4 text-2xl font-extrabold tracking-tight text-ink">
              {readingPlan.name}
            </h3>
            <p className="mt-2 text-sm text-ink-soft">
              Today: <span className="font-bold text-ink">{readingPlan.todayReading}</span> — {readingPlan.todayTheme}
            </p>
            <div className="mt-6">
              <div className="flex items-center justify-between text-xs font-bold text-ink-faint">
                <span>Overall progress</span>
                <span className="text-primary-700">{Math.round((readingPlan.day / readingPlan.totalDays) * 100)}%</span>
              </div>
              <div className="mt-2">
                <ProgressBar value={readingPlan.day} max={readingPlan.totalDays} label="Reading plan progress" />
              </div>
            </div>
            <div className="mt-6">
              <p className="text-xs font-bold text-ink-faint">This week</p>
              <div className="mt-2 flex gap-2">
                {readingPlan.weekProgress.map((done, i) => (
                  <span
                    key={i}
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-extrabold ${
                      done ? "bg-primary text-white shadow-glow" : "bg-sky-tint text-ink-faint"
                    }`}
                    aria-label={`${days[i]}: ${done ? "read" : "not yet"}`}
                  >
                    {days[i]}
                  </span>
                ))}
              </div>
            </div>
            <ul className="mt-6 flex-1 space-y-2.5">
              {readingPlan.upcoming.map((u) => (
                <li key={u.day} className="flex items-center justify-between rounded-2xl bg-sky-soft px-4 py-3 text-sm">
                  <span className="font-semibold text-ink">{u.passage}</span>
                  <span className="text-xs text-ink-faint">Day {u.day}</span>
                </li>
              ))}
            </ul>
            <ButtonLink href="/plans" className="mt-6 w-full">
              Continue today&apos;s reading
            </ButtonLink>
          </Card>
        </Reveal>
      </section>

      {/* ---- Prayer wall ---- */}
      <section className="bg-sky-soft py-24" aria-label="Prayer wall">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <Reveal>
              <SectionHeading
                eyebrow="Community prayer wall"
                title="Carry each other's burdens"
                sub="Real requests from real people. One tap says: you're not praying alone."
              />
            </Reveal>
            <Reveal delay={0.1}>
              <ButtonLink href="/prayer" variant="outline">
                Submit a prayer request
              </ButtonLink>
            </Reveal>
          </div>
          <Reveal delay={0.12} className="mt-10">
            <PrayerPreview />
          </Reveal>
        </div>
      </section>

      {/* ---- Daily challenges ---- */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8" aria-label="Daily challenges">
        <Reveal>
          <SectionHeading
            center
            eyebrow="Grow daily"
            title="Today's challenges"
            sub="Small, faithful steps — memorize, encourage, pray, reflect. Earn XP and keep your streak alive."
          />
        </Reveal>
        <Stagger className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {challenges.map((ch) => {
            const Icon = icons[ch.icon as keyof typeof icons] ?? Sparkles;
            return (
              <StaggerItem key={ch.title}>
                <Card className="flex h-full flex-col p-6">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-tint text-primary">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <p className="mt-4 text-xs font-extrabold uppercase tracking-wider text-primary">
                    {ch.type}
                  </p>
                  <h3 className="mt-1.5 flex-1 text-[15px] font-bold leading-snug text-ink">
                    {ch.title}
                  </h3>
                  <Badge tone="gold" className="mt-4 self-start">+{ch.xp} XP</Badge>
                </Card>
              </StaggerItem>
            );
          })}
        </Stagger>
      </section>

      {/* ---- Quotes ---- */}
      <section className="border-y border-line bg-surface py-24" aria-label="Inspiring quotes">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <QuoteCarousel />
          </Reveal>
        </div>
      </section>

      {/* ---- Events ---- */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8" aria-label="Upcoming events">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <SectionHeading
              eyebrow="Upcoming events"
              title="Step in. Shine out."
              sub="Worship nights, youth camps, trainings — come as you are, leave set on fire."
            />
          </Reveal>
          <Reveal delay={0.1}>
            <ButtonLink href="/events" variant="outline">
              All events <ArrowRight className="h-4 w-4" aria-hidden />
            </ButtonLink>
          </Reveal>
        </div>
        <Stagger className="mt-10 grid gap-6 md:grid-cols-3">
          {events.map((e) => (
            <StaggerItem key={e.title}>
              <Card className="group h-full overflow-hidden">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={e.image}
                    alt={e.title}
                    fill
                    sizes="(min-width:768px) 30vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <Badge tone="white" className="absolute left-4 top-4">{e.tag}</Badge>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-extrabold leading-snug text-ink">{e.title}</h3>
                  <ul className="mt-4 space-y-2 text-sm text-ink-soft">
                    <li className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" aria-hidden />
                      {e.displayDate} · {e.time}
                    </li>
                    <li className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" aria-hidden />
                      {e.location}
                    </li>
                    <li className="flex items-center gap-2">
                      <Mic className="h-4 w-4 text-primary" aria-hidden />
                      {e.speaker}
                    </li>
                  </ul>
                </div>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* ---- Testimonials ---- */}
      <section className="bg-sky-soft py-24" aria-label="Testimonials">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading
              center
              eyebrow="Changed mornings, changed lives"
              title="Stories from the CYA family"
            />
          </Reveal>
          <Stagger className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <StaggerItem key={t.name}>
                <Card className="flex h-full flex-col p-7" hover={false}>
                  <blockquote className="verse-text flex-1 text-[15px] italic leading-relaxed text-ink">
                    “{t.quote}”
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3">
                    <Image
                      src={t.image}
                      alt=""
                      width={44}
                      height={44}
                      className="h-11 w-11 rounded-full border-2 border-surface object-cover shadow-soft"
                    />
                    <span>
                      <span className="block text-sm font-extrabold text-ink">{t.name}</span>
                      <span className="block text-xs text-ink-faint">{t.role}</span>
                    </span>
                  </figcaption>
                </Card>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ---- CTA band ---- */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8" aria-label="Get started">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary via-[#0089ec] to-[#33b1ff] px-8 py-16 text-center text-white shadow-glow sm:px-16">
            <div aria-hidden className="pointer-events-none absolute inset-0">
              <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/15 blur-2xl" />
              <div className="absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-[#005ea8]/40 blur-2xl" />
            </div>
            <div className="relative">
              <h2 className="mx-auto max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">
                Tomorrow morning, let the first word you read be His.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-white/85">
                Free forever. Works on any device. Install it as an app and keep
                your streak going — Kay Kristo Buong Buhay, Habambuhay!
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link
                  href="/register"
                  className="inline-flex h-13 cursor-pointer items-center rounded-full bg-white px-8 text-base font-bold text-[#005ea8] shadow-soft transition-transform duration-200 hover:scale-[1.03] active:scale-[0.97]"
                >
                  Create free account
                </Link>
                <Link
                  href="/verse"
                  className="inline-flex h-13 cursor-pointer items-center rounded-full border border-white/50 bg-white/10 px-8 text-base font-bold text-white transition-colors duration-200 hover:bg-white/20"
                >
                  Read today&apos;s verse first
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
