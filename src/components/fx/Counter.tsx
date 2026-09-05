"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { formatNumber, parseStat } from "@/lib/utils";

/** Renders a stat like "230k+" and counts the numeric part up when scrolled into view. */
export function Counter({
  value,
  className,
  duration = 2,
}: {
  value: string;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduce = useReducedMotion();
  const parsed = parseStat(value);

  useEffect(() => {
    if (!inView || !parsed || !ref.current) return;
    const el = ref.current;
    if (reduce) {
      el.textContent = formatNumber(parsed.target, parsed.decimals, parsed.useCommas);
      return;
    }
    const controls = animate(0, parsed.target, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        el.textContent = formatNumber(v, parsed.decimals, parsed.useCommas);
      },
    });
    return () => controls.stop();
  }, [inView, parsed, reduce, duration]);

  if (!parsed) return <span className={className}>{value}</span>;
  return (
    <span className={className}>
      {parsed.prefix}
      <span ref={ref} className="tabular-nums">
        {formatNumber(0, parsed.decimals, parsed.useCommas)}
      </span>
      {parsed.suffix}
    </span>
  );
}
