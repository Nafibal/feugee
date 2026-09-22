import type { Metadata } from "next";

import { LogoMark } from "@/components/LogoMark";
import { NotFoundMessage } from "@/components/BoundaryMessage";

import { albertSans } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Not Found — Feugee",
};

// The 404 for URLs that match no route at all. The app has two root layouts
// (public site and CMS Dashboard), so no single layout could compose this
// page — it stands alone with its own document, styles, and font, carrying
// the logo artwork the Navbar otherwise shows. Next.js serves it without
// rendering the app, so nothing here may touch the CMS.
export default function GlobalNotFound() {
  return (
    <html lang="en" className={`${albertSans.variable} h-full antialiased`}>
      <body className="min-h-full bg-neutral-950 text-white">
        <div className="flex min-h-dvh flex-col items-center justify-center gap-y-10 px-6 py-24 text-center md:gap-y-12">
          <LogoMark ariaLabel="Feugee" className="h-7 w-auto md:h-8" />
          <NotFoundMessage />
        </div>
      </body>
    </html>
  );
}
