import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
  PayloadRequest,
} from "payload";
import { revalidatePath } from "next/cache";

import type { Work } from "@/payload-types";

/** One revalidatePath call: a route path plus its type when it names a layout. */
type RevalidationTarget = { path: string; type?: "page" | "layout" };

type StatusCarrier = { slug?: string | null; _status?: string | null };

/**
 * Every public page worth invalidating when any published content changes.
 * The root layout revalidation covers all pages beneath it — every content
 * type surfaces in shared chrome (the Footer renders on every route) or on
 * the Landing Page — and the sitemap lists the Works that just changed.
 */
export const siteRevalidationTargets: readonly RevalidationTarget[] = [
  { path: "/", type: "layout" },
  { path: "/sitemap.xml" },
];

/**
 * A change is publicly visible when this save published, or when it took a
 * published doc off the public site. A draft save of an already-published
 * doc passes `publishedIntact: true` — the published row survived the
 * autosave untouched — so editing sessions never revalidate anything until
 * the publish lands.
 */
const touchesPublic = (
  doc?: StatusCarrier,
  previousDoc?: StatusCarrier,
  publishedIntact = true,
) =>
  doc?._status === "published" ||
  (previousDoc?._status === "published" && !publishedIntact);

/**
 * The targets a Work change must invalidate: its Detail Page (the current
 * slug, and the previous one when a published Work was renamed or
 * unpublished) plus the whole site — Works surface as Selected Works, Other
 * Works, and listing cards. Draft-only churn revalidates nothing: the
 * public site reads published docs and cannot have changed.
 */
export const workRevalidationTargets = (
  doc?: StatusCarrier,
  previousDoc?: StatusCarrier,
  publishedIntact = true,
): readonly RevalidationTarget[] => {
  if (!touchesPublic(doc, previousDoc, publishedIntact)) return [];

  const detailPaths = [doc?.slug, previousDoc?.slug].flatMap((slug) =>
    typeof slug === "string" && slug !== ""
      ? [{ path: `/works/${slug}` }]
      : [],
  );
  const seen = new Set<string>();
  const details = detailPaths.filter(({ path }) => {
    if (seen.has(path)) return false;
    seen.add(path);
    return true;
  });

  return [...details, ...siteRevalidationTargets];
};

/**
 * The targets a drafted global's change must invalidate: the site-wide set
 * whenever a publish (or unpublish) transition touches public content.
 */
export const globalRevalidationTargets = (
  doc?: StatusCarrier,
  previousDoc?: StatusCarrier,
  publishedIntact = true,
): readonly RevalidationTarget[] =>
  touchesPublic(doc, previousDoc, publishedIntact) ? siteRevalidationTargets : [];

/**
 * Whether the doc the public site reads is still the published one. Payload
 * keeps the published row intact through draft autosaves; an unpublish
 * rewrites it as a draft. A read that fails counts as taken down.
 */
const publishedRowIntact = async (
  req: PayloadRequest,
  readPublished: () => Promise<StatusCarrier | null>,
): Promise<boolean> => {
  try {
    const published = await readPublished();
    return published?._status === "published";
  } catch {
    return false;
  }
};

/**
 * revalidatePath needs a running Next request scope — absent in standalone
 * `payload run` scripts (seed, size regeneration), where the call throws.
 * Those scripts pass `context.disableRevalidate`, and anything that slips
 * through logs instead of failing the write.
 */
const revalidateTargets = (
  targets: readonly RevalidationTarget[],
  req: PayloadRequest,
) => {
  if (req.context.disableRevalidate) return;

  for (const { path, type } of targets) {
    try {
      revalidatePath(path, type);
    } catch (error) {
      req.payload.logger.warn({
        error,
        msg: `Public site revalidation skipped for ${path} — no Next request scope`,
      });
    }
  }
};

export const revalidateSiteAfterChange: CollectionAfterChangeHook = ({
  req,
}) => {
  revalidateTargets(siteRevalidationTargets, req);
};

export const revalidateSiteAfterDelete: CollectionAfterDeleteHook = ({
  req,
}) => {
  revalidateTargets(siteRevalidationTargets, req);
};

export const revalidateGlobalAfterChange: GlobalAfterChangeHook = async ({
  doc,
  previousDoc,
  req,
  global,
}) => {
  // Only the ambiguous case — a non-publishing save of a published global —
  // needs to look: an autosave leaves the published global intact, an
  // unpublish rewrites it as a draft.
  const publishedIntact =
    doc?._status === "published" || previousDoc?._status !== "published"
      ? true
      : await publishedRowIntact(req, () =>
          req.payload.findGlobal({
            slug: global.slug,
            draft: false,
            depth: 0,
            req,
          }),
        );

  revalidateTargets(globalRevalidationTargets(doc, previousDoc, publishedIntact), req);
  return doc;
};

export const revalidateWorkAfterChange: CollectionAfterChangeHook<Work> =
  async ({ doc, previousDoc, req }) => {
    // Only the ambiguous case — a non-publishing save of a published Work —
    // needs to look: an autosave leaves the published parent intact, an
    // unpublish rewrites it as a draft.
    const publishedIntact =
      doc._status === "published" || previousDoc?._status !== "published"
        ? true
        : await publishedRowIntact(req, () =>
            req.payload.findByID({
              collection: "works",
              id: doc.id,
              draft: false,
              depth: 0,
              req,
            }),
          );

    revalidateTargets(
      workRevalidationTargets(doc, previousDoc, publishedIntact),
      req,
    );
    return doc;
  };

export const revalidateWorkAfterDelete: CollectionAfterDeleteHook<Work> = ({
  doc,
  req,
}) => {
  revalidateTargets(workRevalidationTargets(doc, undefined), req);
  return doc;
};
