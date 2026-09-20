import { describe, expect, it } from "vitest";

import { railActiveIndex, railArrowOffsetY } from "./railActiveIndex";
import type { Rect } from "./captionClip";

// A caption zone anchored to the bottom of a 1280x960 viewport, and
// full-bleed viewport-tall cards to scroll through it.
const zone: Rect = { top: 700, right: 1280, bottom: 950, left: 0 };
const card = (over: Partial<Rect>): Rect => ({
  top: 0,
  right: 1280,
  bottom: 960,
  left: 0,
  ...over,
});

describe("railActiveIndex", () => {
  it("marks the first Work when it covers the zone", () => {
    expect(
      railActiveIndex(zone, [card({}), card({ top: 964, bottom: 1924 })]),
    ).toBe(0);
  });

  it("hands off to the entering Work once it covers more of the zone", () => {
    // Seam just above the zone's middle: the leaving Work still wins…
    expect(
      railActiveIndex(zone, [
        card({ bottom: 825 }),
        card({ top: 829, bottom: 1789 }),
      ]),
    ).toBe(0);
    // …one seam-step later the entering Work covers more of it.
    expect(
      railActiveIndex(zone, [
        card({ bottom: 820 }),
        card({ top: 824, bottom: 1784 }),
      ]),
    ).toBe(1);
  });

  it("keeps the leaving Work at an exact tie", () => {
    expect(
      railActiveIndex(zone, [
        card({ bottom: 825 }),
        card({ top: 825, bottom: 1785 }),
      ]),
    ).toBe(0);
  });

  it("marks the middle Work of three when it covers the zone", () => {
    expect(
      railActiveIndex(zone, [
        card({ top: -960, bottom: -10 }),
        card({ top: 450, bottom: 1410 }),
        card({ top: 1414, bottom: 2374 }),
      ]),
    ).toBe(1);
  });

  it("returns null when no Work touches the zone", () => {
    expect(
      railActiveIndex(zone, [
        card({ top: -960, bottom: -10 }),
        card({ top: 1000, bottom: 1960 }),
      ]),
    ).toBeNull();
  });
});

describe("railArrowOffsetY", () => {
  it("centers a shorter arrow on its entry", () => {
    expect(railArrowOffsetY(334, 20, 16)).toBe(336);
  });

  it("centers a taller arrow by starting above the entry's top", () => {
    expect(railArrowOffsetY(100, 20, 24)).toBe(98);
  });
});
