import type { Metadata } from "next";
import Image from "next/image";
import { Clock } from "lucide-react";
import { Reveal } from "@/components/motion";
import { Badge, ButtonLink, Card, SectionHeading } from "@/components/ui";
import { devotions } from "@/lib/data";

export const metadata: Metadata = {
  title: "Daily Devotional",
  description: "Short, honest devotionals written for young believers.",
};

export default function DevotionPage() {
  const [featured, ...rest] = devotions;
  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-28 sm:px-6 lg:px-8">
      <SectionHeading
        center
        eyebrow="Daily devotional"
        title="Honest words for real mornings"
        sub="Short readings written by the CYA family — never longer than your coffee."
      />

      {/* Featured, full text */}
      <Reveal className="mt-12">
        <Card hover={false} className="overflow-hidden">
          <div className="relative h-64 sm:h-80">
            <Image
              src="/media/step-in-shine-out.jpg"
              alt="CYA youth at the Step In Shine Out encounter"
              fill
              sizes="(min-width:1024px) 60vw, 100vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-transparent" aria-hidden />
            <div className="absolute bottom-6 left-6 right-6">
              <Badge tone="white">Today · {featured.verse}</Badge>
              <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                {featured.title}
              </h2>
            </div>
          </div>
          <div className="mx-auto max-w-2xl px-6 py-10 sm:px-8">
            <div className="flex items-center gap-3 text-xs font-semibold text-ink-faint">
              <span>{featured.author}</span>
              <span aria-hidden>·</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" aria-hidden />
                {featured.readTime} read
              </span>
              <span aria-hidden>·</span>
              <span>{featured.date}</span>
            </div>
            <div className="mt-6 space-y-5 text-[16px] leading-relaxed text-ink-soft">
              <p>
                There is a specific kind of tiredness that sleep doesn&apos;t fix.
                You know it — the exam week that blurs into the next, the family
                situation you can&apos;t solve, the serving schedule that quietly
                emptied your tank. Isaiah 40 was written to people that tired.
              </p>
              <p>
                And notice what God <em>doesn&apos;t</em> say. He doesn&apos;t say
                “try harder.” He says <span className="font-semibold text-ink">hope in Me,
                and I will renew you.</span> The eagle doesn&apos;t flap harder to
                soar — it finds the wind and spreads its wings.
              </p>
              <p>
                Waiting on God is not passive. It is choosing, every morning,
                to put your expectation in the only One whose strength never
                runs out. That&apos;s what this app is for. That&apos;s what this
                morning is for.
              </p>
              <blockquote className="verse-text rounded-2xl bg-sky-soft p-6 text-lg italic text-ink">
                “But those who hope in the LORD will renew their strength.” — Isaiah 40:31
              </blockquote>
              <p>
                <span className="font-semibold text-ink">Today, try this:</span>{" "}
                before you open any other app, sit for one minute of silence and
                pray five words: “Lord, I am waiting on You.”
              </p>
            </div>
          </div>
        </Card>
      </Reveal>

      {/* Previous devotions */}
      <Reveal className="mt-16">
        <h2 className="text-2xl font-extrabold tracking-tight text-ink">Previous devotionals</h2>
      </Reveal>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {rest.map((d, i) => (
          <Reveal key={d.slug} delay={i * 0.06}>
            <Card className="flex h-full flex-col p-7">
              <Badge tone="sky" className="self-start">{d.verse}</Badge>
              <h3 className="mt-4 text-xl font-extrabold leading-snug text-ink">{d.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">{d.excerpt}</p>
              <div className="mt-5 flex items-center justify-between text-xs font-semibold text-ink-faint">
                <span>{d.author}</span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" aria-hidden />
                  {d.readTime}
                </span>
              </div>
            </Card>
          </Reveal>
        ))}
      </div>

      <div className="mt-12 text-center">
        <ButtonLink href="/register" variant="secondary">
          Get devotionals in your inbox every morning
        </ButtonLink>
      </div>
    </div>
  );
}
