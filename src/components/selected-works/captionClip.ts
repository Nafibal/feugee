export interface Rect {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface ClipInsets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

// Half of the gap-1 (4px) seam between Selected Works cards. Each Work's
// bounds are inflated by this vertically so the Pinned Caption hands off
// across the seam instead of blinking in the 4px where no Work covers it.
export const SEAM_BRIDGE_PX = 2;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

// How much of the caption zone (its box) the Work leaves uncovered, as
// clip-path insets: the caption is visible only where the Work overlaps it.
export const clipInsetsFor = (
  zone: Rect,
  item: Rect,
  bridge: number = SEAM_BRIDGE_PX,
): ClipInsets => {
  const height = zone.bottom - zone.top;
  const width = zone.right - zone.left;

  const top = clamp(item.top - bridge - zone.top, 0, height);
  const bottom = clamp(zone.bottom - (item.bottom + bridge), 0, height);
  const left = clamp(item.left - zone.left, 0, width);
  const right = clamp(zone.right - item.right, 0, width);

  // Rects that don't overlap (or a degenerate zone) sum past the box size;
  // collapse to one full inset so the element is deterministically hidden.
  if (top + bottom >= height || left + right >= width) {
    return { top: height, right: 0, bottom: 0, left: 0 };
  }

  return { top, right, bottom, left };
};

export const formatClipPath = (insets: ClipInsets): string => {
  const px = (value: number) => `${Math.round(value * 100) / 100}px`;
  return `inset(${px(insets.top)} ${px(insets.right)} ${px(insets.bottom)} ${px(insets.left)})`;
};
