import Header from "@/components/layout/header/Header";
import Footer from "@/components/layout/footer/Footer";
import { ReactNode } from "react";

export default function StudentPage({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <div className="soft-surface min-h-[100vh] pt-[var(--navHeight)]">
        <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
        </main>
      </div>
      <Footer />
    </>
  );
}
