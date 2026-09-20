/**
 * Pure helpers for the Hero title. The lead-in is structural copy, hardcoded
 * here and shared with the component — the agency-managed part is only the
 * word list.
 */

// "Into" — the fixed word ahead of the Rotating Word on the title's second line.
export const HERO_LEAD_IN = "Into";

// Structural stand-in for the CMS rows: wordless rows are a mid-edit Live
// Preview state, not an error.
interface RotatingWordRow {
  id?: string | null;
  word?: string | null;
}

export const normalizeRotatingWords = (
  rows: readonly RotatingWordRow[] | null | undefined,
): string[] =>
  (rows ?? []).flatMap((row) => {
    const word = row.word?.trim();
    return word ? [word] : [];
  });

export const accessibleHeroTitle = (
  title: string,
  words: readonly string[],
): string =>
  words.length > 0 ? `${title} ${HERO_LEAD_IN} ${words.join(", ")}` : title;
