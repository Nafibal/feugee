import { getFooterGlobal } from "./footer-data";
import { FooterView } from "./FooterView";

// Mounted once in the frontend root layout, so every public page shares it.
// mt-auto pins it to the viewport bottom on pages shorter than 100vh — the
// body is a flex column and this is its last child. The server side only
// fetches; FooterView merges CMS edits client-side, powering Live Preview.
export const Footer = async () => {
  const footer = await getFooterGlobal();

  return <FooterView initialData={footer} />;
};
