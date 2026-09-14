import { execFileSync } from "node:child_process"
import { mkdtempSync, readFileSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import path from "node:path"

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

// Video Assets are generated with ffmpeg: an animated gradient clip plus its
// first frame as the poster image. Without ffmpeg on the machine the video
// fixtures are skipped and the Works stay image-only.
type VideoDef = {
  key: string
  name: string
  posterName: string
  alt: string
  caption?: string
  // The lavfi "gradients" source — each def carries its own colourway, pace,
  // and duration (the hero loops match the slider's 8-second interval).
  gradient: string
  duration: number
}

const videoDefs: VideoDef[] = [
  {
    key: "pulseTeaser",
    name: "pulse-teaser.mp4",
    posterName: "pulse-teaser-poster.png",
    alt: "Animated gradient teaser in the Pulse Festival colourway",
    caption: "Motion teaser, opening night",
    gradient:
      "gradients=size=1280x720:duration=4:rate=30:speed=0.03:c0=0xd94f30:c1=0x274b9f",
    duration: 4,
  },
  {
    key: "heroEmber",
    name: "hero-loop-ember.mp4",
    posterName: "hero-loop-ember-poster.png",
    alt: "Drifting loop from brand orange into black",
    gradient:
      "gradients=size=1280x720:duration=8:rate=30:speed=0.025:c0=0xf2631c:c1=0x191919",
    duration: 8,
  },
  {
    key: "heroTide",
    name: "hero-loop-tide.mp4",
    posterName: "hero-loop-tide-poster.png",
    alt: "Drifting loop in the secondary blue palette",
    gradient:
      "gradients=size=1280x720:duration=8:rate=30:speed=0.035:c0=0x60b4e2:c1=0x1c2e52",
    duration: 8,
  },
  {
    key: "heroInk",
    name: "hero-loop-ink.mp4",
    posterName: "hero-loop-ink-poster.png",
    alt: "Drifting loop from violet into near-black",
    gradient:
      "gradients=size=1280x720:duration=8:rate=30:speed=0.02:c0=0x7a3fb0:c1=0x14141f",
    duration: 8,
  },
]

const videoAssetIds: Record<(typeof videoDefs)[number]["key"], number> = {}

const hasFfmpeg = (() => {
  try {
    execFileSync("ffmpeg", ["-version"], { stdio: "ignore" })
    return true
  } catch {
    return false
  }
})()

let createdVideos = 0
if (!hasFfmpeg) {
  payload.logger.info("ffmpeg not found — skipping video asset seed")
} else {
  const tmp = mkdtempSync(path.join(tmpdir(), "feugee-seed-"))
  try {
    for (const def of videoDefs) {
      const existingVideo = await payload.find({
        collection: "assets",
        limit: 1,
        where: { filename: { equals: def.name } },
      })
      if (existingVideo.docs.length > 0) {
        videoAssetIds[def.key] = existingVideo.docs[0].id
        continue
      }

      const videoPath = path.join(tmp, def.name)
      const posterPath = path.join(tmp, def.posterName)
      execFileSync("ffmpeg", [
        "-f",
        "lavfi",
        "-i",
        // A slowly drifting two-colour gradient — clearly in motion, safely
        // looping, tiny file.
        def.gradient,
        "-t",
        String(def.duration),
        "-pix_fmt",
        "yuv420p",
        "-movflags",
        "+faststart",
        videoPath,
      ])
      execFileSync("ffmpeg", ["-i", videoPath, "-frames:v", "1", posterPath])

      const posterData = readFileSync(posterPath)
      const poster = await payload.create({
        collection: "assets",
        data: { alt: `${def.alt} — still frame` },
        file: {
          data: posterData,
          mimetype: "image/png",
          name: def.posterName,
          size: posterData.length,
        },
      })

      const videoData = readFileSync(videoPath)
      const video = await payload.create({
        collection: "assets",
        data: { alt: def.alt, caption: def.caption, poster: poster.id },
        file: {
          data: videoData,
          mimetype: "video/mp4",
          name: def.name,
          size: videoData.length,
        },
      })
      videoAssetIds[def.key] = video.id
      createdVideos++
    }
  } finally {
    rmSync(tmp, { recursive: true, force: true })
  }
  payload.logger.info(
    `Seeded ${createdVideos} new video asset(s) with ffmpeg (${videoDefs.length} total)`,
  )
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
      thumbnail: assetIds.solsticeFeature,
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
      // The video teaser doubles as the Thumbnail and a gallery Item when
      // ffmpeg generated it; image-only environments fall back.
      thumbnail: videoAssetIds.pulseTeaser ?? assetIds.pulseStageWide,
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
                {
                  blockType: "asset",
                  asset: videoAssetIds.pulseTeaser ?? assetIds.pulseStageWide,
                },
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

// ---- Clients (the Client Marquee) ------------------------------------
// Wordmark logos rendered from SVG text: the marquee silhouettes every logo
// white at render time, so dark text on a transparent canvas is all a dummy
// logo needs. Sharp's trim() cuts the transparent margins so spacing between
// marquee items comes from the layout gap, not hidden padding.
type ClientDef = {
  name: string
  wordmark: string
  font: string
  weight: number
  fontSize: number
  letterSpacing: number
  italic?: boolean
  url?: string
}

const clientDefs: ClientDef[] = [
  { name: "Solstice", wordmark: "SOLSTICE", font: "Noto Sans", weight: 400, fontSize: 64, letterSpacing: 18 },
  { name: "Pulse Festival", wordmark: "Pulse Festival", font: "Noto Sans", weight: 700, fontSize: 60, letterSpacing: 2 },
  { name: "Atlas Museum", wordmark: "Atlas Museum", font: "Noto Serif", weight: 400, fontSize: 60, letterSpacing: 6 },
  { name: "Northline Rail", wordmark: "NORTHLINE RAIL", font: "Noto Sans", weight: 700, fontSize: 54, letterSpacing: 10, url: "https://example.com" },
  { name: "Kestrel Coffee", wordmark: "kestrel coffee", font: "Noto Sans", weight: 700, fontSize: 60, letterSpacing: 4 },
  { name: "Mono Records", wordmark: "MONO RECORDS", font: "Noto Sans", weight: 400, fontSize: 58, letterSpacing: 14, url: "https://example.com" },
  { name: "Harbor Books", wordmark: "Harbor Books", font: "Noto Serif", weight: 400, fontSize: 60, letterSpacing: 2, italic: true },
  { name: "Vela Sport", wordmark: "VELA SPORT", font: "Noto Sans", weight: 700, fontSize: 58, letterSpacing: 8, italic: true },
]

const wordmarkLogo = async (def: ClientDef) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="200">
  <text x="400" y="100" text-anchor="middle" dominant-baseline="central"
    font-family="${def.font}, sans-serif" font-weight="${def.weight}"
    font-style="${def.italic ? "italic" : "normal"}"
    font-size="${def.fontSize}" letter-spacing="${def.letterSpacing}"
    fill="#141414">${def.wordmark}</text>
</svg>`
  return sharp(Buffer.from(svg)).trim().png().toBuffer()
}

const existingClients = await payload.find({
  collection: "clients",
  limit: 1,
})

if (existingClients.docs.length === 0) {
  for (const def of clientDefs) {
    const data = await wordmarkLogo(def)
    // Logos are Assets like every other image; Clients references them.
    const logo = await payload.create({
      collection: "assets",
      data: { alt: `${def.name} wordmark logo` },
      file: {
        data,
        mimetype: "image/png",
        name: `logo-${def.name.toLowerCase().replace(/\s+/g, "-")}.png`,
        size: data.length,
      },
    })
    await payload.create({
      collection: "clients",
      data: { name: def.name, url: def.url ?? null, logo: logo.id },
    })
  }
  payload.logger.info(`Seeded ${clientDefs.length} clients for the Client Marquee`)
} else {
  payload.logger.info("Clients already exist — skipping client seed")
}

// Read the published state, not the draft — the stats are live content.
const publishedLandingPage = await payload.findGlobal({
  slug: "landing-page",
  draft: false,
})

if ((publishedLandingPage.stats?.length ?? 0) === 0) {
  await payload.updateGlobal({
    slug: "landing-page",
    draft: false,
    data: {
      // Without an explicit _status the saved version defaults to draft,
      // and the published read path would never see the stats.
      _status: "published",
      stats: [
        { value: "55+", label: "Videos" },
        { value: "35+M", label: "Views" },
      ],
    },
  })
  payload.logger.info('Seeded landing page stats: "55+ Videos", "35+M Views"')
} else {
  payload.logger.info("Landing page stats already published — skipping stat seed")
}

// ---- Landing Page hero, Who We Are, and Selected Works ----------------
// Re-read the published state: the stats block above may have just written
// it, and this update passes every section explicitly.
const landingNow = await payload.findGlobal({
  slug: "landing-page",
  draft: false,
})

if ((landingNow.hero?.slides?.length ?? 0) === 0) {
  const publishedWorks = await payload.find({
    collection: "works",
    depth: 0,
    draft: false,
    limit: 0,
    where: { _status: { equals: "published" } },
  })

  // Curated order: video-thumbnail works first for landing variety, then the
  // remaining published Works in CMS order.
  const preferredSlugs = [
    "pulse-festival-identity",
    "fest-for-music",
    "solstice-denim-rebrand",
  ]
  const idBySlug = new Map(
    publishedWorks.docs.map((work) => [work.slug ?? "", work.id]),
  )
  const selectedWorks = [
    ...preferredSlugs.flatMap((slug) => {
      const id = idBySlug.get(slug)
      return id !== undefined ? [id] : []
    }),
    ...publishedWorks.docs
      .filter((work) => !preferredSlugs.includes(work.slug ?? ""))
      .map((work) => work.id),
  ]

  // Hero slides are the ffmpeg gradient loops; image-only environments seed
  // no slides and the Hero stays hidden until real videos are uploaded.
  const heroSlides = (["heroEmber", "heroTide", "heroInk"] as const).flatMap(
    (key) => (videoAssetIds[key] ? [{ video: videoAssetIds[key] }] : []),
  )

  await payload.updateGlobal({
    slug: "landing-page",
    draft: false,
    data: {
      // Without an explicit _status the saved version defaults to draft,
      // and the published read path would never see the content.
      _status: "published",
      hero: {
        title: "Feugee",
        subtitle: "Ambitious ideas for ambitious business",
        slides: heroSlides,
      },
      whoWeAre: {
        heading: "Who We Are",
        description:
          "Feugee is a creative agency for ambitious business. One team directs, designs, and builds — carrying films, identities, and campaigns from first sketch to final frame.",
      },
      stats: landingNow.stats ?? [],
      selectedWorks,
    },
  })
  payload.logger.info(
    `Seeded landing page: ${heroSlides.length} hero slide(s), Who We Are copy, ${selectedWorks.length} selected work(s)`,
  )
} else {
  payload.logger.info("Landing page hero already has slides — skipping landing content seed")
}

process.exit(0)
