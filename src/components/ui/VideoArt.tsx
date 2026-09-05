"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import type { Art } from "@/lib/content";

type Props = {
  art: Art;
  className?: string;
  /** Kept for call-site compatibility; images animate on hover either way. */
  play?: "auto" | "hover";
  priority?: boolean;
  sizes?: string;
  rounded?: string;
  /** Glow colour that hugs the artwork silhouette. */
  accent?: "warm" | "cool";
  /** "light" swaps the deep drop-shadow for a soft navy one (for cream/white cards). */
  surface?: "dark" | "light";
};

/** Animated illustration stage. The artwork is a keyed, transparent poster: it springs in with a
 *  blur, floats and sways continuously, breathes a silhouette-hugging glow, and lifts on hover. */
export function VideoArt({ art, className, priority, sizes = "(min-width:1024px) 50vw, 100vw", rounded = "rounded-3xl", accent = "warm", surface = "dark" }: Props) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={cn("group/art relative overflow-visible", rounded, className)}
      initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.82, y: 40, rotate: -3, filter: "blur(14px)" }}
      whileInView={{ opacity: 1, scale: 1, y: 0, rotate: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ type: "spring", stiffness: 70, damping: 16, mass: 1.1 }}
      whileHover={reduce ? undefined : { scale: 1.04 }}
    >
      <motion.div
        className="h-full w-full"
        animate={reduce ? undefined : { y: [0, -10, 0, 8, 0], rotate: [0, 0.8, 0, -0.8, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image
          src={art.src}
          alt={art.alt}
          width={art.width ?? 1600}
          height={art.height ?? 900}
          priority={priority}
          sizes={sizes}
          className={cn("h-full w-full object-contain transition-[filter] duration-700", surface === "light" ? "art-glow-light" : "art-glow", accent === "cool" && "art-glow-cool")}
        />
      </motion.div>
    </motion.div>
  );
}
