// Complete refactor into composable components (single file)
// Components included in this file:
// - BannerSection
// - SidebarSection
// - LessonsSection
// - DetailSections
// - CourseDetailPage (default export, contains all logic and passes handlers/props down)

"use client";

import React, { useCallback, useEffect, useState } from "react";

import { useAppSelector } from "@/redux/hooks";
import { Course, CourseDetail } from "@/types/courseType";
import { toast } from "sonner";
import { BannerSection } from "@/components/course-detail/BannerSection";
import { SidebarSection } from "@/components/course-detail/SidebarSection";
import { LessonsSection } from "@/components/course-detail/LessonSection";
import { DetailSections } from "@/components/course-detail/DetailSection";
import ReviewsTab from "@/components/course/sub-title-tab/ReviewsTab";
import {
  getCourseDetail,
  getPublicLessons,
  getPublicSubLessons,
  updateCourseDetail,
  uploadCourseImage,
} from "@/services/courses";
import { useSession } from "next-auth/react";
import { Lesson, SubLesson } from "@/types/lessonType";

type CourseDetailForm = {
  content: string;
  request: string;
  description: string;
  course_include: string;
};

type ApiError = {
  message?: string;
  response?: {
    data?: {
      error?: string;
      message?: string;
    };
  };
};

const CourseDetailPage: React.FC = () => {
  const courseRedux = useAppSelector((state) => state.course);
  const { data: session } = useSession();
  const user = session?.user;

  // lessons
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [openLessonId, setOpenLessonId] = useState<number | null>(null);
  const [subLessons, setSubLessons] = useState<Record<number, SubLesson[]>>({});

  // course detail
  const [data, setData] = useState<CourseDetail | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [editCourse, setEditCourse] = useState<Course | null>(null);
  const [editDetail, setEditDetail] = useState<CourseDetailForm>({
    content: "",
    request: "",
    description: "",
    course_include: "",
  });
  const [editImageFile, setEditImageFile] = useState<File | null>(null);

  // Fetch lessons when courseId changes
  useEffect(() => {
    const fetchLessons = async () => {
      try {
        if (!courseRedux.courseId) return;
        const data = await getPublicLessons(courseRedux.courseId);
        setLessons(data || []);
      } catch (err) {
        console.error("fetchLessons error", err);
      }
    };
    fetchLessons();
  }, [courseRedux.courseId]);

  // Fetch sublessons lazily
  const toggleLesson = async (lessonId: number) => {
    if (openLessonId === lessonId) {
      setOpenLessonId(null);
      return;
    }

    if (!subLessons[lessonId]) {
      try {
        const data = await getPublicSubLessons(lessonId);
        setSubLessons((prev) => ({ ...prev, [lessonId]: data || [] }));
      } catch (err) {
        console.error("toggleLesson error", err);
      }
    }

    setOpenLessonId(lessonId);
  };

  const handleImageChange = (file: File | null) => {
    setEditImageFile(file);
  };

  const fetchData = useCallback(async () => {
    const idToFetch = courseRedux.courseId;
    if (!idToFetch) return;

    try {
      const res = await getCourseDetail(idToFetch);
      setData(res);
      // keep edit states in sync
    } catch (error: unknown) {
      const apiError = error as ApiError;
      toast.error(apiError.message || "Lỗi lấy thông tin khóa học");
    }
  }, [courseRedux.courseId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // keep edit states when data loaded
  useEffect(() => {
    if (data) {
      setEditCourse(data.course);
      setEditDetail({
        content: data.content,
        request: data.request,
        description: data.description,
        course_include: data.course_include,
      });
    }
  }, [data]);

  const handleSave = async () => {
    if (!courseRedux.courseId) return;
    if (!editCourse) return;

    try {
      let uploadedImageUrl: string | null = null;

      if (editImageFile) {
        uploadedImageUrl = await uploadCourseImage(
          courseRedux.courseId,
          editImageFile
        );
      }

      const dataToSend: Record<string, unknown> & { course: Course } = {
        course: { ...editCourse },
        ...editDetail,
      };
      if (uploadedImageUrl) dataToSend.course.course_img = uploadedImageUrl;

      const result = await updateCourseDetail(courseRedux.courseId, dataToSend);

      // show feedback
      toast.success(result.message || "Cập nhật thành công");

      // refresh and exit edit mode
      await fetchData();
      setIsEditing(false);
      setEditImageFile(null);
    } catch (err: unknown) {
      const apiError = err as ApiError;
      const msg =
        apiError.response?.data?.error ||
        apiError.response?.data?.message ||
        apiError.message ||
        "Có lỗi xảy ra";
      toast.error(msg);
    }
  };

  if (!data) {
    return (
      <div className="page-container py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-5">
            <div className="h-56 animate-pulse rounded-xl bg-muted" />
            <div className="h-36 animate-pulse rounded-xl bg-muted" />
            <div className="h-72 animate-pulse rounded-xl bg-muted" />
          </div>
          <div className="h-96 animate-pulse rounded-xl bg-muted" />
        </div>
      </div>
    );
  }

  const { course, content, request, description } = data;

  return (
    <div className="relative left-1/2 w-screen -translate-x-1/2">
      <BannerSection
        isEditing={isEditing}
        course={course}
        editCourse={editCourse}
        setEditCourse={setEditCourse}
      />

      <div className="page-container grid gap-8 py-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:py-10">
        <main className="min-w-0 space-y-6 lg:pt-2">
          {!isEditing ? (
            <>
              {/* Nội dung khóa học */}
              <section className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
                <h2 className="text-xl font-semibold tracking-tight text-foreground">
                  Nội dung khóa học
                </h2>
                <p className="mt-3 whitespace-pre-line text-sm leading-7 text-muted-foreground sm:text-base">
                  {content || "Khóa học đang được cập nhật nội dung."}
                </p>
              </section>

              {/* Danh sách bài học */}
              <LessonsSection
                lessons={lessons}
                openLessonId={openLessonId}
                toggleLesson={toggleLesson}
                subLessons={subLessons}
              />

              {/* Bạn sẽ học được gì */}
              <section className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
                <h2 className="text-xl font-semibold tracking-tight text-foreground">
                  Bạn sẽ học được gì
                </h2>
                <p className="mt-3 whitespace-pre-line text-sm leading-7 text-muted-foreground sm:text-base">
                  {description || "Thông tin đầu ra của khóa học sẽ được bổ sung."}
                </p>
              </section>

              {/* Yêu cầu */}
              <section className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
                <h2 className="text-xl font-semibold tracking-tight text-foreground">
                  Yêu cầu
                </h2>
                <p className="mt-3 whitespace-pre-line text-sm leading-7 text-muted-foreground sm:text-base">
                  {request || "Không có yêu cầu đặc biệt trước khi bắt đầu."}
                </p>
              </section>

              <ReviewsTab courseId={course.id} />
            </>
          ) : (
            <DetailSections
              isEditing={isEditing}
              content={content}
              description={description}
              request={request}
              editDetail={editDetail}
              setEditDetail={setEditDetail}
            />
          )}
        </main>

        <aside className="order-first lg:sticky lg:top-20 lg:order-none lg:-mt-[22rem] xl:-mt-[24rem]">
          <SidebarSection
            isEditing={isEditing}
            course={course}
            user={user}
            editCourse={editCourse}
            setEditCourse={setEditCourse}
            editDetail={editDetail}
            setEditDetail={setEditDetail}
            editImageFile={editImageFile}
            handleImageChange={handleImageChange}
            onToggleEdit={() => setIsEditing((s) => !s)}
            onSave={handleSave}
          />
        </aside>
      </div>
    </div>
  );
};

export default CourseDetailPage;
