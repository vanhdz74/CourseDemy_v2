import { notFound } from "next/navigation";
import CourseDetailPage from "./CourseDetailPage";

export function generateStaticParams() {
  return [{ course_name_slug: "placeholder" }];
}

export default function Page({ params }: any) {
  if (params.course_name_slug === "placeholder") {
    notFound();
  }

  return <CourseDetailPage />;
}
