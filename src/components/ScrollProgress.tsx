"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, type RefObject } from "react";

gsap.registerPlugin(ScrollTrigger);

export const ScrollProgress = ({
  colorClassName = "bg-primary-500",
  scope,
}: {
  colorClassName?: string;
  scope?: RefObject<HTMLElement | null>;
}) => {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    const tween = gsap.to(bar, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: scope?.current
        ? // Scoped progress: 0% when the element's top reaches the top of the
          // viewport, 100% when its bottom reaches the bottom.
          {
            trigger: scope.current,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
          }
        : // Document-wide progress: scroll position 0 to max scroll.
          {
            start: 0,
            end: "max",
            scrub: true,
            // Direct mapping — Lenis already smooths the scroll position, and
            // under reduced motion instant tracking is exactly what we want.
          },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [scope]);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-x-0 top-0 z-50 h-[3px] origin-left ${colorClassName}`}
      ref={barRef}
      // Collapsed in the SSR markup so the bar never flashes full-width
      // before the ScrollTrigger takes over.
      style={{ transform: "scaleX(0)" }}
    />
  );
};
