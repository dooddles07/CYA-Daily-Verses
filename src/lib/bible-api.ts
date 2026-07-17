// Bible text integration.
// NIV itself is copyrighted (Biblica) and has no legal free API, so the app
// uses the closest free modern-English equivalent:
//   Primary:  BSB (Berean Standard Bible, public domain) via bible.helloao.org
//   Fallback: KJV via the wldeh/bible-api jsDelivr CDN (github.com/wldeh/bible-api)
//   Fallback: bible-api.com (WEB), then the local verse library.
// All sources are free, keyless, and CORS-open. Works in server components
// (24h fetch revalidation) and the browser.

import { verseLibrary, type Verse } from "./data";

const HELLOAO = "https://bible.helloao.org/api";
const CDN = "https://cdn.jsdelivr.net/gh/wldeh/bible-api/bibles";
const FALLBACK_API = "https://bible-api.com";
export const BIBLE_VERSION_LABEL = "BSB";
const CDN_VERSION_ID = "en-kjv";

/** Canon: CDN slug → { USFM book code, chapter count }. */
export const BOOKS: Record<string, { usfm: string; chapters: number }> = {
  genesis: { usfm: "GEN", chapters: 50 }, exodus: { usfm: "EXO", chapters: 40 },
  leviticus: { usfm: "LEV", chapters: 27 }, numbers: { usfm: "NUM", chapters: 36 },
  deuteronomy: { usfm: "DEU", chapters: 34 }, joshua: { usfm: "JOS", chapters: 24 },
  judges: { usfm: "JDG", chapters: 21 }, ruth: { usfm: "RUT", chapters: 4 },
  "1samuel": { usfm: "1SA", chapters: 31 }, "2samuel": { usfm: "2SA", chapters: 24 },
  "1kings": { usfm: "1KI", chapters: 22 }, "2kings": { usfm: "2KI", chapters: 25 },
  "1chronicles": { usfm: "1CH", chapters: 29 }, "2chronicles": { usfm: "2CH", chapters: 36 },
  ezra: { usfm: "EZR", chapters: 10 }, nehemiah: { usfm: "NEH", chapters: 13 },
  esther: { usfm: "EST", chapters: 10 }, job: { usfm: "JOB", chapters: 42 },
  psalms: { usfm: "PSA", chapters: 150 }, proverbs: { usfm: "PRO", chapters: 31 },
  ecclesiastes: { usfm: "ECC", chapters: 12 }, songofsolomon: { usfm: "SNG", chapters: 8 },
  isaiah: { usfm: "ISA", chapters: 66 }, jeremiah: { usfm: "JER", chapters: 52 },
  lamentations: { usfm: "LAM", chapters: 5 }, ezekiel: { usfm: "EZK", chapters: 48 },
  daniel: { usfm: "DAN", chapters: 12 }, hosea: { usfm: "HOS", chapters: 14 },
  joel: { usfm: "JOL", chapters: 3 }, amos: { usfm: "AMO", chapters: 9 },
  obadiah: { usfm: "OBA", chapters: 1 }, jonah: { usfm: "JON", chapters: 4 },
  micah: { usfm: "MIC", chapters: 7 }, nahum: { usfm: "NAM", chapters: 3 },
  habakkuk: { usfm: "HAB", chapters: 3 }, zephaniah: { usfm: "ZEP", chapters: 3 },
  haggai: { usfm: "HAG", chapters: 2 }, zechariah: { usfm: "ZEC", chapters: 14 },
  malachi: { usfm: "MAL", chapters: 4 }, matthew: { usfm: "MAT", chapters: 28 },
  mark: { usfm: "MRK", chapters: 16 }, luke: { usfm: "LUK", chapters: 24 },
  john: { usfm: "JHN", chapters: 21 }, acts: { usfm: "ACT", chapters: 28 },
  romans: { usfm: "ROM", chapters: 16 }, "1corinthians": { usfm: "1CO", chapters: 16 },
  "2corinthians": { usfm: "2CO", chapters: 13 }, galatians: { usfm: "GAL", chapters: 6 },
  ephesians: { usfm: "EPH", chapters: 6 }, philippians: { usfm: "PHP", chapters: 4 },
  colossians: { usfm: "COL", chapters: 4 }, "1thessalonians": { usfm: "1TH", chapters: 5 },
  "2thessalonians": { usfm: "2TH", chapters: 3 }, "1timothy": { usfm: "1TI", chapters: 6 },
  "2timothy": { usfm: "2TI", chapters: 4 }, titus: { usfm: "TIT", chapters: 3 },
  philemon: { usfm: "PHM", chapters: 1 }, hebrews: { usfm: "HEB", chapters: 13 },
  james: { usfm: "JAS", chapters: 5 }, "1peter": { usfm: "1PE", chapters: 5 },
  "2peter": { usfm: "2PE", chapters: 3 }, "1john": { usfm: "1JN", chapters: 5 },
  "2john": { usfm: "2JN", chapters: 1 }, "3john": { usfm: "3JN", chapters: 1 },
  jude: { usfm: "JUD", chapters: 1 }, revelation: { usfm: "REV", chapters: 22 },
};

