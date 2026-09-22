import type { MetadataRoute } from "next";

import { env } from "@/env";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      // OG image URLs point at Payload's media route under /api/assets —
      // crawlers that honor robots.txt (Facebook's among them) refuse to
      // fetch a disallowed og:image. The longest matching rule wins, so the
      // REST API stays off-limits while the media below it stays fetchable.
      allow: ["/", "/api/assets"],
      disallow: ["/admin", "/api"],
    },
    sitemap: `${env.NEXT_PUBLIC_SERVER_URL}/sitemap.xml`,
  };
}
