import { Albert_Sans } from "next/font/google";

// Single definition shared by the Public site and CMS Dashboard layouts.
export const albertSans = Albert_Sans({
  variable: "--font-albert-sans",
  subsets: ["latin"],
  style: ["normal", "italic"],
});
