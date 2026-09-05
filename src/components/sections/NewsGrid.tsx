import { ArrowUpRight } from "lucide-react";
import { home } from "@/lib/content";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Stagger, StaggerItem } from "@/components/fx/Reveal";
import { VideoArt } from "@/components/ui/VideoArt";
import { cn } from "@/lib/utils";

const u = home.updates;

/** Editorial news layout: one lead story, then a stacked list. Videos play on hover. */
export function NewsGrid() {
  const [lead, ...rest] = u.articles;
  return (
    <section className="relative bg-paper py-24 text-navy lg:py-32">
      <div className="container-x">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader eyebrow={u.eyebrow} title={u.title} description={u.description} tone="light" />
        </div>

        <Stagger className="mt-14 grid gap-6 lg:grid-cols-12" stagger={0.1}>
          <StaggerItem as="article" className="lg:col-span-7">
            <a href={lead.href} target="_blank" rel="noreferrer" className="group block h-full overflow-hidden rounded-[2rem] bg-white ring-1 ring-navy/8 transition-all duration-700 ease-out-expo hover:-translate-y-1 hover:shadow-[0_40px_80px_-40px_rgba(22,57,78,0.5)]">
              <VideoArt
                art={{ src: lead.image!, alt: lead.imageAlt, video: lead.video, videoMp4: lead.videoMp4, width: 1400, height: 900 }}
                play="hover"
                rounded="rounded-none"
                className="aspect-[16/9]"
                sizes="(min-width:1024px) 60vw, 100vw"
              />
              <div className="p-8">
                <span className="eyebrow text-orange">{lead.kicker}</span>
                <h3 className="mt-4 font-display text-2xl font-bold leading-tight tracking-tight sm:text-3xl">{lead.headline}</h3>
                <span className="mt-6 inline-flex items-center gap-2 font-display text-sm font-semibold">
                  {u.readMore}
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </span>
              </div>
            </a>
          </StaggerItem>

          <div className="flex flex-col gap-4 lg:col-span-5">
            {rest.map((a, i) => (
              <StaggerItem key={a.href} as="article">
                <a
                  href={a.href}
                  target="_blank"
                  rel="noreferrer"
                  className={cn("group flex gap-5 rounded-3xl bg-white p-4 ring-1 ring-navy/8 transition-all duration-700 ease-out-expo hover:-translate-y-1 hover:ring-orange/40", !a.image && "items-center")}
                >
                  {a.image ? (
                    <VideoArt
                      art={{ src: a.image, alt: a.imageAlt, video: a.video, videoMp4: a.videoMp4, width: 400, height: 300 }}
                      play="hover"
                      rounded="rounded-2xl"
                      className="aspect-[4/3] w-32 shrink-0 sm:w-40"
                      sizes="160px"
                    />
                  ) : (
                    <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-navy to-ink font-display text-lg font-bold text-orange">
                      0{i + 2}
                    </span>
                  )}
                  <div className="flex flex-col justify-center">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-orange">{a.kicker}</span>
                    <h3 className="mt-2 font-display text-base font-bold leading-snug tracking-tight sm:text-lg">{a.headline}</h3>
                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-navy/60 transition-colors group-hover:text-navy">
                      {u.readMore} <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </a>
              </StaggerItem>
            ))}
          </div>
        </Stagger>
      </div>
    </section>
  );
}
