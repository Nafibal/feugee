import configPromise from "@payload-config"
import { notFound } from "next/navigation"
import { cache } from "react"
import { getPayload } from "payload"

import type { Work } from "@/payload-types"

import { WorkDetail } from "./WorkDetail"

// Demo integration page — it deliberately renders the newest draft so that
// draft-only Works are reachable and the CMS Dashboard's Live Preview tab
// always has a target. Public published-only semantics arrive with the real
// Work Detail Page.
export const dynamic = "force-dynamic"

const getWork = cache(async (slug: string): Promise<Work | null> => {
  const payload = await getPayload({ config: configPromise })
  const works = await payload.find({
    collection: "works",
    where: { slug: { equals: slug } },
    draft: true,
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
  return { title: work ? `${work.title} — Feugee` : "Work — Feugee" }
}
