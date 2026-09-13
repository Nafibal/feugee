"use client";

import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import { ArrowRight } from "../ArrowRight";
import { AutoVideo } from "../AutoVideo";
import { ScrollProgress } from "../ScrollProgress";

export interface WorksListItem {
  id: number;
  slug: string;
  title: string;
  firstExpertise: string | null;
  sectorSlug: string | null;
  thumbnail:
    | {
        kind: "image";
        url: string;
        width: number;
        height: number;
        alt: string;
      }
    | {
        kind: "video";
        url: string;
        posterUrl: string | null;
        width: number;
        height: number;
        alt: string;
      };
}

export interface SectorOption {
  name: string;
  slug: string;
}

const desktopQuery = "(min-width: 768px)";
const hoverQuery = "(hover: hover)";

const subscribeMediaQuery =
  (query: string) =>
  (onChange: () => void): (() => void) => {
    const mediaQuery = window.matchMedia(query);
    mediaQuery.addEventListener("change", onChange);
    return () => mediaQuery.removeEventListener("change", onChange);
  };

const subscribeDesktop = subscribeMediaQuery(desktopQuery);
const getDesktopSnapshot = () => window.matchMedia(desktopQuery).matches;

const subscribeHover = subscribeMediaQuery(hoverQuery);
const getHoverSnapshot = () => window.matchMedia(hoverQuery).matches;

const getServerSnapshot = () => false;

/**
 * Row-major-ish masonry: each item joins the currently shorter column, so the
 * curated order still reads left-to-right while the columns stay balanced.
 * Column heights are compared as sums of aspect ratios (height / width), which
 * is exact for equal-width columns and needs no image-load wait.
 */
const balanceColumns = (items: WorksListItem[]): WorksListItem[][] => {
  const columns: { items: WorksListItem[]; height: number }[] = [
    { items: [], height: 0 },
    { items: [], height: 0 },
  ];

  for (const item of items) {
    const shortest =
      columns[0].height <= columns[1].height ? columns[0] : columns[1];
    shortest.items.push(item);
    shortest.height +=
      item.thumbnail.width > 0
        ? item.thumbnail.height / item.thumbnail.width
        : 1;
  }

  return columns.map((column) => column.items);
};

const WorkCard = ({
  item,
  dimmed,
  canHover,
  onHoverStart,
  onHoverEnd,
}: {
  item: WorksListItem;
  dimmed: boolean;
  canHover: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}) => (
  <Link
    className="group/card relative block"
    data-work-card
    href={`/works/${item.slug}`}
    onMouseEnter={canHover ? onHoverStart : undefined}
    onMouseLeave={canHover ? onHoverEnd : undefined}
  >
    <div
      className={`transition-[filter] duration-300 ${dimmed ? "grayscale" : ""}`}
    >
      {item.thumbnail.kind === "video" ? (
        // Video thumbnails autoplay muted while on screen; the poster-derived
        // width/height keep the card's slot identical to an image card's.
        <AutoVideo
          alt={item.thumbnail.alt}
          className="h-auto w-full object-cover"
          height={item.thumbnail.height}
          poster={item.thumbnail.posterUrl}
          src={item.thumbnail.url}
          width={item.thumbnail.width}
        />
      ) : (
        <Image
          alt={item.thumbnail.alt}
          className="h-auto w-full object-cover"
          height={item.thumbnail.height}
          src={item.thumbnail.url}
          width={item.thumbnail.width}
        />
      )}
    </div>
    {/* Tailwind's hover: variant is (hover: hover)-guarded, so touch devices
        stay image-only — captions never appear there. The caption backdrop is
        a blur gradient: the Thumbnail's own pixels, blurred by backdrop-filter
        and faded out by a mask — no dark scrim. blur(0px) rather than none
        keeps the hover transition interpolable. */}
    <div className="pointer-events-none absolute inset-x-0 bottom-0 flex h-1/2 items-end opacity-0 backdrop-blur-[0px] [mask-image:linear-gradient(to_top,black_30%,transparent)] transition-[opacity,backdrop-filter] duration-300 group-hover/card:backdrop-blur-[12px] group-hover/card:opacity-100">
      <div className="flex w-full items-baseline justify-between gap-4 p-4">
        <span className="text-3xl text-white font-bold">{item.title}</span>
        {item.firstExpertise && (
          <span className="text-xl text-white">{item.firstExpertise}</span>
        )}
      </div>
    </div>
  </Link>
);

