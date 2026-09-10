import type { Block } from "payload"

import { assetItem, textItem, titledTextItem, titleItem } from "./items"

const layoutBlock = (options: {
  slug: string
  label: string
  slots: number
  geometry: string
}): Block => ({
  slug: options.slug,
  labels: { singular: options.label, plural: options.label },
  fields: [
    {
      name: "items",
      type: "blocks",
      labels: { singular: "Item", plural: "Items" },
      blocks: [titleItem, titledTextItem, textItem, assetItem],
      minRows: options.slots,
      maxRows: options.slots,
      admin: {
        description: options.geometry,
      },
    },
  ],
})

// The vocabulary is provisional until the Agency finalises each layout's spec —
// see docs/adr/0003-named-layouts-with-fixed-item-slots.md.
export const layoutBlocks: Block[] = [
  layoutBlock({
    slug: "one-column",
    label: "One column",
    slots: 1,
    geometry: "A single item at full width.",
  }),
  layoutBlock({
    slug: "two-column",
    label: "Two column",
    slots: 2,
    geometry: "Two items side by side.",
  }),
  layoutBlock({
    slug: "three-column",
    label: "Three column",
    slots: 3,
    geometry: "Three items side by side.",
  }),
  layoutBlock({
    slug: "feature-left",
    label: "Feature left",
    slots: 3,
    geometry:
      "Item 1 spans two rows on the left; items 2 and 3 stack on the top and bottom right.",
  }),
]
