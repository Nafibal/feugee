import type { MetadataRoute } from "next";
import configPromise from "@payload-config";
import { getPayload } from "payload";

import { publishedWhere } from "@/access/publishedRead";
import { env } from "@/env";
import { sitemapEntries } from "@/seo/sitemapEntries";

// The sitemap reads the database on every request, so request-time rendering
// is the honest mode (same as the pages it lists).
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config: configPromise });

  // The same published-only gate the public read paths use — drafts never
  // list. Depth 0: entries need only slug and updatedAt.
  const [worksResult, landingPage] = await Promise.all([
    payload.find({
      collection: "works",
      depth: 0,
      draft: false,
      limit: 0,
      where: publishedWhere,
    }),
    payload.findGlobal({ slug: "landing-page", draft: false }),
  ]);

  return sitemapEntries({
    base: env.NEXT_PUBLIC_SERVER_URL,
    landing: landingPage,
    works: worksResult.docs,
  });
}
