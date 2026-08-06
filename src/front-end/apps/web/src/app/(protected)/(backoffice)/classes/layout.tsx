import ProtectedRoute from "@/modules/auth/components/protected-route";
import { ReactNode } from "react";
export default function StudentPage({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["TEACHER", "ADMIN"]}>
      <div className="mt-[var(--navHeight)] mx-auto w-[var(--wBodyMD)] md:[80%]">
        {children}
      </div>
    </ProtectedRoute>
  );
}
