import Image from "next/image";
import { Download } from "lucide-react";
import { esg } from "@/lib/content";
import { Counter } from "@/components/fx/Counter";
import { Reveal, Stagger, StaggerItem } from "@/components/fx/Reveal";
import { SplitText } from "@/components/fx/SplitText";
import { cn } from "@/lib/utils";

const im = esg.impact;

/** Impact stats + two consolidation cards + methodology + downloadable documents. */
export function Impact() {
  return (
    <>
      <section className="relative overflow-hidden bg-paper py-24 text-navy lg:py-32">
        <div aria-hidden className="grid-lines-dark absolute inset-0" />
        <div className="container-x relative">
          <Reveal y={12} blur={false}>
            <span className="eyebrow text-teal">{im.kicker}</span>
          </Reveal>
          <SplitText as="h2" text={im.title} className="display-lg mt-5 max-w-[20ch] text-navy" />
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-[56ch] text-lg text-navy/65">{im.description}</p>
          </Reveal>

          <Stagger className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" stagger={0.1}>
            {im.stats.map((s, i) => (
              <StaggerItem key={s.label}>
                <div className={cn("group relative h-full overflow-hidden rounded-3xl p-7 transition-transform duration-700 ease-out-expo hover:-translate-y-2", i === 0 ? "bg-teal text-ink" : "bg-white ring-1 ring-navy/8")}>
                  <Counter value={s.value} className={cn("block font-display text-4xl font-bold tracking-tighter sm:text-5xl", i === 0 ? "text-ink" : "text-gradient-cool")} />
                  <span className={cn("mt-3 block text-sm leading-snug", i === 0 ? "text-ink/70" : "text-navy/60")}>{s.label}</span>
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          <Stagger className="mt-8 grid gap-5 lg:grid-cols-2" stagger={0.15}>
            {im.cards.map((c, i) => (
              <StaggerItem key={c.kicker}>
                <article className="relative h-full overflow-hidden rounded-[2rem] bg-navy p-8 text-paper lg:p-10">
                  <div aria-hidden className={cn("absolute -right-24 -top-24 h-64 w-64 rounded-full blur-[90px]", i ? "bg-orange/30" : "bg-teal/30")} />
                  <div aria-hidden className="grain absolute inset-0" />
                  <div className="relative">
                    <span className={cn("eyebrow", i ? "text-orange-2" : "text-teal-2")}>{c.kicker}</span>
                    <h3 className="mt-4 font-display text-2xl font-bold sm:text-3xl">{c.subtitle}</h3>
                    <ul className="mt-8 space-y-5">
                      {c.bullets.map((b, k) => (
                        <li key={k} className="flex gap-4 text-[15px] leading-relaxed text-paper/80">
                          <span className={cn("mt-2 h-2 w-2 shrink-0 rounded-full", i ? "bg-orange" : "bg-teal")} />
                          <span>
                            {b.map((seg, j) => (seg.b ? <strong key={j} className="font-display font-bold text-paper">{seg.t}</strong> : <span key={j}>{seg.t}</span>))}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal className="mt-10" delay={0.1}>
            <p className="max-w-4xl text-sm leading-relaxed text-navy/55">
              <strong className="font-semibold text-navy/80">{im.methodologyLabel}</strong> {im.methodology}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-ink py-24 lg:py-32">
        <div className="container-x">
          <Reveal>
            <h2 className="display-md text-paper">{esg.documents.title}</h2>
          </Reveal>
          <Stagger className="mt-10 grid gap-5 sm:grid-cols-2" stagger={0.12}>
            {esg.documents.items.map((d) => (
              <StaggerItem key={d.href}>
                <a href={d.href} download className="group flex items-center justify-between gap-6 rounded-3xl bg-ink-2 p-6 ring-1 ring-white/10 transition-all duration-500 hover:-translate-y-1 hover:ring-teal/50">
                  <span className="flex items-center gap-5">
                    <Image src={d.icon} alt="" width={48} height={48} className="h-12 w-12" />
                    <span className="font-display text-xl font-bold text-paper">{d.label}</span>
                  </span>
                  <span className="grid h-12 w-12 place-items-center rounded-full border border-white/15 text-paper transition-colors group-hover:bg-teal group-hover:text-ink">
                    <Download className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
                  </span>
                </a>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}
