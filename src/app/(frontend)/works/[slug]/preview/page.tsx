import configPromise from "@payload-config"
import type { Metadata } from "next"
import { headers } from "next/headers"
import { notFound } from "next/navigation"
import { cache } from "react"
import { getPayload } from "payload"

import type { Work } from "@/payload-types"

import { WorkDetailLivePreview } from "../WorkDetailLivePreview"

// The public Detail Page renders statically, so the CMS Dashboard's Live
// Preview iframe points here instead: drafts render for authenticated CMS
// sessions only, and the Live Preview stream keeps the view in step with
// the editor. Everyone else gets the 404 boundary.
export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

const getPreviewWork = cache(async (slug: string): Promise<Work | null> => {
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers: await headers() })
  if (!user) return null

  // Draft queries read the versions table, where a `slug` where clause does
  // not land — so the slug resolves against the parent table first and the
  // latest version (the draft in progress, or the published doc) loads by ID.
  const parent = await payload.find({
    collection: "works",
    where: { slug: { equals: slug } },
    depth: 0,
    limit: 1,
  })
  const id = parent.docs[0]?.id
  if (id === undefined) return null

  return payload.findByID({
    collection: "works",
    id,
    draft: true,
    depth: 2,
  })
})

export default async function Page({
  params,
}: PageProps<"/works/[slug]/preview">) {
  const { slug } = await params
  const work = await getPreviewWork(slug)
  if (!work) notFound()
  return <WorkDetailLivePreview initialData={work} />
}
