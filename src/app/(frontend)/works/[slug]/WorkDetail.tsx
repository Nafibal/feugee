"use client";

import Image from "next/image";
import { useLivePreview } from "@payloadcms/live-preview-react";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { useEffect, useMemo, useState, type ReactNode } from "react";

import type { Work } from "@/payload-types";

import { WorkSections, sectionAnchor } from "./WorkSections";

const ArrowRight = () => (
  <svg
    aria-hidden="true"
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path
      d="M5 12h14M13 6l6 6-6 6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Chip = ({ children }: { children: ReactNode }) => (
  <li className="rounded-full bg-primary-50 px-3 py-1 text-sm text-primary-300">
    {children}
  </li>
);

const Meta = ({ label, value }: { label: string; value: ReactNode }) => (
  <div className="space-y-3 w-full">
    <h4 className="text-xl text-neutral-600">{label}</h4>
    <p className="text-xl text-white">{value}</p>
  </div>
);

const MetaList = ({ label, values }: { label: string; values: string[] }) => (
  <div className="w-full space-y-3">
    <h4 className="text-xl text-neutral-600">{label}</h4>
    <ul className="space-y-1">
      {values.map((value) => (
        <li key={value} className="text-xl text-white">
          {value}
        </li>
      ))}
    </ul>
  </div>
  // <div>
  //   <dt className="text-neutral-400">{label}</dt>
  //   <dd className="mt-1">
  //     <ul className="list-inside list-disc text-neutral-200">
  //       {values.map((value) => (
  //         <li key={value}>{value}</li>
  //       ))}
  //     </ul>
  //   </dd>
  // </div>
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
      <aside className="self-start md:sticky md:top-10 px-6">
        <nav aria-label="Work sections" className="space-y-12">
          <div className="w-full pb-12 border-b border-neutral-900 space-y-6">
            <h1 className="text-neutral-50 text-4xl font-bold block">
              {data.title}
            </h1>
            <p className="text-neutral-500 text-lg block">{data.subtitle}</p>
          </div>
          <div className="space-y-6">
            <span className="text-lg text-white">Contents</span>
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
        <section id="work-detail" className="scroll-mt-10 ">
          {typeof data.thumbnail === "object" &&
            data.thumbnail?.url &&
            !data.thumbnail.mimeType?.startsWith("video/") && (
              <div className="relative w-full h-screen">
                <Image
                  src={data.thumbnail.url}
                  alt={data.thumbnail.alt}
                  fill
                  className="object-cover"
                  // width={data.thumbnail.width ?? 1}
                  // height={data.thumbnail.height ?? 1}
                />
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
          <section id="testimonials" className="scroll-mt-10 space-y-8 p-16">
            <div className="space-y-8">
              {(data.testimonials ?? []).map((testimonial, index) => (
                <figure key={testimonial.id ?? index} className="space-y-8">
                  <div className="text-2xl text-white">
                    &quot;{testimonial.testimony}&quot;
                  </div>
                  <div className=" space-y-1.5">
                    <figcaption className="text-md text-primary-500">
                      {testimonial.name}
                    </figcaption>
                    <figcaption className="text-xs text-neutral-300">
                      {testimonial.job && `${testimonial.job}`}
                      {testimonial.company && `, ${testimonial.company}`}
                    </figcaption>
                  </div>
                </figure>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
};
