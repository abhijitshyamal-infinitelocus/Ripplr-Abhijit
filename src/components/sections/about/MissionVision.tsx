"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { about } from "@/lib/content";
import { VideoArt } from "@/components/ui/VideoArt";
import { SplitText } from "@/components/fx/SplitText";
import { Reveal } from "@/components/fx/Reveal";
import { Orbit } from "@/components/fx/Orbit";

/** Two sticky-stacked panels: mission then vision, each art pinned while its copy scrolls through. */
export function MissionVision() {
  return (
    <section className="relative bg-paper text-navy">
      <Panel index="01" title={about.mission.title} body={about.mission.body} art={about.mission.art} />
      <Panel index="02" title={about.vision.title} body={about.vision.body} art={about.vision.art} flip />
    </section>
  );
}

function Panel({ index, title, body, art, flip }: { index: string; title: string; body: string; art: typeof about.mission.art; flip?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const clip = useTransform(scrollYProgress, [0, 0.45], ["inset(12% 12% 12% 12% round 3rem)", "inset(0% 0% 0% 0% round 2rem)"]);
  const y = useTransform(scrollYProgress, [0, 1], [80, -80]);

  return (
    <div ref={ref} className="container-x grid items-center gap-12 py-20 lg:min-h-screen lg:grid-cols-12 lg:py-28">
      <div className={flip ? "lg:col-span-5 lg:col-start-8 lg:order-2" : "lg:col-span-5"}>
        <Reveal y={12} blur={false}>
          <span className="eyebrow text-orange">{index}</span>
        </Reveal>
        <SplitText as="h2" text={title} className="display-lg mt-5 text-navy" mode="chars" stagger={0.035} />
        <Reveal delay={0.2}>
          <p className="mt-8 text-lg leading-relaxed text-navy/70">{body}</p>
        </Reveal>
      </div>
      <motion.div style={{ clipPath: clip, y }} className={flip ? "lg:col-span-7 lg:col-start-1 lg:order-1 lg:row-start-1" : "lg:col-span-7"}>
        <Orbit accent={flip ? "cool" : "warm"} particles={10} tilt={6}>
          <VideoArt art={art} className="aspect-[16/9] drop-shadow-[0_50px_80px_rgba(0,0,0,0.5)]" rounded="rounded-none" />
        </Orbit>
      </motion.div>
    </div>
  );
}
