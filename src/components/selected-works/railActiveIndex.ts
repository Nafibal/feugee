import type { Rect } from "./captionClip";

/**
 * The Work the Works Rail marks: the one covering the most of the caption
 * zone. That is the same seam the Pinned Caption hands off across — the
 * entering Work takes the mark exactly when it covers more of the zone
 * than the leaving one, i.e. as the seam sweeps past the zone's middle.
 * The gap-1 seam never blanks the mark: one of the two always covers more.
 *
 * null means no Work touches the zone at all; callers keep the last mark.
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
