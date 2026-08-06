import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{
    courseSlug: string;
  }>;
};

export default async function CourseSlugPage({ params }: PageProps) {
  const { courseSlug } = await params;

  redirect(`/course-detail/${courseSlug}`);
}
