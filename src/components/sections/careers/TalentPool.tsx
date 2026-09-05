"use client";

import { Upload } from "lucide-react";
import { useState } from "react";
import { careers } from "@/lib/content";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/fx/Reveal";
import { EnquiryForm } from "@/components/sections/EnquiryForm";
import { cn } from "@/lib/utils";

const t = careers.talentPool;

export function TalentPool() {
  const [file, setFile] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);

  return (
    <section id="talent-pool" className="relative overflow-hidden bg-ink-2 py-24 lg:py-32">
      <div aria-hidden className="pointer-events-none absolute -right-40 top-0 h-[600px] w-[600px] rounded-full bg-orange/10 blur-[150px]" />
      <div className="container-x relative">
        <SectionHeader eyebrow={t.eyebrow} title={t.title} description={t.description} />
        <Reveal className="mt-14" scale={0.97} y={50}>
          <div className="grid overflow-hidden rounded-[2.5rem] ring-1 ring-white/10 lg:grid-cols-12">
            <div className="relative flex flex-col justify-between bg-gradient-to-br from-navy via-navy-2 to-ink p-8 lg:col-span-5 lg:p-12">
              <div aria-hidden className="grain absolute inset-0" />
              <div className="relative">
                <span className="eyebrow text-orange-2">Talent pool</span>
                <h3 className="display-md mt-5 text-paper">{t.panel.title}</h3>
                <p className="mt-5 text-lg text-paper/65">{t.panel.body}</p>
              </div>
              <div className="relative mt-12 flex -space-x-3">
                {["suresh", "rohit", "akshatha-ht", "chetan", "preeti-swain"].map((p) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={p} src={`/figma/culture/people/${p}.webp`} alt="" className="h-12 w-12 rounded-full object-cover ring-2 ring-navy" />
                ))}
                <span className="grid h-12 w-12 place-items-center rounded-full bg-orange font-display text-xs font-bold text-ink ring-2 ring-navy">+200</span>
              </div>
            </div>
            <div className="bg-ink p-8 lg:col-span-7 lg:p-12">
              <EnquiryForm
                fields={t.form.fields}
                submitLabel={t.form.submitLabel}
                successTitle="You're on our radar"
                successBody="We'll reach out the moment a matching role opens up."
                extra={
                  <label
                    onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
                    onDragLeave={() => setDrag(false)}
                    onDrop={(e) => { e.preventDefault(); setDrag(false); setFile(e.dataTransfer.files[0]?.name ?? null); }}
                    className={cn("flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed px-6 py-10 text-center transition-colors duration-300", drag ? "border-orange bg-orange/10" : "border-white/15 hover:border-orange/60")}
                  >
                    <input type="file" accept=".pdf,.doc,.docx" className="sr-only" onChange={(e) => setFile(e.target.files?.[0]?.name ?? null)} />
                    <span className="grid h-12 w-12 place-items-center rounded-full bg-white/6 text-orange">
                      <Upload className="h-5 w-5" />
                    </span>
                    <span className="font-display text-sm font-semibold text-paper">{t.form.resumeLabel}</span>
                    <span className="text-sm text-paper/55">{file ?? t.form.resumeHint}</span>
                  </label>
                }
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
