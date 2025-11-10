import ProtectedRoute from "@/components/protected-route";
import { ReactNode } from "react";
export default function StudentPage({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["TEACHER"]}>
      <div className="mt-[var(--navHeight)] mx-auto w-[var(--wBodyMD)] md:[80%] lg:w-[var(--wBodyLG)]">
        {children}
      </div>
    </ProtectedRoute>
  );
}
