import { ReactNode, Suspense } from "react";
import ProtectedClientLayout from "@/layouts/protected/ProtectedClientLayout";
import CourseDemyLoading from "@/modules/shared/components/loading/CourseDemyLoading";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<CourseDemyLoading label="Đang mở không gian học tập" />}>
      <ProtectedClientLayout>{children}</ProtectedClientLayout>
    </Suspense>
  );
}
