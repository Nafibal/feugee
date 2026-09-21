"use client";

import Link from "next/link";

import { LogoMark } from "./LogoMark";
import { navigateWithBlackout } from "./page-transition/navigateWithBlackout";

/**
 * The Navbar's logo link as a client island: the Navbar itself is a server
 * component (it fetches the Menu links), and the Blackout's onNavigate
 * handler can't cross the server/client boundary. Nothing else about the
 * link differs.
 */
export const LogoLink = () => (
  <Link href="/" onNavigate={(event) => navigateWithBlackout(event, "/")}>
    <LogoMark ariaLabel="Feugee" height={32} width={113} />
  </Link>
);
