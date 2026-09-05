"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { culture, site } from "@/lib/content";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { LinkedInIcon } from "@/components/ui/LinkedInIcon";
import { cn } from "@/lib/utils";

const m = culture.moments;

/** Photo wall: 4 columns drifting at different scroll speeds; hover lifts a frame and reveals its caption. */
export function Moments() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y0 = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const y1 = useTransform(scrollYProgress, [0, 1], [80, -220]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-40, -160]);
  const y3 = useTransform(scrollYProgress, [0, 1], [120, -260]);
  const ys = [y0, y1, y2, y3];
  const cols = [0, 1, 2, 3].map((c) => m.photos.filter((_, i) => i % 4 === c));

  return (
    <section className="relative overflow-hidden bg-paper py-24 text-navy lg:py-32">
      <div className="container-x">
        <SectionHeader eyebrow={m.eyebrow} title={m.title} description={m.description} tone="light" align="center" />
      </div>
      <div ref={ref} className="container-x mt-16 grid grid-cols-2 gap-4 md:grid-cols-4">
        {cols.map((col, c) => (
          <motion.div key={c} style={{ y: ys[c] }} className={cn("flex flex-col gap-4", c % 2 === 1 && "mt-12")}>
            {col.map((p, i) => (
              <motion.figure
                key={p.src}
                initial={{ opacity: 0, y: 40, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.9, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className={cn("group relative overflow-hidden rounded-3xl ring-1 ring-navy/8", (i + c) % 3 === 0 ? "aspect-[3/4]" : (i + c) % 3 === 1 ? "aspect-square" : "aspect-[4/5]")}
              >
                <Image src={p.src} alt={p.alt} fill className="object-cover transition-transform duration-1000 ease-out-expo group-hover:scale-110" sizes="(min-width:768px) 25vw, 50vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <figcaption className="absolute inset-x-4 bottom-4 translate-y-3 text-xs font-medium text-paper opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  {p.alt}
                </figcaption>
              </motion.figure>
            ))}
          </motion.div>
        ))}
      </div>

      <div className="container-x mt-20">
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }} className="relative overflow-hidden rounded-[2rem] bg-navy p-8 text-paper sm:p-12">
          <div aria-hidden className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-orange/30 blur-[90px]" />
          <div className="relative flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div className="flex items-center gap-5">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-paper text-navy">
                <LinkedInIcon className="h-6 w-6" />
              </span>
              <div>
                <h3 className="font-display text-2xl font-bold">{m.linkedinCard.title}</h3>
                <p className="mt-1 text-paper/65">{m.linkedinCard.body}</p>
              </div>
            </div>
            <Button href={site.social.linkedin} variant="light">{m.linkedinCard.cta}</Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
