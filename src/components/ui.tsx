import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

function cx(...cls: (string | false | undefined)[]) {
  return cls.filter(Boolean).join(" ");
}

const buttonBase =
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40";

const buttonVariants = {
  primary:
    "bg-primary text-white shadow-glow hover:bg-primary-600 hover:shadow-lift",
  secondary:
    "bg-sky-tint text-primary-700 hover:bg-sky-mist",
  outline:
    "border border-line bg-white text-ink hover:border-primary hover:text-primary-700",
  ghost: "text-ink-soft hover:bg-sky-soft hover:text-primary-700",
} as const;

const buttonSizes = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-13 px-8 text-base",
} as const;

type ButtonStyleProps = {
  variant?: keyof typeof buttonVariants;
  size?: keyof typeof buttonSizes;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ComponentProps<"button"> & ButtonStyleProps) {
  return (
    <button
      className={cx(buttonBase, buttonVariants[variant], buttonSizes[size], className)}
      {...props}
    />
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ComponentProps<typeof Link> & ButtonStyleProps) {
  return (
    <Link
      className={cx(buttonBase, buttonVariants[variant], buttonSizes[size], className)}
      {...props}
    />
  );
}

export function Badge({
  children,
  tone = "sky",
  className,
}: {
  children: ReactNode;
  tone?: "sky" | "gold" | "green" | "white";
  className?: string;
}) {
  const tones = {
    sky: "bg-sky-tint text-primary-700",
    gold: "bg-[#fff4d6] text-[#9a6b00]",
    green: "bg-[#e2f8ee] text-[#116b4a]",
    white: "bg-white/85 text-ink shadow-soft",
  };
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold tracking-wide",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

export function Card({
  children,
  className,
  hover = true,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={cx(
        "rounded-3xl border border-line bg-white shadow-soft",
        hover &&
          "transition-all duration-300 hover:-translate-y-1 hover:border-sky-mist hover:shadow-lift",
        className
      )}
    >
      {children}
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  sub,
  center,
}: {
  eyebrow: string;
  title: string;
  sub?: string;
  center?: boolean;
}) {
  return (
    <div className={cx("max-w-2xl", center && "mx-auto text-center")}>
      <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        {title}
      </h2>
      {sub && <p className="mt-4 text-base leading-relaxed text-ink-soft">{sub}</p>}
    </div>
  );
}

export function ProgressBar({
  value,
  max,
  label,
}: {
  value: number;
  max: number;
  label?: string;
}) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={label ?? "progress"}
      className="h-2.5 w-full overflow-hidden rounded-full bg-sky-tint"
    >
      <div
        className="h-full rounded-full bg-gradient-to-r from-primary to-[#4db8ff] transition-[width] duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
