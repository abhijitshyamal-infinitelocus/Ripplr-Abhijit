import Image from "next/image";
import { about } from "@/lib/content";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Stagger, StaggerItem } from "@/components/fx/Reveal";
import { LinkedInIcon } from "@/components/ui/LinkedInIcon";

const l = about.leadership;

export function Leadership() {
  return (
    <section id="leadership" className="relative bg-ink py-24 lg:py-32">
      <div aria-hidden className="pointer-events-none absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-teal/10 blur-[140px]" />
      <div className="container-x relative">
        <SectionHeader eyebrow={l.eyebrow} title={l.title} description={l.description} accent="cool" />
        <Stagger className="mt-16 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4" stagger={0.07}>
          {l.people.map((p) => (
            <StaggerItem key={p.name}>
              <article className="group relative overflow-hidden rounded-3xl bg-ink-2 ring-1 ring-white/10">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image src={p.photo} alt={p.name} fill className="object-cover grayscale transition-all duration-1000 ease-out-expo group-hover:scale-105 group-hover:grayscale-0" sizes="(min-width:1024px) 25vw, 50vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-2 via-ink-2/20 to-transparent" />
                  <p className="absolute inset-x-5 bottom-5 translate-y-4 text-sm leading-snug text-paper/85 opacity-0 transition-all duration-700 ease-out-expo group-hover:translate-y-0 group-hover:opacity-100">
                    {p.bio}
                  </p>
                </div>
                <div className="flex items-start justify-between gap-2 p-5">
                  <div>
                    <h3 className="font-display text-base font-bold leading-tight text-paper sm:text-lg">{p.name}</h3>
                    <p className="mt-1 text-xs text-teal-2 sm:text-sm">{p.role}</p>
                  </div>
                  {"linkedin" in p && p.linkedin && (
                    <a href={p.linkedin} target="_blank" rel="noreferrer" aria-label={`${p.name} on ${l.linkedinLabel}`} className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/12 text-paper/60 transition-colors hover:bg-paper hover:text-ink">
                      <LinkedInIcon className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
