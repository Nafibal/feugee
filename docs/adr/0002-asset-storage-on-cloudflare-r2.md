# Asset storage on Cloudflare R2

The agency will upload many large video and image Assets. Production runs on a single Coolify-managed VPS, where serving heavy video from local disk would strain bandwidth and storage. Assets are stored on Cloudflare R2 (S3-compatible) via Payload's S3 storage adapter, even though the app itself is otherwise self-hosted on the VPS.

## Consequences

- Asset URLs point at R2 and get baked into published content — swapping storage providers later means rewriting those references.
- R2 credentials and a bucket are required before the first upload feature; the storage adapter stays unwired until they exist.

## Amendment — 2026-09-16: wired via S3 adapter, Biznet Gio for local dev

The adapter is wired (`src/storage.ts` builds the options, spread into `s3Storage` in `payload.config.ts`). Local development does not use R2: the same `R2_*` credentials point at Biznet Gio Neo Object Storage (`https://nos.wjv-1.neo.id`) through `R2_ENDPOINT`; production sets `R2_ACCOUNT_ID` instead and the R2 endpoint is derived from it. The env schema enforces exactly one of the two. Production CMS data starts from scratch, so nothing carries over between providers.

Two consequences above turned out different once wired:

- URLs the CMS stores are app-relative (`/api/assets/file/<filename>`), not provider URLs — the plugin streams objects through the app by default. Swapping providers later does not rewrite content references after all; only absolute URLs pasted into rich text would break.
- Because objects stream through the app, heavy video still consumes VPS bandwidth — the original strain concern is half-solved (storage offloaded, bandwidth not). Direct serving is available via the plugin's `signedDownloads` (302 to presigned URLs, expiring); whether production wants that is deferred to the production R2 wiring. Uploads also set a public-read object ACL — honored by Biznet Gio, ignored by R2 (public access there is bucket-level); revisit alongside `signedDownloads` when wiring production.
