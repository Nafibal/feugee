import { describe, expect, it } from "vitest";

import { accessibleHeroTitle, normalizeRotatingWords } from "./heroTitle";

describe("normalizeRotatingWords", () => {
  it("keeps filled words and trims surrounding whitespace", () => {
    expect(
      normalizeRotatingWords([{ id: "1", word: " Motion " }, { id: "2", word: "Design" }]),
    ).toEqual(["Motion", "Design"]);
  });

  it("drops wordless rows — a mid-edit Live Preview state", () => {
    expect(
      normalizeRotatingWords([{ id: "1", word: "Motion" }, { id: "2", word: null }]),
    ).toEqual(["Motion"]);
  });

  it("drops rows that are blank after trimming", () => {
    expect(
      normalizeRotatingWords([{ id: "1", word: "   " }, { id: "2", word: "" }]),
    ).toEqual([]);
  });

  it("returns an empty list for null and undefined", () => {
    expect(normalizeRotatingWords(null)).toEqual([]);
    expect(normalizeRotatingWords(undefined)).toEqual([]);
  });
});

describe("accessibleHeroTitle", () => {
  it("joins the title, the lead-in, and every word", () => {
    expect(
      accessibleHeroTitle("We're Feugee", ["Motion", "Design", "Experience"]),
    ).toBe("We're Feugee Into Motion, Design, Experience");
  });

  it("falls back to the bare title when there are no words", () => {
    expect(accessibleHeroTitle("We're Feugee", [])).toBe("We're Feugee");
  });
});
