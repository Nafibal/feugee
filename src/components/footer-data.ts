import configPromise from "@payload-config";
import { cache } from "react";
import { getPayload } from "payload";

import type { Footer } from "@/payload-types";

/**
 * The Footer global with every CMS field empty — what the layout chrome
 * renders when the read fails. FooterView's field guards collapse it to the
 * Wordmark and the bottom bar.
 */
export const emptyFooter: Footer = { id: 0 };

/**
 * One read of the Footer global per request — the Footer renders most of it
 * and the Navbar's Menu feeds off its menu links, so both go through here.
 * Depth 3 populates the Other Works, their Thumbnails and, in turn, the
 * posters — same requirement as the Landing Page's Selected Works.
 *
 * Never throws: both consumers sit in the root layout, where a throw would
 * fail every route rather than just the chrome. A failed read logs and
 * resolves null; consumers fall back to emptyFooter / no menu.
 */
export const getFooterGlobal = cache(async (): Promise<Footer | null> => {
  try {
    const payload = await getPayload({ config: configPromise });
    return await payload.findGlobal({
      slug: "footer",
      depth: 3,
      draft: false,
    });
  } catch (error) {
    console.error("Footer global read failed — degrading site chrome", error);
    return null;
  }
});
