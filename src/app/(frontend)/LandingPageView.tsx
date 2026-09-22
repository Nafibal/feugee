"use client";

import { useLivePreview } from "@payloadcms/live-preview-react";
import { useMemo, useState } from "react";

import type { LandingPage } from "@/payload-types";

import { ClientMarquee, type MarqueeClient } from "@/components/ClientMarquee";
import { HeroSlider, type HeroSlide } from "@/components/HeroSlider";
import { WhoWeAreSection } from "@/components/who-we-are/WhoWeAreSection";
import { SelectedWorksSection } from "@/components/selected-works/SelectedWorksSection";
import {
  TestimonialsSection,
  type TestimonialItem,
} from "@/components/testimonials/TestimonialsSection";
import { sizedUrlOf, videoPosterOf } from "@/components/work";
import { normalizeRotatingWords } from "@/components/heroTitle";

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
  // (bare ID) just leaves the slide out until it resolves again. Slides are
  // full-bleed, so their posters request the wide variant.
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
            posterUrl: poster ? sizedUrlOf(poster, "wide") : null,
            alt: slide.video.alt,
          },
        ];
      }),
    [data],
  );

  // The visible Hero title doubles as the page's h1; without slides the Hero
  // stays hidden and the title falls back to this sr-only h1 below.
  const heroTitle = data.hero?.title?.trim() || "Feugee";

  // Blank words are a mid-edit Live Preview state — dropped until they
  // resolve, like a half-uploaded hero slide.
  const rotatingWords = useMemo(
    () => normalizeRotatingWords(data.hero?.rotatingWords),
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

  return (
    <div className="flex flex-1 flex-col">
      {slides.length > 0 ? (
        <HeroSlider rotatingWords={rotatingWords} slides={slides} title={heroTitle} />
      ) : (
        <h1 className="sr-only">{heroTitle}</h1>
      )}

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
    </div>
  );
};
