import type { CollectionConfig } from "payload"

import {
  revalidateSiteAfterChange,
  revalidateSiteAfterDelete,
} from "../hooks/revalidateSite"

export const Clients: CollectionConfig = {
  slug: "clients",
  labels: {
    singular: "Client",
    plural: "Clients",
  },
  orderable: true,
  admin: {
    useAsTitle: "name",
    description:
      "The external companies Works are made for — drives the Client Marquee on the Landing Page. Drag order is the marquee order.",
    defaultColumns: ["name", "logo"],
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateSiteAfterChange],
    afterDelete: [revalidateSiteAfterDelete],
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "logo",
      type: "upload",
      relationTo: "assets",
      required: true,
      filterOptions: () => ({ mimeType: { like: "image/" } }),
      admin: {
        description:
          "Image only — SVG especially welcome. The marquee applies its own colour treatment at render time.",
      },
    },
    {
      name: "url",
      type: "text",
      admin: {
        description: "Optional link to the client's website.",
      },
    },
  ],
}
