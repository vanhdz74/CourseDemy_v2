import ProtectedRoute from "@/components/protected-route";
import Header from "@/components/layout/header/Header";
import Footer from "@/components/layout/footer/Footer";
import { ReactNode } from "react";

export default function StudentPage({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["STUDENT"]}>
      <Header />
      <div className="min-h-[100vh] mt-[var(--navHeight)] py-[var(--paddingBody)] mx-auto w-[var(--wBodyMD)] md:[80%] lg:w-[var(--wBodyLG)]">
        {children}
      </div>
      <Footer />
    </ProtectedRoute>
  );
}
