"use client";

import { useEffect, useRef, useState } from "react";

export interface HeroSlide {
  id: string;
  url: string;
  posterUrl: string | null;
  alt: string;
}

const SLIDE_INTERVAL_MS = 8000;
const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

/**
 * The Hero's video slider: every slide mounted at once (only the active one
 * plays), a fixed-interval auto-advance, and a crossfade between slides — the
 * incoming slide fades in above the outgoing one, so the blend never dips to
 * the black section behind them. Nothing here is interactive: the videos and
 * the track are display-only.
 */
export const HeroSlider = ({ slides }: { slides: HeroSlide[] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    const mediaQuery = window.matchMedia(reducedMotionQuery);
    const sync = () => setReducedMotion(mediaQuery.matches);
    sync();
    mediaQuery.addEventListener("change", sync);
    return () => mediaQuery.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (reducedMotion || slides.length <= 1) return;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, SLIDE_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [reducedMotion, slides.length]);

  // Only the active slide plays; the rest sit paused on their poster frame.
  // Live Preview can shrink the slide list under the current index, so clamp.
  const safeActiveIndex = Math.min(activeIndex, slides.length - 1);

  useEffect(() => {
    if (reducedMotion) return;
    videoRefs.current.forEach((video, index) => {
      if (!video) return;
      // React sets `muted` as a property, not an attribute — some autoplay
      // policies check the attribute, so set the property here before play().
      video.muted = true;
      if (index === safeActiveIndex) {
        void video.play().catch(() => {
          // Autoplay refused (battery saver, cold start) — the poster
          // frame stays put, nothing to recover.
        });
      } else {
        video.pause();
      }
    });
  }, [reducedMotion, safeActiveIndex, slides]);

  return (
    <section
      aria-label="Featured videos"
      className="relative h-screen w-full overflow-hidden bg-neutral-950"
    >
      {slides.map((slide, index) => (
        <div
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === safeActiveIndex ? "z-10 opacity-100" : "z-0 opacity-0"
          }`}
          key={slide.id || index}
        >
          <video
            aria-label={slide.alt}
            className="pointer-events-none h-full w-full object-cover"
            loop
            muted
            playsInline
            poster={slide.posterUrl ?? undefined}
            preload={index === 0 ? "auto" : "none"}
            ref={(element) => {
              videoRefs.current[index] = element;
            }}
            src={slide.url}
          />
        </div>
      ))}
      {slides.length > 1 && (
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-12 left-16 z-20 flex items-center gap-2"
        >
          {slides.map((slide, index) => (
            <div
              className={
                index === safeActiveIndex
                  ? "h-[3px] w-16 bg-white"
                  : "h-[3px] w-6 bg-white/50"
              }
              key={slide.id || index}
            />
          ))}
        </div>
      )}
    </section>
  );
};
