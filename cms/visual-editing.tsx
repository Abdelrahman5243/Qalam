"use client";

import { useSyncExternalStore } from "react";
import { VisualEditing as SanityVisualEditing } from "next-sanity/visual-editing";

const subscribe = () => () => {};
const isInsideStudio = () => window.parent !== window;

/**
 * Rendered only in draft mode. Inside the Presentation tool: click-to-edit overlays.
 * In a normal tab: a bar saying unpublished changes are visible (to this browser only), with a way out.
 */
export function VisualEditing() {
  const insideStudio = useSyncExternalStore(
    subscribe,
    isInsideStudio,
    () => true,
  );
  if (insideStudio) return <SanityVisualEditing />;
  return (
    // A full page load (not <Link>) so the route can clear the draft cookie.
    // eslint-disable-next-line @next/next/no-html-link-for-pages
    <a
      href="/api/draft-mode/disable"
      style={{
        position: "fixed",
        insetInline: "1rem",
        bottom: "1rem",
        zIndex: 50,
        width: "fit-content",
        marginInline: "auto",
        padding: "0.6rem 1rem",
        borderRadius: 999,
        background: "#ffbd25",
        color: "#151517",
        fontSize: "0.85rem",
        fontWeight: 700,
        textDecoration: "none",
        boxShadow: "0 8px 24px rgb(0 0 0 / 35%)",
      }}
    >
      وضع المعاينة: بتشوف تعديلات مش منشورة · Preview mode, click to exit
    </a>
  );
}
