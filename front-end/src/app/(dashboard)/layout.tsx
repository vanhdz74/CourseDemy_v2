import { ReactNode, Suspense } from "react";
import DashboardClientLayout from "./dashboard-client-layout.tsx";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardClientLayout>{children}</DashboardClientLayout>
    </Suspense>
  );
}
