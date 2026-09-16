import type { Footer } from "@/payload-types";

export interface MenuLink {
  id: string;
  label: string;
  url: string;
}

/**
 * The Footer and the Navbar's Menu render the same menu links, so both go
 * through this mapper: an entry the Agency left half-filled disappears from
 * both, and the React key is settled once here.
 */
export const toMenuLinks = (links: Footer["menuLinks"]): MenuLink[] =>
  (links ?? []).flatMap((link) => {
    const label = link.label.trim();
    const url = link.url.trim();
    if (label === "" || url === "") return [];
    return [{ id: link.id ?? `${label}:${url}`, label, url }];
  });
