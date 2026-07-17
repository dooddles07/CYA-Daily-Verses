"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const STORAGE_KEY = "cya-theme";

function applyTheme(dark: boolean) {
  document.documentElement.classList.toggle("dark", dark);
}

/** Light/dark toggle. Initial theme set pre-hydration by the inline script in layout. */
export function ThemeToggle({ className = "" }: { className?: string }) {
  // null until mounted — avoids SSR/client mismatch on the icon
  const [dark, setDark] = useState<boolean | null>(null);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !(dark ?? false);
    setDark(next);
    applyTheme(next);
    try {
      localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
    } catch {
      /* private mode */
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={dark ?? false}
      title={dark ? "Light mode" : "Dark mode"}
      className={`inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-line bg-surface text-ink-soft transition-colors duration-200 hover:border-primary hover:text-primary ${className}`}
    >
      {dark === null ? (
        <span className="h-4.5 w-4.5" aria-hidden />
      ) : dark ? (
        <Sun className="h-4.5 w-4.5" aria-hidden />
      ) : (
        <Moon className="h-4.5 w-4.5" aria-hidden />
      )}
    </button>
  );
}
