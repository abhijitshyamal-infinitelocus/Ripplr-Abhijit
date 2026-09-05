import type { Metadata } from "next";
import { about } from "@/lib/content";
import { Hero } from "@/components/sections/Hero";
import { Founders } from "@/components/sections/about/Founders";
import { MissionVision } from "@/components/sections/about/MissionVision";
import { Leadership } from "@/components/sections/about/Leadership";
import { Journey } from "@/components/sections/about/Journey";
import { NetworkSection } from "@/components/sections/NetworkSection";
import { Investors } from "@/components/sections/about/Investors";
import { CtaCard } from "@/components/sections/CtaCard";

export const metadata: Metadata = { title: about.meta.title, description: about.meta.description };

export default function AboutPage() {
  const h = about.hero;
  const n = about.network;
  return (
    <>
      <Hero
        eyebrow={h.eyebrow}
        headline={[{ t: h.headline }, { t: h.headlineAccent, accent: true }, { t: h.headlineRest }]}
        subhead={h.subhead}
        primaryCta={h.primaryCta}
        secondaryCta={h.secondaryCta}
        stats={h.stats}
        art={h.art}
        chips={h.floatingChips}
      />
      <Founders />
      <MissionVision />
      <Leadership />
      <Journey />
      <NetworkSection eyebrow={n.eyebrow} title={n.title} description={n.description} legend={n.legend} regions={n.regions} distributionCities={n.distributionCities} />
      <Investors />
      <CtaCard
        eyebrow={about.cta.eyebrow}
        titleParts={[{ t: about.cta.title }, { t: about.cta.titleAccent, accent: true }, { t: about.cta.titleRest }]}
        description={about.cta.description}
        primaryCta={about.cta.primaryCta}
        secondaryCta={about.cta.secondaryCta}
        art={about.cta.art}
      />
    </>
  );
}
