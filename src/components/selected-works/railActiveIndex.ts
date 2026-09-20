import type { Rect } from "./captionClip";

/**
 * The Work the Works Rail marks: the one covering the most of a probe
 * zone. The rail feeds a hairline band at its own vertical middle, so
 * the mark names the Work the rail is sitting on and flips exactly as
 * the seam between two cards crosses it.
 *
 * null means nothing covers the probe — the seam gap, or past the
 * section's ends; callers keep the last mark.
 */
export const railActiveIndex = (
  zone: Rect,
  cards: readonly Rect[],
): number | null => {
  let best = -1;
  let bestOverlap = 0;
  cards.forEach((card, index) => {
    const overlap = Math.max(
      0,
      Math.min(zone.bottom, card.bottom) - Math.max(zone.top, card.top),
    );
    // Strictly greater: at an exact tie the leaving Work keeps the mark.
    if (overlap > bestOverlap) {
      bestOverlap = overlap;
      best = index;
    }
  });
  return best >= 0 ? best : null;
};

/**
 * The arrow's translateY, centering it vertically on the rail entry it
 * marks. A taller arrow than its entry starts above the entry's top —
 * still centered.
 */
export const railArrowOffsetY = (
  entryTop: number,
  entryHeight: number,
  arrowHeight: number,
): number => entryTop + (entryHeight - arrowHeight) / 2;
