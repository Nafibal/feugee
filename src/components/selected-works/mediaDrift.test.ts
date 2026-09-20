import { describe, expect, it } from "vitest";

import { MEDIA_OVERSHOOT, driftTravelPercent } from "./mediaDrift";

describe("driftTravelPercent", () => {
  it("travels the overshoot as a share of the media's own height", () => {
    // Worked example: a 1.15× media on a 1000px card is 1150px tall and can
    // slide 150px — which is 15/115 of its own height.
    expect(driftTravelPercent(1.15)).toBeCloseTo((15 / 115) * 100, 10);
  });

  it("slides exactly the overshoot, keeping the card covered", () => {
    const card = 1000;
    const media = card * MEDIA_OVERSHOOT;
    const travelPx = (driftTravelPercent(MEDIA_OVERSHOOT) / 100) * media;

    // Start, media translated up by the full travel: its bottom sits flush
    // with the card's bottom (nothing falls short of the card).
    expect(media - travelPx).toBeCloseTo(card, 6);
  });
});
