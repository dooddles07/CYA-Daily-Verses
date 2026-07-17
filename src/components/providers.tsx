"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/** Honors prefers-reduced-motion for all framer-motion animations. */
export function Providers({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
