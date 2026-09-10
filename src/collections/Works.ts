import type { CollectionConfig } from "payload";

import { layoutBlocks } from "../blocks/layouts";
import { slugField } from "../utilities/slug";

export const Works: CollectionConfig = {
  slug: "works",
  labels: {
    singular: "Work",
    plural: "Works",
  },
  orderable: true,
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "sector", "_status"],
    livePreview: {
      url: ({ data }) => {
        if (typeof data.slug === "string" && data.slug.length > 0) {
          return `/works/${data.slug}`;
        }
        return undefined;
      },
      breakpoints: [
        { label: "Mobile", name: "mobile", width: 375, height: 667 },
        { label: "Tablet", name: "tablet", width: 768, height: 1024 },
      ],
    },
  },
  access: {
    read: () => true,
  },
  versions: {
    drafts: {
      autosave: true,
    },
    maxPerDoc: 50,
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    slugField("title"),
    {
      name: "subtitle",
      type: "text",
    },
    {
      name: "thumbnail",
      type: "upload",
      relationTo: "assets",
      admin: {
        description: "The primary visual for this Work, shown at the top of the Work Detail Page.",
      },
    },
    {
      name: "tags",
      type: "text",
      hasMany: true,
      admin: {
        description: "Free-form labels, displayed as chips.",
      },
    },
    {
      name: "description",
      type: "richText",
    },
    {
      name: "client",
      type: "text",
    },
    {
      name: "sector",
      type: "relationship",
      relationTo: "sectors",
    },
    {
      name: "associate",
      type: "text",
      admin: {
        description: "The project lead responsible for this Work.",
      },
    },
    {
      name: "expertise",
      type: "text",
      hasMany: true,
    },
    {
      name: "projectTeam",
      type: "text",
      hasMany: true,
      admin: {
        description: "Feugee's own staff credited on this Work.",
      },
    },
    {
      name: "collaborators",
      type: "text",
      hasMany: true,
      admin: {
        description: "People outside Feugee credited on this Work.",
      },
    },
    {
      name: "testimonials",
      type: "array",
      labels: {
        singular: "Testimonial",
        plural: "Testimonials",
      },
      fields: [
        {
          name: "name",
          type: "text",
          required: true,
        },
        {
          name: "job",
          type: "text",
        },
        {
          name: "company",
          type: "text",
        },
        {
          name: "testimony",
          type: "textarea",
          required: true,
        },
      ],
    },
    {
      name: "sections",
      type: "array",
      labels: {
        singular: "Section",
        plural: "Sections",
      },
      admin: {
        description: "The content of the Work Detail Page, in sidebar order.",
      },
      fields: [
        {
          name: "title",
          type: "text",
          required: true,
        },
        {
          name: "layouts",
          type: "blocks",
          labels: {
            singular: "Layout",
            plural: "Layouts",
          },
          blocks: layoutBlocks,
          minRows: 1,
        },
      ],
    },
  ],
};
