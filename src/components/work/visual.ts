import type { Asset, Work } from "@/payload-types";

/**
 * The configured variant ladder on the Assets collection (see its
 * `imageSizes`): thumbnail 640, tablet 1024, desktop 1600, wide 2400.
 */
export type AssetSizeName = keyof NonNullable<Asset["sizes"]>;

/**
 * The URL of an Asset's variant for a size — the one every public placement
 * should request instead of the original file. Payload skips sizes wider
 * than a small original (and SVGs get none at all), so the pick falls back
 * to the widest variant that does exist and, failing that, to the original
 * url — never worse than the status quo, and dimensions for layout always
 * come from the Asset's own width/height elsewhere. Placements render the
 * picked URL with next/image's `unoptimized` — the optimizer would only
 * re-encode an already-sized variant.
 */
export const sizedUrlOf = (
  asset: Asset,
  size: AssetSizeName,
): string | null => {
  const entries = Object.values(asset.sizes ?? {}).filter(
    (entry): entry is NonNullable<NonNullable<Asset["sizes"]>[AssetSizeName]> =>
      entry != null,
  );
  const withUrl = entries.filter((entry) => entry.url != null);

  const requested = asset.sizes?.[size];
  if (requested?.url != null) return requested.url;

  // The requested variant is missing — either skipped (an original narrower
  // than the size gets no variant) or still unregenerated. When its width is
  // known, the smallest variant at least that wide is the closest stand-in;
  // otherwise (sizes are monotonic, so a skipped size has no wider siblings
  // either) the widest remaining variant is.
  const target = requested?.width;
  if (target != null) {
    const atLeast = withUrl
      .filter((entry) => (entry.width ?? 0) >= target)
      .sort((a, b) => (a.width ?? 0) - (b.width ?? 0));
    if (atLeast[0]?.url != null) return atLeast[0].url;
  }

  const widest = withUrl.reduce<(typeof withUrl)[number] | null>(
    (best, entry) =>
      (best?.width ?? 0) < (entry.width ?? 0) ? entry : best,
    null,
  );

  return widest?.url ?? asset.url ?? null;
};

/**
 * Video Assets carry no dimensions — Payload measures images only — so until
 * playback starts the poster image stands in for the video's size. Anything
 * laying out a video without a poster falls back to this aspect ratio.
 */
export const VIDEO_ASPECT_FALLBACK = { width: 16, height: 9 };

/**
 * The populated poster Asset of a video Asset, or null. The field can hold a
 * bare ID (shallow populate, mid-flight Live Preview edit) — treat that as
 * "no poster" and let the caller fall back.
 */
export const videoPosterOf = (asset: Asset): Asset | null =>
  typeof asset.poster === "object" && asset.poster !== null
    ? asset.poster
    : null;

/**
 * A Work's visual — its Thumbnail or its Feature Visual — as a render-ready
 * discriminated union, or null when the Asset is not usable (none set, or a
 * shallow-populated bare ID). Every card surface — Selected Works, the Works
 * Page masonry, the Footer — discriminates on this one shape instead of
 * re-deriving it.
 */
export type CardVisual =
  | {
      kind: "image";
      url: string;
      width: number;
      height: number;
      alt: string;
    }
  | {
      kind: "video";
      url: string;
      posterUrl: string | null;
      width: number;
      height: number;
      alt: string;
    };

const assetVisualOf = (
  asset: Asset | number | null | undefined,
  size?: AssetSizeName,
): CardVisual | null => {
  if (
    typeof asset !== "object" ||
    asset === null ||
    typeof asset.url !== "string"
  ) {
    return null;
  }

  const { url, alt } = asset;

  if (asset.mimeType?.startsWith("video/")) {
    const poster = videoPosterOf(asset);
    return {
      kind: "video",
      url,
      posterUrl: poster && size ? sizedUrlOf(poster, size) : (poster?.url ?? null),
      width: poster?.width ?? VIDEO_ASPECT_FALLBACK.width,
      height: poster?.height ?? VIDEO_ASPECT_FALLBACK.height,
      alt,
    };
  }

  return {
    kind: "image",
    url: size ? (sizedUrlOf(asset, size) ?? url) : url,
    width: asset.width ?? 1,
    height: asset.height ?? 1,
    alt,
  };
};

/** A Work's Thumbnail as a render-ready CardVisual, or null when unusable. */
export const workThumbnailOf = (
  work: Work,
  size?: AssetSizeName,
): CardVisual | null => assetVisualOf(work.thumbnail, size);

/** A Work's Feature Visual as a render-ready CardVisual, or null when unusable. */
export const workFeatureVisualOf = (
  work: Work,
  size?: AssetSizeName,
): CardVisual | null => assetVisualOf(work.featureVisual, size);
