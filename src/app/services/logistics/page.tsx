import type { Metadata } from "next";
import { logistics } from "@/lib/content";
import { Hero } from "@/components/sections/Hero";
import { StatsBand } from "@/components/sections/StatsBand";
import { Specialisms } from "@/components/sections/services/Specialisms";
import { ModesLanes } from "@/components/sections/services/ModesLanes";
import { NetworkSection } from "@/components/sections/NetworkSection";
import { LogoRow } from "@/components/sections/LogoRow";
import { Faq } from "@/components/sections/Faq";
import { CtaCard } from "@/components/sections/CtaCard";

export const metadata: Metadata = { title: logistics.meta.title, description: logistics.meta.description };

export default function LogisticsPage() {
  const l = logistics;
  const n = l.network;
  return (
    <>
      <Hero eyebrow={l.hero.eyebrow} headline={l.hero.headlineParts} subhead={l.hero.subhead} primaryCta={l.hero.primaryCta} secondaryCta={l.hero.secondaryCta} art={l.hero.art} accent="cool" />
      <StatsBand eyebrow={l.stats.eyebrow} title={l.stats.title} stats={l.stats.items} accent="cool" />
      <Specialisms />
      <StatsBand eyebrow={l.warehousingStats.eyebrow} title={l.warehousingStats.title} stats={l.warehousingStats.items} tone="dark" accent="cool" />
      <ModesLanes />
      <NetworkSection eyebrow={n.eyebrow} title={n.title} description={n.description} legend={n.legend} regions={n.regions} tabs={n.tabs} />
      {l.clientRows.map((r, i) => (
        <LogoRow key={r.title} eyebrow={r.eyebrow} title={r.title} logos={r.logos} reverse={i === 1} compact duration={r.logos.length < 5 ? 18 : 40} className={i === 1 ? "pt-0" : undefined} />
      ))}
      <Faq {...l.faqs} />
      <CtaCard eyebrow={l.cta.eyebrow} titleParts={l.cta.titleParts} description={l.cta.description} primaryCta={l.cta.primaryCta} secondaryCta={l.cta.secondaryCta} art={l.cta.art} />
    </>
  );
}
