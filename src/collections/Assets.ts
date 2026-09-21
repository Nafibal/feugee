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
      name: "poster",
      type: "upload",
      relationTo: "assets",
      // Payload stores no dimensions for videos, so the poster image is the
      // only thing that can hold the video's aspect ratio — grids and masonry
      // read it from the poster instead of the video itself.
      filterOptions: () => ({ mimeType: { like: "image/" } }),
      admin: {
        condition: (data) =>
          typeof data?.mimeType === "string" &&
          data.mimeType.startsWith("video/"),
        description:
          "Image shown before the video plays. Pick one with the same frame size as the video — it fixes the video's slot in grids and the masonry.",
      },
    },
  ],
}
