import CourseSearchClient from "./CourseSearchClient";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return [{ id: "placeholder" }];
}

export default function Page({ params }: any) {
  if (params.id === "placeholder") {
    notFound();
  }

  return <CourseSearchClient />;
}
