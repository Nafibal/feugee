"use client";

import Image from "next/image";
import Link from "next/link";
import { useLivePreview } from "@payloadcms/live-preview-react";
import { useMemo, useState } from "react";

import type { LandingPage, Work } from "@/payload-types";

import { AutoVideo } from "@/components/AutoVideo";
import { ClientMarquee, type MarqueeClient } from "@/components/ClientMarquee";
import { HeroSlider, type HeroSlide } from "@/components/HeroSlider";
import { ArrowRight } from "@/components/ArrowRight";
import { WhoWeAreSection } from "@/components/who-we-are/WhoWeAreSection";
import { toCardWork, videoPosterOf, type CardWork } from "@/components/work";

export interface SelectedWorkItem extends CardWork {
  shortDescription: string | null;
  year: number | null;
  firstExpertise: string | null;
}

// The card guards (published, populated, usable Thumbnail) live in
// toCardWork; this adds only what the Selected Works cards display.
const toSelectedWorkItem = (work: number | Work): SelectedWorkItem | null => {
  if (typeof work !== "object") return null;
  const card = toCardWork(work);
  if (card === null) return null;

  return {
    ...card,
    shortDescription: work.shortDescription ?? null,
    year: work.year ?? null,
    firstExpertise: work.expertise?.[0] ?? null,
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
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-start justify-end gap-2 bg-linear-to-t from-black/80 via-black/30 to-transparent p-6 md:flex-row md:items-center md:justify-between md:p-16">
        <h3 className="text-3xl font-medium text-white md:text-5xl">
          {item.title}
        </h3>
        {item.shortDescription && (
          <p className="text-base text-white md:text-lg">
            {item.shortDescription}
          </p>
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
  const slides = useMemo<HeroSlide[]>(
    () =>
      (data.hero?.slides ?? []).flatMap((slide) => {
        if (typeof slide.video !== "object" || slide.video === null)
          return [];
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
      }),
    [data],
  );

  const heading = data.whoWeAre?.heading?.trim() || "Who We Are";
  const description = data.whoWeAre?.description?.trim() || null;
  const stats = data.stats ?? [];
  const showAbout = description !== null || stats.length > 0;

  const selectedWorks = (data.selectedWorks ?? []).flatMap((work) => {
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
    <div className="flex flex-1 flex-col">
      {/* The Hero renders no visible title, so this stands in as the page's
          h1 — same text as the metadata title, hidden from sighted visitors. */}
      <h1 className="sr-only">{data.hero?.title?.trim() || "Feugee"}</h1>
      {slides.length > 0 && <HeroSlider slides={slides} />}

      {showAbout && (
        <WhoWeAreSection
          description={description}
          heading={heading}
          stats={data.stats}
        />
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
          className="flex min-h-svh w-full flex-col items-center justify-center gap-y-8 px-6 md:gap-y-12 md:px-16"
        >
          <div className="flex flex-col gap-y-6 items-center text-center">
            {ctaEyebrow && (
              <p className="text-lg text-neutral-300 md:text-xl">
                {ctaEyebrow}
              </p>
            )}
            {ctaHeadline && (
              <h2 className="text-4xl text-white font-bold md:text-7xl">
                {ctaHeadline}
              </h2>
            )}
            {ctaBody && (
              <p className="text-lg text-neutral-300 md:text-xl">{ctaBody}</p>
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
    </div>
  );
};
