import Image from "next/image";
import { about } from "@/lib/content";
import { Marquee } from "@/components/fx/Marquee";
import { Reveal } from "@/components/fx/Reveal";

export function Investors() {
  return (
    <section className="bg-cream py-20 text-navy lg:py-24">
      <div className="container-x grid gap-16 lg:grid-cols-2">
        {about.investors.groups.map((g, gi) => (
          <Reveal key={g.title} delay={gi * 0.1}>
            <span className="eyebrow text-orange">{g.eyebrow}</span>
            <h2 className="display-md mt-4">{g.title}</h2>
            <div className="mt-8 rounded-3xl border border-navy/8 bg-white/70 py-6">
              <Marquee duration={about.investors.marquee.durationSeconds + g.logos.length * 2} reverse={gi === 1} gap="gap-4">
                {g.logos.map((l) => (
                  <div key={l.src} className="flex h-16 w-[220px] shrink-0 items-center justify-center px-6">
                    <Image src={l.src} alt={l.alt} width={l.width} height={l.height} className="h-auto max-h-12 w-auto object-contain" />
                  </div>
                ))}
              </Marquee>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
