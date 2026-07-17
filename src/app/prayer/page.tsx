import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui";
import { PrayerClient } from "./prayer-client";

export const metadata: Metadata = {
  title: "Prayer Wall",
  description: "Share prayer requests and pray for others in the CYA community.",
};

export default function PrayerPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-28 sm:px-6 lg:px-8">
      <SectionHeading
        center
        eyebrow="Prayer wall"
        title="Pray for one another"
        sub="“Carry each other's burdens, and in this way you will fulfill the law of Christ.” — Galatians 6:2"
      />
      <div className="mt-12">
        <PrayerClient />
      </div>
    </div>
  );
}
