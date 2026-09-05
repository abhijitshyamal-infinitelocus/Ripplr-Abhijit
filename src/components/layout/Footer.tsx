import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { LinkedInIcon } from "@/components/ui/LinkedInIcon";
import { site } from "@/lib/content";
import { Reveal } from "@/components/fx/Reveal";
import { Marquee } from "@/components/fx/Marquee";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/8 bg-ink">
      <div className="pointer-events-none absolute -left-40 top-0 h-[520px] w-[520px] rounded-full bg-orange/12 blur-[140px]" aria-hidden />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-[420px] w-[420px] rounded-full bg-teal/12 blur-[140px]" aria-hidden />

      <div className="border-b border-white/8 py-5">
        <Marquee duration={30} gap="gap-8" pauseOnHover={false}>
          {["Distribution", "Logistics", "Warehousing", "Control Tower", "Cold Chain", "Technology", "New India"].map((w) => (
            <span key={w} className="flex items-center gap-8 font-display text-sm font-semibold uppercase tracking-[0.25em] text-paper/40">
              {w}
              <span className="h-1.5 w-1.5 rounded-full bg-orange" />
            </span>
          ))}
        </Marquee>
      </div>

      <div className="container-x relative grid gap-14 py-20 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <Image src="/brand/ripplr-wordmark-light.svg" alt="Ripplr" width={160} height={34} className="h-8 w-auto" />
          <p className="mt-6 max-w-[38ch] text-paper/60 leading-relaxed">{site.brand.tagline}</p>
          <a
            href={site.social.linkedin}
            target="_blank"
            rel="noreferrer"
            className="group mt-8 inline-flex items-center gap-3 font-display text-sm font-semibold text-paper"
          >
            <span className="grid h-10 w-10 place-items-center rounded-full border border-white/15 transition-colors group-hover:bg-paper group-hover:text-ink">
              <LinkedInIcon className="h-4 w-4" />
            </span>
            {site.social.label}
          </a>
        </Reveal>

        {site.footerColumns.map((col, i) => (
          <Reveal key={col.title} delay={0.1 * (i + 1)} className="lg:col-span-2">
            <h4 className="eyebrow text-orange">{col.title}</h4>
            <ul className="mt-6 space-y-3">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="group inline-flex items-center gap-1 text-paper/70 transition-colors hover:text-paper">
                    {l.label}
                    <ArrowUpRight className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        ))}

        <Reveal delay={0.3} className="lg:col-span-3">
          <h4 className="eyebrow text-teal">Head office</h4>
          <p className="mt-6 text-paper/70 leading-relaxed">
            {site.contact.headOffice.name}
            <br />
            {site.contact.headOffice.address}
          </p>
          <div className="mt-5 flex flex-col gap-2 text-sm">
            <a className="text-paper/70 hover:text-paper" href={`mailto:${site.contact.generalEnquiries}`}>
              {site.contact.generalEnquiries}
            </a>
            <a className="text-paper/70 hover:text-paper" href={`mailto:${site.contact.careers}`}>
              {site.contact.careers}
            </a>
          </div>
        </Reveal>
      </div>

      <div className="container-x relative flex flex-col items-start justify-between gap-4 border-t border-white/8 py-6 text-xs text-paper/45 sm:flex-row sm:items-center">
        <span>
          © {new Date().getFullYear()} {site.legal}
        </span>
        <span className="font-display uppercase tracking-[0.2em]">Bengaluru · India</span>
      </div>

      <div className="pointer-events-none select-none overflow-hidden" aria-hidden>
        <div className="container-x">
          <div className="font-display text-[clamp(5rem,20vw,19rem)] font-bold leading-[0.8] tracking-[-0.06em] text-white/[0.035] -mb-[0.16em]">
            ripplr
          </div>
        </div>
      </div>
    </footer>
  );
}
