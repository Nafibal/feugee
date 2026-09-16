import { describe, expect, it } from "vitest";

import type { Footer } from "@/payload-types";

import { toMenuLinks } from "./menuLinks";

const menuLink = (
  overrides: Partial<NonNullable<Footer["menuLinks"]>[number]> = {},
): NonNullable<Footer["menuLinks"]>[number] => ({
  label: "Works",
  url: "/works",
  ...overrides,
});

describe("toMenuLinks", () => {
  it("maps null and undefined to an empty list", () => {
    expect(toMenuLinks(null)).toEqual([]);
    expect(toMenuLinks(undefined)).toEqual([]);
  });

  it("maps a populated list through with trimmed label and url", () => {
    expect(
      toMenuLinks([menuLink({ id: "1", label: " Works ", url: " /works " })]),
    ).toEqual([{ id: "1", label: "Works", url: "/works" }]);
  });

  it("drops a link whose label is only whitespace", () => {
    expect(toMenuLinks([menuLink({ label: "  " })])).toEqual([]);
  });

  it("drops a link whose url is only whitespace", () => {
    expect(toMenuLinks([menuLink({ url: " " })])).toEqual([]);
  });

  it("keeps the row id when Payload provides one", () => {
    expect(toMenuLinks([menuLink({ id: "abc123" })])).toEqual([
      { id: "abc123", label: "Works", url: "/works" },
    ]);
  });

  it("synthesizes a stable id from label and url when the row id is missing", () => {
    const [link] = toMenuLinks([menuLink({ id: null })]);
    expect(link.id).toBe("Works:/works");
  });
});
