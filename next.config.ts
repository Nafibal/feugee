import type { NextConfig } from "next"
import { withPayload } from "@payloadcms/next/withPayload"

import { securityHeaders } from "./src/securityHeaders"

const nextConfig: NextConfig = {
  // Two root layouts (public site and CMS Dashboard) leave no single layout
  // to compose unmatched-URL 404s from — global-not-found.tsx serves those.
  experimental: {
    globalNotFound: true,
  },
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ]
  },
}

export default withPayload(nextConfig)
