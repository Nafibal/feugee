import configPromise from "@payload-config";
import { cache } from "react";
import { getPayload } from "payload";

import type { Footer } from "@/payload-types";

/**
 * One read of the Footer global per request — the Footer renders most of it
 * and the Navbar's Menu feeds off its menu links, so both go through here.
 * Depth 3 populates the Other Works, their Thumbnails and, in turn, the
 * posters — same requirement as the Landing Page's Selected Works.
 */
export const getFooterGlobal = cache(async (): Promise<Footer> =>
  getPayload({ config: configPromise }).then((payload) =>
    payload.findGlobal({ slug: "footer", depth: 3, draft: false }),
  ),
);
