"use client";

import LessonsCourse from "@/modules/course/components/course/LessonsCourse";
import SubTitle from "@/modules/course/components/course/SubTitle";
import VideoCourse from "@/modules/course/components/course/VideoCourse";
import { Button } from "@/modules/shared/components/ui/button";
import { Skeleton } from "@/modules/shared/components/ui/skeleton";
import { useApi } from "@/modules/shared/hooks/useApi";
import { useAppSelector } from "@/modules/shared/store/hooks";
import { Lesson, SubLesson } from "@repo/contracts";
import { AlertCircle, BookOpen, PanelRightClose } from "lucide-react";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

type CourseRouteParams = {
  courseSlug?: string | string[];
  lectureId?: string | string[];
  status?: string | string[];
  sublessonId?: string | string[];
};

function getParamValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return "Không tải được nội dung khóa học.";
}

const LessonPage = () => {
  const { get } = useApi();
  const params = useParams<CourseRouteParams>();
  const courseId = useAppSelector((state) => state.course.courseId);

  const courseSlug = getParamValue(params.courseSlug) || "";
  const status = getParamValue(params.status) || "view";
  const routeLessonId = Number(getParamValue(params.lectureId));
  const routeSubLessonId = Number(getParamValue(params.sublessonId));

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [openLessonIds, setOpenLessonIds] = useState<number[]>([]);
  const [selectedSubLessonId, setSelectedSubLessonId] = useState<number | null>(
    Number.isFinite(routeSubLessonId) ? routeSubLessonId : null,
  );
  const [reloadFlag, setReloadFlag] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setSelectedSubLessonId(Number.isFinite(routeSubLessonId) ? routeSubLessonId : null);
  }, [routeSubLessonId]);

  const loadSubLessons = useCallback(
    async (lessonId: number) => {
      const foundLesson = lessons.find((lesson) => lesson.id === lessonId);
      if (foundLesson?.sub_lessons) {
        return foundLesson.sub_lessons;
      }

      const data = await get<SubLesson[]>(`/sublessons/lesson/${lessonId}`);
      setLessons((prev) =>
        prev.map((lesson) =>
          lesson.id === lessonId ? { ...lesson, sub_lessons: data } : lesson,
        ),
      );
      return data;
    },
    [get, lessons],
  );

  const fetchLessons = useCallback(async () => {
    if (!courseId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const data = await get<Lesson[]>(`/lessons/course/${courseId}`);
      setLessons(data || []);
    } catch (error: unknown) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, [courseId, get]);

  useEffect(() => {
    fetchLessons();
  }, [fetchLessons, reloadFlag]);

  useEffect(() => {
    if (!Number.isFinite(routeLessonId) || routeLessonId <= 0 || lessons.length === 0) {
      return;
    }

    setOpenLessonIds((prev) =>
      prev.includes(routeLessonId) ? prev : [...prev, routeLessonId],
    );
    loadSubLessons(routeLessonId);
  }, [lessons.length, loadSubLessons, routeLessonId]);

  useEffect(() => {
    if (selectedSubLessonId || lessons.length === 0) return;

    const firstLesson = lessons[0];
    if (!firstLesson) return;

    let isActive = true;
    setOpenLessonIds((prev) =>
      prev.includes(firstLesson.id) ? prev : [...prev, firstLesson.id],
    );

    loadSubLessons(firstLesson.id)
      .then((subLessons) => {
        if (!isActive) return;

        const firstSubLesson = subLessons[0];
        if (!firstSubLesson) return;

        setSelectedSubLessonId(firstSubLesson.id);
        window.history.replaceState(
          null,
          "",
          `/course/${courseSlug}/lectures/${firstLesson.id}/${status}/${firstSubLesson.id}`,
        );
      })
      .catch(() => {
        if (isActive) {
          setErrorMessage("Không tải được bài học đầu tiên.");
        }
      });

    return () => {
      isActive = false;
    };
  }, [courseSlug, lessons, loadSubLessons, selectedSubLessonId, status]);

  useEffect(() => {
    if (!selectedSubLessonId || lessons.length === 0) return;

    const loadedLesson = lessons.find((lesson) =>
      lesson.sub_lessons?.some((subLesson) => subLesson.id === selectedSubLessonId),
    );

    if (loadedLesson) {
      setOpenLessonIds((prev) =>
        prev.includes(loadedLesson.id) ? prev : [...prev, loadedLesson.id],
      );
    }
  }, [lessons, selectedSubLessonId]);

  const currentSubLesson = useMemo(
    () =>
      lessons
        .flatMap((lesson) => lesson.sub_lessons || [])
        .find((subLesson) => subLesson.id === selectedSubLessonId),
    [lessons, selectedSubLessonId],
  );

  const handleToggleLesson = async (lessonId: number) => {
    if (openLessonIds.includes(lessonId)) {
      setOpenLessonIds((prev) => prev.filter((id) => id !== lessonId));
      return;
    }

    setOpenLessonIds((prev) => [...prev, lessonId]);
    await loadSubLessons(lessonId);
  };

  const handleSelectSubLesson = async (lessonId: number, subLessonId: number) => {
    await loadSubLessons(lessonId);
    setSelectedSubLessonId(subLessonId);
    window.history.pushState(
      null,
      "",
      `/course/${courseSlug}/lectures/${lessonId}/${status}/${subLessonId}`,
    );
  };

  if (isLoading) {
    return (
      <div className="grid min-h-screen gap-0 bg-background lg:grid-cols-[minmax(0,1fr)_390px]">
        <main className="min-w-0">
          <Skeleton className="h-[56vh] rounded-none" />
          <div className="space-y-4 p-6">
            <Skeleton className="h-9 w-64" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-4/5" />
          </div>
        </main>
        <aside className="hidden border-l border-border bg-card p-4 lg:block">
          <Skeleton className="h-8 w-44" />
          <div className="mt-6 space-y-3">
            {Array.from({ length: 7 }).map((_, index) => (
              <Skeleton key={index} className="h-16 w-full" />
            ))}
          </div>
        </aside>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 text-center shadow-sm">
          <AlertCircle className="mx-auto h-10 w-10 text-destructive" />
          <h1 className="mt-4 text-lg font-semibold text-foreground">
            Không tải được bài học
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">{errorMessage}</p>
          <Button onClick={fetchLessons} className="mt-5">
            Thử tải lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-[minmax(0,1fr)_390px]">
      <main className="min-w-0 border-r border-border/70">
        <div className="sticky top-0 z-20 border-b border-border bg-background">
          <div className="border-b border-border bg-card/85 px-4 py-3 backdrop-blur sm:px-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <span>Không gian học tập</span>
                </div>
                <h1 className="mt-1 truncate text-lg font-semibold text-foreground">
                  {currentSubLesson?.title || "Tổng quan khóa học"}
                </h1>
              </div>
              <div className="inline-flex w-fit items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm text-muted-foreground">
                <PanelRightClose className="h-4 w-4" />
                {lessons.length} phần học
              </div>
            </div>
          </div>
          <VideoCourse subLesson={currentSubLesson} />
        </div>

        <SubTitle selectedSubLesson={currentSubLesson} />
      </main>

      <aside className="order-first border-b border-border bg-card lg:sticky lg:top-0 lg:order-none lg:h-screen lg:border-b-0">
        <div className="h-full overflow-y-auto">
          <LessonsCourse
            onReload={() => setReloadFlag((prev) => !prev)}
            lessons={lessons}
            openLessonIds={openLessonIds}
            selectedSubLessonId={selectedSubLessonId}
            onToggleLesson={handleToggleLesson}
            onSelectSubLesson={handleSelectSubLesson}
          />
        </div>
      </aside>
    </div>
  );
};

export default LessonPage;