const ALIASES: Record<string, string> = {
  psalm: "psalms",
  songofsongs: "songofsolomon",
  song: "songofsolomon",
};

function titleCaseBook(slug: string) {
  const m = slug.match(/^([1-3])?(.+)$/)!;
  const name = m[2].charAt(0).toUpperCase() + m[2].slice(1);
  const spaced = name.replace("ofsolomon", " of Solomon");
  return m[1] ? `${m[1]} ${spaced}` : spaced;
}

export type ParsedRef = {
  book: string; // canon slug
  chapter: number;
  verseStart?: number;
  verseEnd?: number;
  display: string;
};

/** Parse "1 Cor 13:4-7", "Psalm 23", "john 3:16" → canon coordinates. */
export function parseReference(input: string): ParsedRef | null {
  const m = input
    .trim()
    .match(/^([1-3]?\s*[a-z .]+?)\s+(\d+)(?:\s*[:.]\s*(\d+)(?:\s*[-–]\s*(\d+))?)?$/i);
  if (!m) return null;
  let key = m[1].toLowerCase().replace(/[\s.]+/g, "");
  key = ALIASES[key] ?? key;
  let book = BOOKS[key] ? key : undefined;
  if (!book) {
    const hits = Object.keys(BOOKS).filter((b) => b.startsWith(key));
    if (hits.length === 1) book = hits[0];
  }
  if (!book) return null;
  const chapter = Number(m[2]);
  if (chapter < 1 || chapter > BOOKS[book].chapters) return null;
  const verseStart = m[3] ? Number(m[3]) : undefined;
  const verseEnd = m[4] ? Number(m[4]) : undefined;
  const display =
    `${titleCaseBook(book)} ${chapter}` +
    (verseStart ? `:${verseStart}${verseEnd ? `-${verseEnd}` : ""}` : "");
  return { book, chapter, verseStart, verseEnd, display };
}

