import type { Metadata } from "next";
import { albertSans } from "@/app/fonts";
import "../globals.css";

import { Footer } from "./Footer";
import { Navbar } from "./Navbar";
import { SmoothScroll } from "./SmoothScroll";

export const metadata: Metadata = {
  title: "Feugee",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${albertSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-neutral-950">
        <SmoothScroll>
          <Navbar />
          {children}
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
