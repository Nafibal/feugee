import configPromise from "@payload-config";
import { cache } from "react";
import { getPayload, type Payload } from "payload";

import { publishedWhere } from "@/access/publishedRead";
import type { Footer } from "@/payload-types";

import { asWorkSelect, otherWorksSelect } from "./work";

/**
 * The Footer global with every CMS field empty — what the layout chrome
 * renders when the read fails. FooterView's field guards collapse it to the
 * Wordmark and the bottom bar.
 */
export const emptyFooter: Footer = { id: 0 };

// findGlobal's select cannot trim populated relationships — depth-populated
// docs come back whole — so the global is read at depth 0 (bare IDs) and its
// Other Works rehydrated through a card-select find. The Works come back
// without their detail-page Sections, in the CMS's own Other Works order;
// an ID the find could not populate (a now-draft Work) stays a number,
// which FooterView drops like a mid-edit Live Preview state.
const rehydrateOtherWorks = async (
  payload: Payload,
  footer: Footer,
): Promise<Footer> => {
  const otherWorkIds = (footer.otherWorks ?? []).flatMap((work) =>
    typeof work === "number" ? [work] : [],
  );
  if (otherWorkIds.length === 0) return footer;

  const works = await payload.find({
    collection: "works",
    // Depth 2 populates the card thumbnails and, in turn, their posters.
    depth: 2,
    draft: false,
    limit: otherWorkIds.length,
    where: { and: [{ id: { in: otherWorkIds } }, publishedWhere] },
    select: asWorkSelect(otherWorksSelect),
  });
  const workById = new Map(works.docs.map((work) => [work.id, work]));

  return {
    ...footer,
    otherWorks: otherWorkIds.map((id) => workById.get(id) ?? id),
  };
};

/**
 * One read of the Footer global per request — the Footer renders most of it
 * and the Navbar's Menu feeds off its menu links, so both go through here.
 * Depth 0 plus the card-select rehydration keeps the Other Works trimmed to
 * what their cards consume.
 *
 * Never throws: both consumers sit in the root layout, where a throw would
 * fail every route rather than just the chrome. A failed read logs and
 * resolves null; consumers fall back to emptyFooter / no menu.
 */
export const getFooterGlobal = cache(async (): Promise<Footer | null> => {
  try {
    const payload = await getPayload({ config: configPromise });
    const footer = await payload.findGlobal({
      slug: "footer",
      draft: false,
      depth: 0,
    });
    return await rehydrateOtherWorks(payload, footer);
  } catch (error) {
    console.error("Footer global read failed — degrading site chrome", error);
    return null;
  }
});
