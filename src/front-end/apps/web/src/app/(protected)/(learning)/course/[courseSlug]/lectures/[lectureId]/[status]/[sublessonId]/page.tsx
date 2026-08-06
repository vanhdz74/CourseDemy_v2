import LessonPage from "@/modules/course/components/course/LessonPage";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{
    courseSlug: string;
    lectureId: string;
    status: string;
    sublessonId: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { courseSlug } = await params;

  if (courseSlug === "placeholder") {
    notFound();
  }

  return <LessonPage />;
}
