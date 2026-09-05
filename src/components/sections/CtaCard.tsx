import Image from "next/image";
import { Reveal } from "@/components/fx/Reveal";
import { SplitText } from "@/components/fx/SplitText";
import { Parallax } from "@/components/fx/Parallax";
import { Button } from "@/components/ui/Button";
import type { Art, Cta, TextPart } from "@/lib/content";

/** Closing call-to-action: warm gradient card with parallax art. */
export function CtaCard({
  eyebrow,
  titleParts,
  description,
  primaryCta,
  secondaryCta,
  art,
}: {
  eyebrow: string;
  titleParts: TextPart[];
  description: string;
  primaryCta: Cta;
  secondaryCta?: Cta;
  art?: Art;
}) {
  return (
    <section className="relative py-24 lg:py-32">
      <div className="container-x">
        <Reveal scale={0.96} y={60}>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-navy via-navy-2 to-ink-2 p-8 shadow-card ring-1 ring-white/10 sm:p-12 lg:p-16">
            <div aria-hidden className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-orange/35 blur-[110px]" />
            <div aria-hidden className="pointer-events-none absolute -bottom-40 left-1/3 h-80 w-80 rounded-full bg-teal/30 blur-[110px]" />
            <div aria-hidden className="grain absolute inset-0" />

            <div className="relative grid items-center gap-10 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <span className="eyebrow text-orange-2">{eyebrow}</span>
                <SplitText
                  as="h2"
                  className="display-lg mt-5 text-paper"
                  text={titleParts.map((p) => ({ text: p.t, className: p.accent ? "text-gradient-warm" : undefined }))}
                />
                <p className="mt-6 max-w-[46ch] text-lg text-paper/70">{description}</p>
                <div className="mt-9 flex flex-wrap gap-3">
                  <Button href={primaryCta.href} size="lg">
                    {primaryCta.label}
                  </Button>
                  {secondaryCta && (
                    <Button href={secondaryCta.href} size="lg" variant="ghost">
                      {secondaryCta.label}
                    </Button>
                  )}
                </div>
              </div>
              {art && (
                <div className="relative lg:col-span-5">
                  <Parallax speed={-0.25}>
                    <div className="relative mx-auto max-w-md drop-shadow-[0_40px_60px_rgba(0,0,0,0.5)]">
                      <Image src={art.src} alt={art.alt} width={art.width ?? 1200} height={art.height ?? 800} className="h-full w-full object-cover" sizes="(min-width:1024px) 40vw, 90vw" />
                    </div>
                  </Parallax>
                </div>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
