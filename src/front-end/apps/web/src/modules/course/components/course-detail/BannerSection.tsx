import { Course } from "@repo/contracts";
import dayjs from "dayjs";
import { BookOpen, CalendarClock, Layers, Users } from "lucide-react";

function formatCourseDate(value?: string | number) {
  if (!value) return "Chưa cập nhật";

  const date = typeof value === "number" ? dayjs(value) : dayjs(value);
  return date.isValid() ? date.format("DD/MM/YYYY HH:mm") : "Chưa cập nhật";
}

// -------------------- BannerSection --------------------
export const BannerSection: React.FC<{
  isEditing: boolean;
  course: Course;
  editCourse: Course | null;
  setEditCourse: (c: Course | null) => void;
}> = ({ isEditing, course, editCourse, setEditCourse }) => {
  return (
    <section className="bg-[#1c1d1f] text-white">
      <div className="page-container py-8 sm:py-10 lg:pb-24 lg:pt-12">
        {!isEditing ? (
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white ring-1 ring-white/15">
              <BookOpen className="h-4 w-4" />
              CourseDemy course
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              {course.title}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">
              {course.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-3 text-sm text-white/80">
              <span className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 ring-1 ring-white/15">
                <Users className="h-4 w-4 text-primary-foreground" />
                {course.quantity ?? 0} học viên
              </span>
              <span className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 ring-1 ring-white/15">
                <Layers className="h-4 w-4 text-primary-foreground" />
                {course.category_name || "Chưa phân loại"}
              </span>
              <span className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 ring-1 ring-white/15">
                <CalendarClock className="h-4 w-4 text-primary-foreground" />
                {formatCourseDate(course.update_at)}
              </span>
            </div>

            <p className="mt-4 text-sm text-white/75">
              Giảng viên:{" "}
              <span className="font-medium text-white">
                {course.teacher_name || "CourseDemy"}
              </span>
            </p>
          </div>
        ) : (
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white ring-1 ring-white/15">
              <BookOpen className="h-4 w-4" />
              Đang chỉnh sửa
            </div>
            <input
              className="h-12 w-full rounded-lg border border-white/20 bg-white px-4 text-lg font-semibold text-foreground shadow-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-white/30"
              value={editCourse?.title || ""}
              onChange={(e) =>
                setEditCourse({ ...editCourse!, title: e.target.value })
              }
              placeholder="Tiêu đề"
            />

            <input
              className="h-11 w-full rounded-lg border border-white/20 bg-white px-4 text-sm text-foreground shadow-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-white/30"
              value={editCourse?.description || ""}
              onChange={(e) =>
                setEditCourse({ ...editCourse!, description: e.target.value })
              }
              placeholder="Mô tả ngắn"
            />

            <p className="text-sm text-white/75">
              Giảng viên: {course.teacher_name} | Lĩnh vực:{" "}
              {course.category_name}
            </p>

            <span className="text-sm text-white/75">
              Lần cập nhật gần nhất:{" "}
              {formatCourseDate(course.update_at)}
            </span>
          </div>
        )}
      </div>
    </section>
  );
};
