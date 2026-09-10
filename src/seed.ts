import { getPayload } from "payload"
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

  payload.logger.info("Seeded works: Solstice, Pulse (published), Atlas Museum (draft)")
} else {
  payload.logger.info("Works already exist — skipping work seed")
}

process.exit(0)
