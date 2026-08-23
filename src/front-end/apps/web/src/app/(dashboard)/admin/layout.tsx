import ProtectedRoute from "@/modules/auth/components/protected-route";
import { ReactNode } from "react";
export default function StudentPage({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <div className="w-full">
        {children}
      </div>
    </ProtectedRoute>
  );
}
