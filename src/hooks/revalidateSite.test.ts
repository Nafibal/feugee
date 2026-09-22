import { describe, expect, it } from "vitest";

import {
  globalRevalidationTargets,
  siteRevalidationTargets,
  workRevalidationTargets,
} from "./revalidateSite";

// The site is a handful of pages and every content type surfaces on at least
// one shared chrome or landing slot, so any published change is a whole-site
// revalidation plus, for Works, the detail page.
const siteTargets = [
  { path: "/", type: "layout" as const },
  { path: "/sitemap.xml" },
];

describe("siteRevalidationTargets", () => {
  it("covers every public page through the root layout, plus the sitemap", () => {
    expect(siteRevalidationTargets).toEqual([
      { path: "/", type: "layout" },
      { path: "/sitemap.xml" },
    ]);
  });
});

describe("workRevalidationTargets", () => {
  it("revalidates the detail page and the site when the Work is published", () => {
    expect(
      workRevalidationTargets({ slug: "solstice", _status: "published" }),
    ).toEqual([{ path: "/works/solstice" }, ...siteTargets]);
  });

  it("keeps the previous detail page and the site when a Work is unpublished", () => {
    expect(
      workRevalidationTargets(
        { slug: "solstice", _status: "draft" },
        { slug: "solstice", _status: "published" },
        false,
      ),
    ).toEqual([{ path: "/works/solstice" }, ...siteTargets]);
  });

  it("revalidates nothing while a published Work is edited as draft", () => {
    // The editing session's autosaves — the published row survives them, so
    // only the eventual publish revalidates.
    expect(
      workRevalidationTargets(
        { slug: "solstice", _status: "draft" },
        { slug: "solstice", _status: "published" },
        true,
      ),
    ).toEqual([]);
  });

  it("revalidates both detail pages when a published Work's slug changes", () => {
    expect(
      workRevalidationTargets(
        { slug: "new-slug", _status: "published" },
        { slug: "old-slug", _status: "published" },
      ),
    ).toEqual([
      { path: "/works/new-slug" },
      { path: "/works/old-slug" },
      ...siteTargets,
    ]);
  });

  it("touches nothing while a never-published Work stays in draft", () => {
    expect(
      workRevalidationTargets(
        { slug: "atlas", _status: "draft" },
        { slug: "atlas", _status: "draft" },
      ),
    ).toEqual([]);
  });

  it("falls back to the site-wide targets when the slug is missing", () => {
    expect(
      workRevalidationTargets({ slug: null, _status: "published" }),
    ).toEqual(siteTargets);
  });
});

describe("globalRevalidationTargets", () => {
  it("revalidates the site when the global is published", () => {
    expect(globalRevalidationTargets({ _status: "published" })).toEqual(
      siteTargets,
    );
  });

  it("revalidates the site when a published global goes back to draft", () => {
    expect(
      globalRevalidationTargets({ _status: "draft" }, { _status: "published" }, false),
    ).toEqual(siteTargets);
  });

  it("revalidates nothing while a published global is edited as draft", () => {
    expect(
      globalRevalidationTargets(
        { _status: "draft" },
        { _status: "published" },
        true,
      ),
    ).toEqual([]);
  });

  it("touches nothing while the global stays in draft", () => {
    expect(globalRevalidationTargets({ _status: "draft" })).toEqual([]);
  });
});
