import type { Asset, Work } from "@/payload-types";

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
      posterUrl: poster?.url ?? null,
      width: poster?.width ?? VIDEO_ASPECT_FALLBACK.width,
      height: poster?.height ?? VIDEO_ASPECT_FALLBACK.height,
      alt,
    };
  }

  return {
    kind: "image",
    url,
    width: asset.width ?? 1,
    height: asset.height ?? 1,
    alt,
  };
};

/** A Work's Thumbnail as a render-ready CardVisual, or null when unusable. */
export const workThumbnailOf = (work: Work): CardVisual | null =>
  assetVisualOf(work.thumbnail);

/** A Work's Feature Visual as a render-ready CardVisual, or null when unusable. */
export const workFeatureVisualOf = (work: Work): CardVisual | null =>
  assetVisualOf(work.featureVisual);
