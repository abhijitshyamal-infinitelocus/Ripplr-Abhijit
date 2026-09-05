import { home } from "@/lib/content";
import { Hero } from "@/components/sections/Hero";
import { LogoRow } from "@/components/sections/LogoRow";
import { ServicesShowcase } from "@/components/sections/ServicesShowcase";
import { StatsBand } from "@/components/sections/StatsBand";
import { NewsGrid } from "@/components/sections/NewsGrid";
import { ContactCard } from "@/components/sections/ContactCard";

export default function HomePage() {
  const h = home.hero;
  return (
    <>
      <Hero
        eyebrow={h.eyebrow}
        headline={[{ t: h.headline }, { t: h.headlineAccent, accent: true }]}
        subhead={h.subhead}
        primaryCta={h.primaryCta}
        secondaryCta={h.secondaryCta}
        stats={h.stats}
        art={h.illustration}
        artStyle="logo"
        chips={h.floatingChips}
      />
      <LogoRow eyebrow={home.brands.eyebrow} title={home.brands.title} logos={home.brands.logos} duration={home.brands.marquee.durationSeconds} />
      <ServicesShowcase />
      <StatsBand eyebrow={home.performance.eyebrow} title={home.performance.title} stats={home.performance.stats} tone="dark" />
      <NewsGrid />
      <ContactCard eyebrow={home.connect.eyebrow} title={home.connect.title} description={home.connect.description} panel="home" />
    </>
  );
}
