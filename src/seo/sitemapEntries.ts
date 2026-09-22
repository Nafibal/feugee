import type { MetadataRoute } from "next";

import type { LandingPage, Work } from "@/payload-types";

type SitemapWorks = readonly Pick<Work, "slug" | "updatedAt">[];

/**
 * The public site's whole URL space as sitemap entries: the Landing Page, the
 * Works Page, and one entry per published Work — the same pages the frontend
 * route group serves. The Works Page carries its newest Work's date because
 * that listing is exactly the Works.
 */
export const sitemapEntries = ({
  base,
  landing,
  works,
}: {
  /** The production URL; the env schema rejects a trailing slash on it. */
  base: string;
  landing: Pick<LandingPage, "updatedAt"> | null;
  works: SitemapWorks;
}): MetadataRoute.Sitemap => {
  const published = works.filter(
    (work) => typeof work.slug === "string" && work.slug.length > 0,
  );

  const newestWork = published.reduce<string | undefined>(
    (newest, work) => (work.updatedAt > (newest ?? "") ? work.updatedAt : newest),
    undefined,
  );

  return [
    {
      url: `${base}/`,
      ...(landing?.updatedAt ? { lastModified: landing.updatedAt } : {}),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/works`,
      ...(newestWork ? { lastModified: newestWork } : {}),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...published.map((work) => ({
      url: `${base}/works/${work.slug}`,
      lastModified: work.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
};
