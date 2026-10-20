import type { Metadata } from "next";
import { StatusPage } from "@/components/status-page";

export const metadata: Metadata = {
  title: "الصفحة غير موجودة",
  robots: { index: false },
};

export default function NotFoundPage() {
  return (
    <StatusPage
      label="404"
      title="الصفحة غير موجودة"
      message="تحقق من الرابط وحاول مرة أخرى."
    />
  );
}
