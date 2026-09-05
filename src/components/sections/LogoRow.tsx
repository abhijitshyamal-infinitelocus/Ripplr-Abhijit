import Image from "next/image";
import { Marquee } from "@/components/fx/Marquee";
import { Reveal } from "@/components/fx/Reveal";
import type { Logo } from "@/lib/content";
import { cn } from "@/lib/utils";

/** Light band with an infinite logo marquee. */
export function LogoRow({
  eyebrow,
  title,
  logos,
  duration = 45,
  reverse,
  compact,
  className,
}: {
  eyebrow?: string;
  title?: string;
  logos: Logo[];
  duration?: number;
  reverse?: boolean;
  compact?: boolean;
  className?: string;
}) {
  return (
    <section className={cn("bg-cream text-navy", compact ? "py-14" : "py-20 lg:py-24", className)}>
      {(eyebrow || title) && (
        <div className="container-x mb-12 flex flex-col items-center gap-4 text-center">
          {eyebrow && (
            <Reveal y={12} blur={false}>
              <span className="eyebrow text-orange">{eyebrow}</span>
            </Reveal>
          )}
          {title && (
            <Reveal delay={0.1}>
              <h2 className="display-md text-navy">{title}</h2>
            </Reveal>
          )}
        </div>
      )}
      <Reveal delay={0.15} y={20}>
        <Marquee duration={duration} reverse={reverse} gap="gap-6">
          {logos.map((l) => (
            <div
              key={l.src}
              className="group flex h-24 w-[200px] shrink-0 items-center justify-center rounded-2xl border border-navy/8 bg-white/70 px-6 transition-all duration-500 hover:-translate-y-1 hover:border-orange/40 hover:shadow-[0_20px_40px_-20px_rgba(255,122,47,0.5)]"
            >
              <Image
                src={l.src}
                alt={l.alt}
                width={l.width}
                height={l.height}
                className="h-auto max-h-12 w-auto max-w-[140px] object-contain grayscale transition-all duration-500 group-hover:grayscale-0"
                style={{ width: (l.displayWidth ?? 160) * 0.75 }}
              />
            </div>
          ))}
        </Marquee>
      </Reveal>
    </section>
  );
}
