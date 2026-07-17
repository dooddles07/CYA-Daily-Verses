"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Flame, Menu, X } from "lucide-react";
import { ButtonLink } from "@/components/ui";
import { streak } from "@/lib/data";

const links = [
  { href: "/verse", label: "Daily Verse" },
  { href: "/search", label: "Bible Search" },
  { href: "/plans", label: "Reading Plans" },
  { href: "/devotion", label: "Devotion" },
  { href: "/prayer", label: "Prayer Wall" },
  { href: "/events", label: "Events" },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open ? "glass shadow-soft" : "bg-transparent"
      }`}
    >
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
      >
        <Link href="/" className="flex items-center gap-2.5" aria-label="CYA Daily Verse home">
          <Image
            src="/media/cya-logo.png"
            alt="CYA logo"
            width={36}
            height={36}
            className="rounded-xl"
            priority
          />
          <span className="text-[15px] font-extrabold tracking-tight text-ink">
            CYA <span className="text-primary">Daily Verse</span>
          </span>
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-full px-3.5 py-2 text-sm font-semibold transition-colors duration-200 ${
                    active
                      ? "bg-sky-tint text-primary-700"
                      : "text-ink-soft hover:bg-sky-soft hover:text-primary-700"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          <span
            className="inline-flex items-center gap-1.5 rounded-full bg-[#fff4d6] px-3 py-1.5 text-xs font-bold text-[#9a6b00]"
            title={`${streak.current}-day reading streak`}
          >
            <Flame className="h-3.5 w-3.5" aria-hidden />
            {streak.current} days
          </span>
          <ButtonLink href="/login" variant="ghost" size="sm">
            Sign in
          </ButtonLink>
          <ButtonLink href="/register" size="sm">
            Start free
          </ButtonLink>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-ink hover:bg-sky-soft lg:hidden"
        >
          {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-line px-4 pb-6 pt-2 lg:hidden">
          <ul className="flex flex-col gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="block rounded-2xl px-4 py-3 text-[15px] font-semibold text-ink hover:bg-sky-soft"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex gap-3">
            <ButtonLink href="/login" variant="outline" className="flex-1">
              Sign in
            </ButtonLink>
            <ButtonLink href="/register" className="flex-1">
              Start free
            </ButtonLink>
          </div>
        </div>
      )}
    </header>
  );
}
