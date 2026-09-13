"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export const ScrollProgress = () => {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    const tween = gsap.to(bar, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        // Document-wide progress: scroll position 0 to max scroll.
        start: 0,
        end: "max",
        // Direct mapping — Lenis already smooths the scroll position, and
        // under reduced motion instant tracking is exactly what we want.
        scrub: true,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[3px] origin-left bg-primary-500"
      ref={barRef}
      // Collapsed in the SSR markup so the bar never flashes full-width
      // before the ScrollTrigger takes over.
      style={{ transform: "scaleX(0)" }}
    />
  );
};
