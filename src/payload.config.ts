import { postgresAdapter } from "@payloadcms/db-postgres"
import { lexicalEditor } from "@payloadcms/richtext-lexical"
import path from "path"
import { buildConfig } from "payload"
import { fileURLToPath } from "url"
import sharp from "sharp"

import { Sectors } from "./collections/Sectors"
import { Users } from "./collections/Users"
import { Works } from "./collections/Works"
import { env } from "./env"

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    theme: "light",
  },
  collections: [Works, Sectors, Users],
  editor: lexicalEditor(),
  secret: env.PAYLOAD_SECRET,
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: env.DATABASE_URL,
    },
  }),
  sharp,
  // R2 asset storage stays unwired until credentials exist — see docs/adr/0002-asset-storage-on-cloudflare-r2.md.
  // To enable: add s3Adapter({ bucket, config: { endpoint, credentials } }) from @payloadcms/storage-s3
  // together with an Assets collection, driven by the R2_* vars in .env.example.
  plugins: [],
})
