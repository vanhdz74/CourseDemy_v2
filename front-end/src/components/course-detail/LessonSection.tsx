// -------------------- LessonsSection --------------------
export const LessonsSection: React.FC<{
  lessons: any[];
  openLessonId: number | null;
  toggleLesson: (id: number) => Promise<void> | void;
  subLessons: Record<number, any[]>;
}> = ({ lessons, openLessonId, toggleLesson, subLessons }) => {
  return (
    <div className="space-y-3 ">
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
  );
};