function collapse(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

const fetchOpts: RequestInit = { next: { revalidate: 86400 } } as RequestInit;

/* ---------------- Primary: BSB via bible.helloao.org ---------------- */

type HelloaoPiece = string | { text?: string; noteId?: number };
type HelloaoItem = { type: string; number?: number; content?: HelloaoPiece[] };

/** Fetch a BSB chapter → map of verse number → text. */
async function fetchChapterBSB(
  book: string,
  chapter: number
): Promise<Map<number, string> | null> {
  try {
    const res = await fetch(
      `${HELLOAO}/BSB/${BOOKS[book].usfm}/${chapter}.json`,
      fetchOpts
    );
    if (!res.ok) return null;
    const data = await res.json();
    const items: HelloaoItem[] = data?.chapter?.content ?? [];
    const map = new Map<number, string>();
    for (const item of items) {
      if (item.type !== "verse" || !item.number || !item.content) continue;
      const text = item.content
        .map((p) => (typeof p === "string" ? p : p.text ?? ""))
        .join(" ");
      map.set(item.number, collapse(text));
    }
    return map.size > 0 ? map : null;
  } catch {
    return null;
  }
}

/* ---------------- Fallback: KJV via wldeh CDN ---------------- */

function cleanCdnText(raw: string) {
  return collapse(
    raw.replace(/\s*¶\s*/g, " ").replace(/(\S)\d+[.:]\d+\s[\s\S]*$/, "$1")
  );
}

async function fetchVerseKJV(
  book: string,
  chapter: number,
  verse: number
): Promise<string | null> {
  try {
    const res = await fetch(
      `${CDN}/${CDN_VERSION_ID}/books/${book}/chapters/${chapter}/verses/${verse}.json`,
      fetchOpts
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data?.text ? cleanCdnText(String(data.text)) : null;
  } catch {
    return null;
  }
}

/* ---------------- Public API ---------------- */

/** Fetch a parsed reference (single verse or range; whole chapter → first 3 verses). */
export async function fetchParsedPassage(ref: ParsedRef): Promise<Verse | null> {
  const start = ref.verseStart ?? 1;
  const end = Math.min(ref.verseEnd ?? (ref.verseStart ? start : 3), start + 9);

  const bsb = await fetchChapterBSB(ref.book, ref.chapter);
  if (bsb) {
    const texts: string[] = [];
    for (let v = start; v <= end; v++) {
      const t = bsb.get(v);
      if (t) texts.push(t);
    }
    if (texts.length > 0) {
      return {
        reference: ref.display,
        text: texts.join(" "),
        version: BIBLE_VERSION_LABEL,
        topic: "",
      };
    }
  }

  // KJV fallback, verse by verse
  const nums: number[] = [];
  for (let v = start; v <= end; v++) nums.push(v);
  const parts = await Promise.all(
    nums.map((v) => fetchVerseKJV(ref.book, ref.chapter, v))
  );
  const texts = parts.filter((t): t is string => !!t);
  if (texts.length === 0) return null;
  return { reference: ref.display, text: texts.join(" "), version: "KJV", topic: "" };
}

/** Fetch by free-text reference string. */
export async function fetchPassage(reference: string): Promise<Verse | null> {
  const parsed = parseReference(reference);
  if (parsed) {
    const verse = await fetchParsedPassage(parsed);
    if (verse) return verse;
  }
  // Last resort: bible-api.com handles fuzzier references (WEB translation)
  try {
    const res = await fetch(
      `${FALLBACK_API}/${encodeURIComponent(reference)}?translation=web`,
      fetchOpts
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (!data?.text) return null;
    return {
      reference: data.reference,
      text: collapse(String(data.text)),
      version: String(data.translation_id ?? "web").toUpperCase(),
      topic: "",
    };
  } catch {
    return null;
  }
}

/** Random verse: random book/chapter from the canon, random verse within it. */
export async function fetchRandomVerse(): Promise<Verse | null> {
  const books = Object.keys(BOOKS);
  const book = books[Math.floor(Math.random() * books.length)];
  const chapter = 1 + Math.floor(Math.random() * BOOKS[book].chapters);
  const bsb = await fetchChapterBSB(book, chapter);
  if (!bsb) return null;
  const nums = [...bsb.keys()];
  const pick = nums[Math.floor(Math.random() * nums.length)];
  return {
    reference: `${titleCaseBook(book)} ${chapter}:${pick}`,
    text: bsb.get(pick)!,
    version: BIBLE_VERSION_LABEL,
    topic: "",
  };
}

/**
 * Verse of the day: rotates through the curated reference list by day of
 * year, pulls live BSB text, falls back to KJV/WEB/local copy.
 */
export async function getVerseOfTheDay(): Promise<Verse> {
  const now = new Date();
  const startOfYear = Date.UTC(now.getUTCFullYear(), 0, 0);
  const dayOfYear = Math.floor((now.getTime() - startOfYear) / 86_400_000);
  const curated = verseLibrary[dayOfYear % verseLibrary.length];
  const live = await fetchPassage(curated.reference);
  return live ? { ...live, topic: curated.topic } : curated;
}

/** Human date label for the verse-of-the-day header, computed server-side. */
export function getTodayLabel(): string {
  return new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "Asia/Manila",
  });
}
