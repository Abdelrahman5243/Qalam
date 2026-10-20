import type { Metadata } from "next";
import { StatusPage } from "@/components/status-page";

export const metadata: Metadata = { title: "404" };

/** A missing page inside /ar or /en: keeps the site layout, so Presentation stays connected. */
export default function NotFoundPage() {
  return <StatusPage kind="not-found" />;
}
