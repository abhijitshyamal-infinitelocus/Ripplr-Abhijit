"use client";

import { AnimatePresence, animate, motion } from "motion/react";
import { useEffect, useState } from "react";

let started = false;

/** Once-per-session intro: counts to 100 under the mark, then the curtain lifts. */
export function Preloader() {
  const [show, setShow] = useState(false);
  const [n, setN] = useState(0);

  useEffect(() => {
    // Module flag guards against React's dev-mode double effect run.
    if (started || sessionStorage.getItem("ripplr:intro")) return;
    started = true;
    sessionStorage.setItem("ripplr:intro", "1");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-off mount sync with sessionStorage
    setShow(true);
    document.documentElement.style.overflow = "hidden";
    animate(0, 100, {
      duration: 1.6,
      ease: [0.76, 0, 0.24, 1],
      onUpdate: (v) => setN(Math.round(v)),
      onComplete: () => {
        setTimeout(() => {
          setShow(false);
          document.documentElement.style.overflow = "";
        }, 250);
      },
    });
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[10000] flex items-end bg-ink"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="container-x flex w-full items-end justify-between pb-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-4"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/ripplr-mark-light.svg" alt="" className="h-10 w-10 animate-spin-slow" />
              <span className="eyebrow text-paper/60">Distribution &amp; Logistics for New India</span>
            </motion.div>
            <div className="font-display text-[clamp(4rem,14vw,11rem)] font-bold leading-none tabular-nums text-paper">
              {n}
            </div>
          </div>
          <motion.div
            className="absolute bottom-0 left-0 h-[2px] bg-orange"
            initial={{ width: "0%" }}
            animate={{ width: `${n}%` }}
            transition={{ ease: "linear", duration: 0.05 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
