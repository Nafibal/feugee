import type { CollectionConfig } from "payload"

import { adminAuth } from "./userAuth"

export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    useAsTitle: "email",
  },
  auth: adminAuth(process.env.NODE_ENV === "production"),
  fields: [
    {
      name: "name",
      type: "text",
    },
  ],
}
