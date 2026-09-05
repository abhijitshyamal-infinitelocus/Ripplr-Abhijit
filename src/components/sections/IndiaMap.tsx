"use client";

import { geoMercator, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import { motion, useInView } from "motion/react";
import { useMemo, useRef, useState } from "react";
import topology from "../../../content/india-map.json";
import { CITY_COORDS } from "@/lib/cities";
import { cn } from "@/lib/utils";

const W = 720;
const H = 780;

type Pin = { city: string; color: string };

/** SVG India: states draw themselves in on scroll, then network pins ripple out. */
export function IndiaMap({ pins, highlight, className }: { pins: Pin[]; highlight?: string | null; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const [hovered, setHovered] = useState<string | null>(null);

  const { paths, project } = useMemo(() => {
    const topo = topology as unknown as Topology;
    const states = feature(topo, topo.objects.states as GeometryCollection);
    const projection = geoMercator().fitExtent([[20, 20], [W - 20, H - 20]], states);
    const path = geoPath(projection);
    return {
      paths: states.features.map((f) => ({ d: path(f) ?? "", name: (f.properties as { name: string }).name })),
      project: (lat: number, lng: number) => projection([lng, lat]) ?? [0, 0],
    };
  }, []);

  // Dedupe cities keeping the first color assigned.
  const uniquePins = useMemo(() => {
    const seen = new Map<string, Pin>();
    for (const p of pins) if (!seen.has(p.city)) seen.set(p.city, p);
    return [...seen.values()].filter((p) => CITY_COORDS[p.city]);
  }, [pins]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full overflow-visible" role="img" aria-label="Map of Ripplr's network across India">
        <defs>
          <radialGradient id="map-fill" cx="50%" cy="40%" r="70%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.09)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.02)" />
          </radialGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g>
          {paths.map((p, i) => (
            <motion.path
              key={p.name + i}
              d={p.d}
              fill="url(#map-fill)"
              stroke="rgba(255,255,255,0.35)"
              strokeWidth={0.8}
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={inView ? { pathLength: 1, opacity: 1 } : {}}
              transition={{ pathLength: { duration: 2, delay: 0.15 + i * 0.03, ease: [0.16, 1, 0.3, 1] }, opacity: { duration: 0.6, delay: 0.15 + i * 0.03 } }}
              className="transition-[fill] duration-500 hover:[fill:rgba(255,255,255,0.14)]"
            />
          ))}
        </g>

        {/* connection arcs from Bengaluru HQ */}
        <g fill="none" strokeWidth={0.9} strokeDasharray="3 5" opacity={0.5}>
          {uniquePins
            .filter((p) => p.city !== "Bengaluru")
            .map((p, i) => {
              const [x1, y1] = project(...CITY_COORDS.Bengaluru);
              const [x2, y2] = project(...CITY_COORDS[p.city]);
              const mx = (x1 + x2) / 2;
              const my = (y1 + y2) / 2 - Math.hypot(x2 - x1, y2 - y1) * 0.18;
              return (
                <motion.path
                  key={p.city}
                  d={`M${x1},${y1} Q${mx},${my} ${x2},${y2}`}
                  stroke={p.color}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={inView ? { pathLength: 1, opacity: 0.55 } : {}}
                  transition={{ duration: 1.6, delay: 1.4 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                />
              );
            })}
        </g>

        <g>
          {uniquePins.map((p, i) => {
            const [x, y] = project(...CITY_COORDS[p.city]);
            const hq = p.city === "Bengaluru";
            const active = hovered === p.city || (highlight && highlight === p.city);
            return (
              <motion.g
                key={p.city}
                initial={{ opacity: 0, scale: 0 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 1.2 + i * 0.06, type: "spring", stiffness: 300, damping: 18 }}
                style={{ transformOrigin: `${x}px ${y}px` }}
                onMouseEnter={() => setHovered(p.city)}
                onMouseLeave={() => setHovered(null)}
                className="cursor-pointer"
              >
                <circle cx={x} cy={y} r={hq ? 14 : 9} fill={p.color} opacity={0.25} className="animate-pulse-ring" style={{ transformOrigin: `${x}px ${y}px`, animationDelay: `${i * 0.2}s` }} />
                <circle cx={x} cy={y} r={hq ? 5 : 3.5} fill={p.color} filter="url(#glow)" />
                <circle cx={x} cy={y} r={hq ? 2 : 1.4} fill="#fff" />
                <motion.g animate={{ opacity: active || hq ? 1 : 0, y: active || hq ? 0 : 4 }} transition={{ duration: 0.3 }}>
                  <rect x={x + 9} y={y - 11} rx={6} width={p.city.length * 6.6 + 16} height={20} fill="rgba(7,16,25,0.9)" stroke={p.color} strokeWidth={0.8} />
                  <text x={x + 17} y={y + 3} fontSize={11} fontWeight={600} fill="#fff" fontFamily="var(--font-display)">
                    {p.city}
                  </text>
                </motion.g>
              </motion.g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
