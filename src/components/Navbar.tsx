import Image from "next/image";
import Link from "next/link";

import { getFooterGlobal } from "./footer-data";
import { Menu, toMenuLinks } from "./menu";

// Mounted in the frontend root layout, so every public page shares it. The
// Menu's links come from the Footer global — one CMS list drives both.
export const Navbar = async () => {
  const footer = await getFooterGlobal();
  const menuLinks = toMenuLinks(footer.menuLinks);

  return (
    <header className="sticky top-0 z-40 flex h-[var(--navbar-height)] items-center justify-between px-6">
      <Link href="/">
        <Image
          src="/logo.svg"
          alt="Feugee"
          height={32}
          width={113}
          // A vector wordmark has nothing to optimize — serve the file as-is.
          unoptimized
        />
      </Link>
      {menuLinks.length > 0 && <Menu links={menuLinks} />}
    </header>
  );
};
