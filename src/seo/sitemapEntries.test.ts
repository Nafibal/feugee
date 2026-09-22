import { describe, expect, it } from "vitest";

import { sitemapEntries } from "./sitemapEntries";

const BASE = "https://feugee.test";

const works = [
  { slug: "fest-for-music", updatedAt: "2026-08-01T00:00:00.000Z" },
  { slug: "ember-rebrand", updatedAt: "2026-09-15T00:00:00.000Z" },
  { slug: "tide-campaign", updatedAt: "2026-07-01T00:00:00.000Z" },
] as const;

describe("sitemapEntries", () => {
  it("lists the Landing Page, the Works Page, then every Work Detail Page", () => {
    expect(
      sitemapEntries({
        base: BASE,
        landing: { updatedAt: "2026-09-20T00:00:00.000Z" },
        works: [...works],
      }),
    ).toEqual([
      {
        url: `${BASE}/`,
        lastModified: "2026-09-20T00:00:00.000Z",
        changeFrequency: "weekly",
        priority: 1,
      },
      {
        url: `${BASE}/works`,
        lastModified: "2026-09-15T00:00:00.000Z",
        changeFrequency: "weekly",
        priority: 0.9,
      },
      {
        url: `${BASE}/works/fest-for-music`,
        lastModified: "2026-08-01T00:00:00.000Z",
        changeFrequency: "monthly",
        priority: 0.8,
      },
      {
        url: `${BASE}/works/ember-rebrand`,
        lastModified: "2026-09-15T00:00:00.000Z",
        changeFrequency: "monthly",
        priority: 0.8,
      },
      {
        url: `${BASE}/works/tide-campaign`,
        lastModified: "2026-07-01T00:00:00.000Z",
        changeFrequency: "monthly",
        priority: 0.8,
      },
    ]);
  });

  it("drops Works without a usable slug", () => {
    const entries = sitemapEntries({
      base: BASE,
      landing: null,
      works: [
        { slug: undefined, updatedAt: "2026-08-01T00:00:00.000Z" },
        { slug: "", updatedAt: "2026-08-01T00:00:00.000Z" },
        ...works.slice(0, 1),
      ],
    });

    expect(entries.map((entry) => entry.url)).toEqual([
      `${BASE}/`,
      `${BASE}/works`,
      `${BASE}/works/fest-for-music`,
    ]);
  });

  it("dates the Works Page at its newest Work", () => {
    const entries = sitemapEntries({
      base: BASE,
      landing: null,
      works: [...works].reverse(),
    });

    expect(entries[1]?.lastModified).toBe("2026-09-15T00:00:00.000Z");
  });

  it("leaves both lastModified fields out when nothing offers a date", () => {
    const entries = sitemapEntries({
      base: BASE,
      landing: null,
      works: [],
    });

    expect(entries).toEqual([
      { url: `${BASE}/`, changeFrequency: "weekly", priority: 1 },
      { url: `${BASE}/works`, changeFrequency: "weekly", priority: 0.9 },
    ]);
  });
});
