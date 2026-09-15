import type { Work } from "@/payload-types";

import { workThumbnailOf, type WorkThumbnail } from "./thumbnail";

/**
 * The core of every Work card surface — exactly the fields a card needs
 * before a page adds its own (Selected Works adds year, the Footer adds
 * subtitle, …). Surfaces spread this and read their extras off the
 * original Work.
 */
export type CardWork = {
  id: number;
  slug: string;
  title: string;
  thumbnail: WorkThumbnail;
};

/**
 * The one place that decides whether a Work can ride a card surface:
 * published, populated deep enough to have a usable Thumbnail, and that
 * Thumbnail resolved to its render-ready union. Every guard a card needs,
 * behind one call — surfaces stop re-deriving them.
 *
 * A bare number (a shallow-populated relationship, mid-flight Live Preview
 * edit) is not a card; null is the caller's signal to drop it.
 */
export const toCardWork = (
  work: Work | number | null | undefined,
): CardWork | null => {
  if (typeof work !== "object" || work === null) return null;
  // Belt-and-braces: populated relationships can resolve docs that
  // draft:false would have excluded.
  if (work._status !== "published") return null;

  const thumbnail = workThumbnailOf(work);
  if (thumbnail === null) return null;

  return {
    id: work.id,
    slug: work.slug ?? "",
    title: work.title,
    thumbnail,
  };
};
