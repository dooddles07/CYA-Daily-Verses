import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, HandHelping, PenLine } from "lucide-react";
import { VerseToday } from "@/components/home/verse-today";
import { Reveal } from "@/components/motion";
import { Card, SectionHeading } from "@/components/ui";
import { verseLibrary } from "@/lib/data";
import { getTodayLabel, getVerseOfTheDay } from "@/lib/bible-api";

export const metadata: Metadata = {
  title: "Daily Verse",
  description: "Today's verse with reflection, prayer, and related scriptures.",
};

// Refresh the verse of the day every 24h
export const revalidate = 86400;

const reflectionQuestions = [
  "What does this verse show you about who God is?",
  "Where does this word meet your life right now — school, family, work, or a quiet worry?",
  "Who could you encourage with this verse today, and how?",
];

export default async function VersePage() {
  const verseOfTheDay = await getVerseOfTheDay();
  return (
    <div className="pt-24 pb-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            center
            eyebrow="Daily verse"
            title="Sit with the Word"
            sub="Read slowly. Reflect honestly. Pray simply. That's the whole practice."
          />
        </Reveal>
      </div>

      <div className="mt-12">
        <VerseToday verse={verseOfTheDay} dateLabel={getTodayLabel()} />
      </div>

      <div className="mx-auto mt-16 grid max-w-4xl gap-6 px-4 sm:px-6 lg:px-8">
        <Reveal>
          <Card className="p-8" hover={false}>
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-tint text-primary">
                <BookOpen className="h-5 w-5" aria-hidden />
              </span>
              <h2 className="text-xl font-extrabold text-ink">How to sit with this verse</h2>
            </div>
            <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-ink-soft">
              <p>
                Don&apos;t rush. Read today&apos;s verse twice — once for the
                words, once for the Voice behind them. Scripture was written to
                real people in real seasons, and the same Spirit speaks through
                it now.
              </p>
              <p>
                Notice one word or phrase that stands out to you. That&apos;s
                usually where God is inviting you to slow down. Carry that
                phrase into your day — on your commute, between classes, before
                you sleep.
              </p>
            </div>
          </Card>
        </Reveal>

        <Reveal>
          <Card className="p-8" hover={false}>
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-tint text-primary">
                <PenLine className="h-5 w-5" aria-hidden />
              </span>
              <h2 className="text-xl font-extrabold text-ink">Reflection questions</h2>
            </div>
            <ol className="mt-5 space-y-3">
              {reflectionQuestions.map((q, i) => (
                <li key={i} className="flex gap-4 rounded-2xl bg-sky-soft p-4 text-[15px] leading-relaxed text-ink">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-extrabold text-white">
                    {i + 1}
                  </span>
                  {q}
                </li>
              ))}
            </ol>
          </Card>
        </Reveal>

        <Reveal>
          <Card className="p-8" hover={false}>
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-tint text-primary">
                <HandHelping className="h-5 w-5" aria-hidden />
              </span>
              <h2 className="text-xl font-extrabold text-ink">A prayer for today</h2>
            </div>
            <p className="verse-text mt-5 text-lg italic leading-relaxed text-ink">
              Father, thank You for speaking to me today. Let this word take
              root in my heart — not just read, but lived. Give me grace to
              obey what I&apos;ve seen, and to carry Your peace into everything
              this day holds. In Jesus&apos; name, Amen.
            </p>
          </Card>
        </Reveal>

        <Reveal>
          <section aria-label="Related verses">
            <h2 className="text-xl font-extrabold text-ink">More verses to carry with you</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {verseLibrary.slice(1, 5).map((v) => (
                <Link
                  key={v.reference}
                  href={`/search?q=${encodeURIComponent(v.reference)}`}
                  className="group rounded-3xl border border-line bg-surface p-6 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift"
                >
                  <p className="verse-text text-[15px] leading-relaxed text-ink">
                    “{v.text.length > 140 ? v.text.slice(0, 140) + "…" : v.text}”
                  </p>
                  <p className="mt-4 flex items-center gap-1.5 text-sm font-bold text-primary-700">
                    {v.reference}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
                  </p>
                </Link>
              ))}
            </div>
          </section>
        </Reveal>
      </div>
    </div>
  );
}
