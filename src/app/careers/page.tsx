import type { Metadata } from "next";
import { careers } from "@/lib/content";
import { Hero } from "@/components/sections/Hero";
import { Perks } from "@/components/sections/careers/Perks";
import { OpenRoles } from "@/components/sections/careers/OpenRoles";
import { TalentPool } from "@/components/sections/careers/TalentPool";

export const metadata: Metadata = { title: careers.meta.title, description: careers.meta.description };

export default function CareersPage() {
  const h = careers.hero;
  return (
    <>
      <Hero eyebrow={h.eyebrow} headline={[{ t: h.headline }, { t: h.headlineAccent, accent: true }]} subhead={h.subhead} primaryCta={h.primaryCta} secondaryCta={h.secondaryCta} art={h.art} />
      <Perks />
      <OpenRoles />
      <TalentPool />
    </>
  );
}
