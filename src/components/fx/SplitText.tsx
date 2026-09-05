"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Segment = { text: string; className?: string };

type Props = {
  /** Plain string or segments (to style accent words). */
  text: string | Segment[];
  className?: string;
  delay?: number;
  stagger?: number;
  /** "words" slides each word up through a clip mask; "chars" flips letters in. */
  mode?: "words" | "chars";
  once?: boolean;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  trailing?: ReactNode;
};

export function SplitText({
  text,
  className,
  delay = 0,
  stagger = 0.045,
  mode = "words",
  once = true,
  as = "h2",
  trailing,
}: Props) {
  const reduce = useReducedMotion();
  const segments: Segment[] = typeof text === "string" ? [{ text }] : text;
  const Comp = motion[as];

  let index = 0;
  const nodes: ReactNode[] = [];
  segments.forEach((seg, si) => {
    const words = seg.text.split(/(\s+)/).filter((w) => w.length > 0);
    words.forEach((w, wi) => {
      if (/^\s+$/.test(w)) {
        nodes.push(<span key={`s-${si}-${wi}`}> </span>);
        return;
      }
      const units = mode === "chars" ? Array.from(w) : [w];
      nodes.push(
        <span
          key={`w-${si}-${wi}`}
          className="inline-block overflow-hidden align-bottom pb-[0.08em] -mb-[0.08em]"
        >
          {units.map((u, ui) => {
            const i = index++;
            return (
              <motion.span
                key={ui}
                // Gradient classes must sit on the transformed leaf: background-clip:text
                // on an ancestor is dropped once a child gets its own compositing layer.
                className={cn("inline-block will-change-transform", seg.className)}
                variants={{
                  hidden: reduce
                    ? { opacity: 0 }
                    : mode === "chars"
                      ? { y: "110%", rotateX: -80, opacity: 0 }
                      : { y: "115%", rotate: 4, opacity: 0 },
                  show: {
                    y: 0,
                    rotate: 0,
                    rotateX: 0,
                    opacity: 1,
                    transition: {
                      duration: mode === "chars" ? 0.7 : 0.95,
                      delay: delay + i * stagger,
                      ease: [0.16, 1, 0.3, 1],
                    },
                  },
                }}
                style={{ transformOrigin: "0% 100%" }}
              >
                {u}
              </motion.span>
            );
          })}
        </span>,
      );
    });
  });

  return (
    <Comp
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount: 0.4 }}
      aria-label={segments.map((s) => s.text).join("")}
    >
      {nodes}
      {trailing}
    </Comp>
  );
}
