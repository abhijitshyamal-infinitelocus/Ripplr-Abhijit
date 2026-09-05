"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { Art } from "@/lib/content";

type Props = {
  art: Art;
  className?: string;
  /** "auto" plays when in view; "hover" plays while hovered. */
  play?: "auto" | "hover";
  priority?: boolean;
  sizes?: string;
  rounded?: string;
};

/** Poster image that swaps to its looping video when in view (or on hover). */
export function VideoArt({ art, className, play = "auto", priority, sizes = "(min-width:1024px) 50vw, 100vw", rounded = "rounded-3xl" }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [hover, setHover] = useState(false);
  const hasVideo = Boolean(art.video || art.videoMp4);

  useEffect(() => {
    if (!hasVideo || play !== "auto") return;
    const v = ref.current;
    const el = wrap.current;
    if (!v || !el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasVideo, play]);

  useEffect(() => {
    if (play !== "hover" || !ref.current) return;
    if (hover) ref.current.play().catch(() => {});
    else {
      ref.current.pause();
      ref.current.currentTime = 0;
    }
  }, [hover, play]);

  return (
    <div
      ref={wrap}
      className={cn("relative overflow-hidden", rounded, className)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      data-cursor={hasVideo && play === "hover" ? "media" : undefined}
    >
      <Image
        src={art.src}
        alt={art.alt}
        width={art.width ?? 1600}
        height={art.height ?? 900}
        priority={priority}
        sizes={sizes}
        className={cn("h-full w-full object-cover transition-opacity duration-700", ready && (play === "auto" || hover) ? "opacity-0" : "opacity-100")}
      />
      {hasVideo && (
        <video
          ref={ref}
          muted
          loop
          playsInline
          preload={play === "auto" ? "metadata" : "none"}
          onCanPlay={() => setReady(true)}
          className="absolute inset-0 h-full w-full object-cover"
          aria-hidden
        >
          {art.video && <source src={art.video} type="video/webm" />}
          {art.videoMp4 && <source src={art.videoMp4} type="video/mp4" />}
        </video>
      )}
    </div>
  );
}
