import type { Metadata } from "next";
import { esg } from "@/lib/content";
import { Hero } from "@/components/sections/Hero";
import { Impact } from "@/components/sections/esg/Impact";

export const metadata: Metadata = { title: esg.meta.title, description: esg.meta.description };

export default function EsgPage() {
  const h = esg.hero;
  return (
    <>
      <Hero eyebrow={h.eyebrow} headline={[{ t: h.title }, { t: h.titleAccent, accent: true }]} subhead={h.body} art={h.art} accent="cool" primaryCta={{ label: "Download ESH Policy", href: esg.documents.items[0].href }} />
      <Impact />
    </>
  );
}
