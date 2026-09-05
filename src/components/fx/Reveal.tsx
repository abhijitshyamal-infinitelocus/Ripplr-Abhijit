"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  delay?: number;
  y?: number;
  x?: number;
  scale?: number;
  blur?: boolean;
  once?: boolean;
  amount?: number;
  className?: string;
  as?: "div" | "section" | "li" | "span" | "article";
};

/** Fades + lifts children into view when scrolled to. */
export function Reveal({
  children,
  delay = 0,
  y = 40,
  x = 0,
  scale = 1,
  blur = true,
  once = true,
  amount = 0.25,
  className,
  as = "div",
}: Props) {
  const reduce = useReducedMotion();
  const Comp = motion[as];
  const variants: Variants = {
    hidden: reduce
      ? { opacity: 0 }
      : { opacity: 0, y, x, scale, filter: blur ? "blur(10px)" : "blur(0px)" },
    show: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: 1, delay, ease: [0.16, 1, 0.3, 1] },
    },
  };
  return (
    <Comp
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      variants={variants}
    >
      {children}
    </Comp>
  );
}

/** Staggers direct children reveals. Wrap items in <Reveal.Item>. */
export function Stagger({
  children,
  className,
  stagger = 0.08,
  delay = 0,
  amount = 0.2,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  amount?: number;
  as?: "div" | "ul" | "ol" | "section";
}) {
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
    >
      {children}
    </Comp>
  );
}

export function StaggerItem({
  children,
  className,
  y = 32,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  y?: number;
  as?: "div" | "li" | "article" | "span";
}) {
  const reduce = useReducedMotion();
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      variants={{
        hidden: reduce ? { opacity: 0 } : { opacity: 0, y, filter: "blur(8px)" },
        show: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
        },
      }}
    >
      {children}
    </Comp>
  );
}
