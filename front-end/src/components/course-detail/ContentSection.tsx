"use client";

import publicClient from "@/api/publicClient";
import { useEffect, useState } from "react";

export default function ContentSection({
  content,
  description,
  request,
  courseId,
}: {
  content: any;
  description: any;
  request: any;
  courseId: number;
}) {
  const [lessons, setLessons] = useState<any[]>([]);
  const [openLessonId, setOpenLessonId] = useState<number | null>(null);
  const [subLessons, setSubLessons] = useState<Record<number, any[]>>({});

  // Fetch lessons
  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const res = await publicClient.get(
          `/public/lessons/course/${courseId}`
        );
        const data = await res.data;
        setLessons(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchLessons();
  }, [courseId]);

  // Fetch sublessons only when clicking
  const toggleLesson = async (lessonId: number) => {
    if (openLessonId === lessonId) {
      setOpenLessonId(null);
      return;
    }

    // fetch if not fetched before
    if (!subLessons[lessonId]) {
      try {
        const res = await publicClient.get(
          `/public/sublessons/lesson/${lessonId}`
        );
        const data = await res.data;
        setSubLessons((prev) => ({ ...prev, [lessonId]: data }));
      } catch (err) {
        console.error(err);
      }
    }

    setOpenLessonId(lessonId);
  };

  return (
    <div className="space-y-8">
      <section className="border p-5 max-w-[60%]">
        <h2 className="text-2xl font-bold mb-3">Nội dung khóa học</h2>
        <div className="text-gray-700 mb-5">{content}</div>
      </section>

      {/* Lessons */}
      <div className="space-y-3 max-w-[60%]">
        <h2 className="text-2xl font-bold mb-3">Nội dung khoá học</h2>
        <hr />

        {lessons.map((lesson) => (
          <div key={lesson.id} className="border rounded p-3">
            <button
              onClick={() => toggleLesson(lesson.id)}
              className="w-full flex justify-between items-center text-left font-semibold text-lg"
            >
              <span>
                {lesson.order_index}. {lesson.title}
              </span>
              <span>{openLessonId === lesson.id ? "▲" : "▼"}</span>
            </button>

            {/* Sub Lessons */}
            {openLessonId === lesson.id && (
              <div className="mt-3 pl-4 space-y-2 text-gray-700">
                {(subLessons[lesson.id] || []).map((sub) => (
                  <div key={sub.id} className="border-l-2 pl-3">
                    <p className="font-medium">
                      {sub.order_index}. {sub.title}
                    </p>
                    {sub.duration && (
                      <p className="text-sm text-gray-500">
                        Thời lượng: {sub.duration}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <section>
        <h2 className="text-2xl font-bold mb-3">Bạn sẽ học được gì</h2>
        <p className="text-gray-700">{description}</p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-3">Yêu cầu</h2>
        <p className="text-gray-700">{request}</p>
      </section>
    </div>
  );
}
