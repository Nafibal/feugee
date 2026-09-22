"use client";

import Link from "next/link";
import { useEffect } from "react";

import { ArrowRight } from "@/components/ArrowRight";
import {
  BoundaryMessage,
  boundaryActionClassName,
} from "@/components/BoundaryMessage";

// The Public site's error boundary: data-layer throws in any frontend page
// (the CMS or database unreachable, say) render this inside the site chrome
// instead of a framework 500. The Link home keeps an exit that works
// without JS; the retry button needs it.
export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="flex flex-1 flex-col items-center justify-center px-6 py-24 md:py-32">
      <BoundaryMessage
        body="This page's content didn't respond. It's usually brief — trying again may be all it needs."
        eyebrow="Something went wrong"
        headline="The site couldn't load this page."
      >
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button className={boundaryActionClassName} onClick={retry} type="button">
            Try again
          </button>
          <Link className={boundaryActionClassName} href="/">
            Back to the Landing Page <ArrowRight />
          </Link>
        </div>
      </BoundaryMessage>
    </section>
  );
}
