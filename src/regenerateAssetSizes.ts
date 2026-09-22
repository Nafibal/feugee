import { getPayload } from "payload"

import { env } from "./env"
import config from "./payload.config"
import { r2EndpointOf } from "./storage"

/**
 * One-off maintenance: re-save every image Asset so Payload regenerates its
 * size variants (see the Assets collection's imageSizes). Run it after the
 * size ladder changes or after wiring sizes onto an existing library:
 *
 *   npm run regenerate:sizes
 *
 * The original file is fetched back from object storage — uploads carry a
 * public-read ACL (docs/adr/0002), so an anonymous GET on the S3 endpoint
 * works without signing — and re-uploaded through the Local API, which runs
 * the normal upload pipeline (sharp variants written to storage, size
 * columns populated). Videos and SVGs are skipped: sharp sizes neither.
 */

const payload = await getPayload({ config })

// Path-style object URL against the same endpoint/bucket pairing the
// storage plugin uses (src/storage.ts).
const objectUrl = (filename: string) =>
  `${r2EndpointOf(env)}/${env.R2_BUCKET}/${filename
    .split("/")
    .map(encodeURIComponent)
    .join("/")}`

const { docs } = await payload.find({
  collection: "assets",
  depth: 0,
  draft: false,
  limit: 0,
})

const resizable = docs.filter(
  (asset) =>
    asset.mimeType?.startsWith("image/") &&
    asset.mimeType !== "image/svg+xml" &&
    typeof asset.filename === "string",
)

payload.logger.info(
  `Regenerating size variants for ${resizable.length} of ${docs.length} Assets (videos and SVGs get none)…`,
)

let regenerated = 0
const failed: string[] = []

for (const asset of resizable) {
  const filename = asset.filename as string
  try {
    const response = await fetch(objectUrl(filename))
    if (!response.ok) {
      throw new Error(`fetching the original back: HTTP ${response.status}`)
    }
    const data = Buffer.from(await response.arrayBuffer())
    await payload.update({
      collection: "assets",
      id: asset.id,
      // Maintenance, not a CMS edit — the revalidation hooks have no Next
      // request scope in a payload run script, and nothing visible changes:
      // the variants are re-derived from the same source file.
      context: { disableRevalidate: true },
      data: {},
      file: {
        data,
        mimetype: asset.mimeType ?? "image/png",
        name: filename,
        size: data.length,
      },
      overwriteExistingFiles: true,
    })
    regenerated++
  } catch (error) {
    failed.push(`${filename}: ${error instanceof Error ? error.message : error}`)
  }
}

payload.logger.info(
  `Done — variants regenerated for ${regenerated} Assets, ${failed.length} failures`,
)
for (const failure of failed) {
  payload.logger.error(failure)
}
