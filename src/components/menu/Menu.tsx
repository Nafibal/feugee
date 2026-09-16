"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import type { MenuLink } from "./menuLinks";

/**
 * The Navbar's Menu control: a button toggling a dropdown of the site's
 * primary navigation. Escape and an outside press close it, a link click
 * closes it ahead of the navigation, and the panel carries its own solid
 * background because the Navbar sits transparently over page content.
 */
export const Menu = ({ links }: { links: MenuLink[] }) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    const onPointerDown = (event: PointerEvent) => {
      if (rootRef.current?.contains(event.target as Node)) return;
      setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <div className="relative" ref={rootRef}>
      <button
        aria-controls="site-menu"
        aria-expanded={open}
        className="text-xl text-neutral-50"
        onClick={() => setOpen((current) => !current)}
        ref={buttonRef}
        type="button"
      >
        Menu
      </button>
      <div
        className={`absolute right-0 top-full mt-2 rounded border border-neutral-800 bg-neutral-950/95 py-2 backdrop-blur transition duration-200 motion-reduce:transition-none ${
          open
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-1 opacity-0"
        }`}
        id="site-menu"
      >
        <ul className="flex min-w-56 flex-col">
          {links.map((link) => (
            <li key={link.id}>
              <Link
                className="block px-6 py-2 text-xl text-neutral-300 transition-colors hover:text-white"
                href={link.url}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
