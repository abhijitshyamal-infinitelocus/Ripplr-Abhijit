"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { useRef, type ReactNode } from "react";

/** Moves children vertically at a fraction of scroll speed while in view. */
export function Parallax({
  children,
  speed = 0.2,
  className,
}: {
  children: ReactNode;
  /** Positive drifts up as you scroll; negative drifts down. */
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [speed * 200, speed * -200]);
  return (
    <motion.div ref={ref} style={{ y: reduce ? 0 : y }} className={className}>
      {children}
    </motion.div>
  );
}
