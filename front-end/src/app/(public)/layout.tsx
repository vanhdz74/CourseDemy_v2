"use client";

import Header from "@/components/layout/header/Header";
import Footer from "@/components/layout/footer/Footer";
import { ReactNode, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchRegisteredCourses } from "@/features/my_course/myCourseThunk";

export default function layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <div className="min-h-[100vh] mt-[var(--navHeight)] mx-auto w-[var(--wBodyMD)] md:[80%] lg:w-[var(--wBodyLG)]">
        {children}
      </div>
      <Footer />
    </>
  );
}
