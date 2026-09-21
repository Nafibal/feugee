import { describe, expect, it } from "vitest";

import { shouldBlackout } from "./shouldBlackout";

describe("shouldBlackout", () => {
  it("animates navigations to a different page", () => {
    expect(shouldBlackout("/", "/works")).toBe(true);
    expect(shouldBlackout("/works/alpha", "/works/beta")).toBe(true);
    expect(shouldBlackout("/works", "/")).toBe(true);
  });

  it("animates a click on a link to the current page — the scroll reset hides under the cover", () => {
    expect(shouldBlackout("/", "/")).toBe(true);
    expect(shouldBlackout("/works/alpha", "/works/alpha")).toBe(true);
  });

  it("exempts query-only changes — the Works Page sector filter", () => {
    expect(shouldBlackout("/works", "/works?sector=film")).toBe(false);
    expect(shouldBlackout("/works?sector=film", "/works?sector=photo")).toBe(
      false,
    );
    expect(shouldBlackout("/works?sector=film", "/works")).toBe(false);
  });

  it("exempts in-page anchor jumps — only the hash differs", () => {
    expect(shouldBlackout("/", "/#contact")).toBe(false);
    expect(shouldBlackout("/#contact", "/")).toBe(false);
    expect(shouldBlackout("/works#about", "/works#contact")).toBe(false);
  });

  it("animates a hash link to a different page", () => {
    expect(shouldBlackout("/", "/works#section")).toBe(true);
  });

  it("never animates external origins", () => {
    expect(shouldBlackout("/", "https://example.com/works")).toBe(false);
  });

  it("never animates into the CMS Dashboard, even from CMS-managed link URLs", () => {
    expect(shouldBlackout("/", "/admin")).toBe(false);
    expect(shouldBlackout("/", "/admin/login")).toBe(false);
  });

  it("classifies absolute same-origin URLs like relative ones", () => {
    expect(
      shouldBlackout("http://localhost:3000/", "http://localhost:3000/works"),
    ).toBe(true);
    expect(
      shouldBlackout(
        "http://localhost:3000/works?sector=film",
        "http://localhost:3000/works",
      ),
    ).toBe(false);
  });

  it("classifies the runtime call shape: absolute current URL, relative target", () => {
    expect(
      shouldBlackout("http://localhost:3000/works/alpha", "/"),
    ).toBe(true);
    expect(
      shouldBlackout("http://localhost:3000/works", "/works?sector=film"),
    ).toBe(false);
  });

  it("treats trailing-slash variants as the same page", () => {
    expect(shouldBlackout("/works", "/works/")).toBe(true);
  });
});
