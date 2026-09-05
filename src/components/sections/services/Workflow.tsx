"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";
import { useState } from "react";
import { distribution } from "@/lib/content";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/fx/Reveal";
import { cn } from "@/lib/utils";

const w = distribution.workflow;

/** Three-phase process: phase selector on the left, five steps cascade on the right along a drawn connector. */
export function Workflow() {
  const [phase, setPhase] = useState(0);
  const p = w.phases[phase];

  return (
    <section className="relative overflow-hidden bg-ink py-24 lg:py-32">
      <div aria-hidden className="pointer-events-none absolute -left-40 top-1/3 h-[600px] w-[600px] rounded-full bg-orange/10 blur-[150px]" />
      <div className="container-x relative">
        <SectionHeader eyebrow={w.eyebrow} title={w.title} description={w.description} />

        <div className="mt-16 grid gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-4" x={-30} y={0}>
            <ol className="flex flex-col gap-3">
              {w.phases.map((ph, i) => {
                const active = i === phase;
                return (
                  <li key={ph.index}>
                    <button
                      onClick={() => setPhase(i)}
                      className={cn(
                        "group relative flex w-full items-center gap-5 overflow-hidden rounded-3xl p-5 text-left transition-colors duration-500",
                        active ? "bg-paper text-ink" : "glass text-paper hover:bg-white/8",
                      )}
                    >
                      {active && <motion.span layoutId="phase-bg" className="absolute inset-0 -z-10 bg-paper" transition={{ type: "spring", stiffness: 300, damping: 30 }} />}
                      <span className={cn("font-display text-3xl font-bold tracking-tighter", active ? "text-orange" : "text-paper/30")}>{ph.index}</span>
                      <span className="flex-1">
                        <span className="block font-display text-lg font-bold">{ph.name}</span>
                        <span className={cn("block text-sm", active ? "text-ink/60" : "text-paper/50")}>{ph.steps.length} steps</span>
                      </span>
                      <span className={cn("h-2 w-2 rounded-full transition-transform duration-500", active ? "scale-100 bg-orange" : "scale-0")} />
                    </button>
                  </li>
                );
              })}
            </ol>

            <div className="mt-8 rounded-3xl border border-white/10 p-6">
              <span className="eyebrow text-teal">{w.takeawaysLabel}</span>
              <ul className="mt-4 space-y-3">
                {w.takeaways.map((t) => (
                  <li key={t} className="flex items-start gap-3 text-[15px] text-paper/80">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-teal/20 text-teal">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <div className="relative lg:col-span-8">
            <motion.div key={phase} initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09 } } }} className="relative">
              <motion.div
                aria-hidden
                className="absolute left-7 top-8 bottom-8 w-px origin-top bg-gradient-to-b from-orange to-teal"
                variants={{ hidden: { scaleY: 0 }, show: { scaleY: 1, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } } }}
              />
              <ol className="space-y-3">
                {p.steps.map((s, i) => (
                  <motion.li
                    key={s.title}
                    variants={{ hidden: { opacity: 0, x: 40, filter: "blur(6px)" }, show: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } } }}
                    className="group relative flex items-center gap-6 rounded-3xl bg-ink-2 p-5 ring-1 ring-white/10 transition-all duration-500 hover:ring-orange/40 hover:translate-x-1 sm:p-6"
                  >
                    <span className="relative grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-orange to-[#ff5b6a] text-ink shadow-glow-orange">
                      <Icon name={s.icon} className="h-6 w-6" strokeWidth={2} />
                      <span className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-ink font-display text-[10px] font-bold text-paper ring-1 ring-white/15">
                        {phase * 5 + i + 1}
                      </span>
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-bold text-paper sm:text-xl">{s.title}</h3>
                      <p className="mt-1 text-[15px] text-paper/55">{s.body}</p>
                    </div>
                  </motion.li>
                ))}
              </ol>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
