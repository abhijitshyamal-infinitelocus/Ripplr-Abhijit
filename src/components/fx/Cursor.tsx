"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";

/** Custom pointer: a dot that grows into a ring over interactive elements. Desktop only. */
export function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 900, damping: 60, mass: 0.2 });
  const sy = useSpring(y, { stiffness: 900, damping: 60, mass: 0.2 });
  const [mode, setMode] = useState<"dot" | "link" | "media" | "hidden">("hidden");
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- pointer capability is only knowable after mount
    setEnabled(true);
    document.body.classList.add("has-cursor");

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target as HTMLElement | null;
      if (!t) return;
      if (t.closest("[data-cursor='media']")) setMode("media");
      else if (t.closest("a, button, [role='button'], input, textarea, select, label")) setMode("link");
      else setMode("dot");
    };
    const leave = () => setMode("hidden");
    const enter = () => setMode("dot");
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    document.documentElement.addEventListener("pointerenter", enter);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
      document.documentElement.removeEventListener("pointerenter", enter);
      document.body.classList.remove("has-cursor");
    };
  }, [x, y]);

  if (!enabled) return null;

  const size = mode === "media" ? 88 : mode === "link" ? 56 : 12;
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[9999] flex items-center justify-center rounded-full mix-blend-difference"
      style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%" }}
      animate={{
        width: size,
        height: size,
        opacity: mode === "hidden" ? 0 : 1,
        backgroundColor: mode === "dot" ? "#ffffff" : "rgba(255,255,255,0)",
        borderWidth: mode === "dot" ? 0 : 1.5,
      }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
    >
      <motion.div
        className="rounded-full border-white"
        style={{ borderStyle: "solid", position: "absolute", inset: 0 }}
        animate={{ borderWidth: mode === "dot" ? 0 : 1.5 }}
      />
      <motion.span
        className="font-display text-[10px] font-semibold uppercase tracking-[0.2em] text-white"
        animate={{ opacity: mode === "media" ? 1 : 0, scale: mode === "media" ? 1 : 0.6 }}
      >
        Play
      </motion.span>
    </motion.div>
  );
}
