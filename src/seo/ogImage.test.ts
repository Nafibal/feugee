import { describe, expect, it } from "vitest";

import type { Asset, LandingPage } from "@/payload-types";

import { ogImageOf, heroOgImage } from "./ogImage";

const imageAsset = (overrides: Partial<Asset> = {}): Asset =>
  ({
    id: 1,
    url: "/api/files/assets/original.png",
    alt: "An image",
    mimeType: "image/png",
    width: 1600,
    height: 900,
    updatedAt: "2026-09-01T00:00:00.000Z",
    createdAt: "2026-09-01T00:00:00.000Z",
    ...overrides,
  }) as unknown as Asset;

const videoAsset = (overrides: Partial<Asset> = {}): Asset =>
  ({
    id: 2,
    url: "/api/files/assets/original.mp4",
    alt: "A video",
    mimeType: "video/mp4",
    width: null,
    height: null,
    updatedAt: "2026-09-01T00:00:00.000Z",
    createdAt: "2026-09-01T00:00:00.000Z",
    ...overrides,
  }) as unknown as Asset;

const hero = (
  slides: (LandingPage["hero"] & object)["slides"],
): LandingPage["hero"] => ({ slides });

describe("ogImageOf", () => {
  it("picks the desktop variant of an image Asset", () => {
    const asset = imageAsset({
      sizes: {
        thumbnail: { url: "/t.webp", width: 640, height: 360 },
        desktop: { url: "/d.webp", width: 1600, height: 900 },
      },
    });

    expect(ogImageOf(asset)).toEqual({
      url: "/d.webp",
      width: 1600,
      height: 900,
      alt: "An image",
    });
  });

  it("falls back to the original when the Asset has no variants", () => {
    expect(ogImageOf(imageAsset())).toEqual({
      url: "/api/files/assets/original.png",
      width: 1600,
      height: 900,
      alt: "An image",
    });
  });

  it("omits dimensions an unmeasured image Asset cannot offer", () => {
    expect(ogImageOf(imageAsset({ width: null, height: null }))).toEqual({
      url: "/api/files/assets/original.png",
      alt: "An image",
    });
  });

  it("stands a video Asset's poster in as the image", () => {
    const poster = imageAsset({
      id: 3,
      url: "/api/files/assets/poster.png",
      sizes: { desktop: { url: "/poster-d.webp", width: 1600, height: 900 } },
    });

    expect(ogImageOf(videoAsset({ poster }))).toEqual({
      url: "/poster-d.webp",
      width: 1600,
      height: 900,
      alt: "An image",
    });
  });

  it("drops a video Asset without a populated poster", () => {
    expect(ogImageOf(videoAsset({ poster: 99 }))).toBeNull();
    expect(ogImageOf(videoAsset({ poster: null }))).toBeNull();
  });

  it("drops null, undefined, and a shallow-populated bare ID", () => {
    expect(ogImageOf(null)).toBeNull();
    expect(ogImageOf(undefined)).toBeNull();
    expect(ogImageOf(7)).toBeNull();
  });
});

describe("heroOgImage", () => {
  it("uses the first Slide's video poster", () => {
    const poster = imageAsset({
      url: "/api/files/assets/slide.png",
      sizes: { desktop: { url: "/slide-d.webp", width: 1600, height: 900 } },
    });

    expect(heroOgImage(hero([{ video: videoAsset({ poster }) }]))).toEqual({
      url: "/slide-d.webp",
      width: 1600,
      height: 900,
      alt: "An image",
    });
  });

  it("skips posterless Slides to the first one with a poster", () => {
    const poster = imageAsset({
      id: 4,
      url: "/api/files/assets/second.png",
      sizes: { desktop: { url: "/second-d.webp", width: 1600, height: 900 } },
    });

    const result = heroOgImage(
      hero([{ video: videoAsset() }, { video: videoAsset({ poster }) }]),
    );

    expect(result).toEqual({
      url: "/second-d.webp",
      width: 1600,
      height: 900,
      alt: "An image",
    });
  });

  it("drops a Slide whose video is only shallow-populated", () => {
    const poster = imageAsset({
      id: 5,
      url: "/api/files/assets/second.png",
      sizes: { desktop: { url: "/second-d.webp", width: 1600, height: 900 } },
    });

    const result = heroOgImage(hero([{ video: 12 }, { video: videoAsset({ poster }) }]));

    expect(result).toEqual({
      url: "/second-d.webp",
      width: 1600,
      height: 900,
      alt: "An image",
    });
  });

  it("is null with no Slides or no usable poster among them", () => {
    expect(heroOgImage(hero(null))).toBeNull();
    expect(heroOgImage(hero([]))).toBeNull();
    expect(heroOgImage(hero([{ video: videoAsset() }]))).toBeNull();
    expect(heroOgImage(undefined)).toBeNull();
  });
});
