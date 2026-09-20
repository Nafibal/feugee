import type { GlobalConfig } from "payload"

export const LandingPage: GlobalConfig = {
  slug: "landing-page",
  label: "Landing Page",
  admin: {
    description: "The content of the site's front page, section by section.",
    livePreview: {
      url: "/",
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
    max: 50,
  },
  fields: [
    {
      type: "group",
      name: "hero",
      label: "Hero",
      admin: {
        description:
          "The full-screen opening: the title and its rotating words over a slider of videos.",
      },
      fields: [
        {
          name: "title",
          type: "text",
        },
        {
          name: "subtitle",
          type: "text",
        },
        {
          name: "rotatingWords",
          type: "array",
          labels: {
            singular: "Rotating Word",
            plural: "Rotating Words",
          },
          minRows: 1,
          admin: {
            description:
              "The words that cycle as the title's last word, in order. A single word renders statically.",
          },
          fields: [
            {
              name: "word",
              type: "text",
              required: true,
            },
          ],
        },
        {
          name: "slides",
          type: "array",
          labels: {
            singular: "Slide",
            plural: "Slides",
          },
          minRows: 1,
          fields: [
            {
              name: "video",
              type: "upload",
              relationTo: "assets",
              required: true,
              filterOptions: () => ({ mimeType: { like: "video/" } }),
              admin: {
                description:
                  "Video only. Set the poster on the Asset itself — it is the slide's preview frame.",
              },
            },
          ],
        },
      ],
    },
    {
      type: "group",
      name: "whoWeAre",
      label: "Who We Are",
      fields: [
        {
          name: "heading",
          type: "text",
          defaultValue: "Who We Are",
        },
        {
          name: "description",
          type: "textarea",
        },
      ],
    },
    {
      name: "stats",
      type: "array",
      labels: {
        singular: "Stat",
        plural: "Stats",
      },
      admin: {
        description: "Proof figures shown together — e.g. 55+ / Videos.",
      },
      fields: [
        {
          name: "value",
          type: "text",
          required: true,
          admin: {
            description: 'The figure — e.g. "55+" or "35+M".',
          },
        },
        {
          name: "label",
          type: "text",
          required: true,
        },
      ],
    },
    {
      name: "selectedWorks",
      type: "relationship",
      relationTo: "works",
      hasMany: true,
      filterOptions: () => ({ _status: { equals: "published" } }),
      admin: {
        description: "Works featured on the Landing Page, in display order.",
      },
    },
    {
      type: "group",
      name: "testimonials",
      label: "Testimonials",
      admin: {
        description:
          "Endorsements of the agency, shown below Selected Works in two counter-scrolling columns.",
      },
      fields: [
        {
          name: "heading",
          type: "text",
          defaultValue: "Testimonials",
        },
        {
          name: "description",
          type: "textarea",
        },
        {
          name: "items",
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
      ],
    },
    {
      type: "group",
      name: "contactCta",
      label: "Contact CTA",
      admin: {
        description:
          "The closing call-to-action section: eyebrow, headline, body copy, and the button.",
      },
      fields: [
        {
          name: "eyebrow",
          type: "text",
          admin: {
            description: 'The small line above the headline — e.g. "Free 20-min intro call".',
          },
        },
        {
          name: "headline",
          type: "text",
        },
        {
          name: "body",
          type: "textarea",
        },
        {
          name: "actionLabel",
          type: "text",
          admin: {
            description: 'The button label — e.g. "Work with us".',
          },
        },
        {
          name: "actionUrl",
          type: "text",
          admin: {
            description:
              "Where the button points — internal path or external URL. Without it the button renders inert.",
          },
        },
      ],
    },
  ],
}
