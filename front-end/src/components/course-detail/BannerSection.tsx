import { Course, CourseDetail } from "@/types/courseType";
import dayjs from "dayjs";

// -------------------- BannerSection --------------------
export const BannerSection: React.FC<{
  isEditing: boolean;
  course: Course;
  editCourse: Course | null;
  setEditCourse: (c: Course | null) => void;
}> = ({ isEditing, course, editCourse, setEditCourse }) => {
  return (
    <div className="bg-black text-white pt-15 pb-10 px-4 md:px-10">
      <div className="max-w-6xl mx-auto">
        {!isEditing ? (
          <>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {course.title}
            </h1>
            <p className="text-md md:text-md mb-10">{course.description}</p>

            <p>{course.quantity} học viên</p>
            <p className="text-sm mb-2">
              Giảng viên: {course.teacher_name} | Lĩnh vực:{" "}
              {course.category_name}
            </p>

            <span className="text-sm text-[#ddd]">
              Lần cập nhật gần nhất:{" "}
              {dayjs(String(course.update_at)).format("DD/MM/YYYY HH:mm")}
            </span>
          </>
        ) : (
          <div className="flex flex-col gap-4">
            <input
              className="border p-2 rounded w-full lg:w-[65%]"
              value={editCourse?.title || ""}
              onChange={(e) =>
                setEditCourse({ ...editCourse!, title: e.target.value })
              }
              placeholder="Tiêu đề"
            />

            <input
              className="border p-2 rounded w-full lg:w-[65%]"
              value={editCourse?.description || ""}
              onChange={(e) =>
                setEditCourse({ ...editCourse!, description: e.target.value })
              }
              placeholder="Mô tả ngắn"
            />

            <p className="text-sm mb-2">
              Giảng viên: {course.teacher_name} | Lĩnh vực:{" "}
              {course.category_name}
            </p>

            <span className="text-sm text-[#ddd]">
              Lần cập nhật gần nhất:{" "}
              {dayjs(String(course.update_at)).format("DD/MM/YYYY HH:mm")}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
