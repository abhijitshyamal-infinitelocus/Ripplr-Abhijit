import { careers } from "@/lib/content";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Icon } from "@/components/ui/Icon";
import { Stagger, StaggerItem } from "@/components/fx/Reveal";
import { Tilt } from "@/components/fx/Tilt";
import { cn } from "@/lib/utils";

const p = careers.perks;

export function Perks() {
  return (
    <section className="relative overflow-hidden bg-paper py-24 text-navy lg:py-32">
      <div aria-hidden className="grid-lines-dark absolute inset-0" />
      <div className="container-x relative">
        <SectionHeader eyebrow={p.eyebrow} title={p.title} description={p.description} tone="light" align="center" />
        <Stagger className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
          {p.items.map((it, i) => (
            <StaggerItem key={it.title}>
              <Tilt max={7} className="group relative h-full overflow-hidden rounded-3xl bg-white p-8 ring-1 ring-navy/8 transition-shadow duration-700 hover:shadow-[0_40px_80px_-40px_rgba(22,57,78,0.45)]">
                <span aria-hidden className={cn("absolute -right-12 -top-12 h-40 w-40 rounded-full blur-3xl opacity-0 transition-opacity duration-700 group-hover:opacity-100", i % 2 ? "bg-teal/40" : "bg-orange/40")} />
                <span className={cn("relative grid h-14 w-14 place-items-center rounded-2xl text-ink transition-transform duration-700 ease-out-expo group-hover:-rotate-6 group-hover:scale-110", i % 2 ? "bg-teal" : "bg-orange")}>
                  <Icon name={it.icon} className="h-6 w-6" />
                </span>
                <h3 className="relative mt-7 font-display text-2xl font-bold">{it.title}</h3>
                <p className="relative mt-3 leading-relaxed text-navy/65">{it.body}</p>
              </Tilt>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
