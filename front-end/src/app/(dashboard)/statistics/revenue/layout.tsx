import ProtectedRoute from "@/components/protected-route";
import { ReactNode } from "react";

export default function StatitisPage({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["ADMIN", "TEACHER"]}>
      <div className="min-h-[100vh] mt-[var(--navHeight)] mx-auto w-[var(--wBodyMD)] md:[80%]">
        {children}
      </div>
    </ProtectedRoute>
  );
}
