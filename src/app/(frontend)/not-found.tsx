import { NotFoundMessage } from "@/components/BoundaryMessage";

// The Public site's in-chrome 404: notFound() from any frontend page — a
// Draft Work's slug, say — lands here inside the site chrome. Unmatched
// URLs never reach this file; the standalone global-not-found serves those.
// A plain Link (no Blackout choreography): a boundary page is quiet and
// must work without JS.
export default function NotFound() {
  return (
    <section className="flex flex-1 flex-col items-center justify-center px-6 py-24 md:py-32">
      <NotFoundMessage />
    </section>
  );
}
