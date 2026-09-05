"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { culture } from "@/lib/content";
import { SplitText } from "@/components/fx/SplitText";
import { Reveal } from "@/components/fx/Reveal";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const h = culture.hero;

/** Culture hero: auto-rotating photo collage with clip-path wipes and a label ticker. */
export function CultureHero() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % h.slides.length), 4200);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative isolate overflow-hidden pt-36 pb-16 lg:pt-44 lg:pb-24">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <motion.div className="absolute -top-40 right-[-10%] h-[70vh] w-[60vw] rounded-full bg-orange/20 blur-[130px]" animate={{ x: [0, -60, 30, 0], y: [0, 50, 20, 0] }} transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }} />
        <motion.div className="absolute bottom-0 left-[-10%] h-[50vh] w-[50vw] rounded-full bg-teal/20 blur-[130px]" animate={{ x: [0, 60, -20, 0] }} transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }} />
        <div className="grid-lines absolute inset-0" />
      </div>

      <div className="container-x grid items-center gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Reveal y={16} blur={false}>
            <span className="eyebrow text-orange">{h.eyebrow}</span>
          </Reveal>
          <SplitText as="h1" className="display-xl mt-6 text-paper" text={[{ text: h.headline + " " }, { text: h.headlineSecond }, { text: h.headlineAccent, className: "text-gradient-warm" }]} delay={0.15} stagger={0.07} />
          <Reveal delay={0.55} y={20}>
            <p className="mt-7 max-w-[46ch] text-lg leading-relaxed text-paper/70 sm:text-xl">{h.subhead}</p>
          </Reveal>
          <Reveal delay={0.7} y={20}>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button href={h.primaryCta.href} size="lg">{h.primaryCta.label}</Button>
              <Button href={h.secondaryCta.href} size="lg" variant="ghost">{h.secondaryCta.label}</Button>
            </div>
          </Reveal>
        </div>

        <motion.div initial={{ opacity: 0, y: 60, rotate: 2 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ duration: 1.3, delay: 0.3, ease: [0.16, 1, 0.3, 1] }} className="relative lg:col-span-7">
          <div className="absolute -inset-6 -z-10 rounded-[3rem] bg-orange/15 blur-3xl" />
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] ring-1 ring-white/10 shadow-card">
            <AnimatePresence initial={false}>
              <motion.div
                key={i}
                className="absolute inset-0"
                initial={{ clipPath: "inset(0 0 0 100%)", scale: 1.1 }}
                animate={{ clipPath: "inset(0 0 0 0%)", scale: 1 }}
                exit={{ opacity: 0, scale: 1.05, transition: { duration: 1.2 } }}
                transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
              >
                <Image src={h.slides[i].src} alt={h.slides[i].alt} fill priority={i === 0} className="object-cover" sizes="(min-width:1024px) 60vw, 100vw" />
              </motion.div>
            </AnimatePresence>
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/80 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4">
              <AnimatePresence mode="wait">
                <motion.span key={i} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} transition={{ duration: 0.5 }} className="font-display text-2xl font-bold text-paper sm:text-3xl">
                  {h.slides[i].label}
                </motion.span>
              </AnimatePresence>
              <div className="flex gap-2">
                {h.slides.map((_, k) => (
                  <button key={k} aria-label={`Slide ${k + 1}`} onClick={() => setI(k)} className="relative h-1.5 w-10 overflow-hidden rounded-full bg-white/25">
                    {k === i && <motion.span layoutId="slide-bar" className="absolute inset-0 bg-orange" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 4.2, ease: "linear" }} style={{ originX: 0 }} />}
                    <span className={cn("absolute inset-0", k < i && "bg-paper/60")} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
