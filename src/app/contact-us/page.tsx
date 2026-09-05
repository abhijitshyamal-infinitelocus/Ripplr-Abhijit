import type { Metadata } from "next";
import { contact } from "@/lib/content";
import { Hero } from "@/components/sections/Hero";
import { StatsBand } from "@/components/sections/StatsBand";
import { ContactCard } from "@/components/sections/ContactCard";
import { Visit } from "@/components/sections/contact/Visit";

export const metadata: Metadata = { title: contact.meta.title, description: contact.meta.description };

export default function ContactPage() {
  const h = contact.hero;
  return (
    <>
      <Hero eyebrow={h.eyebrow} headline={[{ t: h.headline }, { t: h.headlineAccent, accent: true }, { t: " " + h.headlineRest }]} subhead={h.subhead} primaryCta={h.primaryCta} art={h.art} />
      <StatsBand eyebrow={contact.stats.eyebrow} title={contact.stats.title} stats={contact.stats.items} />
      <ContactCard eyebrow={contact.enquiry.eyebrow} title={contact.enquiry.title} description={contact.enquiry.description} panel="contact" />
      <Visit />
    </>
  );
}
