"use client";

import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Accordion({ items, tone = "dark" }: { items: { q: string; a: string }[]; tone?: "dark" | "light" }) {
  const [open, setOpen] = useState<number | null>(0);
  const line = tone === "dark" ? "border-white/10" : "border-navy/10";
  return (
    <ul className={cn("divide-y border-y", line, tone === "dark" ? "divide-white/10" : "divide-navy/10")}>
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <li key={it.q}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className={cn("group flex w-full items-start justify-between gap-6 py-6 text-left", tone === "dark" ? "text-paper" : "text-navy")}
              aria-expanded={isOpen}
            >
              <span className="flex gap-5">
                <span className={cn("font-display text-xs tabular-nums pt-1.5", tone === "dark" ? "text-orange" : "text-orange")}>0{i + 1}</span>
                <span className="font-display text-lg font-semibold tracking-tight sm:text-xl">{it.q}</span>
              </span>
              <motion.span
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-colors", line, isOpen ? "bg-orange text-ink border-orange" : "group-hover:border-orange/60")}
              >
                <Plus className="h-4 w-4" />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="body"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p className={cn("max-w-[64ch] pb-7 pl-[3.1rem] leading-relaxed", tone === "dark" ? "text-paper/65" : "text-navy/70")}>{it.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
