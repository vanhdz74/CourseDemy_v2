import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{
    courseSlug: string;
    lectureId: string;
    status: string;
  }>;
};

export default async function LectureStatusPage({ params }: PageProps) {
  const { courseSlug, lectureId, status } = await params;

  redirect(`/course/${courseSlug}/lectures/${lectureId}/${status}/0`);
}
