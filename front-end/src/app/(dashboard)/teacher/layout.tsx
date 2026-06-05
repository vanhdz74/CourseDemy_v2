import ProtectedRoute from "@/components/protected-route";
import { ReactNode } from "react";
export default function StudentPage({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["TEACHER"]}>
      <div className="min-h-screen bg-background">
        {children}
      </div>
    </ProtectedRoute>
  );
}
