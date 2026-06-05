import Header from "@/components/layout/header/Header";
import Footer from "@/components/layout/footer/Footer";
import { ReactNode, Suspense } from "react";

export default function layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <Header />
        <div className="soft-surface min-h-[100vh] pt-[var(--navHeight)]">
          <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          {children}
          </main>
        </div>
      </Suspense>
      <Footer />
    </>
  );
}
