import type { NextConfig } from "next"
import { withPayload } from "@payloadcms/next/withPayload"

import { securityHeaders } from "./src/securityHeaders"

const nextConfig: NextConfig = {
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
