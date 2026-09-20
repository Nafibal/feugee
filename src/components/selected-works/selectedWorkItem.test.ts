import { describe, expect, it } from "vitest";

import type { Work } from "@/payload-types";

import { toSelectedWorkItem } from "./selectedWorkItem";

const work = (overrides: Partial<Work> = {}): Work =>
  ({
    id: 10,
    slug: "fest-for-music",
    title: "Fest for Music",
    _status: "published",
    thumbnail: {
      id: 1,
      url: "/assets/img.png",
      alt: "An image",
      mimeType: "image/png",
      width: 1600,
      height: 900,
    },
    ...overrides,
  }) as unknown as Work;

describe("toSelectedWorkItem", () => {
  it("extends the card core with the Work's Year", () => {
    expect(toSelectedWorkItem(work({ year: 2025 }))).toMatchObject({
      id: 10,
      slug: "fest-for-music",
      title: "Fest for Music",
      year: 2025,
    });
  });

  it("maps a Work with no Year to null", () => {
    expect(toSelectedWorkItem(work({ year: null }))?.year).toBeNull();
  });

  it("defers the card guards to toCardWork (unpublished Work)", () => {
    expect(toSelectedWorkItem(work({ _status: "draft" }))).toBeNull();
  });
});
