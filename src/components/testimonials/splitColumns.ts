/**
 * Deals the items out round-robin — item 0, 2, 4… to the left column,
 * 1, 3, 5… to the right — so the two counter-scrolling columns stay
 * balanced no matter how many testimonials the agency adds. Order is
 * preserved within each column.
 */
export const splitTestimonialColumns = <T>(
  items: readonly T[],
): [left: T[], right: T[]] => {
  const left: T[] = [];
  const right: T[] = [];
  items.forEach((item, index) => {
    (index % 2 === 0 ? left : right).push(item);
  });
  return [left, right];
};
