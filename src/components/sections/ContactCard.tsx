"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useState } from "react";
import { site } from "@/lib/content";
import { Reveal } from "@/components/fx/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Icon } from "@/components/ui/Icon";
import { Tabs } from "@/components/ui/Tabs";
import { Button } from "@/components/ui/Button";
import { EnquiryForm } from "./EnquiryForm";

const forms = site.contactCard.forms;
type FormId = keyof typeof forms;

/** Layered illustration + contact rows on the left, tabbed enquiry form on the right. */
export function ContactCard({
  eyebrow,
  title,
  description,
  panel = "home",
  id = "enquiry",
}: {
  eyebrow: string;
  title: string;
  description: string;
  panel?: "home" | "contact";
  id?: string;
}) {
  const [tab, setTab] = useState<FormId>("distribution");
  const p = site.contactCard.panels[panel];
  const media = site.contactCard.media;

  return (
    <section id={id} className="relative overflow-hidden bg-ink-2 py-24 lg:py-32">
      <div aria-hidden className="pointer-events-none absolute -left-40 bottom-0 h-[600px] w-[600px] rounded-full bg-orange/10 blur-[150px]" />
      <div className="container-x relative">
        <SectionHeader eyebrow={eyebrow} title={title} description={description} align="center" />

        <Reveal className="mt-16" scale={0.97} y={50}>
          <div className="grid overflow-hidden rounded-[2.5rem] ring-1 ring-white/10 lg:grid-cols-12">
            {/* left panel */}
            <div className="relative overflow-hidden bg-gradient-to-b from-navy to-ink lg:col-span-5">
              <div className="relative aspect-[4/3] w-full overflow-hidden lg:aspect-auto lg:h-[340px]">
                <motion.div className="absolute inset-0" initial={{ scale: 1.1 }} whileInView={{ scale: 1 }} transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }} viewport={{ once: true }}>
                  <Image src={media.base} alt={media.alt} fill className="object-cover" sizes="(min-width:1024px) 40vw, 100vw" />
                </motion.div>
                {media.layers.map((l, i) => (
                  <motion.div
                    key={l.src}
                    aria-hidden
                    className="absolute inset-0"
                    initial={{ opacity: 0, x: i === 0 ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.4, delay: 0.3 + i * 0.2, ease: [0.16, 1, 0.3, 1] }}
                    style={{ animation: `float ${8 + i * 2}s ease-in-out ${i}s infinite` }}
                  >
                    <Image src={l.src} alt="" fill className="object-cover" sizes="(min-width:1024px) 40vw, 100vw" />
                  </motion.div>
                ))}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-navy to-transparent" />
              </div>
              <div className="relative p-8 lg:p-10">
                <h3 className="font-display text-2xl font-bold text-paper">{p.title}</h3>
                <ul className="mt-6 space-y-4">
                  {p.rows.map((r) => {
                    const inner = (
                      <>
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/12 text-orange transition-colors group-hover:bg-orange group-hover:text-ink">
                          <Icon name={r.icon} className="h-4 w-4" />
                        </span>
                        <span className="text-[15px] text-paper/80 group-hover:text-paper">{r.value}</span>
                      </>
                    );
                    return (
                      <li key={r.value}>
                        {"href" in r && r.href ? (
                          <a href={r.href} target={r.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="group flex items-center gap-4">
                            {inner}
                          </a>
                        ) : (
                          <span className="group flex items-center gap-4">{inner}</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
                {"cta" in p && p.cta && (
                  <div className="mt-8">
                    <Button href={p.cta.href} variant="ghost">
                      {p.cta.label}
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* form */}
            <div className="bg-ink p-8 lg:col-span-7 lg:p-12">
              <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                <Tabs id={`${id}-tabs`} tabs={[{ id: "distribution", label: "Distribution" }, { id: "logistics", label: "Logistics" }]} value={tab} onChange={(v) => setTab(v as FormId)} />
                <span className="text-xs uppercase tracking-[0.2em] text-paper/40">Avg response · 24h</span>
              </div>
              <motion.div key={tab} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
                <EnquiryForm title={forms[tab].title} fields={forms[tab].fields} submitLabel={forms[tab].submitLabel} />
              </motion.div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
