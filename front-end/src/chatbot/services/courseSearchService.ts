import { CourseResult } from "../types/chatbot.types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081";

export async function searchCourses(keyword: string): Promise<CourseResult[]> {
  try {
    const response = await fetch(
      `${API_URL}/courses/search?keyword=${encodeURIComponent(keyword)}`
    );

    if (!response.ok) {
      throw new Error("Không thể tìm kiếm khóa học");
    }

    const data = await response.json();
    const courses = data.courses || [];

    return courses.map((course: any) => ({
      id: course.id,
      title: course.title,
      description: course.description || "",
      price: course.price || 0,
      teacher_name: course.teacher_name || "Chưa có",
      img: course.img || "/placeholder.svg",
    }));
  } catch (error) {
    console.error("Lỗi khi tìm kiếm khóa học:", error);
    return [];
  }
}

export function formatCourseResultsMessage(
  courses: CourseResult[],
  keyword: string
): string {
  if (courses.length === 0) {
    return `Xin lỗi, tôi không tìm thấy khóa học nào liên quan đến "${keyword}". Bạn có thể thử với từ khóa khác không?`;
  }

  let message = `Tôi tìm thấy ${courses.length} khóa học liên quan đến "${keyword}":\n\n`;

  courses.slice(0, 5).forEach((course, index) => {
    message += `${index + 1}. ${course.title}\n`;
    message += `   - Giảng viên: ${course.teacher_name}\n`;
    message += `   - Giá: ${course.price.toLocaleString("vi-VN")} VNĐ\n`;
    if (course.description) {
      const shortDesc = course.description.substring(0, 100);
      message += `   - Mô tả: ${shortDesc}${course.description.length > 100 ? "..." : ""}\n`;
    }
    message += `\n`;
  });

  if (courses.length > 5) {
    message += `\nVà còn ${courses.length - 5} khóa học khác. Bạn có muốn xem thêm không?`;
  }

  return message;
}

