import { getFooterGlobal } from "./footer-data";
import { LogoLink } from "./LogoLink";
import { Menu, toMenuLinks } from "./menu";

// Mounted in the frontend root layout, so every public page shares it. The
// Menu's links come from the Footer global — one CMS list drives both.
export const Navbar = async () => {
  const footer = await getFooterGlobal();
  const menuLinks = toMenuLinks(footer?.menuLinks);

  return (
    /* The negative margin cancels the header's flow footprint: page content
       starts at the very top and slides under the (transparent) navbar while
       it stays pinned. Sticky offsets and scroll margins elsewhere still hang
       off --navbar-height. */
    /* The data attribute marks the Page Shift slab (ADR 0007). */
    <header
      className="sticky top-0 z-40 -mb-(--navbar-height) flex h-(--navbar-height) items-center justify-between px-6"
      data-blackout-slab
    >
      <LogoLink />
      {menuLinks.length > 0 && <Menu links={menuLinks} />}
    </header>
  );
};
