"use client";

import Link from "next/link";
import { useLivePreview } from "@payloadcms/live-preview-react";
import { useMemo, useState } from "react";

import type { LandingPage } from "@/payload-types";

import { ClientMarquee, type MarqueeClient } from "@/components/ClientMarquee";
import { HeroSlider, type HeroSlide } from "@/components/HeroSlider";
import { ArrowRight } from "@/components/ArrowRight";
import { WhoWeAreSection } from "@/components/who-we-are/WhoWeAreSection";
import { SelectedWorksSection } from "@/components/selected-works/SelectedWorksSection";
import {
  TestimonialsSection,
  type TestimonialItem,
} from "@/components/testimonials/TestimonialsSection";
import { videoPosterOf } from "@/components/work";

// Shared by the Contact CTA's link and fallback-button branches.
const ctaButtonClassName =
  "inline-flex items-center gap-2 text-white px-6 py-3 rounded border-neutral-800 border";

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

  // Rows missing their required text are a mid-edit Live Preview state —
  // left out until they resolve, like a half-uploaded hero slide.
  const testimonialItems = useMemo<TestimonialItem[]>(
    () =>
      (data.testimonials?.items ?? []).flatMap((item) => {
        const name = item.name?.trim();
        const testimony = item.testimony?.trim();
        if (!name || !testimony) return [];
        return [
          {
            id: item.id ?? null,
            name,
            job: item.job?.trim() || null,
            company: item.company?.trim() || null,
            testimony,
          },
        ];
      }),
    [data],
  );

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

      <SelectedWorksSection works={data.selectedWorks} />

      {testimonialItems.length > 0 && (
        <TestimonialsSection
          description={data.testimonials?.description?.trim() || null}
          heading={data.testimonials?.heading?.trim() || "Testimonials"}
          items={testimonialItems}
        />
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
