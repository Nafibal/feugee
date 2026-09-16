import { describe, expect, it, vi } from "vitest";

const accountId = "b374b36817deffd929433cde176d1439"

const baseEnv = {
  DATABASE_URL: "postgres://feugee:feugee@localhost:5432/feugee",
  PAYLOAD_SECRET: "0123456789abcdef0123456789abcdef",
  R2_BUCKET: "feugee",
  R2_ACCESS_KEY_ID: "test-key-id",
  R2_SECRET_ACCESS_KEY: "test-secret",
}

const localDevEnv = {
  ...baseEnv,
  R2_ENDPOINT: "https://nos.wjv-1.neo.id",
}

const productionEnv = {
  ...baseEnv,
  R2_ACCOUNT_ID: accountId,
}

// env.ts parses process.env at import time — stub a valid local-dev baseline
// before the dynamic import below runs.
for (const [key, value] of Object.entries(localDevEnv)) {
  vi.stubEnv(key, value)
}

const { envSchema } = await import("./env")
const { r2StorageOptions } = await import("./storage")

describe("envSchema", () => {
  it("accepts the local-dev shape: R2_ENDPOINT set, R2_ACCOUNT_ID unset", () => {
    expect(envSchema.safeParse(localDevEnv).success).toBe(true)
  })

  it("accepts the production shape: R2_ACCOUNT_ID set, R2_ENDPOINT unset", () => {
    expect(envSchema.safeParse(productionEnv).success).toBe(true)
  })

  it("rejects both R2_ENDPOINT and R2_ACCOUNT_ID set — the provider would be ambiguous", () => {
    const result = envSchema.safeParse({
      ...localDevEnv,
      R2_ACCOUNT_ID: accountId,
    })
    expect(result.success).toBe(false)
  })

  it("rejects neither R2_ENDPOINT nor R2_ACCOUNT_ID set", () => {
    const result = envSchema.safeParse(baseEnv)
    expect(result.success).toBe(false)
  })
})

describe("r2StorageOptions", () => {
  it("uses the S3-compatible endpoint and a fixed signing region for local dev", () => {
    const options = r2StorageOptions(envSchema.parse(localDevEnv))

    expect(options.config.endpoint).toBe("https://nos.wjv-1.neo.id")
    expect(options.config.region).toBe("us-east-1")
  })

  it("derives the R2 endpoint from the account id and signs with region auto in production", () => {
    const options = r2StorageOptions(envSchema.parse(productionEnv))

    expect(options.config.endpoint).toBe(
      `https://${accountId}.r2.cloudflarestorage.com`,
    )
    expect(options.config.region).toBe("auto")
  })

  it("passes the bucket and credentials through and uploads as public-read", () => {
    const options = r2StorageOptions(envSchema.parse(localDevEnv))

    expect(options.bucket).toBe("feugee")
    expect(options.acl).toBe("public-read")
    expect(options.config.credentials).toEqual({
      accessKeyId: "test-key-id",
      secretAccessKey: "test-secret",
    })
  })
})
