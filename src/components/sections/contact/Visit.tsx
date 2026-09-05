import { contact } from "@/lib/content";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/fx/Reveal";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";

const v = contact.visit;

export function Visit() {
  return (
    <section className="bg-paper py-24 text-navy lg:py-32">
      <div className="container-x">
        <SectionHeader eyebrow={v.eyebrow} title={v.title} tone="light" />
        <div className="mt-14 grid gap-6 lg:grid-cols-12">
          <Reveal className="lg:col-span-7" scale={0.97}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] ring-1 ring-navy/10 lg:aspect-auto lg:h-full lg:min-h-[480px]">
              <iframe src={v.map.embedSrc} title={v.map.title} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="absolute inset-0 h-full w-full grayscale-[0.4] contrast-[1.05]" />
            </div>
          </Reveal>
          <Reveal className="lg:col-span-5" delay={0.15} x={30} y={0}>
            <div className="flex h-full flex-col rounded-[2rem] bg-navy p-8 text-paper lg:p-10">
              <span className="eyebrow text-orange-2">{v.office.eyebrow}</span>
              <h3 className="mt-4 font-display text-3xl font-bold">{v.office.name}</h3>
              <p className="mt-3 text-paper/70">
                {v.office.address.map((l) => (
                  <span key={l} className="block">{l}</span>
                ))}
              </p>
              <ul className="mt-8 flex-1 space-y-5">
                {v.office.rows.map((r) => (
                  <li key={r.label}>
                    <a href={r.href} target={r.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="group flex items-center gap-4">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/12 text-orange transition-colors group-hover:bg-orange group-hover:text-ink">
                        <Icon name={r.icon} className="h-4 w-4" />
                      </span>
                      <span>
                        <span className="block text-xs uppercase tracking-[0.18em] text-paper/45">{r.label}</span>
                        <span className="block font-medium text-paper">{r.value}</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Button href={v.office.cta.href} variant="light">{v.office.cta.label}</Button>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
