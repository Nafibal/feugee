"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { navigateWithBlackout } from "@/components/page-transition/navigateWithBlackout";
import { SwipeText } from "@/components/SwipeText";

import { menuItemTransition } from "./menuItemTransition";
import type { MenuLink } from "./menuLinks";

/**
 * The Navbar's Menu control: a button toggling the site's primary navigation
 * as bare text stacked under the label, which itself swaps to Close while
 * open. Opening staggers the items up into place; closing drops them out
 * together. Escape and an outside press close it, and a link click closes it
 * ahead of the navigation. The items carry no panel of their own — they sit
 * directly over page content, which the site's mostly-dark pages keep
 * readable.
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
      {/* The same SwipeText instance rides both labels, so a click mid-hover
          swaps the word in place without re-mounting into the hovered pose. */}
      <button
        aria-controls="site-menu"
        aria-expanded={open}
        className="group text-xl text-neutral-50"
        onClick={() => setOpen((current) => !current)}
        ref={buttonRef}
        type="button"
      >
        <SwipeText>{open ? "Close" : "Menu"}</SwipeText>
      </button>
      {/* The visibility transition flips on instantly when opening and only
          after the items' shared exit when closing, so the panel never hides
          a motion still in flight. */}
      <ul
        className={`absolute right-0 top-full mt-2 flex flex-col gap-y-2 transition-[visibility] duration-200 motion-reduce:transition-none ${
          open ? "visible" : "invisible"
        }`}
        id="site-menu"
      >
        {links.map((link, index) => {
          const { className, transitionDelay } = menuItemTransition(
            open,
            index,
          );
          return (
            <li className={className} key={link.id} style={{ transitionDelay }}>
              <Link
                className="group text-xl text-neutral-50"
                href={link.url}
                onClick={() => setOpen(false)}
                onNavigate={(event) => navigateWithBlackout(event, link.url)}
              >
                <SwipeText>{link.label}</SwipeText>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
