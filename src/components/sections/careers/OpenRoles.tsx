"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { careers } from "@/lib/content";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/fx/Reveal";
import { cn } from "@/lib/utils";

const o = careers.openRoles;
type Role = { title: string; team: string; location: string; type: string; href?: string };
const roles = o.roles as Role[];

export function OpenRoles() {
  const [filter, setFilter] = useState(o.filters[0]);
  const list = roles.filter((r) => filter === "All" || r.team === filter);

  return (
    <section id="open-roles" className="relative bg-ink py-24 lg:py-32">
      <div className="container-x">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader eyebrow={o.eyebrow} title={o.title} />
          <Reveal y={12} blur={false}>
            <div className="flex flex-wrap gap-2">
              {o.filters.map((f) => (
                <button key={f} onClick={() => setFilter(f)} className={cn("relative rounded-full px-4 py-2 font-display text-sm font-semibold transition-colors", filter === f ? "text-ink" : "text-paper/60 hover:text-paper")}>
                  {filter === f && <motion.span layoutId="role-filter" className="absolute inset-0 rounded-full bg-paper" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
                  <span className="relative z-10">{f}</span>
                </button>
              ))}
            </div>
          </Reveal>
        </div>

        <AnimatePresence mode="wait">
          {list.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} className="mt-14 grid items-center gap-10 overflow-hidden rounded-[2rem] bg-ink-2 p-8 ring-1 ring-white/10 lg:grid-cols-12 lg:p-12">
              <div className="lg:col-span-7">
                <h3 className="font-display text-3xl font-bold text-paper sm:text-4xl">{o.emptyState.title}</h3>
                <p className="mt-4 max-w-[46ch] text-lg text-paper/65">{o.emptyState.body}</p>
                <div className="mt-8">
                  <Button href={o.applyHref}>Join the talent pool</Button>
                </div>
              </div>
              <motion.div className="lg:col-span-5" animate={{ y: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
                <div className="mx-auto w-full max-w-sm drop-shadow-[0_30px_50px_rgba(0,0,0,0.5)]">
                  <Image src={o.emptyState.art.src} alt={o.emptyState.art.alt} width={o.emptyState.art.width} height={o.emptyState.art.height} className="w-full" />
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.ul key={filter} initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }} className="mt-14 divide-y divide-white/10 border-y border-white/10">
              {list.map((r) => (
                <motion.li key={r.title} variants={{ hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0 } }}>
                  <a href={r.href ?? o.applyHref} className="group flex flex-col gap-3 py-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="font-display text-xl font-bold text-paper transition-colors group-hover:text-orange">{r.title}</h3>
                      <p className="mt-1 text-sm text-paper/55">{r.team} · {r.location} · {r.type}</p>
                    </div>
                    <span className="font-display text-sm font-semibold text-paper/70">Apply →</span>
                  </a>
                </motion.li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
