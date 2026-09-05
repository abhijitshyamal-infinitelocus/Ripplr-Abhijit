import Image from "next/image";
import { Quote } from "lucide-react";
import { about } from "@/lib/content";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Stagger, StaggerItem } from "@/components/fx/Reveal";
import { Tilt } from "@/components/fx/Tilt";
import { LinkedInIcon } from "@/components/ui/LinkedInIcon";

const f = about.founders;

export function Founders() {
  return (
    <section className="relative bg-ink py-24 lg:py-32">
      <div className="container-x">
        <SectionHeader eyebrow={f.eyebrow} title={f.title} description={f.description} />
        <Stagger className="mt-16 grid gap-6 lg:grid-cols-2" stagger={0.15}>
          {f.people.map((p, i) => (
            <StaggerItem key={p.name}>
              <Tilt max={6} className="group relative overflow-hidden rounded-[2rem] bg-ink-2 ring-1 ring-white/10">
                <div className="grid sm:grid-cols-[200px_1fr]">
                  <div className="relative aspect-square sm:aspect-auto sm:h-full">
                    <Image src={p.photo} alt={p.name} fill className="object-cover transition-transform duration-1000 ease-out-expo group-hover:scale-105" sizes="200px" />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-2 via-transparent sm:bg-gradient-to-r" />
                  </div>
                  <div className="relative flex flex-col p-8">
                    <Quote className={i ? "h-8 w-8 text-teal" : "h-8 w-8 text-orange"} />
                    <p className="mt-4 flex-1 text-lg leading-relaxed text-paper/85">{p.quote}</p>
                    <div className="mt-6 flex items-center justify-between">
                      <div>
                        <div className="font-display text-lg font-bold text-paper">{p.name}</div>
                        <div className="text-sm text-paper/55">{p.role}</div>
                      </div>
                      <a href={p.linkedin} target="_blank" rel="noreferrer" aria-label={`${p.name} on LinkedIn`} className="grid h-10 w-10 place-items-center rounded-full border border-white/12 text-paper/70 transition-colors hover:bg-paper hover:text-ink">
                        <LinkedInIcon className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </Tilt>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
