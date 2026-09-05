import type { Metadata } from "next";
import { distribution } from "@/lib/content";
import { Hero } from "@/components/sections/Hero";
import { StatsBand } from "@/components/sections/StatsBand";
import { Workflow } from "@/components/sections/services/Workflow";
import { Verticals } from "@/components/sections/services/Verticals";
import { NetworkSection } from "@/components/sections/NetworkSection";
import { LogoRow } from "@/components/sections/LogoRow";
import { Faq } from "@/components/sections/Faq";
import { CtaCard } from "@/components/sections/CtaCard";

export const metadata: Metadata = { title: distribution.meta.title, description: distribution.meta.description };

export default function DistributionPage() {
  const d = distribution;
  const n = d.network;
  return (
    <>
      <Hero eyebrow={d.hero.eyebrow} headline={d.hero.headlineParts} subhead={d.hero.subhead} primaryCta={d.hero.primaryCta} secondaryCta={d.hero.secondaryCta} art={d.hero.art} />
      <StatsBand eyebrow={d.performance.eyebrow} title={d.performance.title} stats={d.performance.stats} />
      <Workflow />
      <Verticals />
      <NetworkSection eyebrow={n.eyebrow} title={n.title} description={n.description} legend={n.legend} regions={n.regions} tabs={n.tabs} />
      {d.brandRows.map((r, i) => (
        <LogoRow key={r.title} eyebrow={r.eyebrow} title={r.title} logos={r.logos} reverse={i === 1} compact className={i === 1 ? "pt-0" : undefined} />
      ))}
      <Faq {...d.faqs} />
      <CtaCard eyebrow={d.cta.eyebrow} titleParts={d.cta.titleParts} description={d.cta.description} primaryCta={d.cta.primaryCta} secondaryCta={d.cta.secondaryCta} art={d.cta.art} />
    </>
  );
}
