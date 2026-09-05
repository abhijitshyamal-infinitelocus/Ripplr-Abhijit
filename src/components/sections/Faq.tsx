import { Reveal } from "@/components/fx/Reveal";
import { Accordion } from "@/components/ui/Accordion";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function Faq({ eyebrow, title, description, items }: { eyebrow: string; title: string; description: string; items: { q: string; a: string }[] }) {
  return (
    <section className="bg-paper py-24 text-navy lg:py-32">
      <div className="container-x grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHeader eyebrow={eyebrow} title={title} description={description} tone="light" />
        </div>
        <Reveal className="lg:col-span-7" delay={0.15}>
          <Accordion items={items} tone="light" />
        </Reveal>
      </div>
    </section>
  );
}
