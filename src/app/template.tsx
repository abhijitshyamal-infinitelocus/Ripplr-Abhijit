"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

/** Route transition: every page slides up through a soft curtain. */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[200] origin-top bg-orange"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 0.05 }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[199] origin-top bg-ink-2"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 0.15 }}
      />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
      >
        {children}
      </motion.div>
    </>
  );
}
