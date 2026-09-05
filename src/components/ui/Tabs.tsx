"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export function Tabs({
  tabs,
  value,
  onChange,
  tone = "dark",
  id = "tabs",
  className,
}: {
  tabs: { id: string; label: string }[];
  value: string;
  onChange: (id: string) => void;
  tone?: "dark" | "light";
  id?: string;
  className?: string;
}) {
  return (
    <div
      role="tablist"
      className={cn(
        "inline-flex rounded-full p-1",
        tone === "dark" ? "glass" : "bg-navy/6 border border-navy/10",
        className,
      )}
    >
      {tabs.map((t) => {
        const active = t.id === value;
        return (
          <button
            key={t.id}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(t.id)}
            className={cn(
              "relative rounded-full px-5 py-2.5 font-display text-sm font-semibold transition-colors duration-300",
              active ? (tone === "dark" ? "text-ink" : "text-paper") : tone === "dark" ? "text-paper/60 hover:text-paper" : "text-navy/60 hover:text-navy",
            )}
          >
            {active && (
              <motion.span
                layoutId={`${id}-pill`}
                className={cn("absolute inset-0 rounded-full", tone === "dark" ? "bg-paper" : "bg-navy")}
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            <span className="relative z-10">{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}
