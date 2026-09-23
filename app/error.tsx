"use client";

import { StatusPage } from "@/features/site/components/status-page";

export default function Error({ reset }: { reset: () => void }) {
  return <StatusPage kind="error" onRetry={reset} />;
}
