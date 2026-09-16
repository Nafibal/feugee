import { z } from "zod"

export const envSchema = z
  .object({
    DATABASE_URL: z.url(),
    PAYLOAD_SECRET: z.string().min(32),
    R2_BUCKET: z.string().min(1),
    R2_ACCESS_KEY_ID: z.string().min(1),
    R2_SECRET_ACCESS_KEY: z.string().min(1),
    // Production fills R2_ACCOUNT_ID and the endpoint is derived from it;
    // local dev points the same credentials at an S3-compatible cluster
    // (Biznet Gio Neo) via R2_ENDPOINT instead — see docs/adr/0002.
    R2_ACCOUNT_ID: z.string().min(1).optional(),
    R2_ENDPOINT: z.url().optional(),
  })
  .refine(
    ({ R2_ACCOUNT_ID, R2_ENDPOINT }) =>
      Boolean(R2_ACCOUNT_ID) !== Boolean(R2_ENDPOINT),
    {
      message:
        "Set exactly one of R2_ACCOUNT_ID (production R2) or R2_ENDPOINT (S3-compatible override)",
    },
  )

export type Env = z.infer<typeof envSchema>

export const env = envSchema.parse(process.env)
