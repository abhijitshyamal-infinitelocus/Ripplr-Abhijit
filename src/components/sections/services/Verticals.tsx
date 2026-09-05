import { distribution } from "@/lib/content";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { VideoArt } from "@/components/ui/VideoArt";
import { Icon } from "@/components/ui/Icon";
import { Stagger, StaggerItem } from "@/components/fx/Reveal";
import { cn } from "@/lib/utils";

const c = distribution.categories;

export function Verticals() {
  return (
    <section className="bg-paper py-24 text-navy lg:py-32">
      <div className="container-x">
        <SectionHeader eyebrow={c.eyebrow} title={c.title} tone="light" />
        <Stagger className="mt-14 grid gap-6 lg:grid-cols-2" stagger={0.15}>
          {c.items.map((it, i) => (
            <StaggerItem key={it.title}>
              <article className="group relative overflow-hidden rounded-[2rem] bg-white ring-1 ring-navy/8 transition-all duration-700 ease-out-expo hover:-translate-y-2 hover:shadow-[0_40px_90px_-40px_rgba(22,57,78,0.5)]">
                <VideoArt art={{ src: it.art, alt: it.title, video: it.artVideo, videoMp4: it.artVideoMp4, width: 1200, height: 750 }} className="aspect-[16/10] transition-transform duration-1000 ease-out-expo group-hover:scale-[1.02]" rounded="rounded-none" surface="light" />
                <div className="absolute left-6 top-6 flex items-center gap-2 rounded-full bg-ink/80 px-3 py-1.5 text-xs font-semibold text-paper backdrop-blur">
                  <Icon name={it.icon} className={cn("h-3.5 w-3.5", i ? "text-teal" : "text-orange")} />
                  {it.badge}
                </div>
                <div className="p-8">
                  <h3 className="font-display text-3xl font-bold tracking-tight">
                    {it.title}
                    {"subtitle" in it && it.subtitle && <span className="ml-3 text-base font-medium text-navy/50">{it.subtitle}</span>}
                  </h3>
                  <p className="mt-3 text-lg text-navy/65">{it.body}</p>
                </div>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
