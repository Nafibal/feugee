import configPromise from "@payload-config";
import { cache } from "react";
import { getPayload } from "payload";

import type { Sector, Work } from "@/payload-types";

import { workThumbnailOf } from "@/components/videoAsset";
import {
  WorksListing,
  type SectorOption,
  type WorksListItem,
} from "./WorksListing";

// The page reads the database on every request, so request-time rendering is
// the honest mode (same as the Work Detail Page).
export const dynamic = "force-dynamic";

// Below this many published Works the Filter Projects block stays hidden and
// the page just lists everything.
const FILTER_THRESHOLD = 15;

const sectorSlugOf = (
  sector: Work["sector"] | Sector,
): string | null =>
  typeof sector === "object" && sector !== null
    ? sector.slug ?? String(sector.id)
    : null;

// Works without a usable Thumbnail are left out. Video thumbnails autoplay
// muted in their card; the poster image holds their aspect ratio for the
// masonry math, falling back to 16:9 when no poster is set.
const toListItem = (work: Work): WorksListItem | null => {
  const thumbnail = workThumbnailOf(work);
  if (thumbnail === null) return null;

  return {
    id: work.id,
    slug: work.slug ?? "",
    title: work.title,
    firstExpertise: work.expertise?.[0] ?? null,
    sectorSlug: sectorSlugOf(work.sector),
    thumbnail,
  };
};

const getWorksPageData = cache(
  async (): Promise<{
    items: WorksListItem[];
    sectorOptions: SectorOption[];
    showFilter: boolean;
  }> => {
    const payload = await getPayload({ config: configPromise });
    // Orderable collections default to `_order` ascending — the CMS's manual
    // order. The `_status` guard is belt-and-braces: docs seeded straight into
    // the parent table with `_status: "draft"` would otherwise slip past
    // draft:false, which only excludes docs without a parent row.
    const [worksResult, sectorsResult] = await Promise.all([
      payload.find({
        collection: "works",
        // Depth 2 populates the thumbnail Asset and, in turn, its poster.
        depth: 2,
        draft: false,
        limit: 0,
        where: { _status: { equals: "published" } },
      }),
      payload.find({
        collection: "sectors",
        draft: false,
        limit: 0,
        sort: "id",
      }),
    ]);

    const items = worksResult.docs
      .map(toListItem)
      .filter((item): item is WorksListItem => item !== null);

    // Only sectors that actually surface a Work become filters — dead entries
    // that empty the grid are worse than a shorter list.
    const usedSectorSlugs = new Set(
      items.map((item) => item.sectorSlug).filter((slug) => slug !== null),
    );
    const sectorOptions: SectorOption[] = sectorsResult.docs.flatMap(
      (sector) => {
        const slug = sectorSlugOf(sector);
        return slug !== null && usedSectorSlugs.has(slug)
          ? [{ name: sector.name, slug }]
          : [];
      },
    );

    return {
      items,
      sectorOptions,
      showFilter: worksResult.docs.length > FILTER_THRESHOLD,
    };
  },
);

export default async function Page({ searchParams }: PageProps<"/works">) {
  const params = await searchParams;
  const sectorParam =
    typeof params?.sector === "string" ? params.sector : null;

  const { items, sectorOptions, showFilter } = await getWorksPageData();

  return (
    <WorksListing
      initialSectorSlug={sectorParam}
      items={items}
      sectorOptions={sectorOptions}
      showFilter={showFilter}
    />
  );
}

export const generateMetadata = () => ({
  title: "Our Works — Feugee",
});
