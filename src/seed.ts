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

process.exit(0)
