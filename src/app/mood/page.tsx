import type { Metadata } from "next";
import { Suspense } from "react";
import { SectionHeading } from "@/components/ui";
import { MoodClient } from "./mood-client";

export const metadata: Metadata = {
  title: "Mood Verse Finder",
  description: "Tell us how you feel and we'll find a verse for your heart.",
};

export default function MoodPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 pt-28 sm:px-6 lg:px-8">
      <SectionHeading
        center
        eyebrow="Mood verse finder"
        title="How is your heart today?"
        sub="Scripture speaks to real feelings. Choose yours, and receive a word."
      />
      <div className="mt-10">
        <Suspense fallback={<div className="skeleton mx-auto h-12 max-w-xl rounded-full" />}>
          <MoodClient />
        </Suspense>
      </div>
    </div>
  );
}
