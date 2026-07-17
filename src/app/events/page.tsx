import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui";
import { EventsClient } from "./events-client";

export const metadata: Metadata = {
  title: "Events",
  description: "Upcoming CYA gatherings, camps, and worship nights.",
};

export default function EventsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-28 sm:px-6 lg:px-8">
      <SectionHeading
        center
        eyebrow="Church events"
        title="Come as you are"
        sub="Every gathering is a chance to meet God and find your people."
      />
      <div className="mt-12">
        <EventsClient />
      </div>
    </div>
  );
}
