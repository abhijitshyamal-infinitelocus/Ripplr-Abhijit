"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { SplitText } from "@/components/fx/SplitText";
import { Reveal } from "@/components/fx/Reveal";
import { Counter } from "@/components/fx/Counter";
import { Button } from "@/components/ui/Button";
import { VideoArt } from "@/components/ui/VideoArt";
import type { Art, Cta, Stat, TextPart } from "@/lib/content";
import { cn } from "@/lib/utils";

type Props = {
  eyebrow: string;
  headline: TextPart[];
  subhead: string | string[];
  primaryCta?: Cta;
  secondaryCta?: Cta;
  stats?: Stat[];
  art?: Art;
  chips?: { label: string; value: string }[];
  accent?: "warm" | "cool";
  /** "split" puts art beside copy; "stack" puts art below wide copy. */
  layout?: "split" | "stack";
};

/** Page hero: split headline reveal, parallax video art, orbiting chips, counting stats, animated gradient field. */
export function Hero({ eyebrow, headline, subhead, primaryCta, secondaryCta, stats, art, chips, accent = "warm", layout = "split" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const artY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const artScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const accentClass = accent === "warm" ? "text-gradient-warm" : "text-gradient-cool";
  const subheadText = Array.isArray(subhead) ? subhead.join(" ") : subhead;
  const headlineLength = headline.reduce((n, p) => n + p.t.length, 0);

  return (
    <section ref={ref} className="relative isolate overflow-hidden pt-36 pb-16 sm:pt-40 lg:pt-44 lg:pb-24">
      {/* gradient field */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          className={cn("absolute -top-40 left-[-10%] h-[70vh] w-[70vw] rounded-full blur-[120px]", accent === "warm" ? "bg-orange/25" : "bg-teal/25")}
          animate={{ x: [0, 60, -30, 0], y: [0, 40, 80, 0], scale: [1, 1.15, 0.95, 1] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className={cn("absolute right-[-15%] top-[10%] h-[60vh] w-[55vw] rounded-full blur-[130px]", accent === "warm" ? "bg-teal/18" : "bg-orange/18")}
          animate={{ x: [0, -80, 20, 0], y: [0, 60, -40, 0] }}
          transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="grid-lines absolute inset-0" />
      </div>

      <div className={cn("container-x relative grid items-center gap-12 lg:gap-10", layout === "split" ? "lg:grid-cols-12" : "")}>
        <motion.div style={{ y: copyY, opacity: fade }} className={cn(layout === "split" ? "lg:col-span-6" : "max-w-4xl")}>
          <Reveal y={16} blur={false}>
            <span className={cn("eyebrow", accent === "warm" ? "text-orange" : "text-teal")}>{eyebrow}</span>
          </Reveal>
          <SplitText
            as="h1"
            className={cn("mt-6 text-paper", headlineLength > 34 ? "display-lg" : "display-xl")}
            text={headline.map((p) => ({ text: p.t, className: p.accent ? accentClass : undefined }))}
            delay={0.15}
            stagger={0.06}
          />
          <Reveal delay={0.55} y={20}>
            <p className="mt-7 max-w-[48ch] text-lg leading-relaxed text-paper/70 sm:text-xl">{subheadText}</p>
          </Reveal>
          {(primaryCta || secondaryCta) && (
            <Reveal delay={0.7} y={20}>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                {primaryCta && (
                  <Button href={primaryCta.href} size="lg">
                    {primaryCta.label}
                  </Button>
                )}
                {secondaryCta && (
                  <Button href={secondaryCta.href} size="lg" variant="ghost">
                    {secondaryCta.label}
                  </Button>
                )}
              </div>
            </Reveal>
          )}
        </motion.div>

        {art && (
          <motion.div style={{ y: artY, scale: artScale }} className={cn("relative", layout === "split" ? "lg:col-span-6" : "mt-4")}>
            <motion.div
              initial={{ opacity: 0, y: 60, rotate: 2, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
              transition={{ duration: 1.4, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <div className={cn("absolute -inset-6 -z-10 rounded-[2.5rem] blur-3xl", accent === "warm" ? "bg-orange/20" : "bg-teal/20")} />
              <VideoArt art={art} priority className="relative z-0 aspect-[16/9] w-full shadow-card ring-1 ring-white/10" rounded="rounded-[1.75rem]" />

              {chips?.map((c, i) => (
                <motion.div
                  key={c.label}
                  initial={{ opacity: 0, scale: 0.6, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 1 + i * 0.2, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  className={cn("absolute z-10", i === 0 ? "-left-3 top-6 sm:-left-8 sm:top-10" : "-right-3 bottom-8 sm:-right-8 sm:bottom-12")}
                  style={{ animation: `float ${6 + i * 1.5}s ease-in-out ${i * 0.8}s infinite` }}
                >
                  <div className="flex items-center gap-3 rounded-2xl border border-white/12 bg-ink-2/95 px-4 py-3 shadow-card backdrop-blur">
                    <span className="relative grid h-2.5 w-2.5 place-items-center">
                      <span className={cn("absolute inset-0 rounded-full animate-pulse-ring", i === 0 ? "bg-orange" : "bg-teal")} />
                      <span className={cn("relative h-2.5 w-2.5 rounded-full", i === 0 ? "bg-orange" : "bg-teal")} />
                    </span>
                    <span>
                      <span className="block text-[10px] uppercase tracking-[0.18em] text-paper/55">{c.label}</span>
                      <span className="block font-display text-lg font-bold leading-none text-paper">{c.value}</span>
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </div>

      {stats && stats.length > 0 && (
        <div className="container-x mt-16 lg:mt-20">
          <Reveal delay={0.2}>
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 lg:grid-cols-4">
              {stats.map((s, i) => (
                <div key={s.label} className="group relative bg-ink px-6 py-7 transition-colors duration-500 hover:bg-ink-2">
                  <span className={cn("absolute left-0 top-0 h-full w-[2px] origin-top scale-y-0 transition-transform duration-700 ease-out-expo group-hover:scale-y-100", i % 2 ? "bg-teal" : "bg-orange")} />
                  <Counter value={s.value} className="font-display text-3xl font-bold tracking-tight text-paper sm:text-4xl" />
                  <span className="mt-2 block text-sm text-paper/55">{s.label}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      )}
    </section>
  );
}
