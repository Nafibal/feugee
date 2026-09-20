/**
 * The Selected Works media drift: each card's media is taller than its card
 * by MEDIA_OVERSHOOT and translates from bottom-flush to top-flush while the
 * card traverses the viewport, so it lags behind the scroll instead of
 * tracking it one-to-one.
 */
export const MEDIA_OVERSHOOT = 1.15;

/** The drift distance in percent of the media's own height. */
export const driftTravelPercent = (overshoot: number): number =>
  (1 - 1 / overshoot) * 100;
