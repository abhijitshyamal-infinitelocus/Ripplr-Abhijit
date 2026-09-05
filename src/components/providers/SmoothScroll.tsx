"use client";

import { ReactLenis, useLenis } from "lenis/react";
import type Lenis from "lenis";
import { useEffect, type ReactNode } from "react";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/** Exposes the instance on window so anchor handlers, devtools and tests can drive the smooth scroller. */
function ExposeLenis() {
  const lenis = useLenis();
  useEffect(() => {
    window.__lenis = lenis ?? undefined;
    return () => {
      window.__lenis = undefined;
    };
  }, [lenis]);
  return null;
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.085,
        duration: 1.2,
        smoothWheel: true,
        wheelMultiplier: 0.95,
        touchMultiplier: 1.4,
        anchors: { offset: -96 },
      }}
    >
      <ExposeLenis />
      {children}
    </ReactLenis>
  );
}
