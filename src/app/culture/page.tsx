import type { Metadata } from "next";
import { culture } from "@/lib/content";
import { CultureHero } from "@/components/sections/culture/CultureHero";
import { Moments } from "@/components/sections/culture/Moments";
import { Voices } from "@/components/sections/culture/Voices";
import { CtaCard } from "@/components/sections/CtaCard";

export const metadata: Metadata = { title: culture.meta.title, description: culture.meta.description };

export default function CulturePage() {
  return (
    <>
      <CultureHero />
      <Moments />
      <Voices />
      <CtaCard eyebrow={culture.cta.eyebrow} titleParts={[{ t: "Join us on our " }, { t: "Journey", accent: true }]} description={culture.cta.description} primaryCta={culture.cta.primaryCta} secondaryCta={culture.cta.secondaryCta} art={culture.cta.art} />
    </>
  );
}
