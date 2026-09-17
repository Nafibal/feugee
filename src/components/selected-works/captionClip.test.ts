import { describe, expect, it } from "vitest";

import {
  SEAM_BRIDGE_PX,
  clipInsetsFor,
  formatClipPath,
  type Rect,
} from "./captionClip";

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

describe("SEAM_BRIDGE_PX", () => {
  it("bridges half of the gap-1 (4px) seam between cards", () => {
    expect(SEAM_BRIDGE_PX).toBe(2);
  });
});

describe("clipInsetsFor", () => {
  it("shows the whole caption when the Work covers the zone", () => {
    expect(clipInsetsFor(zone, card({}))).toEqual({
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    });
  });

  it("cuts the caption's top while the Work enters from below", () => {
    const insets = clipInsetsFor(zone, card({ top: 800, bottom: 1760 }));
    expect(insets).toEqual({ top: 98, right: 0, bottom: 0, left: 0 });
  });

  it("cuts the caption's bottom while the Work leaves upward", () => {
    const insets = clipInsetsFor(zone, card({ top: -110, bottom: 850 }));
    expect(insets).toEqual({ top: 0, right: 0, bottom: 98, left: 0 });
  });

  it("hides the caption when the Work is entirely below the zone", () => {
    const insets = clipInsetsFor(zone, card({ top: 1000, bottom: 1960 }));
    expect(insets).toEqual({ top: 250, right: 0, bottom: 0, left: 0 });
  });

  it("hides the caption when the Work is entirely above the zone", () => {
    const insets = clipInsetsFor(zone, card({ top: -960, bottom: -10 }));
    expect(insets).toEqual({ top: 250, right: 0, bottom: 0, left: 0 });
  });

  it("hands off across the seam so adjacent Works cover the zone fully", () => {
    const leaving = clipInsetsFor(zone, card({ top: -960, bottom: 701 }));
    const entering = clipInsetsFor(zone, card({ top: 705, bottom: 1665 }));
    // leaving shows [700,703], entering shows [703,950] — no hole.
    expect(leaving.bottom).toBe(247);
    expect(entering.top).toBe(3);
  });

  it("leaves a hole across the seam when bridging is disabled", () => {
    const leaving = clipInsetsFor(zone, card({ top: -960, bottom: 701 }), 0);
    const entering = clipInsetsFor(zone, card({ top: 705, bottom: 1665 }), 0);
    // leaving shows [700,701], entering shows [705,950] — a 4px blink.
    expect(leaving.bottom).toBe(249);
    expect(entering.top).toBe(5);
  });

  it("hides the caption on exact contact when bridging is disabled", () => {
    const insets = clipInsetsFor(
      zone,
      card({ top: -960, bottom: zone.top }),
      0,
    );
    expect(insets).toEqual({ top: 250, right: 0, bottom: 0, left: 0 });
  });

  it("clips horizontally when the Work only partially overlaps sideways", () => {
    const covering = clipInsetsFor(zone, card({ left: -100, right: 1380 }));
    expect(covering).toEqual({ top: 0, right: 0, bottom: 0, left: 0 });

    const narrower = clipInsetsFor(zone, card({ left: 0, right: 1180 }));
    expect(narrower).toEqual({ top: 0, right: 100, bottom: 0, left: 0 });

    const shiftedRight = clipInsetsFor(zone, card({ left: 100, right: 1380 }));
    expect(shiftedRight).toEqual({ top: 0, right: 0, bottom: 0, left: 100 });
  });

  it("never shows a sliver for a zero-height zone", () => {
    const flat: Rect = { top: 700, right: 1280, bottom: 700, left: 0 };
    const insets = clipInsetsFor(flat, card({}));
    expect(insets).toEqual({ top: 0, right: 0, bottom: 0, left: 0 });
    // A flat zone cannot be half-revealed; the formatter still emits a
    // valid inset() string for it.
    expect(formatClipPath(insets)).toBe("inset(0px 0px 0px 0px)");
  });
});

describe("formatClipPath", () => {
  it("emits inset() in CSS top-right-bottom-left order", () => {
    expect(
      formatClipPath({ top: 10, right: 20, bottom: 30, left: 40 }),
    ).toBe("inset(10px 20px 30px 40px)");
  });

  it("rounds sub-pixel noise to two decimals", () => {
    expect(
      formatClipPath({
        top: 98.000000001,
        right: 0.123456,
        bottom: 1.006,
        left: 0,
      }),
    ).toBe("inset(98px 0.12px 1.01px 0px)");
  });
});
