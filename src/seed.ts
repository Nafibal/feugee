import { getPayload } from "payload"
import sharp from "sharp"
import { z } from "zod"

import config from "./payload.config"

const seedEnv = z
  .object({
    PAYLOAD_ADMIN_EMAIL: z.email(),
    PAYLOAD_ADMIN_PASSWORD: z.string().min(8),
  })
  .parse(process.env)

const payload = await getPayload({ config })

const existing = await payload.find({
  collection: "users",
  limit: 1,
})

if (existing.docs.length === 0) {
  await payload.create({
    collection: "users",
    data: {
      email: seedEnv.PAYLOAD_ADMIN_EMAIL,
      password: seedEnv.PAYLOAD_ADMIN_PASSWORD,
      name: "Feugee Admin",
    },
  })
  payload.logger.info(`Seeded first admin user: ${seedEnv.PAYLOAD_ADMIN_EMAIL}`)
} else {
  payload.logger.info("A user already exists — skipping seed")
}

const lexicalParagraph = (text: string) => ({
  root: {
    type: "root" as const,
    direction: "ltr" as const,
    format: "" as const,
    indent: 0,
    version: 1,
    children: [
      {
        type: "paragraph" as const,
        direction: "ltr" as const,
        format: "" as const,
        indent: 0,
        textFormat: 0,
        textStyle: "",
        version: 1,
        children: [
          {
            detail: 0,
            format: 0,
            mode: "normal" as const,
            style: "",
            text,
            type: "text" as const,
            version: 1,
          },
        ],
      },
    ],
  },
})

const sectorNames = ["Fashion", "Music", "Culture"]
const sectorIds: Record<string, number> = {}
const existingSectors = await payload.find({
  collection: "sectors",
  limit: sectorNames.length,
  where: {
    name: { in: sectorNames },
  },
})

if (existingSectors.docs.length === 0) {
  for (const name of sectorNames) {
    const sector = await payload.create({
      collection: "sectors",
      data: { name },
    })
    sectorIds[name] = sector.id
  }
  payload.logger.info(`Seeded sectors: ${sectorNames.join(", ")}`)
} else {
  for (const sector of existingSectors.docs) {
    if (typeof sector.name === "string") {
      sectorIds[sector.name] = sector.id
    }
  }
  payload.logger.info("Sectors already exist — skipping sector seed")
}

const assetDefs = [
  {
    key: "solsticeFeature",
    name: "solstice-feature.png",
    width: 1200,
    height: 1600,
    background: "#8b6f47",
    alt: "Archival denim jacket photographed against a warm studio backdrop",
    caption: "Solstice lookbook, cover shot",
  },
  {
    key: "solsticeStationery",
    name: "solstice-stationery.png",
    width: 1600,
    height: 900,
    background: "#c9b8a3",
    alt: "Flat-lay of the rebranded stationery suite",
  },
  {
    key: "solsticeStorefront",
    name: "solstice-storefront.png",
    width: 1600,
    height: 900,
    background: "#5f6b4f",
    alt: "Storefront signage at dusk",
    caption: "Retail signage, Turin",
  },
  {
    key: "pulsePoster1",
    name: "pulse-poster-1.png",
    width: 1600,
    height: 900,
    background: "#d94f30",
    alt: "Festival poster variant generated from a headliner waveform",
  },
  {
    key: "pulsePoster2",
    name: "pulse-poster-2.png",
    width: 1600,
    height: 900,
    background: "#274b9f",
    alt: "Festival poster variant generated from a support act waveform",
  },
  {
    key: "pulsePoster3",
    name: "pulse-poster-3.png",
    width: 1600,
    height: 900,
    background: "#e8b23a",
    alt: "Festival poster variant in the late-night colourway",
  },
  {
    key: "pulseStageWide",
    name: "pulse-stage-wide.png",
    width: 1600,
    height: 900,
    background: "#1c1c2e",
    alt: "Main stage wide shot on opening night",
  },
  {
    key: "pulseStagePortrait",
    name: "pulse-stage-portrait.png",
    width: 1200,
    height: 1600,
    background: "#43216b",
    alt: "Crowd silhouetted under purple stage lights",
  },
]

const solidImage = async (def: (typeof assetDefs)[number]) => {
  const data = await sharp({
    create: {
      width: def.width,
      height: def.height,
      channels: 3,
      background: def.background,
    },
  })
    .png()
    .toBuffer()

  return { data, mimetype: "image/png", name: def.name, size: data.length }
}

const assetIds: Record<(typeof assetDefs)[number]["key"], number> = {}
const existingAssets = await payload.find({
  collection: "assets",
  limit: assetDefs.length,
  where: {
    filename: { in: assetDefs.map((def) => def.name) },
  },
})

const assetIdByFilename = new Map<string, number>()
for (const doc of existingAssets.docs) {
  if (doc.filename) {
    assetIdByFilename.set(doc.filename, doc.id)
  }
}

let createdAssets = 0
for (const def of assetDefs) {
  let id = assetIdByFilename.get(def.name)
  if (id === undefined) {
    const asset = await payload.create({
      collection: "assets",
      data: { alt: def.alt, caption: def.caption },
      file: await solidImage(def),
    })
    id = asset.id
    assetIdByFilename.set(def.name, id)
    createdAssets++
  }
  assetIds[def.key] = id
}

