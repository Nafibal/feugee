"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

import type { Work } from "@/payload-types";

import { AutoVideo } from "@/components/AutoVideo";
import { toCardWork, type CardWork } from "@/components/work";

import { clipInsetsFor, formatClipPath, type Rect } from "./captionClip";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export interface SelectedWorkItem extends CardWork {
  shortDescription: string | null;
}

// The card guards (published, populated, usable Thumbnail) live in
// toCardWork; this adds only what the Pinned Caption displays.
const toSelectedWorkItem = (work: number | Work): SelectedWorkItem | null => {
  if (typeof work !== "object") return null;
  const card = toCardWork(work);
  if (card === null) return null;

  return {
    ...card,
    shortDescription: work.shortDescription ?? null,
  };
};

const toRect = (rect: DOMRect): Rect => ({
  top: rect.top,
  right: rect.right,
  bottom: rect.bottom,
  left: rect.left,
});

const SelectedWorkCard = ({ item }: { item: SelectedWorkItem }) => (
  <Link
    className="relative block"
    data-work-card
    href={`/works/${item.slug}`}
  >
    {item.thumbnail.kind === "video" ? (
      <AutoVideo
        alt={item.thumbnail.alt}
        className="h-svh w-full object-cover"
        height={item.thumbnail.height}
        poster={item.thumbnail.posterUrl}
        src={item.thumbnail.url}
        width={item.thumbnail.width}
      />
    ) : (
      <Image
        alt={item.thumbnail.alt}
        className="h-svh w-full object-cover"
        height={item.thumbnail.height}
        src={item.thumbnail.url}
        width={item.thumbnail.width}
      />
    )}
    {/* The static caption is the readable fallback: the accessible text,
        the no-JS state, and what reduced-motion visitors see. Its gradient
        stays on the media once the text steps aside for the Pinned
        Caption. */}
    <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-start justify-end gap-2 bg-linear-to-t from-black/80 via-black/30 to-transparent p-6 md:flex-row md:items-center md:justify-between md:p-16">
      <h3
        className="text-3xl font-medium text-white md:text-5xl"
        data-static-caption
      >
        {item.title}
      </h3>
      {item.shortDescription && (
        <p className="text-base text-white md:text-lg" data-static-caption>
          {item.shortDescription}
        </p>
      )}
    </div>
  </Link>
);

export const SelectedWorksSection = ({
  works,
}: {
  works: readonly (number | Work)[] | null | undefined;
}) => {
  const scopeRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const items = (works ?? []).flatMap((work) => {
    const item = toSelectedWorkItem(work);
    return item ? [item] : [];
  });

  // useGSAP runs before paint, so the overlay never flashes unclipped and
  // never doubles up with the static captions. The raw works prop is the
  // dep — stable identity across re-renders — and revertOnUpdate rebuilds
  // when Live Preview edits swap the Works out.
  useGSAP(
    () => {
      const scope = scopeRef.current;
      const list = listRef.current;
      const layer = scope?.querySelector<HTMLElement>("[data-pinned-layer]");
      if (!scope || !list || !layer || items.length === 0) return;

      // Reduced motion — and, by never running this, no-JS — keeps the
      // static in-card captions: the readable end state.
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      const cards = gsap.utils.toArray<HTMLElement>("[data-work-card]", list);
      const captions = gsap.utils.toArray<HTMLElement>(
        "[data-pinned-caption]",
        layer,
      );
      const staticCaptions = gsap.utils.toArray<HTMLElement>(
        "[data-static-caption]",
        scope,
      );

      gsap.set(captions, { clipPath: "inset(0 0 100% 0)" });
      gsap.set(staticCaptions, { opacity: 0 });
      layer.classList.remove("hidden");

      // Pure geometry: each caption shows exactly where its Work overlaps
      // the fixed caption zone, so the seam between two Works sweeps
      // through the caption and the content hands off mid-letter.
      const applyClips = () => {
        const zone = toRect(layer.getBoundingClientRect());
        cards.forEach((card, index) => {
          const caption = captions[index];
          if (!caption) return;
          caption.style.clipPath = formatClipPath(
            clipInsetsFor(zone, toRect(card.getBoundingClientRect())),
          );
        });
      };
      applyClips();

      ScrollTrigger.create({
        trigger: list,
        start: "top bottom",
        end: "bottom top",
        onUpdate: applyClips,
        onRefresh: applyClips,
      });
    },
    {
      scope: scopeRef,
      dependencies: [works],
      revertOnUpdate: true,
    },
  );

  if (items.length === 0) return null;

  return (
    <section aria-label="Selected works" className="pt-32" ref={scopeRef}>
      <h2 className="px-6 text-center text-4xl font-bold uppercase tracking-tight text-neutral-50 md:px-16 md:text-5xl">
        Selected Works
      </h2>
      <div className="mt-12 flex flex-col gap-1 md:mt-16" ref={listRef}>
        {items.map((item) => (
          <SelectedWorkCard item={item} key={item.id} />
        ))}
      </div>

      {/* The Pinned Caption layer: one caption per Work at the same fixed
          spot, each clipped to its Work's bounds. It ships display:none so
          no-JS never sees it (the grid lives on a child, so unhiding never
          fights the hidden utility); aria-hidden because the static
          captions remain the accessible text. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-30 hidden"
        data-pinned-layer
      >
        <div className="grid">
          {items.map((item) => (
            <div
              className="col-start-1 row-start-1 flex flex-col items-start justify-end gap-2 p-6 md:flex-row md:items-center md:justify-between md:p-16"
              data-pinned-caption
              key={item.id}
            >
              <h3 className="text-3xl font-medium text-white md:text-5xl">
                {item.title}
              </h3>
              {item.shortDescription && (
                <p className="text-base text-white md:text-lg">
                  {item.shortDescription}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
