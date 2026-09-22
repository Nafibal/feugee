import type { Work } from "@/payload-types";

import {
  toCardWork,
  workFeatureVisualOf,
  workThumbnailOf,
  type CardWork,
} from "@/components/work";

/** A Selected Works card: the card core plus the Year its caption shows. */
export interface SelectedWorkItem extends CardWork {
  year: number | null;
}

// The card guards (published, populated, usable visual) live in toCardWork;
// this adds the section's visual preference — the Feature Visual, which wins
// only when usable — and what the Pinned Caption displays. Cards are
// full-bleed (100vw × 100svh), so the visual requests the wide variant.
export const toSelectedWorkItem = (
  work: number | Work,
): SelectedWorkItem | null => {
  if (typeof work !== "object") return null;
  const card = toCardWork(
    work,
    workFeatureVisualOf(work, "wide") ?? workThumbnailOf(work, "wide"),
  );
  if (card === null) return null;

  return {
    ...card,
    year: work.year ?? null,
  };
};
