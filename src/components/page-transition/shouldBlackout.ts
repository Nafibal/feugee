/**
 * Whether a navigation gets the Blackout (ADR 0007): a different page always
 * does, and so does a click on a link to the current page — its scroll reset
 * hides under the cover. In-page updates never do: a query-only change (the
 * Works Page sector filter) refines the current page, and a hash-only change
 * anchors within it.
 */
const BASE_URL = "http://blackout.local";

const normalize = (pathname: string) =>
  pathname !== "/" && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;

export const shouldBlackout = (
  currentUrl: string,
  targetUrl: string,
): boolean => {
  // The target resolves against the current URL, so a relative href shares
  // the current origin instead of picking up this module's parse-only base.
  const current = new URL(currentUrl, BASE_URL);
  const target = new URL(targetUrl, current.href);

  if (target.origin !== current.origin) return false;
  // The CMS Dashboard is never part of the Public site's gesture — CMS
  // managed menu/CTA URLs can point at /admin.
  if (target.pathname === "/admin" || target.pathname.startsWith("/admin/"))
    return false;
  if (normalize(target.pathname) !== normalize(current.pathname)) return true;
  if (target.search !== current.search) return false;

  return target.hash === current.hash;
};
