"use client";

import Image from "next/image";
import Link from "next/link";
import { useLivePreview } from "@payloadcms/live-preview-react";
import { useState } from "react";

import type { LandingPage, Work } from "@/payload-types";

import { AutoVideo } from "./AutoVideo";
import { ClientMarquee, type MarqueeClient } from "./ClientMarquee";
import { HeroSlider, type HeroSlide } from "./HeroSlider";
import {
  videoPosterOf,
  workThumbnailOf,
  type WorkThumbnail,
} from "./videoAsset";
import { ArrowRight } from "./ArrowRight";

export interface SelectedWorkItem {
  id: number;
  slug: string;
  title: string;
  shortDescription: string | null;
  year: number | null;
  firstExpertise: string | null;
  thumbnail: WorkThumbnail;
}

// Works the agency picked but has since unpublished (or that never got a
// usable Thumbnail) drop out here rather than rendering a dead card. The
// `_status` guard is belt-and-braces: populated relationships can resolve
// docs that draft:false would have excluded.
const toSelectedWorkItem = (work: Work): SelectedWorkItem | null => {
  if (work._status !== "published") return null;
  const thumbnail = workThumbnailOf(work);
  if (thumbnail === null) return null;

  return {
    id: work.id,
    slug: work.slug ?? "",
    title: work.title,
    shortDescription: work.shortDescription ?? null,
    year: work.year ?? null,
    firstExpertise: work.expertise?.[0] ?? null,
    thumbnail,
  };
};

// Shared by the Contact CTA's link and fallback-button branches.
const ctaButtonClassName =
  "inline-flex items-center gap-2 text-white px-6 py-3 rounded border-neutral-800 border";

const SelectedWorkCard = ({ item }: { item: SelectedWorkItem }) => {  return (
    <Link className="relative block" href={`/works/${item.slug}`}>
      {item.thumbnail.kind === "video" ? (
        <AutoVideo
          alt={item.thumbnail.alt}
          className="h-screen w-full object-cover"
          height={item.thumbnail.height}
          poster={item.thumbnail.posterUrl}
          src={item.thumbnail.url}
          width={item.thumbnail.width}
        />
      ) : (
        <Image
          alt={item.thumbnail.alt}
          className="h-screen w-full object-cover"
          height={item.thumbnail.height}
          src={item.thumbnail.url}
          width={item.thumbnail.width}
        />
      )}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-row justify-between items-center bg-linear-to-t from-black/80 via-black/30 to-transparent p-16">
        <h3 className="text-5xl font-medium text-white md:text-5xl">
          {item.title}
        </h3>
        {item.shortDescription && (
          <p className="text-lg text-white">{item.shortDescription}</p>
        )}
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

  const ctaEyebrow = data.contactCta?.eyebrow?.trim() || null;
  const ctaHeadline = data.contactCta?.headline?.trim() || null;
  const ctaBody = data.contactCta?.body?.trim() || null;
  const ctaActionLabel = data.contactCta?.actionLabel?.trim() || null;
  const ctaActionUrl = data.contactCta?.actionUrl?.trim() || null;
  const showContactCta =
    ctaEyebrow !== null ||
    ctaHeadline !== null ||
    ctaBody !== null ||
    ctaActionLabel !== null;

  return (
    <main className="flex flex-1 flex-col">
      {slides.length > 0 && <HeroSlider slides={slides} />}

      {showAbout && (
        <section aria-label={heading} className="p-16 ">
          <div className="flex ">
            <div className="w-[25%]">
              <div className="inline-flex rounded border border-neutral-700 px-4 py-2">
                <h2 className="text-md text-white">{heading}</h2>
              </div>
            </div>
            <div className="w-[75%]">
              {description && (
                <p className="text-5xl text-white ">{description}</p>
              )}
              {stats.length > 0 && (
                <div className={`flex gap-24 ${description ? "mt-12" : ""}`}>
                  {stats.map((stat, index) => (
                    <div key={stat.id ?? index}>
                      <p className="text-7xl font-semibold text-secondary-500">
                        {stat.value}
                      </p>
                      <p className="mt-3 text-xl text-neutral-300">
                        {stat.label}
                      </p>
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
        <section aria-label="Selected works" className="pt-32">
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

      {showContactCta && (
        <section
          aria-label="Contact"
          className="h-screen w-full px-16 flex flex-col items-center justify-center gap-y-12"
        >
          <div className="flex flex-col gap-y-6 items-center text-center">
            {ctaEyebrow && (
              <span className="text-xl text-neutral-300">{ctaEyebrow}</span>
            )}
            {ctaHeadline && (
              <h2 className="text-7xl text-white font-bold">{ctaHeadline}</h2>
            )}
            {ctaBody && (
              <span className="text-xl text-neutral-300">{ctaBody}</span>
            )}
          </div>
          {ctaActionLabel &&
            (ctaActionUrl ? (
              <Link className={ctaButtonClassName} href={ctaActionUrl}>
                {ctaActionLabel} <ArrowRight />
              </Link>
            ) : (
              <button className={ctaButtonClassName} type="button">
                {ctaActionLabel} <ArrowRight />
              </button>
            ))}
        </section>
      )}
    </main>
  );
};