export const WorksListing = ({
  items,
  sectorOptions,
  showFilter,
  initialSectorSlug,
}: {
  items: WorksListItem[];
  sectorOptions: SectorOption[];
  showFilter: boolean;
  initialSectorSlug: string | null;
}) => {
  const filterable = showFilter && sectorOptions.length > 0;

  const [activeSector, setActiveSector] = useState<string | null>(() =>
    filterable &&
    initialSectorSlug !== null &&
    sectorOptions.some((sector) => sector.slug === initialSectorSlug)
      ? initialSectorSlug
      : null,
  );

  const selectSector = (slug: string | null) => {
    if (slug === activeSector) return;
    setActiveSector(slug);
    // pushState makes each selection a history entry (Back walks the filter
    // choices) without an RSC round-trip that would refetch the
    // already-client-filtered list.
    const url = slug ? `/works?sector=${encodeURIComponent(slug)}` : "/works";
    window.history.pushState(window.history.state, "", url);
  };

  // History traversal (Back/Forward over pushed filter entries) re-syncs the
  // selection from the URL; anything unknown falls back to "All".
  useEffect(() => {
    const syncFromLocation = () => {
      const slug = new URLSearchParams(window.location.search).get("sector");
      setActiveSector(
        slug !== null && sectorOptions.some((sector) => sector.slug === slug)
          ? slug
          : null,
      );
    };

    window.addEventListener("popstate", syncFromLocation);
    return () => window.removeEventListener("popstate", syncFromLocation);
  }, [sectorOptions]);

  const filteredItems = useMemo(
    () =>
      activeSector === null
        ? items
        : items.filter((item) => item.sectorSlug === activeSector),
    [items, activeSector],
  );

  // Two balanced columns on md+, one straight column on mobile. The server
  // renders mobile-first so the curated order is correct in the initial HTML.
  const isDesktop = useSyncExternalStore(
    subscribeDesktop,
    getDesktopSnapshot,
    getServerSnapshot,
  );
  const columns = useMemo(
    () => (isDesktop ? balanceColumns(filteredItems) : [filteredItems]),
    [filteredItems, isDesktop],
  );

  // Hover dimming: the hovered card keeps its color, every other card
  // desaturates. Mouse events emulate on tap, so gate on hover capability.
  const canHover = useSyncExternalStore(
    subscribeHover,
    getHoverSnapshot,
    getServerSnapshot,
  );
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  // Settle the grid in when the filter (or column count) changes.
  const gridRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cards = grid.querySelectorAll("[data-work-card]");
    const tween = gsap.fromTo(
      cards,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.3,
        stagger: 0.03,
        ease: "power1.out",
        overwrite: "auto",
      },
    );

    return () => {
      tween.kill();
    };
  }, [activeSector, isDesktop]);

  const mainRef = useRef<HTMLDivElement>(null);

  return (
    <div className="mx-auto grid w-full md:grid-cols-[360px_1fr]">
      <ScrollProgress colorClassName="bg-secondary-500" scope={mainRef} />
      <aside className="self-start px-6 md:sticky md:top-[calc(var(--navbar-height)+2.5rem)]">
        <nav aria-label="Filter works" className="space-y-12">
          <div className="w-full space-y-6 border-b border-neutral-900 pb-12">
            <h1 className="block text-4xl font-bold text-neutral-50">
              Our Works
            </h1>
            <p className="block text-lg text-neutral-500">
              Ambitious ideas for ambitious business
            </p>
          </div>
          {filterable && (
            <div className="space-y-6">
              <span className="text-lg text-white">Filter Projects</span>
              <ul className="mt-4 space-y-2">
                {[null, ...sectorOptions].map((sector) => {
                  const active = activeSector === (sector?.slug ?? null);
                  return (
                    <li key={sector?.slug ?? "all"}>
                      <button
                        aria-pressed={active}
                        className={`flex w-full cursor-pointer items-center gap-2 text-left text-xl transition-colors ${
                          active ? "text-primary-500" : "text-neutral-800"
                        }`}
                        onClick={() => selectSector(sector?.slug ?? null)}
                        type="button"
                      >
                        {/* Reserved slot keeps labels steady as the arrow toggles. */}
                        <span className="inline-flex w-5 shrink-0 justify-center">
                          {active ? <ArrowRight /> : null}
                        </span>
                        {sector?.name ?? "All"}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </nav>
      </aside>

      <div className="w-full" ref={mainRef}>
        {filteredItems.length === 0 ? (
          <p className="p-8 text-xl text-neutral-600">Works coming soon</p>
        ) : (
          <div className="flex w-full flex-col gap-1 md:flex-row" ref={gridRef}>
            {columns.map((column, columnIndex) => (
              <div
                className="flex w-full flex-1 flex-col gap-1"
                key={columnIndex}
              >
                {column.map((item) => (
                  <WorkCard
                    canHover={canHover}
                    dimmed={
                      canHover && hoveredId !== null && hoveredId !== item.id
                    }
                    item={item}
                    key={item.id}
                    onHoverEnd={() => setHoveredId(null)}
                    onHoverStart={() => setHoveredId(item.id)}
                  />
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
