// -------------------- LessonsSection --------------------
import { Lesson, SubLesson } from "@repo/contracts";
import { ChevronDown, Clock3, ListVideo, PlayCircle } from "lucide-react";

export const LessonsSection: React.FC<{
  lessons: Lesson[];
  openLessonId: number | null;
  toggleLesson: (id: number) => Promise<void> | void;
  subLessons: Record<number, SubLesson[]>;
}> = ({ lessons, openLessonId, toggleLesson, subLessons }) => {
  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Chương trình học
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {lessons.length} bài học được sắp xếp theo lộ trình.
          </p>
        </div>
        <div className="inline-flex w-fit items-center gap-2 rounded-lg bg-muted px-3 py-2 text-sm font-medium text-muted-foreground">
          <ListVideo className="h-4 w-4" />
          Curriculum
        </div>
      </div>

      {lessons.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-muted/40 p-8 text-center text-sm text-muted-foreground">
          Danh sách bài học đang được cập nhật.
        </div>
      ) : (
        <div className="divide-y divide-border overflow-hidden rounded-lg border border-border">
          {lessons.map((lesson) => (
            <div key={lesson.id} className="bg-card">
              <button
                onClick={() => toggleLesson(lesson.id)}
                className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition hover:bg-muted/50"
              >
                <span className="min-w-0">
                  <span className="text-sm font-medium text-muted-foreground">
                    Bài {lesson.order_index}
                  </span>
                  <span className="mt-1 block truncate text-base font-semibold text-foreground">
                    {lesson.title}
                  </span>
                </span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform ${
                    openLessonId === lesson.id ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openLessonId === lesson.id && (
                <div className="space-y-2 bg-muted/30 px-4 pb-4 pt-1">
                  {(subLessons[lesson.id] || []).length === 0 ? (
                    <p className="rounded-lg bg-background p-3 text-sm text-muted-foreground">
                      Chưa có bài học con.
                    </p>
                  ) : (
                    (subLessons[lesson.id] || []).map((sub) => (
                      <div
                        key={sub.id}
                        className="flex items-start gap-3 rounded-lg bg-background p-3"
                      >
                        <PlayCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-foreground">
                            {sub.order_index}. {sub.title}
                          </p>
                          {sub.duration && (
                            <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Clock3 className="h-3.5 w-3.5" />
                              {sub.duration}
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
