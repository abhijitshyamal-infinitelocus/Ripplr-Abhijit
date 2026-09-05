"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useEffect, useMemo, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  accent?: "warm" | "cool";
  className?: string;
  /** Number of drifting particles. */
  particles?: number;
  /** Pointer tilt strength in degrees. */
  tilt?: number;
};

/** Stage for transparent artwork: breathing glow, counter-rotating dashed orbits, drifting
 *  particles and a pointer-driven 3D tilt so the illustration reads as a floating object. */
export function Orbit({ children, accent = "warm", className, particles = 14, tilt = 8 }: Props) {
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 60, damping: 18 });
  const sy = useSpring(py, { stiffness: 60, damping: 18 });
  const rotateX = useTransform(sy, [0, 1], [tilt, -tilt]);
  const rotateY = useTransform(sx, [0, 1], [-tilt, tilt]);
  const glowX = useTransform(sx, [0, 1], ["35%", "65%"]);
  const glowY = useTransform(sy, [0, 1], ["35%", "65%"]);
  const a = accent === "warm" ? "255,122,47" : "78,164,155";
  const b = accent === "warm" ? "78,164,155" : "255,122,47";
  const glow = useTransform([glowX, glowY], ([x, y]) => `radial-gradient(closest-side at ${x} ${y}, rgba(${a},0.45), rgba(${b},0.18) 45%, transparent 75%)`);

  // Whole-window pointer so the art reacts even when the cursor is over the copy.
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      px.set(e.clientX / window.innerWidth);
      py.set(e.clientY / window.innerHeight);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [px, py]);

  const dots = useMemo(
    () =>
      Array.from({ length: particles }, (_, i) => {
        const r = 0.5 + ((i * 37) % 60) / 100;
        return {
          left: `${8 + ((i * 53) % 84)}%`,
          top: `${6 + ((i * 29) % 88)}%`,
          size: 2 + ((i * 7) % 5),
          dur: 9 + ((i * 13) % 11),
          delay: -((i * 3.7) % 9),
          drift: 14 + ((i * 11) % 30),
          warm: i % 3 !== 0,
          r,
        };
      }),
    [particles],
  );

  const onLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <div className={cn("relative isolate", className)} onMouseLeave={onLeave} style={{ perspective: 1400 }}>
      {/* breathing glow */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -inset-[12%] -z-10 rounded-full blur-2xl"
        style={{ background: glow }}
        animate={{ scale: [1, 1.08, 0.97, 1], opacity: [0.75, 1, 0.8, 0.75] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* orbit rings */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <motion.div
          className="absolute aspect-square w-[92%] rounded-full border border-dashed"
          style={{ borderColor: `rgba(${a},0.35)` }}
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        >
          <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full" style={{ background: `rgb(${a})`, boxShadow: `0 0 14px rgb(${a})` }} />
        </motion.div>
        <motion.div
          className="absolute aspect-square w-[70%] rounded-full border"
          style={{ borderColor: `rgba(${b},0.28)`, borderStyle: "dashed" }}
          animate={{ rotate: -360 }}
          transition={{ duration: 42, repeat: Infinity, ease: "linear" }}
        >
          <span className="absolute -bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full" style={{ background: `rgb(${b})`, boxShadow: `0 0 12px rgb(${b})` }} />
        </motion.div>
        <motion.div
          className="absolute aspect-square w-[118%] rounded-full border border-white/8"
          animate={{ rotate: 360, scale: [1, 1.03, 1] }}
          transition={{ rotate: { duration: 120, repeat: Infinity, ease: "linear" }, scale: { duration: 12, repeat: Infinity, ease: "easeInOut" } }}
        />
      </div>

      {/* particles */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-visible">
        {dots.map((d, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full"
            style={{ left: d.left, top: d.top, width: d.size, height: d.size, background: d.warm ? `rgba(${a},0.9)` : `rgba(${b},0.9)`, boxShadow: `0 0 ${d.size * 3}px rgba(${d.warm ? a : b},0.8)` }}
            animate={{ y: [0, -d.drift, 0, d.drift * 0.6, 0], x: [0, d.drift * 0.4, -d.drift * 0.3, 0], opacity: [0.2, 1, 0.5, 0.9, 0.2] }}
            transition={{ duration: d.dur, delay: d.delay, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      {/* tilted art */}
      <motion.div style={{ rotateX, rotateY, transformStyle: "preserve-3d" }} className="relative will-change-transform">
        <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}>
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
}
