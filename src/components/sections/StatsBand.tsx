import { Counter } from "@/components/fx/Counter";
import { Stagger, StaggerItem } from "@/components/fx/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { Stat } from "@/lib/content";
import { cn } from "@/lib/utils";

/** Big numbers on a light band; each counts up on entry. */
export function StatsBand({
  eyebrow,
  title,
  stats,
  tone = "light",
  accent = "warm",
}: {
  eyebrow: string;
  title: string;
  stats: Stat[];
  tone?: "light" | "dark";
  accent?: "warm" | "cool";
}) {
  const light = tone === "light";
  return (
    <section className={cn("relative overflow-hidden py-24 lg:py-32", light ? "bg-paper text-navy" : "bg-ink-2 text-paper")}>
      <div aria-hidden className={cn("absolute inset-0", light ? "grid-lines-dark" : "grid-lines")} />
      <div className="container-x relative">
        <SectionHeader eyebrow={eyebrow} title={title} tone={light ? "light" : "dark"} accent={accent} align="center" />
        <Stagger className={cn("mt-16 grid gap-6", stats.length === 5 ? "grid-cols-2 lg:grid-cols-5" : stats.length === 3 ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-2 lg:grid-cols-4")} stagger={0.1}>
          {stats.map((s, i) => (
            <StaggerItem key={s.label} className="group relative">
              <div className={cn("relative h-full overflow-hidden rounded-3xl p-6 transition-transform duration-700 ease-out-expo hover:-translate-y-2 sm:p-8", light ? "bg-cream shadow-[0_20px_60px_-30px_rgba(22,57,78,0.35)]" : "glass")}>
                <span
                  aria-hidden
                  className={cn("absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity duration-700 group-hover:opacity-100", i % 2 ? "bg-teal/40" : "bg-orange/40")}
                />
                <Counter value={s.value} className={cn("relative block font-display text-4xl font-bold tracking-tighter sm:text-5xl", i % 2 ? "text-gradient-cool" : "text-gradient-warm")} />
                <span className={cn("relative mt-3 block text-sm leading-snug", light ? "text-navy/60" : "text-paper/60")}>{s.label}</span>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
