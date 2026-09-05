"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { site } from "@/lib/content";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const ease = [0.16, 1, 0.3, 1] as const;

/** Glass header that hides on scroll-down, reveals on scroll-up; mega-dropdown for Services; full-screen mobile menu. */
export function Header() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState<string | null>(null);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 160 && !open);
    setScrolled(y > 24);
  });

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const allMobile = [...site.primaryNav.flatMap((n) => (n.children ? n.children : [n])), ...site.mobileNavExtra];

  return (
    <>
      <motion.header
        initial={false}
        animate={{ y: hidden ? -110 : 0 }}
        transition={{ duration: 0.6, ease }}
        className="fixed inset-x-0 top-0 z-[100]"
      >
        <div className="container-x pt-4">
          <div
            className={cn(
              "flex h-16 items-center justify-between rounded-full px-4 pl-5 transition-all duration-500",
              scrolled || open ? "border border-white/10 bg-ink/75 shadow-card backdrop-blur-xl" : "border border-transparent bg-transparent",
            )}
          >
            <Link href="/" className="relative flex items-center gap-2" aria-label="Ripplr home">
              <Image src="/brand/ripplr-wordmark-light.svg" alt="Ripplr" width={112} height={24} priority className="h-6 w-auto" />
            </Link>

            <nav className="hidden items-center gap-1 lg:flex" onMouseLeave={() => setHover(null)}>
              {site.primaryNav.map((item) => {
                const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href.split("/").slice(0, 2).join("/"));
                return (
                  <div key={item.label} className="relative" onMouseEnter={() => setHover(item.label)}>
                    <Link
                      href={item.href}
                      className={cn(
                        "relative flex items-center gap-1 rounded-full px-4 py-2 font-display text-sm font-medium transition-colors",
                        active ? "text-paper" : "text-paper/65 hover:text-paper",
                      )}
                    >
                      {hover === item.label && (
                        <motion.span layoutId="nav-hover" className="absolute inset-0 rounded-full bg-white/8" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                      )}
                      <span className="relative z-10">{item.label}</span>
                      {item.children && <ChevronDown className="relative z-10 h-3.5 w-3.5 opacity-70" />}
                      {active && <span className="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-orange" />}
                    </Link>
                    <AnimatePresence>
                      {item.children && hover === item.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.98 }}
                          transition={{ duration: 0.35, ease }}
                          className="absolute left-0 top-full pt-3"
                        >
                          <div className="glass w-[340px] overflow-hidden rounded-2xl p-2 shadow-card">
                            {item.children.map((c, i) => (
                              <Link
                                key={c.href}
                                href={c.href}
                                className="group flex items-start justify-between gap-4 rounded-xl px-4 py-3.5 transition-colors hover:bg-white/8"
                              >
                                <span>
                                  <span className="block font-display text-sm font-semibold text-paper">{c.label}</span>
                                  <span className="block text-xs text-paper/55">
                                    {i === 0 ? "Brand to shelf, tech-orchestrated" : "Mid-mile transport & warehousing"}
                                  </span>
                                </span>
                                <span className={cn("mt-1 h-2 w-2 rounded-full transition-transform group-hover:scale-150", i === 0 ? "bg-orange" : "bg-teal")} />
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
              <div className="hidden lg:block">
                <Button href={site.navCta.href} size="md" className="h-10 px-5 text-[13px]">
                  {site.navCta.label}
                </Button>
              </div>
              <button
                onClick={() => setOpen((v) => !v)}
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
                className="relative grid h-10 w-10 place-items-center rounded-full border border-white/12 lg:hidden"
              >
                <span className="relative block h-3 w-4">
                  <motion.span animate={open ? { rotate: 45, y: 5.5 } : { rotate: 0, y: 0 }} className="absolute left-0 top-0 h-[1.5px] w-full bg-paper" />
                  <motion.span animate={open ? { opacity: 0, x: 8 } : { opacity: 1, x: 0 }} className="absolute left-0 top-1/2 h-[1.5px] w-full -translate-y-1/2 bg-paper" />
                  <motion.span animate={open ? { rotate: -45, y: -5.5 } : { rotate: 0, y: 0 }} className="absolute bottom-0 left-0 h-[1.5px] w-full bg-paper" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile"
            initial={{ clipPath: "inset(0 0 100% 0 round 0 0 40px 40px)" }}
            animate={{ clipPath: "inset(0 0 0% 0 round 0 0 0px 0px)" }}
            exit={{ clipPath: "inset(0 0 100% 0 round 0 0 40px 40px)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[90] flex flex-col bg-ink-2 pt-28 lg:hidden"
          >
            <div className="grid-lines absolute inset-0 opacity-60" aria-hidden />
            <nav className="container-x relative flex flex-1 flex-col gap-1">
              {allMobile.map((n, i) => (
                <motion.div
                  key={n.href}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + i * 0.05, duration: 0.7, ease }}
                >
                  <Link
                    href={n.href}
                    onClick={() => setOpen(false)}
                    className="group flex items-baseline justify-between border-b border-white/8 py-4 font-display text-3xl font-bold tracking-tight text-paper"
                  >
                    {n.label}
                    <span className="text-xs tabular-nums text-orange">0{i + 1}</span>
                  </Link>
                </motion.div>
              ))}
            </nav>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="container-x relative flex items-center justify-between pb-10"
            >
              <a href={`mailto:${site.contact.generalEnquiries}`} className="text-sm text-paper/60">
                {site.contact.generalEnquiries}
              </a>
              <span onClick={() => setOpen(false)}>
                <Button href={site.navCta.href}>{site.navCta.label}</Button>
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
