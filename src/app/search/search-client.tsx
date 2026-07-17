"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BookOpen, Globe, Search as SearchIcon, Shuffle, X } from "lucide-react";
import { Badge, Card } from "@/components/ui";
import { categories, verseLibrary, type Verse } from "@/lib/data";
import {
  fetchParsedPassage,
  fetchRandomVerse,
  parseReference,
} from "@/lib/bible-api";

export function SearchClient() {
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [topic, setTopic] = useState(params.get("topic") ?? "");
  const [lookup, setLookup] = useState<Verse | null>(null);
  const [lookupLoading, setLookupLoading] = useState(false);

  // Live passage lookup (wldeh/bible-api CDN, KJV) when the query reads like a reference
  useEffect(() => {
    const parsed = parseReference(query);
    if (!parsed) {
      setLookup(null);
      setLookupLoading(false);
      return;
    }
    setLookupLoading(true);
    let cancelled = false;
    const id = window.setTimeout(async () => {
      const verse = await fetchParsedPassage(parsed);
      if (cancelled) return;
      setLookup(verse);
      setLookupLoading(false);
    }, 500);
    return () => {
      cancelled = true;
      window.clearTimeout(id);
    };
  }, [query]);

  const randomVerse = async () => {
    setLookupLoading(true);
    const verse = await fetchRandomVerse();
    if (verse) setQuery(verse.reference);
    setLookup(verse);
    setLookupLoading(false);
  };

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
          className="h-14 w-full rounded-full border border-line bg-surface pl-13 pr-12 text-[15px] text-ink shadow-soft outline-none transition-shadow duration-200 placeholder:text-ink-faint focus:border-primary focus:shadow-lift"
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

      {/* Random verse */}
      <div className="mt-4 flex justify-center">
        <button
          type="button"
          onClick={randomVerse}
          className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border border-line bg-surface px-5 text-sm font-semibold text-ink-soft shadow-soft transition-all duration-200 hover:border-primary hover:text-primary-700"
        >
          <Shuffle className="h-4 w-4" aria-hidden />
          Surprise me with a random verse
        </button>
      </div>

      {/* Live passage lookup (bible-api.com) */}
      <div aria-live="polite">
        {lookupLoading && (
          <div className="skeleton mx-auto mt-8 h-32 max-w-3xl rounded-3xl" />
        )}
        {!lookupLoading && lookup && (
          <div className="mx-auto mt-8 max-w-3xl rounded-3xl border border-sky-mist bg-sky-tint p-8 shadow-lift">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" aria-hidden />
              <span className="text-xs font-extrabold uppercase tracking-wider text-primary-700">
                Live Scripture · {lookup.version}
              </span>
            </div>
            <blockquote className="verse-text mt-4 text-lg leading-relaxed text-ink sm:text-xl">
              “{lookup.text}”
            </blockquote>
            <p className="mt-4 text-sm font-extrabold text-primary-700">{lookup.reference}</p>
          </div>
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
              className="cursor-pointer rounded-full border border-line bg-surface px-4 py-1.5 text-xs font-bold text-ink-soft transition-colors duration-200 hover:border-primary hover:text-primary-700"
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
