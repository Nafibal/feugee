"use client";

import Image from "next/image";
import Link from "next/link";
import { useLivePreview } from "@payloadcms/live-preview-react";
import { useState } from "react";

import type { LandingPage, Work } from "@/payload-types";

import { AutoVideo } from "./AutoVideo";
import { ClientMarquee, type MarqueeClient } from "./ClientMarquee";
import { HeroSlider, type HeroSlide } from "./HeroSlider";
import { VIDEO_ASPECT_FALLBACK, videoPosterOf } from "./videoAsset";

export interface SelectedWorkItem {
  id: number;
  slug: string;
  title: string;
  year: number | null;
  firstExpertise: string | null;
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

// Works the agency picked but has since unpublished (or that never got a
// usable Thumbnail) drop out here rather than rendering a dead card. The
// `_status` guard is belt-and-braces: populated relationships can resolve
// docs that draft:false would have excluded.
const toSelectedWorkItem = (work: Work): SelectedWorkItem | null => {
  if (work._status !== "published") return null;
  if (
    typeof work.thumbnail !== "object" ||
    work.thumbnail === null ||
    typeof work.thumbnail.url !== "string"
  ) {
    return null;
  }

  const { url, alt } = work.thumbnail;
  const base = {
    id: work.id,
    slug: work.slug ?? "",
    title: work.title,
    year: work.year ?? null,
    firstExpertise: work.expertise?.[0] ?? null,
  };

  if (work.thumbnail.mimeType?.startsWith("video/")) {
    const poster = videoPosterOf(work.thumbnail);
    return {
      ...base,
      thumbnail: {
        kind: "video",
        url,
        posterUrl: poster?.url ?? null,
        width: poster?.width ?? VIDEO_ASPECT_FALLBACK.width,
        height: poster?.height ?? VIDEO_ASPECT_FALLBACK.height,
        alt,
      },
    };
  }

  return {
    ...base,
    thumbnail: {
      kind: "image",
      url,
      width: work.thumbnail.width ?? 1,
      height: work.thumbnail.height ?? 1,
      alt,
    },
  };
};

const SelectedWorkCard = ({ item }: { item: SelectedWorkItem }) => {
  // "year | first expertise" — a missing part is omitted, never a dangling
  // separator.
  const meta = [item.year !== null ? String(item.year) : null, item.firstExpertise]
    .filter((part) => part !== null)
    .join(" | ");

  return (
    <Link className="relative block" href={`/works/${item.slug}`}>
      {item.thumbnail.kind === "video" ? (
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
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-2 bg-gradient-to-t from-black/80 via-black/30 to-transparent px-6 pb-6 pt-28 md:px-16 md:pb-10">
        <h3 className="text-3xl font-bold text-white md:text-5xl">{item.title}</h3>
        {meta && <p className="text-lg text-neutral-300 md:text-xl">{meta}</p>}
      </div>
    </Link>
  );
};

export const LandingPageView = ({
  clients,
  initialData,
}: {
  clients: MarqueeClient[];
  initialData: LandingPage;
}) => {
  // The CMS Dashboard and this page share an origin, so the Live Preview
  // iframe's messages arrive from window.location.origin. Empty during SSR —
  // the hook only reads it inside effects.
  const [serverURL] = useState(() =>
    typeof window === "undefined" ? "" : window.location.origin,
  );
  const { data } = useLivePreview({
    serverURL,
    depth: 3,
    initialData,
  });

  // The video field is video-only by config; a shallow populate mid-edit
  // (bare ID) just leaves the slide out until it resolves again.
  const slides: HeroSlide[] = (data.hero?.slides ?? []).flatMap((slide) => {
    if (typeof slide.video !== "object" || slide.video === null) return [];
    if (typeof slide.video.url !== "string") return [];
    const poster = videoPosterOf(slide.video);
    return [
      {
        id: slide.id ?? "",
        url: slide.video.url,
        posterUrl: poster?.url ?? null,
        alt: slide.video.alt,
      },
    ];
  });

  const heading = data.whoWeAre?.heading?.trim() || "Who We Are";
  const description = data.whoWeAre?.description?.trim() || null;
  const stats = data.stats ?? [];
  const showAbout = description !== null || stats.length > 0;

  const selectedWorks = (data.selectedWorks ?? []).flatMap((work) => {
    if (typeof work !== "object" || work === null) return [];
    const item = toSelectedWorkItem(work);
    return item ? [item] : [];
  });

  return (
    <main className="flex flex-1 flex-col">
      {slides.length > 0 && <HeroSlider slides={slides} />}

      {showAbout && (
        <section
          aria-label={heading}
          className="px-6 py-24 md:px-16 md:py-40"
        >
          <div className="grid gap-12 md:grid-cols-2 md:gap-16">
            <h2 className="text-5xl font-bold uppercase tracking-tight text-neutral-50 md:text-6xl">
              {heading}
            </h2>
            <div>
              {description && (
                <p className="max-w-2xl text-xl leading-relaxed text-neutral-300 md:text-2xl">
                  {description}
                </p>
              )}
              {stats.length > 0 && (
                <div
                  className={`flex gap-16 md:gap-24 ${description ? "mt-16 md:mt-24" : ""}`}
                >
                  {stats.map((stat, index) => (
                    <div key={stat.id ?? index}>
                      <p className="text-6xl font-bold text-secondary-500 md:text-7xl">
                        {stat.value}
                      </p>
                      <p className="mt-2 text-lg text-neutral-400">{stat.label}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {clients.length > 0 && <ClientMarquee clients={clients} />}

      {selectedWorks.length > 0 && (
        <section aria-label="Selected works" className="py-24 md:py-32">
          <h2 className="px-6 text-center text-4xl font-bold uppercase tracking-tight text-neutral-50 md:px-16 md:text-5xl">
            Selected Works
          </h2>
          <div className="mt-12 flex flex-col gap-1 md:mt-16">
            {selectedWorks.map((item) => (
              <SelectedWorkCard item={item} key={item.id} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
};
