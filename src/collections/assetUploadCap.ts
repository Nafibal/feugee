import { ValidationError } from "payload"

const MEGABYTE = 1024 * 1024

// Web-compressed hero videos and images land well under this; the cap stops
// accidental master-file uploads from reaching storage and the public site.
export const assetUploadLimitBytes = 100 * MEGABYTE

export function describeSize(bytes: number): string {
  const megabytes = bytes / MEGABYTE
  if (megabytes < 1024) {
    return `${megabytes.toFixed(1).replace(/\.0$/, "")} MB`
  }
  return `${(megabytes / 1024).toFixed(1).replace(/\.0$/, "")} GB`
}

// Thrown from the Assets beforeValidate hook — Payload renders the message
// on the file field in the CMS Dashboard.
export function uploadSizeError(
  size: number | undefined,
): ValidationError | null {
  if (size === undefined || size <= assetUploadLimitBytes) {
    return null
  }
  return new ValidationError({
    errors: [
      {
        message: `This Asset is ${describeSize(size)} — the limit is ${describeSize(assetUploadLimitBytes)}. Compress it before uploading.`,
        path: "file",
      },
    ],
  })
}
