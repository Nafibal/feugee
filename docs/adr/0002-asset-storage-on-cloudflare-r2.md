# Asset storage on Cloudflare R2

The agency will upload many large video and image Assets. Production runs on a single Coolify-managed VPS, where serving heavy video from local disk would strain bandwidth and storage. Assets are stored on Cloudflare R2 (S3-compatible) via Payload's S3 storage adapter, even though the app itself is otherwise self-hosted on the VPS.

## Consequences

- Asset URLs point at R2 and get baked into published content — swapping storage providers later means rewriting those references.
- R2 credentials and a bucket are required before the first upload feature; the storage adapter stays unwired until they exist.
