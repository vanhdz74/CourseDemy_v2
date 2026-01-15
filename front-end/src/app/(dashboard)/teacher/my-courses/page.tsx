"use client";

import { useParams, useSearchParams } from "next/navigation";
import CourseDisplay from "@/components/common/CourseDisplay";
import { useAppSelector } from "@/redux/hooks";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useApi } from "@/hooks/useApi";

const TeacherCourseManagement = () => {
  const params = useParams();
  const user = useAppSelector((state) => state.auth.user);
  const { post } = useApi();

  const randomNumber = Math.floor(1000 + Math.random() * 9000); // 4 số random
  const handleAddCourse = async () => {
    const payload = {
      title: `Khoá học ${randomNumber}`,
      description: "",
      teacher_id: user?.id,
      price: 0,
      category_name: "Lập trình Web",
    };

    // console.log(payload);
    try {
      const data = await post(`/course`, payload);
      toast.success("Tạo khoá học thành công!");
    } catch (error: any) {
      toast.error(`Lỗi: ${error.message}`);
    }
  };

  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-2xl mb-[20px]">Danh sách</h1>
        <Button onClick={handleAddCourse}>Thêm khoá học</Button>
      </div>

      <CourseDisplay
        apiUrl={`${process.env.NEXT_PUBLIC_API_URL}/courses/search?teacher_id=${user?.id}`}
      />
    </div>
  );
};

export default TeacherCourseManagement;
