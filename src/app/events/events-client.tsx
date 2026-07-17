"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Calendar, MapPin, Mic } from "lucide-react";
import { Badge, Card } from "@/components/ui";
import { events } from "@/lib/data";

function useCountdown(target: string) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(id);
  }, []);
  const diff = new Date(target + "T00:00:00").getTime() - now;
  if (diff <= 0) return null;
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  return { days, hours };
}

function EventCard({ event }: { event: (typeof events)[number] }) {
  const cd = useCountdown(event.date);
  return (
    <Card className="group h-full overflow-hidden">
      <div className="relative h-56 overflow-hidden">
        <Image
          src={event.image}
          alt={event.title}
          fill
          sizes="(min-width:768px) 30vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <Badge tone="white" className="absolute left-4 top-4">{event.tag}</Badge>
        {cd && (
          <span className="absolute bottom-4 left-4 rounded-full bg-black/60 px-3.5 py-1.5 text-xs font-extrabold text-white backdrop-blur-sm">
            In {cd.days}d {cd.hours}h
          </span>
        )}
      </div>
      <div className="p-7">
        <h2 className="text-xl font-extrabold leading-snug text-ink">{event.title}</h2>
        <ul className="mt-4 space-y-2.5 text-sm text-ink-soft">
          <li className="flex items-center gap-2.5">
            <Calendar className="h-4 w-4 shrink-0 text-primary" aria-hidden />
            {event.displayDate} · {event.time}
          </li>
          <li className="flex items-center gap-2.5">
            <MapPin className="h-4 w-4 shrink-0 text-primary" aria-hidden />
            {event.location}
          </li>
          <li className="flex items-center gap-2.5">
            <Mic className="h-4 w-4 shrink-0 text-primary" aria-hidden />
            {event.speaker}
          </li>
        </ul>
        <button
          type="button"
          className="mt-6 inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-full bg-sky-tint text-sm font-bold text-primary-700 transition-colors duration-200 hover:bg-sky-mist"
        >
          I&apos;m coming
        </button>
      </div>
    </Card>
  );
}

export function EventsClient() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {events.map((e) => (
        <EventCard key={e.title} event={e} />
      ))}
    </div>
  );
}
