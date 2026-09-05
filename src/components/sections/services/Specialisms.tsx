"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { logistics } from "@/lib/content";
import { Tabs } from "@/components/ui/Tabs";
import { VideoArt } from "@/components/ui/VideoArt";
import { SplitText } from "@/components/fx/SplitText";
import { Reveal } from "@/components/fx/Reveal";
import { cn } from "@/lib/utils";

const s = logistics.specialisms;

/** Transport / Warehousing: three steps, each a full-bleed sticky card that stacks over the previous one. */
export function Specialisms() {
  const [tab, setTab] = useState(s.tabs[0].id);
  const panel = s.panels.find((p) => p.id === tab)!;

  return (
    <section id="specialisms" className="relative bg-ink-2 py-24 lg:py-32">
      <div className="container-x">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="max-w-3xl">
              <span className="eyebrow text-teal">{panel.eyebrow}</span>
              <SplitText as="h2" text={panel.title} className="display-lg mt-5 text-paper" />
              <p className="mt-6 text-lg leading-relaxed text-paper/65">{panel.body}</p>
            </motion.div>
          </AnimatePresence>
          <Reveal y={16} blur={false}>
            <Tabs id="specialisms" tabs={s.tabs} value={tab} onChange={setTab} />
          </Reveal>
        </div>
      </div>

      <div key={tab} className="mt-16">
        {panel.steps.map((st, i) => (
          <StepCard key={st.title} step={st} index={i} total={panel.steps.length} />
        ))}
      </div>
    </section>
  );
}

function StepCard({ step, index, total }: { step: (typeof s.panels)[number]["steps"][number]; index: number; total: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0.5, 1], [1, 0.92]);
  const opacity = useTransform(scrollYProgress, [0.6, 1], [1, 0.4]);
  const last = index === total - 1;

  return (
    <div ref={ref} className="sticky px-5 lg:px-0" style={{ top: `calc(6rem + ${index * 1.25}rem)`, marginBottom: last ? 0 : "-2rem" }}>
      <motion.div style={{ scale: last ? 1 : scale, opacity: last ? 1 : opacity }} className="container-x pb-24">
        <div className={cn("grid overflow-hidden rounded-[2rem] ring-1 ring-white/10 shadow-card lg:grid-cols-12", index % 2 ? "bg-navy" : "bg-ink")}>
          <div className={cn("flex flex-col justify-between p-8 lg:col-span-5 lg:p-12", index % 2 === 1 && "lg:order-2")}>
            <div>
              <span className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-teal-2">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-teal text-ink font-display text-sm">{index + 1}</span>
                {"label" in step && step.label ? step.label : `${s.stepLabel} ${index + 1} of ${total}`}
              </span>
              <h3 className="mt-6 font-display text-3xl font-bold leading-tight tracking-tight text-paper sm:text-4xl">{step.title}</h3>
              <p className="mt-5 text-lg leading-relaxed text-paper/65">{step.body}</p>
            </div>
            <div className="mt-10 flex gap-1">
              {Array.from({ length: total }).map((_, k) => (
                <span key={k} className={cn("h-1 flex-1 rounded-full", k <= index ? "bg-teal" : "bg-white/10")} />
              ))}
            </div>
          </div>
          <div className={cn("lg:col-span-7", index % 2 === 1 && "lg:order-1")}>
            <VideoArt art={{ src: step.art, alt: step.title, video: step.video, videoMp4: step.videoMp4, width: 1400, height: 900 }} className="aspect-[16/10] h-full" rounded="rounded-none" sizes="(min-width:1024px) 60vw, 100vw" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
