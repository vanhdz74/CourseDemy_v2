import ProtectedRoute from "@/modules/auth/components/protected-route";
import { ReactNode } from "react";
export default function StudentPage({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <div className="min-h-[100vh] mt-[var(--navHeight)] mx-auto w-[var(--wBodyMD)] md:[80%]">
        {children}
      </div>
    </ProtectedRoute>
  );
}
