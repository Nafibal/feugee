import type { TextField } from "payload"

export const formatSlug = (value: string): string =>
  value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

export const slugField = (sourceField: string): TextField => ({
  name: "slug",
  type: "text",
  unique: true,
  index: true,
  admin: {
    position: "sidebar",
    description: `Generated from the ${sourceField} — edit only if you need a different URL.`,
  },
  hooks: {
    beforeValidate: [
      ({ value, data }) => {
        if (typeof value === "string" && value.length > 0) {
          return formatSlug(value)
        }
        const source = data?.[sourceField]
        if (typeof source === "string") {
          return formatSlug(source)
        }
        return value
      },
    ],
  },
})
