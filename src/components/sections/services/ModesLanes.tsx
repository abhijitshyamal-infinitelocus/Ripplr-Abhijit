import Image from "next/image";
import { logistics } from "@/lib/content";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { VideoArt } from "@/components/ui/VideoArt";
import { Icon } from "@/components/ui/Icon";
import { Stagger, StaggerItem } from "@/components/fx/Reveal";
import { cn } from "@/lib/utils";

const m = logistics.modes;
const l = logistics.lanes;
const p = logistics.pricing;

/** Modes of transport, road lane types, and pricing models on one light canvas. */
export function ModesLanes() {
  return (
    <section className="bg-paper py-24 text-navy lg:py-32">
      <div className="container-x">
        <SectionHeader eyebrow={m.eyebrow} title={m.title} tone="light" accent="cool" />
        <Stagger className="mt-14 grid gap-6 lg:grid-cols-2" stagger={0.15}>
          {m.items.map((it, i) => (
            <StaggerItem key={it.title}>
              <article className="group relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-navy via-navy-2 to-ink ring-1 ring-white/10">
                <VideoArt art={{ src: it.art, alt: it.title, video: it.video, videoMp4: it.videoMp4, width: 1200, height: 750 }} className="aspect-[16/10] transition-transform duration-1000 ease-out-expo group-hover:scale-[1.03]" rounded="rounded-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
                <span className={cn("absolute right-6 top-6 rounded-full px-3 py-1.5 text-xs font-semibold", i ? "bg-teal text-ink" : "bg-orange text-ink")}>{it.badge}</span>
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-8">
                  <div>
                    <h3 className="font-display text-4xl font-bold text-paper">{it.title}</h3>
                    <p className="mt-2 max-w-[36ch] text-paper/75">{it.body}</p>
                  </div>
                  <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl glass text-paper">
                    <Icon name={it.icon} className="h-6 w-6" />
                  </span>
                </div>
              </article>
            </StaggerItem>
          ))}
        </Stagger>

        <div className="mt-28">
          <SectionHeader eyebrow={l.eyebrow} title={l.title} tone="light" accent="cool" size="md" />
          <Stagger className="mt-12 grid gap-5 md:grid-cols-3" stagger={0.1}>
            {l.items.map((it) => (
              <StaggerItem key={it.title}>
                <article className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-navy/8 transition-all duration-700 ease-out-expo hover:-translate-y-2 hover:shadow-[0_40px_80px_-40px_rgba(78,164,155,0.5)]">
                  <VideoArt art={{ src: it.art, alt: it.title, video: it.video, videoMp4: it.videoMp4, width: 800, height: 500 }} play="hover" surface="light" className="aspect-[16/10]" rounded="rounded-none" sizes="(min-width:768px) 33vw, 100vw" />
                  <div className="flex flex-1 flex-col p-6">
                    <Image src={it.iconArt} alt="" width={40} height={40} className="h-10 w-10" />
                    <h3 className="mt-4 font-display text-xl font-bold">{it.title}</h3>
                    <p className="mt-2 text-[15px] text-navy/65">{it.body}</p>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </div>

        <div className="mt-28 grid gap-12 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-4">
            <SectionHeader eyebrow={p.eyebrow} title={p.title} description={p.description} tone="light" accent="cool" size="md" />
          </div>
          <Stagger className="grid gap-4 sm:grid-cols-3 lg:col-span-8" stagger={0.1}>
            {p.items.map((it) => (
              <StaggerItem key={it.title}>
                <div className="group relative h-full overflow-hidden rounded-3xl bg-navy p-7 text-paper transition-transform duration-700 ease-out-expo hover:-translate-y-2">
                  <span aria-hidden className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-teal/30 blur-2xl transition-transform duration-700 group-hover:scale-150" />
                  <Icon name={it.icon} className="relative h-7 w-7 text-teal-2" />
                  <div className="relative mt-8 font-display text-3xl font-bold tracking-tight">{it.unit}</div>
                  <h3 className="relative mt-1 font-display text-lg font-semibold text-paper/85">{it.title}</h3>
                  <p className="relative mt-3 text-sm text-paper/60">{it.body}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
