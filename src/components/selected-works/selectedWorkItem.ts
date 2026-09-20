import type { Work } from "@/payload-types";

import { toCardWork, type CardWork } from "@/components/work";

/** A Selected Works card: the card core plus the Year its caption shows. */
export interface SelectedWorkItem extends CardWork {
  year: number | null;
}

// The card guards (published, populated, usable Thumbnail) live in
// toCardWork; this adds only what the Pinned Caption displays.
export const toSelectedWorkItem = (
  work: number | Work,
): SelectedWorkItem | null => {
  if (typeof work !== "object") return null;
  const card = toCardWork(work);
  if (card === null) return null;

  return {
    ...card,
    year: work.year ?? null,
  };
};