if (createdAssets === 0) {
  payload.logger.info("Assets already exist — skipping asset seed")
} else {
  payload.logger.info(`Seeded ${createdAssets} new assets (${assetDefs.length} total)`)
}

const existingWorks = await payload.find({
  collection: "works",
  limit: 1,
})

if (existingWorks.docs.length === 0) {
  await payload.create({
    collection: "works",
    data: {
      title: "Solstice Denim Rebrand",
      slug: "solstice-denim-rebrand",
      subtitle: "A denim house re-cut for the archive era",
      description: lexicalParagraph(
        "Solstice came to Feugee with a forty-year archive and no way to wear it. We rebuilt the identity around the garments themselves — every touchpoint now borrows its rhythm from the cutting table.",
      ),
      client: "Solstice",
      sector: sectorIds["Fashion"],
      associate: "Amara Diallo",
      tags: ["Branding", "Art Direction"],
      expertise: ["Brand Identity", "Motion Design"],
      projectTeam: ["Jonas Weber", "Rin Takahashi"],
      collaborators: ["Studio Kite", "Marta Nunes"],
      testimonials: [
        {
          name: "Elena Marsh",
          job: "Creative Director",
          company: "Solstice",
          testimony:
            "Feugee rebuilt our brand without losing its history — the rollout was flawless.",
        },
      ],
      sections: [
        {
          title: "Challenges",
          layouts: [
            {
              blockType: "two-column",
              items: [
                {
                  blockType: "title",
                  title: "Challenges we overcame",
                },
                {
                  blockType: "titled-text",
                  entries: [
                    {
                      title: "Challenge 1 — the art of time management",
                      text: lexicalParagraph(
                        "Forty years of archive, six weeks to catalogue it. We rotated three photographers through the collection so every garment was documented before the design phase began.",
                      ),
                    },
                    {
                      title: "Challenge 2 — the pressure of creativity",
                      text: lexicalParagraph(
                        "A rebrand this anticipated invites second-guessing. We locked the typographic system in week two and gave every later decision a deadline, keeping the team creating instead of circling.",
                      ),
                    },
                  ],
                },
              ],
            },
            {
              blockType: "feature-left",
              items: [
                { blockType: "asset", asset: assetIds.solsticeFeature },
                { blockType: "asset", asset: assetIds.solsticeStationery },
                { blockType: "asset", asset: assetIds.solsticeStorefront },
              ],
            },
          ],
        },
        {
          title: "Approach",
          layouts: [
            {
              blockType: "one-column",
              items: [
                {
                  blockType: "text",
                  entries: [
                    {
                      text: lexicalParagraph(
                        "We treated the archive as the brief: every cut, label, and repair mark became raw material for the new identity.",
                      ),
                    },
                    {
                      text: lexicalParagraph(
                        "The wordmark's rhythm is lifted directly from the spacing of the original 1984 selvedge print — a detail collectors spotted within hours of launch.",
                      ),
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      _status: "published",
    },
  })

  await payload.create({
    collection: "works",
    data: {
      title: "Pulse Festival Identity",
      slug: "pulse-festival-identity",
      subtitle: "A living identity for a three-day music festival",
      description: lexicalParagraph(
        "An identity that behaves like the lineup: loud, layered, and different every night. The system generates poster variants from the artists' own waveforms.",
      ),
      client: "Pulse Festival",
      sector: sectorIds["Music"],
      associate: "Jonas Weber",
      tags: ["Identity", "Motion"],
      expertise: ["Art Direction", "3D"],
      projectTeam: ["Amara Diallo"],
      collaborators: ["Field Recordings Co."],
      testimonials: [
        {
          name: "Tomas Reyes",
          job: "Festival Director",
          company: "Pulse",
          testimony: "Ticket sales opened and the posters had already gone viral.",
        },
      ],
      sections: [
        {
          title: "Gallery",
          layouts: [
            {
              blockType: "three-column",
              items: [
                { blockType: "asset", asset: assetIds.pulsePoster1 },
                { blockType: "asset", asset: assetIds.pulsePoster2 },
                { blockType: "asset", asset: assetIds.pulsePoster3 },
              ],
            },
            {
              blockType: "two-column",
              items: [
                { blockType: "asset", asset: assetIds.pulseStageWide },
                { blockType: "asset", asset: assetIds.pulseStagePortrait },
              ],
            },
          ],
        },
      ],
      _status: "published",
    },
  })

  await payload.create({
    collection: "works",
    data: {
      title: "Atlas Museum Wayfinding",
      slug: "atlas-museum-wayfinding",
      subtitle: "Wayfinding and digital guides for a reopened museum",
      description: lexicalParagraph(
        "Draft in progress: a wayfinding system that carries the museum's reopening campaign into the building itself.",
      ),
      client: "Atlas Museum",
      sector: sectorIds["Culture"],
      associate: "Rin Takahashi",
      tags: ["Wayfinding", "Typography"],
      expertise: ["Environmental Graphics", "Design Systems"],
      projectTeam: ["Amara Diallo", "Jonas Weber"],
      collaborators: ["Atlas Museum Digital Team"],
      _status: "draft",
    },
  })

  payload.logger.info("Seeded works: Solstice (sections), Pulse (gallery), Atlas Museum (draft)")
} else {
  payload.logger.info("Works already exist — skipping work seed")
}

process.exit(0)
