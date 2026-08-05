"use client";

import { Provider } from "react-redux";
import { store } from "./store";
import { useEffect } from "react";
import { setCourse } from "@/modules/course/store/courseSlice";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  // Set lại course redux khi load trang
  useEffect(() => {
    const courseData = localStorage.getItem("course");
    if (courseData) {
      const parsed = JSON.parse(courseData);
      store.dispatch(setCourse(parsed));
    }
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
