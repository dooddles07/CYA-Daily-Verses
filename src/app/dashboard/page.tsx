import type { Metadata } from "next";
import { Award, BookOpen, Bookmark, Flame, Star, Trophy } from "lucide-react";
import { Reveal } from "@/components/motion";
import { Badge, ButtonLink, Card, ProgressBar, SectionHeading } from "@/components/ui";
import { readingPlan, streak, verseLibrary } from "@/lib/data";

export const metadata: Metadata = {
  title: "My Dashboard",
  description: "Your reading streak, saved verses, and achievements.",
};

const badges = [
  { name: "7-Day Streak", icon: Flame, earned: true },
  { name: "First Verse Saved", icon: Bookmark, earned: true },
  { name: "Prayer Warrior", icon: Star, earned: true },
  { name: "30-Day Streak", icon: Trophy, earned: false },
  { name: "Plan Finisher", icon: Award, earned: false },
  { name: "Scripture Scholar", icon: BookOpen, earned: false },
];

export default function DashboardPage() {
  const savedVerses = verseLibrary.slice(0, 3);
  const xpToNext = 2000;
  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-28 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="My dashboard"
        title="Good morning, friend"
        sub="Demo data shown — sign-in unlocks your real journey."
      />

      {/* Stats row */}
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <Reveal>
          <Card hover={false} className="p-7">
            <div className="flex items-center gap-4">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff4d6] text-[#c98a00]">
                <Flame className="h-6 w-6" aria-hidden />
              </span>
              <div>
                <p className="text-3xl font-extrabold text-ink">{streak.current}</p>
                <p className="text-xs font-bold text-ink-faint">day streak · best {streak.best}</p>
              </div>
            </div>
          </Card>
        </Reveal>
        <Reveal delay={0.05}>
          <Card hover={false} className="p-7">
            <div className="flex items-center gap-4">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-tint text-primary">
                <Star className="h-6 w-6" aria-hidden />
              </span>
              <div className="flex-1">
                <p className="text-3xl font-extrabold text-ink">Level {streak.level}</p>
                <div className="mt-2">
                  <ProgressBar value={streak.xp} max={xpToNext} label="XP progress" />
                </div>
                <p className="mt-1.5 text-xs font-bold text-ink-faint">{streak.xp} / {xpToNext} XP</p>
              </div>
            </div>
          </Card>
        </Reveal>
        <Reveal delay={0.1}>
          <Card hover={false} className="p-7">
            <div className="flex items-center gap-4">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e2f8ee] text-success">
                <BookOpen className="h-6 w-6" aria-hidden />
              </span>
              <div>
                <p className="text-3xl font-extrabold text-ink">{readingPlan.day}</p>
                <p className="text-xs font-bold text-ink-faint">chapters read this plan</p>
              </div>
            </div>
          </Card>
        </Reveal>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Saved verses */}
        <Reveal>
          <Card hover={false} className="p-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-ink">Saved verses</h2>
              <Badge tone="sky">{savedVerses.length} saved</Badge>
            </div>
            <ul className="mt-5 space-y-3">
              {savedVerses.map((v) => (
                <li key={v.reference} className="rounded-2xl bg-sky-soft p-5">
                  <p className="verse-text text-[15px] leading-relaxed text-ink">
                    “{v.text.length > 120 ? v.text.slice(0, 120) + "…" : v.text}”
                  </p>
                  <p className="mt-2.5 text-sm font-extrabold text-primary-700">
                    {v.reference} · {v.version}
                  </p>
                </li>
              ))}
            </ul>
            <ButtonLink href="/search" variant="secondary" className="mt-6">
              Find more verses
            </ButtonLink>
          </Card>
        </Reveal>

        {/* Achievements */}
        <Reveal delay={0.06}>
          <Card hover={false} className="p-8">
            <h2 className="text-xl font-extrabold text-ink">Achievements</h2>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {badges.map(({ name, icon: Icon, earned }) => (
                <div
                  key={name}
                  className={`flex flex-col items-center gap-2 rounded-2xl border p-5 text-center ${
                    earned
                      ? "border-sky-mist bg-sky-soft"
                      : "border-dashed border-line opacity-55"
                  }`}
                >
                  <span
                    className={`inline-flex h-11 w-11 items-center justify-center rounded-full ${
                      earned ? "bg-primary text-white shadow-glow" : "bg-sky-tint text-ink-faint"
                    }`}
                  >
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <p className="text-xs font-extrabold leading-tight text-ink">{name}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-ink-faint">
                    {earned ? "Earned" : "Locked"}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </Reveal>
      </div>
    </div>
  );
}
