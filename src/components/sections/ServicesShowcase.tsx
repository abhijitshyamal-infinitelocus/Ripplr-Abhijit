"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { home } from "@/lib/content";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Tabs } from "@/components/ui/Tabs";
import { VideoArt } from "@/components/ui/VideoArt";
import { Reveal } from "@/components/fx/Reveal";
import { cn } from "@/lib/utils";

const tabs = home.services.tabs;

/** Tabbed services. Desktop: sticky section where vertical scroll drives the cards horizontally. Mobile: snap carousel. */
export function ServicesShowcase() {
  const [tab, setTab] = useState(tabs[0].id);
  const items = tabs.find((t) => t.id === tab)!.items;
  const ref = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [travel, setTravel] = useState(0);
  const [desktop, setDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const measure = () => {
      const t = trackRef.current;
      if (!t) return;
      setTravel(Math.max(0, t.scrollWidth - window.innerWidth + 96));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [tab, desktop]);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0.08, 0.95], [0, -travel]);
  const progress = useTransform(scrollYProgress, [0.08, 0.95], ["0%", "100%"]);

  return (
    <section id="services" ref={ref} className="relative bg-ink" style={{ height: desktop ? "320vh" : "auto" }}>
      <div className={cn("relative overflow-hidden", desktop && "sticky top-0 flex h-screen flex-col justify-center")}>
        <div aria-hidden className="pointer-events-none absolute right-[-10%] top-0 h-[600px] w-[600px] rounded-full bg-orange/10 blur-[150px]" />
        <div className={cn("container-x relative", !desktop && "pt-24")}>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeader eyebrow={home.services.eyebrow} title={home.services.title} description={home.services.description} size={desktop ? "md" : "lg"} />
            <Reveal y={16} blur={false}>
              <Tabs id="services" tabs={tabs.map((t) => ({ id: t.id, label: t.label }))} value={tab} onChange={setTab} />
            </Reveal>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            ref={trackRef}
            style={desktop ? { x } : undefined}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "mt-12 flex gap-6 will-change-transform",
              desktop ? "w-max pl-[max(1.25rem,calc((100vw-1320px)/2+3rem))]" : "snap-x snap-mandatory overflow-x-auto px-5 pb-24 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            )}
          >
            {items.map((it, i) => (
              <ServiceCard key={it.name} item={it} index={i} accent={tab === "logistics" ? "cool" : "warm"} />
            ))}
            <div className="w-6 shrink-0" />
          </motion.div>
        </AnimatePresence>

        {desktop && (
          <div className="container-x mt-10">
            <div className="h-px w-full bg-white/10">
              <motion.div className="h-full bg-orange" style={{ width: progress }} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function ServiceCard({ item, index, accent }: { item: (typeof tabs)[number]["items"][number]; index: number; accent: "warm" | "cool" }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex w-[82vw] max-w-[440px] shrink-0 snap-center flex-col overflow-hidden rounded-[2rem] bg-ink-2 ring-1 ring-white/10 transition-all duration-700 ease-out-expo hover:-translate-y-2 hover:ring-white/25 lg:w-[440px]"
    >
      <div className="relative">
        <VideoArt
          art={{ src: item.art, alt: item.artAlt, video: "artVideo" in item ? (item as { artVideo?: string }).artVideo : undefined, videoMp4: "artVideoMp4" in item ? (item as { artVideoMp4?: string }).artVideoMp4 : undefined, width: 880, height: 560 }}
          play="hover"
          rounded="rounded-none"
          className="aspect-[16/10] w-full transition-transform duration-1000 ease-out-expo group-hover:scale-[1.03]"
          sizes="440px"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink-2 to-transparent" />
        <span className={cn("absolute left-5 top-5 font-display text-5xl font-bold leading-none tracking-tighter opacity-80", accent === "warm" ? "text-gradient-warm" : "text-gradient-cool")}>{item.series}</span>
      </div>
      <div className="flex flex-1 flex-col p-7">
        <h3 className="font-display text-2xl font-bold leading-tight text-paper">{item.name}</h3>
        <p className="mt-3 flex-1 text-[15px] leading-relaxed text-paper/60">{item.description}</p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {item.proof.map((p) => (
            <li key={p} className={cn("rounded-full border px-3 py-1 text-xs", accent === "warm" ? "border-orange/30 text-orange-2" : "border-teal/30 text-teal-2")}>
              {p}
            </li>
          ))}
        </ul>
        <Link href={item.cta.href} className="mt-6 inline-flex items-center gap-2 font-display text-sm font-semibold text-paper">
          <span className="relative">
            {item.cta.label}
            <span className={cn("absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 transition-transform duration-500 ease-out-expo group-hover:scale-x-100", accent === "warm" ? "bg-orange" : "bg-teal")} />
          </span>
          <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </motion.article>
  );
}
