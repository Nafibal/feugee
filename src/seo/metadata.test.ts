import { describe, expect, it } from "vitest";

import { pageMetadata } from "./metadata";

describe("pageMetadata", () => {
  it("builds the full tag set for a page with everything set", () => {
    expect(
      pageMetadata({
        title: "Fest for Music — Feugee",
        description: "A festival identity in motion.",
        url: "/works/fest-for-music",
        image: { url: "/d.webp", width: 1600, height: 900, alt: "Stage lights" },
      }),
    ).toEqual({
      title: "Fest for Music — Feugee",
      description: "A festival identity in motion.",
      alternates: { canonical: "/works/fest-for-music" },
      openGraph: {
        title: "Fest for Music — Feugee",
        description: "A festival identity in motion.",
        url: "/works/fest-for-music",
        siteName: "Feugee",
        type: "website",
        images: [{ url: "/d.webp", width: 1600, height: 900, alt: "Stage lights" }],
      },
      twitter: {
        card: "summary_large_image",
        title: "Fest for Music — Feugee",
        description: "A festival identity in motion.",
        images: ["/d.webp"],
      },
    });
  });

  it("trims a blank description to an omitted one", () => {
    const result = pageMetadata({ title: "Feugee", description: "   " });

    expect(result.description).toBeUndefined();
    expect(result.openGraph?.description).toBeUndefined();
    expect(result.twitter?.description).toBeUndefined();
  });

  it("omits canonical and og:url without a page url", () => {
    const result = pageMetadata({ title: "Feugee" });

    expect(result.alternates).toBeUndefined();
    expect(result.openGraph?.url).toBeUndefined();
  });

  it("carries no image tags when the page offers none", () => {
    const result = pageMetadata({ title: "Feugee" });

    expect(result.openGraph?.images).toBeUndefined();
    expect(result.twitter?.images).toBeUndefined();
    expect(result.twitter).toMatchObject({ card: "summary" });
  });

  it("keeps an unmeasured image's url and alt without dimensions", () => {
    const result = pageMetadata({
      title: "Feugee",
      image: { url: "/d.webp", alt: "A gradient" },
    });

    expect(result.openGraph?.images).toEqual([{ url: "/d.webp", alt: "A gradient" }]);
    expect(result.twitter).toMatchObject({ card: "summary_large_image" });
  });
});
