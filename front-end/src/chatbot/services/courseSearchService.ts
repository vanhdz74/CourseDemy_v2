import { CourseResult } from "../types/chatbot.types";
import { getNoCoursesFoundMessage, getNoTeacherCoursesMessage } from "./randomMessages";

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

    return courses.map((course: Record<string, unknown>) => ({
      id: course.id as number,
      title: course.title as string,
      description: (course.description as string) || "",
      price: (course.price as number) || 0,
      teacher_name: (course.teacher_name as string) || "Chưa có",
      img: (course.img as string) || "/placeholder.svg",
    }));
  } catch (error) {
    console.error("Lỗi khi tìm kiếm khóa học:", error);
    return [];
  }
}

export async function searchCoursesByTeacher(teacherName: string): Promise<CourseResult[]> {
  try {
    // Lấy tất cả khóa học (không dùng keyword để tìm theo tên giảng viên)
    // vì API backend không hỗ trợ tìm theo teacher_name trong keyword
    const response = await fetch(
      `${API_URL}/courses/search?page=0&size=100`
    );

    if (!response.ok) {
      throw new Error("Không thể tìm kiếm khóa học");
    }

    const data = await response.json();
    const courses = data.courses || data.content || [];

    // Lọc các khóa học có tên giáo viên khớp (case-insensitive)
    const normalizedTeacherName = teacherName.toLowerCase().trim();
    
    // Tách tên để tìm kiếm linh hoạt hơn
    const searchTerms = normalizedTeacherName.split(/\s+/).filter(term => term.length > 1);
    
    const filteredCourses = courses.filter((course: Record<string, unknown>) => {
      const courseTeacherName = ((course.teacher_name as string) || "").toLowerCase();
      
      // Kiểm tra nếu tên giảng viên chứa tất cả các từ tìm kiếm
      // hoặc chứa toàn bộ chuỗi tìm kiếm
      if (courseTeacherName.includes(normalizedTeacherName)) {
        return true;
      }
      
      // Tìm kiếm linh hoạt: tất cả các từ phải xuất hiện trong tên
      if (searchTerms.length > 0) {
        return searchTerms.every(term => courseTeacherName.includes(term));
      }
      
      return false;
    });

    return filteredCourses.map((course: Record<string, unknown>) => ({
      id: course.id as number,
      title: course.title as string,
      description: (course.description as string) || "",
      price: (course.price as number) || 0,
      teacher_name: (course.teacher_name as string) || "Chưa có",
      img: (course.img as string) || "/placeholder.svg",
    }));
  } catch (error) {
    console.error("Lỗi khi tìm kiếm khóa học theo giáo viên:", error);
    return [];
  }
}

export function formatCourseResultsMessage(
  courses: CourseResult[],
  keyword: string
): string {
  if (courses.length === 0) {
    return getNoCoursesFoundMessage(keyword);
  }

  let message = `Tôi tìm thấy ${courses.length} khóa học liên quan đến "${keyword}":`;

  if (courses.length > 5) {
    message += `\n\nHiển thị 5 khóa học đầu tiên. Còn ${courses.length - 5} khóa học khác.`;
  }

  return message;
}

export function formatTeacherCourseResultsMessage(
  courses: CourseResult[],
  teacherName: string
): string {
  if (courses.length === 0) {
    return getNoTeacherCoursesMessage(teacherName);
  }

  const uniqueTeachers = [...new Set(courses.map(c => c.teacher_name))];
  let message = `Tìm thấy ${courses.length} khóa học của giáo viên "${uniqueTeachers.join(", ")}":`;

  if (courses.length > 5) {
    message += `\n\nHiển thị 5 khóa học đầu tiên. Còn ${courses.length - 5} khóa học khác.`;
  }

  return message;
}

