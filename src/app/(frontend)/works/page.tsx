import configPromise from "@payload-config";
import { cache } from "react";
import { getPayload } from "payload";

import type { Sector, Work } from "@/payload-types";

import { toCardWork, workThumbnailOf } from "@/components/work";
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

// The card guards live in toCardWork; this adds only what the Works Page's
// masonry cards display. Its published check is belt-and-braces — the query
// above already filters to published Works. Cards are full-width below lg
// and one of two content columns above — the tablet variant covers both.
const toListItem = (work: Work): WorksListItem | null => {
  const card = toCardWork(work, workThumbnailOf(work, "tablet"));
  if (card === null) return null;

  return {
    ...card,
    firstExpertise: work.expertise?.[0] ?? null,
    sectorSlug: sectorSlugOf(work.sector),
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
