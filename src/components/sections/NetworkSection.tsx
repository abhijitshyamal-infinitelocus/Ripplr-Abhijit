"use client";

import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { IndiaMap } from "./IndiaMap";
import { Reveal } from "@/components/fx/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Tabs } from "@/components/ui/Tabs";
import type { Region } from "@/lib/content";
import { cn } from "@/lib/utils";

type Tab = { id: string; label: string; title?: string; description?: string; regions?: Region[] };

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  legend: { label: string; color: string }[];
  regions: Region[];
  tabs?: Tab[];
  /** Cities that get the first legend color when two legends exist. */
  distributionCities?: string[];
  id?: string;
};

/** Network map + region breakdown; optional tabs swap the region set. */
export function NetworkSection({ eyebrow, title, description, legend, regions, tabs, distributionCities, id = "network" }: Props) {
  const [tab, setTab] = useState(tabs?.[0]?.id ?? "default");
  const active = tabs?.find((t) => t.id === tab);
  const activeRegions = active?.regions ?? regions;
  const [hoverCity, setHoverCity] = useState<string | null>(null);

  const pins = useMemo(() => {
    const primary = legend[0].color;
    const secondary = legend[1]?.color ?? primary;
    return activeRegions.flatMap((r) =>
      r.cities.map((city) => ({
        city,
        color: distributionCities ? (distributionCities.includes(city) ? primary : secondary) : primary,
      })),
    );
  }, [activeRegions, legend, distributionCities]);

  const total = activeRegions.reduce((n, r) => n + r.cities.length, 0);

  return (
    <section id={id} className="relative overflow-hidden bg-ink py-24 lg:py-32">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-[900px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal/10 blur-[160px]" />
      <div className="container-x relative">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader eyebrow={eyebrow} title={active?.title ?? title} description={active?.description ?? description} accent="cool" />
          {tabs && tabs.length > 1 && (
            <Reveal y={16} blur={false}>
              <Tabs tabs={tabs} value={tab} onChange={setTab} id={id} />
            </Reveal>
          )}
        </div>

        <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:items-center">
          <Reveal className="lg:col-span-6" scale={0.94} y={40}>
            <IndiaMap pins={pins} highlight={hoverCity} className="mx-auto max-w-[560px]" />
          </Reveal>

          <div className="lg:col-span-6">
            <Reveal y={20}>
              <div className="flex flex-wrap items-center gap-5">
                {legend.map((l) => (
                  <span key={l.label} className="flex items-center gap-2 text-sm text-paper/70">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: l.color, boxShadow: `0 0 16px ${l.color}` }} />
                    {l.label}
                  </span>
                ))}
                <span className="ml-auto font-display text-sm text-paper/50">
                  <span className="text-paper">{total}</span> locations
                </span>
              </div>
            </Reveal>

            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="mt-8 grid gap-4 sm:grid-cols-2"
              >
                {activeRegions.map((r, i) => (
                  <motion.div
                    key={r.name}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="glass group relative overflow-hidden rounded-3xl p-6"
                  >
                    <span aria-hidden className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-teal/20 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="flex items-baseline justify-between">
                      <h3 className="font-display text-xl font-bold text-paper">{r.name}</h3>
                      <span className="text-xs uppercase tracking-[0.18em] text-teal-2">{r.count}</span>
                    </div>
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {r.cities.map((c) => (
                        <li
                          key={c}
                          onMouseEnter={() => setHoverCity(c)}
                          onMouseLeave={() => setHoverCity(null)}
                          className={cn(
                            "cursor-default rounded-full border px-3 py-1 text-xs transition-colors duration-300",
                            hoverCity === c ? "border-teal bg-teal text-ink" : "border-white/10 text-paper/70 hover:border-teal/60 hover:text-paper",
                          )}
                        >
                          {c}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
