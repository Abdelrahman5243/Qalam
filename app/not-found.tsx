import type { Metadata } from "next";

import { StatusPage } from "@/features/site/components/status-page";

export const metadata: Metadata = {
  title: "Page not found | الصفحة غير موجودة",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return <StatusPage kind="not-found" />;
}
