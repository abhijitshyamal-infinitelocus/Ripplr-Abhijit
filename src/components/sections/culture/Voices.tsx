"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { culture } from "@/lib/content";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/fx/Reveal";

const v = culture.voices;

/** Testimonial carousel: one featured voice + two supporting, sliding as a set. */
export function Voices() {
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const n = v.slides.length;
  const go = useCallback((d: number) => {
    setDir(d);
    setI((x) => (x + d + n) % n);
  }, [n]);

  useEffect(() => {
    const t = setInterval(() => go(1), 7000);
    return () => clearInterval(t);
  }, [go, i]);

  const s = v.slides[i];
  const variants = {
    enter: (d: number) => ({ opacity: 0, x: d * 80, filter: "blur(8px)" }),
    center: { opacity: 1, x: 0, filter: "blur(0px)" },
    exit: (d: number) => ({ opacity: 0, x: d * -80, filter: "blur(8px)" }),
  };

  return (
    <section className="relative overflow-hidden bg-ink py-24 lg:py-32">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-teal/10 blur-[160px]" />
      <div className="container-x relative">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader eyebrow={v.eyebrow} title={v.title} description={v.description} accent="cool" />
          <Reveal y={12} blur={false}>
            <div className="flex items-center gap-3">
              <span className="font-display text-sm tabular-nums text-paper/50">
                <span className="text-paper">{String(i + 1).padStart(2, "0")}</span> / {String(n).padStart(2, "0")}
              </span>
              <button onClick={() => go(-1)} aria-label="Previous" className="grid h-12 w-12 place-items-center rounded-full border border-white/15 text-paper transition-colors hover:bg-paper hover:text-ink">
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button onClick={() => go(1)} aria-label="Next" className="grid h-12 w-12 place-items-center rounded-full border border-white/15 text-paper transition-colors hover:bg-paper hover:text-ink">
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </Reveal>
        </div>

        <div className="relative mt-14 min-h-[520px]">
          <AnimatePresence custom={dir} mode="wait">
            <motion.div key={i} custom={dir} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} className="grid gap-5 lg:grid-cols-12">
              <article className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-navy to-ink-2 p-8 ring-1 ring-white/10 lg:col-span-7 lg:p-12">
                <Quote className="h-10 w-10 text-teal" />
                <p className="mt-6 font-display text-2xl font-medium leading-snug tracking-tight text-paper sm:text-3xl">{s.featured.quote}</p>
                <div className="mt-10 flex items-center gap-4">
                  <span className="relative h-14 w-14 overflow-hidden rounded-full ring-2 ring-teal">
                    <Image src={s.featured.photo} alt={s.featured.name} fill className="object-cover" sizes="56px" />
                  </span>
                  <div>
                    <div className="font-display text-lg font-bold text-paper">{s.featured.name}</div>
                    <div className="text-sm text-teal-2">{s.featured.role}</div>
                  </div>
                </div>
              </article>
              <div className="flex flex-col gap-5 lg:col-span-5">
                {s.secondary.map((p, k) => (
                  <motion.article key={p.name} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + k * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }} className="glass flex flex-1 flex-col justify-between rounded-3xl p-7">
                    <p className="text-[15px] leading-relaxed text-paper/85">“{p.quote}”</p>
                    <div className="mt-6 flex items-center gap-3">
                      <span className="relative h-10 w-10 overflow-hidden rounded-full">
                        <Image src={p.photo} alt={p.name} fill className="object-cover" sizes="40px" />
                      </span>
                      <div>
                        <div className="font-display text-sm font-bold text-paper">{p.name}</div>
                        <div className="text-xs text-paper/50">{p.role}</div>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
