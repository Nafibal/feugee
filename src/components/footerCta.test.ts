import { describe, expect, it } from "vitest";

import { hasFooterCtaContent, toFooterCta } from "./footerCta";

describe("toFooterCta", () => {
  it("keeps filled fields and trims surrounding whitespace", () => {
    expect(
      toFooterCta({
        eyebrow: " Free 20-min intro call ",
        headline: "Tell us what you're building",
        body: "Tell us about your goals.",
        actionLabel: " Work with us ",
        actionUrl: " /contact ",
      }),
    ).toEqual({
      eyebrow: "Free 20-min intro call",
      headline: "Tell us what you're building",
      body: "Tell us about your goals.",
      actionLabel: "Work with us",
      actionUrl: "/contact",
    });
  });

  it("reads blank fields as null — a mid-edit Live Preview state", () => {
    expect(toFooterCta({ headline: "   ", body: null })).toEqual({
      eyebrow: null,
      headline: null,
      body: null,
      actionLabel: null,
      actionUrl: null,
    });
  });

  it("returns all-null content for null and undefined", () => {
    const absent = {
      eyebrow: null,
      headline: null,
      body: null,
      actionLabel: null,
      actionUrl: null,
    };
    expect(toFooterCta(null)).toEqual(absent);
    expect(toFooterCta(undefined)).toEqual(absent);
  });
});

describe("hasFooterCtaContent", () => {
  it("shows the section when any visible field is filled", () => {
    expect(hasFooterCtaContent(toFooterCta({ eyebrow: "Hi" }))).toBe(true);
    expect(hasFooterCtaContent(toFooterCta({ actionLabel: "Work with us" }))).toBe(true);
  });

  it("hides the section when only the URL is set — it only completes the button", () => {
    expect(hasFooterCtaContent(toFooterCta({ actionUrl: "/contact" }))).toBe(false);
  });

  it("hides the section for absent content", () => {
    expect(hasFooterCtaContent(toFooterCta(undefined))).toBe(false);
  });
});
