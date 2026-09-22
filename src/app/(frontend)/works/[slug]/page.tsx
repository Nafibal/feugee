import configPromise from "@payload-config"
import { headers } from "next/headers"
import { notFound } from "next/navigation"
import { cache } from "react"
import { getPayload } from "payload"

import { publishedWhere } from "@/access/publishedRead"
import type { Work } from "@/payload-types"
import { ogImageOf } from "@/seo/ogImage"
import { pageMetadata } from "@/seo/metadata"

import { WorkDetail } from "./WorkDetail"

export const dynamic = "force-dynamic"

const getWork = cache(async (slug: string): Promise<Work | null> => {
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers: await headers() })
  const works = await payload.find({
    collection: "works",
    where: {
      and: [
        { slug: { equals: slug } },
        // Drafts render only for authenticated CMS sessions — the Dashboard's
        // Live Preview iframe rides the admin cookie.
        ...(user ? [] : [publishedWhere]),
      ],
    },
    draft: Boolean(user),
    // Depth 2 populates the Thumbnail and, in turn, its Poster — the OG image
    // stands a video Thumbnail in via that Poster.
    depth: 2,
    limit: 1,
  })
  return works.docs[0] ?? null
})

export default async function Page({ params }: PageProps<"/works/[slug]">) {
  const { slug } = await params
  const work = await getWork(slug)
  if (!work) notFound()
  return <WorkDetail initialData={work} />
}

export async function generateMetadata({ params }: PageProps<"/works/[slug]">) {
  const { slug } = await params
  const work = await getWork(slug)
  if (!work) return pageMetadata({ title: "Work — Feugee" })

  return pageMetadata({
    title: `${work.title} — Feugee`,
    description: work.subtitle,
    url: `/works/${work.slug}`,
    image: ogImageOf(work.thumbnail),
  })
}
