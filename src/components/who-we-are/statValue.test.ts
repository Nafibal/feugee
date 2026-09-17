import { describe, expect, it } from "vitest";

import { formatStatValue, parseStatValue } from "./statValue";

describe("parseStatValue", () => {
  it("splits a bare number with a suffix", () => {
    expect(parseStatValue("55+")).toEqual({
      prefix: "",
      number: 55,
      decimals: 0,
      suffix: "+",
    });
  });

  it("keeps a suffix that itself starts with a symbol", () => {
    expect(parseStatValue("35+M")).toEqual({
      prefix: "",
      number: 35,
      decimals: 0,
      suffix: "+M",
    });
  });

  it("keeps a leading currency-style prefix", () => {
    expect(parseStatValue("$1.5M")).toEqual({
      prefix: "$",
      number: 1.5,
      decimals: 1,
      suffix: "M",
    });
  });

  it("parses a negative number", () => {
    expect(parseStatValue("-3°")).toEqual({
      prefix: "",
      number: -3,
      decimals: 0,
      suffix: "°",
    });
  });

  it("parses a bare number with no decoration", () => {
    expect(parseStatValue("98")).toEqual({
      prefix: "",
      number: 98,
      decimals: 0,
      suffix: "",
    });
  });

  it("returns null when there is no number to count", () => {
    expect(parseStatValue("many")).toBeNull();
    expect(parseStatValue("")).toBeNull();
  });
});

describe("formatStatValue", () => {
  it("reassembles the figure at the counted value", () => {
    const parsed = parseStatValue("35M+");
    expect(parsed !== null && formatStatValue(parsed, 12)).toBe("12M+");
  });

  it("pads to the parsed decimal places while counting", () => {
    const parsed = parseStatValue("$1.50K");
    expect(parsed !== null && formatStatValue(parsed, 0.4)).toBe("$0.40K");
  });

  it("round-trips the final figure exactly", () => {
    for (const value of ["55+", "35M+", "$1.5M", "98%", "-3°"]) {
      const parsed = parseStatValue(value);
      expect(parsed !== null && formatStatValue(parsed, parsed.number)).toBe(
        value,
      );
    }
  });
});
