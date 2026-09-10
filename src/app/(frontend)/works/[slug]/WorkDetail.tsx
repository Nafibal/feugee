"use client"

import { useLivePreview } from "@payloadcms/live-preview-react"
import { RichText } from "@payloadcms/richtext-lexical/react"
import { useState, type ReactNode } from "react"

import type { Work } from "@/payload-types"

import { WorkSections, sectionAnchor } from "./WorkSections"

const Chip = ({ children }: { children: ReactNode }) => (
  <li className="rounded-full bg-primary-50 px-3 py-1 text-sm text-primary-700">{children}</li>
)

const Meta = ({ label, value }: { label: string; value: ReactNode }) => (
  <div>
    <dt className="text-neutral-400">{label}</dt>
    <dd className="mt-1 text-neutral-800">{value}</dd>
  </div>
)

const MetaList = ({ label, values }: { label: string; values: string[] }) => (
  <div>
    <dt className="text-neutral-400">{label}</dt>
    <dd className="mt-1">
      <ul className="list-inside list-disc text-neutral-800">
        {values.map((value) => (
          <li key={value}>{value}</li>
        ))}
      </ul>
    </dd>
  </div>
)

export const WorkDetail = ({ initialData }: { initialData: Work }) => {
  // The CMS Dashboard and this page share an origin, so the Live Preview
  // iframe's messages arrive from window.location.origin. Empty during SSR —
  // the hook only reads it inside effects.
  const [serverURL] = useState(() =>
    typeof window === "undefined" ? "" : window.location.origin,
  )
  const { data } = useLivePreview({
    serverURL,
    depth: 2,
    initialData,
  })

  const sections = data.sections ?? []
  const sectorName =
    typeof data.sector === "object" && data.sector !== null ? data.sector.name : null

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-10 md:grid-cols-[220px_1fr]">
      <aside className="self-start md:sticky md:top-10">
        <nav aria-label="Work sections">
          <a href="#work-detail" className="block text-lg font-semibold text-neutral-950">
            {data.title}
          </a>
          <ul className="mt-4 space-y-2 text-neutral-600">
            {sections.map((section, index) => (
              <li key={section.id ?? index}>
                <a className="hover:text-neutral-950" href={`#${sectionAnchor(index)}`}>
                  {section.title}
                </a>
              </li>
            ))}
            {data.testimonials?.length ? (
              <li>
                <a className="hover:text-neutral-950" href="#testimonials">
                  Testimonials
                </a>
              </li>
            ) : null}
          </ul>
        </nav>
      </aside>

      <div className="space-y-24">
        <section id="work-detail" className="scroll-mt-10 space-y-8">
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold tracking-tight text-neutral-950 md:text-5xl">
              {data.title}
            </h1>
            {data.subtitle && <p className="text-xl text-neutral-600">{data.subtitle}</p>}
          </div>

          {typeof data.thumbnail === "object" &&
            data.thumbnail?.url &&
            !data.thumbnail.mimeType?.startsWith("video/") && (
              // The Agency's thumbnails are stills — a video Asset here would
              // render as a broken <img>, so it is skipped until the real page.
              <img
                src={data.thumbnail.url}
                alt={data.thumbnail.alt}
                className="w-full rounded-lg"
              />
            )}

          {data.tags?.length ? (
            <ul className="flex flex-wrap gap-2">
              {data.tags.map((tag) => (
                <Chip key={tag}>{tag}</Chip>
              ))}
            </ul>
          ) : null}

          {data.description && (
            <RichText
              data={data.description}
              className="max-w-prose text-neutral-700 [&_p]:leading-relaxed"
            />
          )}

          <dl className="grid gap-6 text-sm sm:grid-cols-2 lg:grid-cols-3">
            {data.client && <Meta label="Client" value={data.client} />}
            {sectorName && <Meta label="Sector" value={sectorName} />}
            {data.associate && <Meta label="Associate" value={data.associate} />}
            {data.expertise?.length ? (
              <MetaList label="Expertise" values={data.expertise} />
            ) : null}
            {data.projectTeam?.length ? (
              <MetaList label="Project Team" values={data.projectTeam} />
            ) : null}
            {data.collaborators?.length ? (
              <MetaList label="Collaborators" values={data.collaborators} />
            ) : null}
          </dl>
        </section>

        <WorkSections sections={sections} />

        {data.testimonials?.length ? (
          <section id="testimonials" className="scroll-mt-10 space-y-8">
            <h2 className="text-2xl font-semibold text-neutral-950 md:text-3xl">Testimonials</h2>
            <div className="space-y-8">
              {(data.testimonials ?? []).map((testimonial, index) => (
                <figure
                  key={testimonial.id ?? index}
                  className="space-y-2 border-l-2 border-primary-200 pl-6"
                >
                  <blockquote className="text-lg text-neutral-800">
                    {testimonial.testimony}
                  </blockquote>
                  <figcaption className="text-sm text-neutral-500">
                    {testimonial.name}
                    {testimonial.job && `, ${testimonial.job}`}
                    {testimonial.company && ` — ${testimonial.company}`}
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  )
}
