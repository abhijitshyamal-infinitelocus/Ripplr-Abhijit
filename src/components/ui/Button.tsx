"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { Magnetic } from "@/components/fx/Magnetic";
import { cn } from "@/lib/utils";

type Props = {
  href?: string;
  children: ReactNode;
  variant?: "primary" | "ghost" | "light" | "dark";
  size?: "md" | "lg";
  className?: string;
  arrow?: boolean;
  type?: "button" | "submit";
  onClick?: () => void;
  magnetic?: boolean;
  disabled?: boolean;
};

/** Pill button with sliding-fill hover and optional magnetic pull. */
export function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  className,
  arrow = true,
  type = "button",
  onClick,
  magnetic = true,
  disabled,
}: Props) {
  const base = cn(
    "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-display font-semibold tracking-tight transition-[color,transform,box-shadow] duration-500 ease-out-expo active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none",
    size === "lg" ? "h-14 px-7 text-[15px]" : "h-12 px-6 text-sm",
    variant === "primary" && "bg-orange text-ink shadow-glow-orange hover:text-paper",
    variant === "ghost" && "border border-white/15 text-paper hover:border-white/0 hover:text-ink",
    variant === "light" && "bg-paper text-ink hover:text-paper",
    variant === "dark" && "bg-navy text-paper hover:text-ink",
    className,
  );
  const fill = cn(
    "absolute inset-0 -z-0 translate-y-[101%] rounded-full transition-transform duration-500 ease-out-expo group-hover:translate-y-0",
    variant === "primary" && "bg-ink",
    variant === "ghost" && "bg-paper",
    variant === "light" && "bg-navy",
    variant === "dark" && "bg-orange",
  );
  const inner = (
    <>
      <span aria-hidden className={fill} />
      <span className="relative z-10 flex items-center gap-2">
        {children}
        {arrow && (
          <ArrowUpRight
            className="h-4 w-4 transition-transform duration-500 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            strokeWidth={2.2}
          />
        )}
      </span>
    </>
  );

  const el = href ? (
    href.startsWith("http") ? (
      <a href={href} target="_blank" rel="noreferrer" className={base}>
        {inner}
      </a>
    ) : (
      <Link href={href} className={base}>
        {inner}
      </Link>
    )
  ) : (
    <button type={type} onClick={onClick} className={base} disabled={disabled}>
      {inner}
    </button>
  );

  return magnetic ? <Magnetic className="inline-block">{el}</Magnetic> : el;
}
