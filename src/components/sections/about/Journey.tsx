"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { about } from "@/lib/content";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/fx/Reveal";
import { cn } from "@/lib/utils";

const j = about.journey;

/** Timeline whose spine draws itself as you scroll; milestones alternate sides on desktop. */
export function Journey() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const h = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section className="relative overflow-hidden bg-paper py-24 text-navy lg:py-32">
      <div aria-hidden className="grid-lines-dark absolute inset-0" />
      <div className="container-x relative">
        <SectionHeader eyebrow={j.eyebrow} title={j.title} description={j.description} tone="light" align="center" />
        <div ref={ref} className="relative mt-20">
          <div className="absolute left-5 top-0 h-full w-px bg-navy/10 lg:left-1/2" />
          <motion.div style={{ height: h }} className="absolute left-5 top-0 w-px bg-gradient-to-b from-orange via-orange to-teal lg:left-1/2" />
          <ol className="space-y-12 lg:space-y-0">
            {j.milestones.map((m, i) => {
              const right = i % 2 === 1;
              return (
                <li key={m.year} className={cn("relative pl-16 lg:grid lg:grid-cols-2 lg:gap-16 lg:pl-0", i > 0 && "lg:-mt-10")}>
                  <Reveal x={right ? 40 : -40} y={0} className={cn(right ? "lg:col-start-2" : "lg:col-start-1 lg:text-right")}>
                    <div className={cn("group relative inline-block max-w-md rounded-3xl bg-cream p-7 shadow-[0_20px_60px_-30px_rgba(22,57,78,0.3)] ring-1 ring-navy/6 transition-transform duration-700 ease-out-expo hover:-translate-y-1", !right && "lg:text-right")}>
                      <span className="font-display text-4xl font-bold tracking-tighter text-gradient-warm">{m.year}</span>
                      <h3 className="mt-3 font-display text-xl font-bold">{m.title}</h3>
                      <p className="mt-2 text-[15px] leading-relaxed text-navy/65">{m.body}</p>
                    </div>
                  </Reveal>
                  <motion.span
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, amount: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 16 }}
                    className="absolute left-5 top-8 grid h-5 w-5 -translate-x-1/2 place-items-center lg:left-1/2"
                  >
                    <span className="absolute inset-0 rounded-full bg-orange/40 animate-pulse-ring" />
                    <span className="relative h-3 w-3 rounded-full border-2 border-paper bg-orange" />
                  </motion.span>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
