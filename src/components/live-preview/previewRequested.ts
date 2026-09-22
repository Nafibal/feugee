/**
 * The query flag that arms a surface's Live Preview machinery: the CMS
 * Dashboard's preview iframe loads the public page with
 * `?livePreview=<surface>` (see the `admin.livePreview.url` configs), and
 * only that surface may load its Live Preview client code. Anonymous
 * visitors carry no flag, so none of it ships to them.
 */
export const previewRequested = (search: string, surface: string): boolean =>
  new URLSearchParams(search).get("livePreview") === surface;
