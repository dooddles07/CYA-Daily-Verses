"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Home, HandHelping, Search, User } from "lucide-react";

const items = [
  { href: "/", label: "Home", icon: Home },
  { href: "/verse", label: "Verse", icon: BookOpen },
  { href: "/search", label: "Search", icon: Search },
  { href: "/prayer", label: "Pray", icon: HandHelping },
  { href: "/dashboard", label: "Me", icon: User },
];

/** Thumb-friendly mobile navigation. Hidden on desktop. */
export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Mobile"
      className="glass fixed inset-x-3 bottom-3 z-50 rounded-3xl shadow-lift lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="flex items-stretch justify-around">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-2xl text-[11px] font-bold transition-colors duration-200 ${
                  active ? "text-primary" : "text-ink-faint hover:text-ink"
                }`}
              >
                <Icon className={`h-5 w-5 ${active ? "scale-110" : ""} transition-transform duration-200`} aria-hidden />
                {label}
                <span
                  aria-hidden
                  className={`h-1 w-1 rounded-full ${active ? "bg-primary" : "bg-transparent"}`}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
