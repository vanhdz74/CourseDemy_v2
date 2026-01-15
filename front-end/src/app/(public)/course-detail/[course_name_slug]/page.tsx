// Complete refactor into composable components (single file)
// Components included in this file:
// - BannerSection
// - SidebarSection
// - LessonsSection
// - DetailSections
// - CourseDetailPage (default export, contains all logic and passes handlers/props down)

"use client";

import React, { useEffect, useState } from "react";

import { useApi } from "@/hooks/useApi";
import { useAppSelector } from "@/redux/hooks";
import publicClient from "@/api/publicClient";
import { Course, CourseDetail } from "@/types/courseType";
import ImageUploader from "@/components/common/ImageUploader";
import { toast } from "sonner";
import { BannerSection } from "@/components/course-detail/BannerSection";
import { SidebarSection } from "@/components/course-detail/SidebarSection";
import { LessonsSection } from "@/components/course-detail/LessonSection";
import { DetailSections } from "@/components/course-detail/DetailSection";
import ReviewsTab from "@/components/course/sub-title-tab/ReviewsTab";

const CourseDetailPage: React.FC = () => {
  const courseRedux = useAppSelector((state) => state.course);
  const { get, put, post } = useApi();
  const user = useAppSelector((state) => state.auth.user);

  // lessons
  const [lessons, setLessons] = useState<any[]>([]);
  const [openLessonId, setOpenLessonId] = useState<number | null>(null);
  const [subLessons, setSubLessons] = useState<Record<number, any[]>>({});

  // course detail
  const [data, setData] = useState<CourseDetail | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [editCourse, setEditCourse] = useState<Course | null>(null);
  const [editDetail, setEditDetail] = useState({
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
        const res = await publicClient.get(
          `/public/lessons/course/${courseRedux.courseId}`
        );
        const data = await res.data;
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
        const res = await publicClient.get(
          `/public/sublessons/lesson/${lessonId}`
        );
        const data = await res.data;
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

  const fetchData = async () => {
    const idToFetch = courseRedux.courseId;
    if (!idToFetch) return;

    try {
      const res = await get(`/course-detail/${idToFetch}`);
      setData(res);
      // keep edit states in sync
    } catch (error: any) {
      toast.error(error?.message || "Lỗi lấy thông tin khóa học");
    }
  };

  useEffect(() => {
    fetchData();
  }, [courseRedux.courseId]);

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
    try {
      let uploadedImageUrl: string | null = null;

      if (editImageFile) {
        const formData = new FormData();
        formData.append("file", editImageFile);
        const resUpload = await post(
          `/upload-course-img/${courseRedux.courseId}`,
          formData
        );
        uploadedImageUrl = resUpload.url;
      }

      const dataToSend: any = { course: { ...editCourse }, ...editDetail };
      if (uploadedImageUrl) dataToSend.course.course_img = uploadedImageUrl;

      const result = await put(
        `/course-detail/m1/${courseRedux.courseId}`,
        dataToSend
      );

      // show feedback
      toast.success(result.message || "Cập nhật thành công");

      // refresh and exit edit mode
      await fetchData();
      setIsEditing(false);
      setEditImageFile(null);
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Có lỗi xảy ra";
      toast.error(msg);
    }
  };

  if (!data) return <div>Loading...</div>;

  const { course, content, request, description, course_include } = data;

  return (
    <div className="w-full">
      <BannerSection
        isEditing={isEditing}
        course={course}
        editCourse={editCourse}
        setEditCourse={setEditCourse}
      />

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

      <div className="max-w-6xl mx-auto px-4 md:px-0 py-10 grid md:grid-cols-3 gap-10">
        <div className="md:col-span-2 space-y-8">
          {!isEditing ? (
            <>
              {/* Nội dung khóa học */}
              <section className="border border-gray-200 rounded-xl p-6 shadow-sm bg-white">
                <h2 className="text-2xl font-bold mb-4 text-gray-900">
                  Nội dung khóa học
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {content}
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
              <section className="border border-gray-200 rounded-xl p-6 shadow-sm bg-white">
                <h2 className="text-2xl font-bold mb-4 text-gray-900">
                  Bạn sẽ học được gì
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {description}
                </p>
              </section>

              {/* Yêu cầu */}
              <section className="border border-gray-200 rounded-xl p-6 shadow-sm bg-white">
                <h2 className="text-2xl font-bold mb-4 text-gray-900">
                  Yêu cầu
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {request}
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
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
