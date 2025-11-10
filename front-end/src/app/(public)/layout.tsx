"use client";

import Header from "@/components/layout/header/Header";
import Footer from "@/components/layout/footer/Footer";
import { ReactNode } from "react";

export default function layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <div className="mt-[var(--navHeight)] mx-auto w-[var(--wBodyMD)] md:[80%] lg:w-[var(--wBodyLG)]">
        {children}
      </div>
      <Footer />
    </>
  );
}
