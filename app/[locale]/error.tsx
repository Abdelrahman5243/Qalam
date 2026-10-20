"use client";

import { StatusPage } from "@/components/status-page";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return <StatusPage label="خطأ" title="حدث خطأ غير متوقع" message="حاول تحديث الصفحة." onRetry={reset} />;
}
