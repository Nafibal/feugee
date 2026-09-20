import { describe, expect, it } from "vitest";

import type { Asset, Work } from "@/payload-types";

import { toCardWork } from "./cardWork";
import { VIDEO_ASPECT_FALLBACK } from "./visual";

const imageAsset = (overrides: Partial<Asset> = {}): Asset =>
  ({
    id: 1,
    url: "/assets/img.png",
    alt: "An image",
    mimeType: "image/png",
    width: 1600,
    height: 900,
    ...overrides,
  }) as unknown as Asset;

const posterAsset = imageAsset({
  id: 3,
  url: "/assets/poster.png",
  width: 640,
  height: 360,
});

const videoAsset = (overrides: Partial<Asset> = {}): Asset =>
  ({
    id: 2,
    url: "/assets/vid.mp4",
    alt: "A video",
    mimeType: "video/mp4",
    width: null,
    height: null,
    poster: posterAsset,
    ...overrides,
  }) as unknown as Asset;

const work = (overrides: Partial<Work> = {}): Work =>
  ({
    id: 10,
    slug: "fest-for-music",
    title: "Fest for Music",
    _status: "published",
    thumbnail: imageAsset(),
    ...overrides,
  }) as unknown as Work;

describe("toCardWork", () => {
  it("drops a shallow-populated relationship (bare number)", () => {
    expect(toCardWork(42)).toBeNull();
  });

  it("drops null and undefined", () => {
    expect(toCardWork(null)).toBeNull();
    expect(toCardWork(undefined)).toBeNull();
  });

  it("drops an unpublished Work even with a usable Thumbnail", () => {
    expect(toCardWork(work({ _status: "draft" }))).toBeNull();
  });

  it("drops a Work whose Thumbnail is only shallow-populated", () => {
    expect(toCardWork(work({ thumbnail: 7 }))).toBeNull();
  });

  it("drops a Work with no Thumbnail at all", () => {
    expect(toCardWork(work({ thumbnail: null }))).toBeNull();
  });

  it("maps a published image-thumbnail Work to the card core", () => {
    expect(toCardWork(work())).toEqual({
      id: 10,
      slug: "fest-for-music",
      title: "Fest for Music",
      visual: {
        kind: "image",
        url: "/assets/img.png",
        width: 1600,
        height: 900,
        alt: "An image",
      },
    });
  });

  it("falls back to 1×1 for an image Thumbnail Payload could not measure", () => {
    const card = toCardWork(
      work({ thumbnail: imageAsset({ width: null, height: null }) }),
    );

    expect(card?.visual).toMatchObject({ kind: "image", width: 1, height: 1 });
  });

  it("carries the poster's dimensions for a video Thumbnail", () => {
    const card = toCardWork(work({ thumbnail: videoAsset() }));

    expect(card?.visual).toEqual({
      kind: "video",
      url: "/assets/vid.mp4",
      posterUrl: "/assets/poster.png",
      width: 640,
      height: 360,
      alt: "A video",
    });
  });

  it("falls back to the 16:9 aspect slot for a video without a poster", () => {
    const card = toCardWork(work({ thumbnail: videoAsset({ poster: 99 }) }));

    expect(card?.visual).toEqual({
      kind: "video",
      url: "/assets/vid.mp4",
      posterUrl: null,
      width: VIDEO_ASPECT_FALLBACK.width,
      height: VIDEO_ASPECT_FALLBACK.height,
      alt: "A video",
    });
  });

  it("maps a missing slug to the empty string", () => {
    expect(toCardWork(work({ slug: undefined }))?.slug).toBe("");
  });
});
