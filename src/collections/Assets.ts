import type { CollectionConfig } from "payload"

export const Assets: CollectionConfig = {
  slug: "assets",
  labels: {
    singular: "Asset",
    plural: "Assets",
  },
  admin: {
    useAsTitle: "filename",
    description: "Images and videos referenced by site content.",
  },
  access: {
    read: () => true,
  },
  upload: {
    mimeTypes: ["image/*", "video/*"],
    // Videos pass through untouched — sizes are only generated for images.
    imageSizes: [
      { name: "thumbnail", width: 640 },
      { name: "tablet", width: 1024 },
      { name: "desktop", width: 1600 },
    ],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
      admin: {
        description:
          "Describes the image or video for screen readers and search engines.",
      },
    },
    {
      name: "caption",
      type: "text",
    },
  ],
}
