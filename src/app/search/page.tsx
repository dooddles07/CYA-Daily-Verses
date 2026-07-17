import type { Metadata } from "next";
import { Suspense } from "react";
import { SectionHeading } from "@/components/ui";
import { SearchClient } from "./search-client";

export const metadata: Metadata = {
  title: "Bible Search",
  description: "Search verses by keyword, reference, or topic.",
};

export default function SearchPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 pt-28 sm:px-6 lg:px-8">
      <SectionHeading
        center
        eyebrow="Bible search"
        title="Find the word you need"
        sub="Search by keyword, reference, or topic across the verse library."
      />
      <div className="mt-10">
        <Suspense
          fallback={<div className="skeleton mx-auto h-14 max-w-2xl rounded-full" />}
        >
          <SearchClient />
        </Suspense>
      </div>
    </div>
  );
}
