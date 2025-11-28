"use client";

import { useApi } from "@/hooks/useApi";
import { useEffect, useState } from "react";
import { Course, CourseDetail } from "@/types/courseType";
import dayjs from "dayjs";
import Image from "next/image";
import { useAppSelector } from "@/redux/hooks";
import { toast } from "sonner";
import ImageUploader from "@/components/common/ImageUploader";

const CourseDetailPage = () => {
  const courseRedux = useAppSelector((state) => state.course);

  const { get, put, post } = useApi();
  const user = useAppSelector((state) => state.auth.user);

  // Dữ liệu course-detail
  const [data, setData] = useState<CourseDetail | null>(null);

  const [isEditing, setIsEditing] = useState(false); // Mở phần sửa
  const [editCourse, setEditCourse] = useState<Course | null>(null); // Sửa phầnn khoá học
  const [editDetail, setEditDetail] = useState({
    content: "",
    request: "",
    description: "",
    course_include: "",
  }); // Sửa chi tiết khoá học
  const [editImageFile, setEditImageFile] = useState<File | null>(null);

  // Lưu thay đổi ảnh course
  const handleImageChange = (file: File | null) => {
    setEditImageFile(file); // lưu file mới vô state
  };

  const handleSave = async () => {
    try {
      let uploadedImageUrl = null;

      // 1. Nếu có ảnh => upload trước
      if (editImageFile) {
        const formData = new FormData();
        formData.append("file", editImageFile);

        const resUpload = await post(
          `/upload-course-img/${courseRedux.courseId}`,
          formData
        );

        // url trả về
        uploadedImageUrl = resUpload.url;
      }

      // 2. Tạo object gửi lên API update
      const dataToSend = { course: { ...editCourse }, ...editDetail };
      if (uploadedImageUrl) {
        dataToSend.course.course_img = uploadedImageUrl;
      }

      // 3. put cập nhật lên api chính
      const data = await put(
        `/course-detail/m1/${courseRedux.courseId}`,
        dataToSend
      );

      toast.loading("Đang cập nhật");
      toast.success(data.message);
      fetchData();
      setIsEditing(false);
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Có lỗi xảy ra";

      toast.error(msg);
    }
  };

  // Set lại data khi sửa xong
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

  // fetch thông tin khi mới vào trang
  const fetchData = async () => {
    const idToFetch = courseRedux.courseId;
    if (!idToFetch) return; // chưa có id thì không fetch

    try {
      const res = await get(`/course-detail/${idToFetch}`);
      setData(res);
      console.log(res);
    } catch (error: any) {
      toast.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [courseRedux.courseId]);

  if (!data) return <div>Loading...</div>;

  const { course, content, request, description, course_include } = data;

  return (
    <div className="w-full">
      {/* Banner */}
      <div className="bg-black text-white pt-15 pb-10 px-4 md:px-10">
        <div className="max-w-6xl mx-auto">
          {!isEditing ? (
            <>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {course.title}
              </h1>
              <p className="text-md md:text-md mb-10">{course.description}</p>

              {/* <p>Bán chạy nhất: {course.level}</p> */}
              <p>{course.quantity} học viên</p>
              <p className="text-sm mb-2">
                Giảng viên: {course.teacher_name} | Lĩnh vực:
                {course.category_name}
              </p>

              {/* <p className="text-2xl md:text-3xl font-semibold">₫{course.price}</p> */}
              <span className="text-sm text-[#ddd]">
                Lần cập nhật gần nhất:
                {dayjs(String(course.update_at)).format("DD/MM/YYYY HH:mm")}
              </span>
            </>
          ) : (
            <div className="flex flex-col gap-4">
              {/* Title */}
              <input
                className="border p-2 rounded w-full lg:w-[65%]"
                value={editCourse?.title}
                onChange={(e) =>
                  setEditCourse({ ...editCourse!, title: e.target.value })
                }
                placeholder="Tiêu đề"
              />

              {/* Description */}
              <input
                className="border p-2 rounded w-full lg:w-[65%]"
                value={editCourse?.description}
                onChange={(e) =>
                  setEditCourse({ ...editCourse!, description: e.target.value })
                }
                placeholder="Mô tả ngắn"
              />
              {/* <p>Bán chạy nhất: {course.level}</p> */}

              <p className="text-sm mb-2">
                Giảng viên: {course.teacher_name} | Lĩnh vực:
                {course.category_name}
              </p>

              <span className="text-sm text-[#ddd]">
                Lần cập nhật gần nhất:
                {dayjs(String(course.update_at)).format("DD/MM/YYYY HH:mm")}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Right sidebar */}
      <div className="bg-[#fff] space-y-4 p-6 border-5 border-gray-200 rounded-lg shadow-md lg:absolute lg:top-20 lg:right-65 lg:min-h-[80vh] ">
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

              {/* Course includes */}
              <section>
                <h2 className="text-xl font-bold mb-3">Khóa học bao gồm:</h2>
                <ul className="list-disc list-inside text-gray-700 whitespace-pre-line leading-relaxed">
                  {course_include}
                </ul>
              </section>
            </div>
            {(user?.role === "TEACHER" || user?.role === "ADMIN") && (
              <div className="my-4">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Chỉnh sửa
                  </button>
                ) : (
                  <button
                    onClick={handleSave}
                    className="bg-green-600 text-white px-4 py-2 rounded"
                  >
                    Lưu thay đổi
                  </button>
                )}
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

            {/* Price */}
            <input
              type="number"
              className="border p-2 rounded w-full lg:w-full"
              value={editCourse?.price}
              onChange={(e) =>
                setEditCourse({
                  ...editCourse!,
                  price: Number(e.target.value),
                })
              }
            />

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

              {/* Select level */}
              <select
                className="border p-2 rounded w-full lg:w-[40%]"
                value={editCourse?.level}
                onChange={(e) =>
                  setEditCourse({
                    ...editCourse!,
                    level: Number(e.target.value),
                  })
                }
              >
                <option value={"1"}>Cơ bản</option>
                <option value={"2"}>Trung bình</option>
                <option value={"3"}>Nâng cao</option>
              </select>

              {/* Course includes */}
              <section>
                <h2 className="text-xl font-bold mb-3">Khóa học bao gồm:</h2>
                <ul className="list-disc list-inside text-gray-700 whitespace-pre-line leading-relaxed">
                  {/* Price */}
                  <textarea
                    className="border p-2 rounded w-full lg:w-full"
                    value={editDetail?.course_include}
                    onChange={(e) =>
                      setEditDetail({
                        ...editDetail!,
                        course_include: e.target.value,
                      })
                    }
                  />
                </ul>
              </section>
            </div>

            {/* Edit Button */}
            {(user?.role === "TEACHER" || user?.role === "ADMIN") && (
              <div className="my-4">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Chỉnh sửa
                  </button>
                ) : (
                  <button
                    onClick={handleSave}
                    className="bg-green-600 text-white px-4 py-2 rounded"
                  >
                    Lưu thay đổi
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-0 py-10 grid md:grid-cols-3 gap-10">
        {/* Left content */}
        {!isEditing ? (
          <>
            <div className="md:col-span-2 space-y-8">
              {/* Nội dung khóa học */}
              <section className="border p-5">
                <h2 className="text-2xl font-bold mb-3">Nội dung khóa học</h2>
                <div className="text-gray-700 leading-relaxed">{content}</div>
              </section>
              {/* Mục tiêu */}
              <section>
                <h2 className="text-2xl font-bold mb-3">Bạn sẽ học được gì</h2>
                <p className="text-gray-700 leading-relaxed">{description}</p>
              </section>
              {/* Yêu cầu */}
              <section>
                <h2 className="text-2xl font-bold mb-3">Yêu cầu</h2>
                <p className="text-gray-700 leading-relaxed">{request}</p>
              </section>
            </div>
          </>
        ) : (
          <>
            <div className="md:col-span-2 space-y-8">
              {/* Nội dung khóa học */}
              <section className="border p-5">
                <h2 className="text-2xl font-bold mb-3">Nội dung khóa học</h2>
                <textarea
                  className="border p-2 rounded w-full lg:w-full"
                  value={editDetail?.content}
                  onChange={(e) =>
                    setEditDetail({
                      ...editDetail!,
                      content: e.target.value,
                    })
                  }
                />
              </section>

              {/* Mục tiêu */}
              <section>
                <h2 className="text-2xl font-bold mb-3">Bạn sẽ học được gì</h2>
                <textarea
                  className="border p-2 rounded w-full lg:w-full"
                  value={editDetail?.description}
                  onChange={(e) =>
                    setEditDetail({
                      ...editDetail!,
                      description: e.target.value,
                    })
                  }
                />
              </section>

              {/* Yêu cầu */}
              <section>
                <h2 className="text-2xl font-bold mb-3">Yêu cầu</h2>
                <textarea
                  className="border p-2 rounded w-full lg:w-full"
                  value={editDetail?.request}
                  onChange={(e) =>
                    setEditDetail({
                      ...editDetail!,
                      request: e.target.value,
                    })
                  }
                />
              </section>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CourseDetailPage;
