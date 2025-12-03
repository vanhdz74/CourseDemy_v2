"use client";

import LessonsCourse from "@/components/course/LessonsCourse";
import SubTitle from "@/components/course/SubTitle";
import VideoCourse from "@/components/course/VideoCourse";

import { useAppSelector } from "@/redux/hooks";
import { useEffect, useRef, useState } from "react";

import { useParams } from "next/navigation";
import { useApi } from "@/hooks/useApi";

const LessonPage = () => {
  const { get } = useApi();
  const params = useParams();

  const [isFixed, setIsFixed] = useState(false);
  const [tabWidth, setTabWidth] = useState<number | null>(null);
  const tabRef = useRef<HTMLDivElement>(null);

  const courseId = useAppSelector((state) => state.course.courseId);
  const token = useAppSelector((state) => state.auth.token);

  const [lessons, setLessons] = useState<any[]>([]); // bài học hiện tại
  const [openLessonIds, setOpenLessonIds] = useState<number[]>([]); // mở theo id lesson
  const [selectedSubLessonId, setSelectedSubLessonId] = useState<number | null>(
    null
  ); // sub_lesson đc chọn
  const [reloadFlag, setReloadFlag] = useState(false); // reload mõi khi LessonsCourses cập nhật

  // Đọc subLessonId từ URL khi load trang
  useEffect(() => {
    const pathParts = window.location.pathname.split("/");
    const subId = Number(pathParts[pathParts.length - 1]);
    if (!isNaN(subId)) {
      setSelectedSubLessonId(subId);
    }
  }, []);

  // Lắng nghe khi người dùng ấn nút Back/Forward
  useEffect(() => {
    const handlePopState = () => {
      const pathParts = window.location.pathname.split("/");
      const subId = Number(pathParts[pathParts.length - 1]);
      if (!isNaN(subId)) setSelectedSubLessonId(subId);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Fetch danh sách lesson
  useEffect(() => {
    const fetchLessons = async () => {
      const data = await get(`/lessons/course/${courseId}`);
      setLessons(data);
    };
    fetchLessons();
  }, [reloadFlag]);

  // Xử lý khi load trang thì hiển thị lại trang vừa rồi
  useEffect(() => {
    if (lessons.length > 0 && selectedSubLessonId) {
      // Tìm lesson chứa sublesson hiện tại
      const foundLesson = lessons.find((lesson) =>
        lesson.sub_lessons?.some((sub: any) => sub.id === selectedSubLessonId)
      );

      // Nếu chưa có sub_lessons trong lesson thì fetch nó
      if (!foundLesson) {
        // Tìm lesson có thể chứa sublesson qua API (trong trường hợp sub_lessons chưa load)
        lessons.forEach(async (lesson) => {
          const data = await get(`/sublessons/lesson/${lesson.id}`);

          if (data.some((s: any) => s.id === selectedSubLessonId)) {
            setOpenLessonIds((prev) =>
              prev.includes(lesson.id) ? prev : [...prev, lesson.id]
            );
            setLessons((prev) =>
              prev.map((l) =>
                l.id === lesson.id ? { ...l, sub_lessons: data } : l
              )
            );
          }
        });
      } else {
        // Nếu lesson đã có sub_lessons thì chỉ cần mở lesson đó
        setOpenLessonIds((prev) =>
          prev.includes(foundLesson.id) ? prev : [...prev, foundLesson.id]
        );
      }
    }
  }, [lessons, selectedSubLessonId]);

  // Load sublesson cho 1 lesson cụ thể
  const loadSubLessons = async (lessonId: number) => {
    const foundLesson = lessons.find((l) => l.id === lessonId);
    if (foundLesson?.sub_lessons) return;

    const data = await get(`/sublessons/lesson/${lessonId}`);

    setLessons((prev) =>
      prev.map((l) => (l.id === lessonId ? { ...l, sub_lessons: data } : l))
    );
  };

  // Tìm sublesson hiện tại
  const currentSubLesson = lessons
    .flatMap((l) => l.sub_lessons || [])
    .find((s) => s.id === selectedSubLessonId);

  // Toggle mở / đóng lesson
  const handleToggleLesson = async (lessonId: number) => {
    if (openLessonIds.includes(lessonId)) {
      setOpenLessonIds((prev) => prev.filter((id) => id !== lessonId));
    } else {
      setOpenLessonIds((prev) => [...prev, lessonId]);
      await loadSubLessons(lessonId);
    }
  };

  // Scroll để cố định tab
  useEffect(() => {
    const handleScroll = () => setIsFixed(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (tabRef.current && !isFixed) {
      setTabWidth(tabRef.current.offsetWidth);
    }
  }, [isFixed]);

  return (
    <div className="flex min-h-[100vh]">
      {/* Phần video */}
      <div className="flex-[3]">
        <VideoCourse subLesson={currentSubLesson} />

        {/* Tiêu đề dưới */}
        <div className="border-t-[1px]">
          <SubTitle />
        </div>
      </div>

      {/* Tab bên phải */}
      <div
        ref={tabRef}
        className={`flex-[1] border shadow-sm bg-white will-change-transform${
          isFixed ? "fixed top-0 bottom-0 right-0" : "relative"
        }`}
        style={isFixed ? { width: `${tabWidth}px` } : undefined}
      >
        <div className="overflow-y-auto py-4 h-[100vh] cursor-pointer">
          <LessonsCourse
            onReload={() => setReloadFlag((prev) => !prev)}
            lessons={lessons}
            openLessonIds={openLessonIds}
            selectedSubLessonId={selectedSubLessonId}
            onToggleLesson={handleToggleLesson}
            onSelectSubLesson={(lessonId, subLessonId) => {
              setSelectedSubLessonId(subLessonId);
              // Cập nhật URL mà vẫn giữ lịch sử + không reload
              window.history.pushState(
                null,
                "",
                `/course/${params.course_name}/${lessonId}/${params.status}/${subLessonId}`
              );
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default LessonPage;
