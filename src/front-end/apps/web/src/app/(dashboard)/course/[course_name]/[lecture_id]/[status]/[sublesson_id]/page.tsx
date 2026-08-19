"use client";

import LessonPage from "./LessonPage";
import { notFound } from "next/navigation";
import { use } from "react";

type PageProps = {
  params: Promise<{
    course_name: string;
  }>;
};

export default function Page({ params }: PageProps) {
  const resolvedParams = use(params);

  if (resolvedParams.course_name === "placeholder") {
    notFound();
  }

  return <LessonPage />;
}
