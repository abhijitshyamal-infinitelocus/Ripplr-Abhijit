import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Infinite horizontal loop. Children are duplicated; pauses on hover. */
export function Marquee({
  children,
  duration = 40,
  reverse = false,
  className,
  pauseOnHover = true,
  gap = "gap-10",
}: {
  children: ReactNode;
  duration?: number;
  reverse?: boolean;
  className?: string;
  pauseOnHover?: boolean;
  gap?: string;
}) {
  return (
    <div className={cn("marquee-mask overflow-hidden", className)}>
      <div
        className={cn(
          "flex w-max animate-marquee will-change-transform",
          gap,
          pauseOnHover && "hover:[animation-play-state:paused]",
        )}
        style={{
          ["--marquee-duration" as string]: `${duration}s`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        <div className={cn("flex shrink-0 items-center", gap)}>{children}</div>
        <div className={cn("flex shrink-0 items-center", gap)} aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
