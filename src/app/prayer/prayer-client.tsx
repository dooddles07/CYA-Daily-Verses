"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, HandHelping, Send } from "lucide-react";
import { Badge, Card } from "@/components/ui";
import { prayerWall } from "@/lib/data";

type Prayer = (typeof prayerWall)[number];

export function PrayerClient() {
  const [items, setItems] = useState<Prayer[]>(prayerWall);
  const [prayed, setPrayed] = useState<Record<number, boolean>>({});
  const [name, setName] = useState("");
  const [request, setRequest] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (request.trim().length < 10) {
      setError("Please write at least a short sentence so people know how to pray.");
      return;
    }
    setError("");
    setItems((list) => [
      {
        name: anonymous || !name.trim() ? "Anonymous" : name.trim(),
        request: request.trim(),
        prayedCount: 0,
        time: "just now",
        tag: "New",
      },
      ...list,
    ]);
    setRequest("");
    setName("");
    setSubmitted(true);
    window.setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
      {/* Submit form */}
      <div>
        <Card hover={false} className="sticky top-24 p-8">
          <h2 className="text-xl font-extrabold text-ink">Submit a prayer request</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            Share what&apos;s on your heart. The CYA family will stand with you.
          </p>
          <form onSubmit={onSubmit} className="mt-6 space-y-5" noValidate>
            <div>
              <label htmlFor="pr-name" className="text-sm font-bold text-ink">
                Your name <span className="font-normal text-ink-faint">(optional)</span>
              </label>
              <input
                id="pr-name"
                type="text"
                value={name}
                disabled={anonymous}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                className="mt-2 h-12 w-full rounded-2xl border border-line bg-surface px-4 text-[15px] outline-none transition-colors duration-200 placeholder:text-ink-faint focus:border-primary disabled:bg-sky-soft disabled:text-ink-faint"
                placeholder="e.g. Kim"
              />
            </div>
            <div>
              <label htmlFor="pr-request" className="text-sm font-bold text-ink">
                Prayer request <span aria-hidden className="text-danger">*</span>
              </label>
              <textarea
                id="pr-request"
                required
                value={request}
                onChange={(e) => setRequest(e.target.value)}
                rows={4}
                aria-invalid={!!error}
                aria-describedby={error ? "pr-error" : "pr-help"}
                className="mt-2 w-full resize-none rounded-2xl border border-line bg-surface p-4 text-[15px] leading-relaxed outline-none transition-colors duration-200 placeholder:text-ink-faint focus:border-primary"
                placeholder="How can we pray for you?"
              />
              {error ? (
                <p id="pr-error" role="alert" className="mt-2 text-sm font-semibold text-danger">
                  {error}
                </p>
              ) : (
                <p id="pr-help" className="mt-2 text-xs text-ink-faint">
                  Please avoid full names of other people for their privacy.
                </p>
              )}
            </div>
            <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold text-ink-soft">
              <input
                type="checkbox"
                checked={anonymous}
                onChange={(e) => setAnonymous(e.target.checked)}
                className="h-5 w-5 cursor-pointer rounded accent-[#0095ff]"
              />
              Post anonymously
            </label>
            <button
              type="submit"
              className="inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-primary text-sm font-bold text-white shadow-glow transition-all duration-200 hover:bg-primary-600 active:scale-[0.98]"
            >
              {submitted ? (
                <>
                  <Check className="h-4.5 w-4.5" aria-hidden /> Shared with the family
                </>
              ) : (
                <>
                  <Send className="h-4.5 w-4.5" aria-hidden /> Share prayer request
                </>
              )}
            </button>
          </form>
        </Card>
      </div>

      {/* Wall */}
      <div aria-live="polite">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-ink">Community wall</h2>
          <span className="text-sm font-semibold text-ink-faint">{items.length} requests</span>
        </div>
        <div className="mt-5 space-y-4">
          <AnimatePresence initial={false}>
            {items.map((p, i) => {
              const done = prayed[i];
              return (
                <motion.div
                  key={`${p.name}-${p.request.slice(0, 24)}`}
                  initial={{ opacity: 0, y: -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  layout
                >
                  <Card hover={false} className="p-6">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-extrabold text-ink">{p.name}</p>
                      <div className="flex items-center gap-2">
                        <Badge tone={p.tag === "New" ? "green" : "sky"}>{p.tag}</Badge>
                        <span className="text-xs text-ink-faint">{p.time}</span>
                      </div>
                    </div>
                    <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{p.request}</p>
                    <div className="mt-4">
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
                        <span className={`rounded-full px-1.5 text-xs ${done ? "bg-white/20" : "bg-surface"}`}>
                          {p.prayedCount + (done ? 1 : 0)}
                        </span>
                      </motion.button>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
