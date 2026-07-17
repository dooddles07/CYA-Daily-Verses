"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BookOpen, Search as SearchIcon, X } from "lucide-react";
import { Badge, Card } from "@/components/ui";
import { categories, verseLibrary } from "@/lib/data";

export function SearchClient() {
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [topic, setTopic] = useState(params.get("topic") ?? "");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return verseLibrary.filter((v) => {
      const matchQ =
        !q ||
        v.text.toLowerCase().includes(q) ||
        v.reference.toLowerCase().includes(q);
      const matchTopic = !topic || v.topic === topic;
      return matchQ && matchTopic;
    });
  }, [query, topic]);

  const topics = ["Strength", "Hope", "Peace", "Love", "Wisdom", "Faith", "Youth", "Grace", "Courage", "Rest"];

  return (
    <div>
      {/* Search bar */}
      <div className="relative mx-auto max-w-2xl">
        <SearchIcon className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-faint" aria-hidden />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by keyword or reference, e.g. “hope” or “John 3:16”"
          aria-label="Search verses"
          className="h-14 w-full rounded-full border border-line bg-white pl-13 pr-12 text-[15px] text-ink shadow-soft outline-none transition-shadow duration-200 placeholder:text-ink-faint focus:border-primary focus:shadow-lift"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="absolute right-4 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-ink-faint hover:bg-sky-soft hover:text-ink"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        )}
      </div>

      {/* Topic filters */}
      <div className="mt-6 flex flex-wrap justify-center gap-2" role="group" aria-label="Filter by topic">
        <button
          type="button"
          onClick={() => setTopic("")}
          aria-pressed={topic === ""}
          className={`cursor-pointer rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
            topic === "" ? "bg-primary text-white shadow-glow" : "bg-sky-tint text-ink-soft hover:text-primary-700"
          }`}
        >
          All topics
        </button>
        {topics.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTopic(topic === t ? "" : t)}
            aria-pressed={topic === t}
            className={`cursor-pointer rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
              topic === t ? "bg-primary text-white shadow-glow" : "bg-sky-tint text-ink-soft hover:text-primary-700"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Results */}
      <p className="mt-10 text-sm font-semibold text-ink-faint" aria-live="polite">
        {results.length} verse{results.length === 1 ? "" : "s"} found
      </p>
      {results.length === 0 ? (
        <Card hover={false} className="mt-4 flex flex-col items-center gap-3 p-12 text-center">
          <BookOpen className="h-10 w-10 text-sky-mist" aria-hidden />
          <p className="text-lg font-extrabold text-ink">No verses matched</p>
          <p className="max-w-sm text-sm text-ink-soft">
            Try a different keyword, or browse by topic — the Word always has
            something for you.
          </p>
        </Card>
      ) : (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {results.map((v) => (
            <Card key={v.reference} className="flex flex-col p-7">
              <blockquote className="verse-text flex-1 text-[16px] leading-relaxed text-ink">
                “{v.text}”
              </blockquote>
              <div className="mt-5 flex items-center justify-between">
                <p className="text-sm font-extrabold text-primary-700">
                  {v.reference} · {v.version}
                </p>
                <Badge tone="sky">{v.topic}</Badge>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Category shortcut strip */}
      <div className="mt-14 border-t border-line pt-10">
        <p className="text-center text-sm font-bold text-ink-faint">
          Or explore all {categories.length} topics
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {categories.map((c) => (
            <button
              key={c.name}
              type="button"
              onClick={() => { setTopic(c.name); setQuery(""); }}
              className="cursor-pointer rounded-full border border-line bg-white px-4 py-1.5 text-xs font-bold text-ink-soft transition-colors duration-200 hover:border-primary hover:text-primary-700"
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
