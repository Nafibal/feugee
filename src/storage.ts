import type { S3StorageOptions } from "@payloadcms/storage-s3"

import type { Env } from "./env"

type R2StorageOptions = Omit<S3StorageOptions, "collections">

export function r2StorageOptions(env: Env): R2StorageOptions {
  const s3CompatibleOverride = Boolean(env.R2_ENDPOINT)

  return {
    bucket: env.R2_BUCKET,
    // Keep objects anonymously fetchable at the bucket URL (debugging, a
    // future move to direct serving). R2 ignores S3 object ACLs — public
    // serving there is bucket-level, decided alongside signedDownloads at
    // production wiring; see docs/adr/0002.
    acl: "public-read",
    config: {
      credentials: {
        accessKeyId: env.R2_ACCESS_KEY_ID,
        secretAccessKey: env.R2_SECRET_ACCESS_KEY,
      },
      endpoint:
        env.R2_ENDPOINT ??
        `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      // S3-compatible clusters sign against a fixed region; R2 requires its
      // "auto" pseudo-region.
      region: s3CompatibleOverride ? "us-east-1" : "auto",
    },
  }
}
