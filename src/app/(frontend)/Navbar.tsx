import Image from "next/image";
import Link from "next/link";

export const Navbar = () => (
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
    <span className="text-xl text-neutral-50">Menu</span>
  </header>
);
