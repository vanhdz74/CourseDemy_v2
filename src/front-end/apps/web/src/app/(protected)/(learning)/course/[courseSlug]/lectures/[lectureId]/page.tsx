import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{
    courseSlug: string;
    lectureId: string;
  }>;
};

export default async function LecturePage({ params }: PageProps) {
  const { courseSlug, lectureId } = await params;

  redirect(`/course/${courseSlug}/lectures/${lectureId}/view/0`);
}
