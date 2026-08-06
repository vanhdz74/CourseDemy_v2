import { notFound } from "next/navigation";
import CourseDetailPage from "@/modules/course/components/course-detail/CourseDetailPage";

export function generateStaticParams() {
  return [{ courseSlug: "placeholder" }];
}

type PageProps = {
  params: Promise<{
    courseSlug: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { courseSlug } = await params;

  if (courseSlug === "placeholder") {
    notFound();
  }

  return <CourseDetailPage />;
}
