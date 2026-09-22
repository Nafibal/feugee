import type { CollectionConfig } from "payload"

import {
  revalidateSiteAfterChange,
  revalidateSiteAfterDelete,
} from "../hooks/revalidateSite"
import { slugField } from "../utilities/slug"

export const Sectors: CollectionConfig = {
  slug: "sectors",
  admin: {
    useAsTitle: "name",
    description: "The industries Works are filed under — drives filtering on the Works Page.",
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
    slugField("name"),
  ],
}
