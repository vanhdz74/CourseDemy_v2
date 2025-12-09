import { Course, CourseDetail } from "@/types/courseType";
import Image from "next/image";
import ImageUploader from "@/components/common/ImageUploader";
import { useEffect, useState } from "react";

// -------------------- SidebarSection --------------------
export const SidebarSection: React.FC<{
  isEditing: boolean;
  course: Course;
  user: any;
  editCourse: Course | null;
  setEditCourse: (c: Course | null) => void;
  editDetail: any;
  setEditDetail: (d: any) => void;
  editImageFile: File | null;
  handleImageChange: (f: File | null) => void;
  onToggleEdit: () => void;
  onSave: () => Promise<void>;
}> = ({
  isEditing,
  course,
  user,
  editCourse,
  setEditCourse,
  editDetail,
  setEditDetail,
  editImageFile,
  handleImageChange,
  onToggleEdit,
  onSave,
}) => {
  const [sticky, setSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= 60) setSticky(true);
      else setSticky(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={
        `bg-[#fff] space-y-4 p-6 border-5 border-gray-200 rounded-lg shadow-md lg:absolute lg:top-20 lg:right-65 lg:w-[350px] lg:min-h-[80vh] ` +
        (sticky ? " lg:fixed lg:top-[80px] lg:w-[350px]" : "")
      }
    >
      {!isEditing ? (
        <>
          <div className="border-1 h-[200px]">
            <Image
              src={course.course_img}
              width={100}
              height={100}
              alt="img"
              className="w-full h-full"
            />
          </div>

          <p className="text-2xl font-bold">₫{course.price}</p>

          {user?.role === "TEACHER" || user?.role === "ADMIN" ? (
            <div className="min-w-[300px]"></div>
          ) : (
            <>
              <button className="w-full bg-[#ec5252] hover:bg-red-600 text-white py-3 px-4 rounded font-semibold transition-all duration-200">
                Thêm vào giỏ hàng
              </button>
              <button className="w-full border border-gray-300 hover:bg-gray-100 text-gray-800 py-3 px-4 rounded font-semibold transition-all duration-200">
                Mua ngay
              </button>
              <p className="text-sm text-center">
                Đảm bảo hoàn tiền trong 30 ngày
              </p>
            </>
          )}

          <div className="mt-4 text-sm text-gray-500 space-y-1 mt-10">
            <p>Số lượng học viên: {course.quantity}</p>
            <p>
              Level:{" "}
              {["Cơ bản", "Trung bình", "Nâng cao"][Number(course.level) - 1]}
            </p>

            <section>
              <h2 className="text-xl font-bold mb-3">Khóa học bao gồm:</h2>
              <ul className="list-disc list-inside text-gray-700 whitespace-pre-line leading-relaxed">
                {editDetail.course_include}
              </ul>
            </section>
          </div>

          {(user?.role === "TEACHER" || user?.role === "ADMIN") && (
            <div className="my-4">
              <button
                onClick={onToggleEdit}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Chỉnh sửa
              </button>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="border-1 h-[200px] mb-20">
            <ImageUploader
              value={editCourse?.course_img}
              onChange={handleImageChange}
              label="Upload ảnh khóa học"
              height={200}
              width={300}
            />
          </div>

          <input
            type="number"
            className="border p-2 rounded w-full lg:w-full"
            value={editCourse?.price}
            onChange={(e) =>
              setEditCourse({ ...editCourse!, price: Number(e.target.value) })
            }
          />

          <select
            className="border p-2 rounded w-full lg:w-[40%]"
            value={editCourse?.level}
            onChange={(e) =>
              setEditCourse({ ...editCourse!, level: Number(e.target.value) })
            }
          >
            <option value={"1"}>Cơ bản</option>
            <option value={"2"}>Trung bình</option>
            <option value={"3"}>Nâng cao</option>
          </select>

          <section>
            <h2 className="text-xl font-bold mb-3">Khóa học bao gồm:</h2>
            <textarea
              className="border p-2 rounded w-full min-h-50 lg:w-full"
              value={editDetail?.course_include}
              onChange={(e) =>
                setEditDetail({
                  ...editDetail!,
                  course_include: e.target.value,
                })
              }
            />
          </section>

          <div className="my-4 flex gap-2">
            <button
              onClick={onSave}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Lưu thay đổi
            </button>
            <button
              onClick={onToggleEdit}
              className="bg-gray-200 px-4 py-2 rounded"
            >
              Hủy
            </button>
          </div>
        </>
      )}
    </div>
  );
};
