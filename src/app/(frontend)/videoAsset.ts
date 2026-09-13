import type { Asset } from "@/payload-types";

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
