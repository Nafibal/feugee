import type { GlobalConfig } from "payload"

// Site chrome rather than Landing Page content, so this lives on its own
// global — the (frontend) root layout mounts the Footer on every public page.
export const Footer: GlobalConfig = {
  slug: "footer",
  label: "Footer",
  admin: {
    description: "The content of the Footer at the bottom of every public page.",
  },
  access: {
    read: () => true,
  },
  versions: {
    drafts: {
      autosave: true,
    },
    max: 50,
  },
  fields: [
    {
      type: "group",
      name: "about",
      label: "About",
      fields: [
        {
          name: "heading",
          type: "text",
          defaultValue: "About",
        },
        {
          name: "description",
          type: "textarea",
        },
      ],
    },
    {
      name: "otherWorksHeading",
      type: "text",
      defaultValue: "Other Works",
      admin: {
        description: "Heading above the Other Works cards.",
      },
    },
    {
      name: "otherWorks",
      type: "relationship",
      relationTo: "works",
      hasMany: true,
      filterOptions: () => ({ _status: { equals: "published" } }),
      admin: {
        description: "Works shown as cards beside the About blurb, in display order.",
      },
    },
    {
      name: "menuHeading",
      type: "text",
      defaultValue: "Menu",
      admin: {
        description: "Heading above the menu links.",
      },
    },
    {
      name: "menuLinks",
      type: "array",
      labels: {
        singular: "Menu Link",
        plural: "Menu Links",
      },
      fields: [
        {
          name: "label",
          type: "text",
          required: true,
        },
        {
          name: "url",
          type: "text",
          required: true,
        },
      ],
    },
    {
      type: "group",
      name: "contact",
      label: "Contact",
      fields: [
        {
          name: "heading",
          type: "text",
          defaultValue: "Contact Us",
        },
        {
          name: "callToAction",
          type: "text",
          admin: {
            description: 'The call-to-action label — e.g. "Book a Call". Links out when a URL is set.',
          },
        },
        {
          name: "callToActionUrl",
          type: "text",
        },
        {
          name: "email",
          type: "email",
        },
        {
          name: "phone",
          type: "text",
        },
      ],
    },
    {
      name: "wordmark",
      type: "text",
      defaultValue: "FEUGEE STUDIO",
      admin: {
        description: "The oversized display wordmark above the bottom bar.",
      },
    },
    {
      name: "location",
      type: "text",
      admin: {
        description: "The pinned location label in the bottom bar.",
      },
    },
    {
      name: "copyrightName",
      type: "text",
      defaultValue: "Feugee",
      admin: {
        description: "Who holds the copyright in the bottom bar — e.g. \"Feugee\".",
      },
    },
  ],
}
