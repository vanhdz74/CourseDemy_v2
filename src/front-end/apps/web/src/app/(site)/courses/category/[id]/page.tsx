import CourseSearchClient from "@/modules/course/components/courses/CourseSearchClient";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return [{ id: "placeholder" }];
}

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  if (id === "placeholder") {
    notFound();
  }

  return <CourseSearchClient />;
}
