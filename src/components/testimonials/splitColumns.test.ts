import { describe, expect, it } from "vitest";

import { splitTestimonialColumns } from "./splitColumns";

describe("splitTestimonialColumns", () => {
  it("deals items round-robin so the columns interleave", () => {
    expect(splitTestimonialColumns(["a", "b", "c", "d"])).toEqual([
      ["a", "c"],
      ["b", "d"],
    ]);
  });

  it("keeps order within each column", () => {
    const [left, right] = splitTestimonialColumns([1, 2, 3, 4, 5, 6]);
    expect(left).toEqual([1, 3, 5]);
    expect(right).toEqual([2, 4, 6]);
  });

  it("sends an odd trailing item to the left column", () => {
    expect(splitTestimonialColumns(["a", "b", "c"])).toEqual([
      ["a", "c"],
      ["b"],
    ]);
  });

  it("returns two empty columns for no items", () => {
    expect(splitTestimonialColumns([])).toEqual([[], []]);
  });
});
