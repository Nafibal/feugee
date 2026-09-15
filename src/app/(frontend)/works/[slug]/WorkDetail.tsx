"use client";

import Image from "next/image";
import { useLivePreview } from "@payloadcms/live-preview-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";

import type { Work } from "@/payload-types";

import { ArrowRight } from "../../ArrowRight";
import { AutoVideo } from "../../AutoVideo";
import { ScrollProgress } from "../../ScrollProgress";
import {
  VIDEO_ASPECT_FALLBACK,
  videoPosterOf,
} from "../../videoAsset";
import { WorkSections, sectionAnchor } from "./WorkSections";

// Meta blocks are label/value pairs — description lists fit them exactly.
const Meta = ({ label, value }: { label: string; value: ReactNode }) => (
  <dl className="space-y-3 w-full">
    <dt className="text-xl text-neutral-600">{label}</dt>
    <dd className="text-xl text-white">{value}</dd>
  </dl>
);

const MetaList = ({ label, values }: { label: string; values: string[] }) => (
  <dl className="w-full space-y-3">
    <dt className="text-xl text-neutral-600">{label}</dt>
    <dd>
      <ul className="space-y-1">
        {values.map((value) => (
          <li key={value} className="text-xl text-white">
            {value}
          </li>
        ))}
      </ul>
    </dd>
  </dl>
);

export const WorkDetail = ({ initialData }: { initialData: Work }) => {
  // The CMS Dashboard and this page share an origin, so the Live Preview
  // iframe's messages arrive from window.location.origin. Empty during SSR —
  // the hook only reads it inside effects.
  const [serverURL] = useState(() =>
    typeof window === "undefined" ? "" : window.location.origin,
  );
  const { data } = useLivePreview({
    serverURL,
    depth: 2,
    initialData,
  });

  const sections = useMemo(() => data.sections ?? [], [data.sections]);
  const sectorName =
    typeof data.sector === "object" && data.sector !== null
      ? data.sector.name
      : null;
  const thumbnailPoster =
    typeof data.thumbnail === "object" && data.thumbnail !== null
      ? videoPosterOf(data.thumbnail)
      : null;

  // Scroll-spy for the Contents nav: the section crossing a band near the top
  // of the viewport is the current one.
  const [activeSection, setActiveSection] = useState<string | null>(
    sectionAnchor(0),
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-10% 0px -75% 0px" },
    );

    for (const index of sections.keys()) {
      const element = document.getElementById(sectionAnchor(index));
      if (element) observer.observe(element);
    }

    return () => observer.disconnect();
  }, [sections]);

  return (
    <div className="mx-auto grid w-full md:grid-cols-[360px_1fr]">
      <ScrollProgress />
      <aside className="self-start md:sticky md:top-[calc(var(--navbar-height)+2.5rem)] px-6">
        <nav aria-label="Work sections" className="space-y-12">
          <div className="w-full pb-12 border-b border-neutral-900 space-y-6">
            <h1 className="text-neutral-50 text-4xl font-bold block">
              {data.title}
            </h1>
            <p className="text-neutral-500 text-lg block">{data.subtitle}</p>
          </div>
          <div className="space-y-6">
            {/* inline keeps the span-era layout: space-y-6's margin-bottom is
                ignored on inline boxes, so the ul's mt-4 still sets the gap. */}
            <h2 className="inline text-lg text-white">Contents</h2>
            <ul className="mt-4 space-y-2">
              {sections.map((section, index) => {
                const anchor = sectionAnchor(index);
                const active = activeSection === anchor;
                return (
                  <li key={section.id ?? index}>
                    <a
                      aria-current={active ? "true" : undefined}
                      className={`flex items-center gap-2 text-xl transition-colors ${
                        active ? "text-primary-500" : "text-neutral-800"
                      }`}
                      href={`#${anchor}`}
                    >
                      {/* Reserved slot keeps labels steady as the arrow toggles. */}
                      <span className="inline-flex w-5 shrink-0 justify-center">
                        {active ? <ArrowRight /> : null}
                      </span>
                      {section.title}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
      </aside>

      <div className="w-full">
        <section id="work-detail" className="scroll-mt-[calc(var(--navbar-height)+0.5rem)] ">
          {typeof data.thumbnail === "object" && data.thumbnail?.url && (
            <div className="relative w-full h-screen">
              {data.thumbnail.mimeType?.startsWith("video/") ? (
                <AutoVideo
                  alt={data.thumbnail.alt}
                  className="absolute inset-0 h-full w-full object-cover"
                  height={
                    thumbnailPoster?.height ?? VIDEO_ASPECT_FALLBACK.height
                  }
                  poster={thumbnailPoster?.url ?? null}
                  src={data.thumbnail.url}
                  width={thumbnailPoster?.width ?? VIDEO_ASPECT_FALLBACK.width}
                />
              ) : (
                <Image
                  src={data.thumbnail.url}
                  alt={data.thumbnail.alt}
                  fill
                  className="object-cover"
                  // width={data.thumbnail.width ?? 1}
                  // height={data.thumbnail.height ?? 1}
                />
              )}
            </div>
          )}

          <div className="p-8 flex flex-col gap-y-8">
            <div className="w-full flex flex-row justify-start items-stretch gap-x-8">
              {data.client && <Meta label="Client" value={data.client} />}
              {sectorName && (
                <>
                  <div className="w-px bg-neutral-900"></div>
                  <Meta label="Sector" value={sectorName} />
                </>
              )}
              {data.associate && (
                <>
                  <div className="w-px bg-neutral-900"></div>
                  <Meta label="Associate" value={data.associate} />
                </>
              )}
            </div>
            <div className="w-full h-px bg-neutral-900"></div>
            <div className="w-full flex flex-row justify-start items-stretch gap-x-8">
              {data.projectTeam?.length ? (
                <MetaList label="Project Team" values={data.projectTeam} />
              ) : null}
              {data.expertise?.length ? (
                <>
                  <div className="w-px bg-neutral-900"></div>
                  <MetaList label="Expertise" values={data.expertise} />
                </>
              ) : null}
              {data.collaborators?.length ? (
                <>
                  <div className="w-px bg-neutral-900"></div>
                  <MetaList label="Collaborators" values={data.collaborators} />
                </>
              ) : null}
            </div>
          </div>
        </section>

        <WorkSections sections={sections} />

        {data.testimonials?.length ? (
          <section id="testimonials" className="scroll-mt-[calc(var(--navbar-height)+0.5rem)] space-y-8 p-16">
            <div className="space-y-8">
              {(data.testimonials ?? []).map((testimonial, index) => (
                <figure key={testimonial.id ?? index} className="space-y-8">
                  <blockquote className="text-2xl text-white">
                    &quot;{testimonial.testimony}&quot;
                  </blockquote>
                  {/* One figcaption per figure; the two lines keep their own
                      classes inside it. */}
                  <figcaption className="space-y-1.5">
                    <div className="text-md text-primary-500">
                      {testimonial.name}
                    </div>
                    <div className="text-xs text-neutral-300">
                      {testimonial.job}
                      {testimonial.company && `, ${testimonial.company}`}
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
};
