// Service để lấy thống kê website

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081";

export interface WebsiteStatistics {
  totalStudents: number;
  totalTeachers: number;
  totalCourses: number;
  totalCategories: number;
  // Thêm thông tin chi tiết
  categories?: CategoryInfo[];
  teachers?: UserInfo[];
  students?: UserInfo[];
}

export interface UserInfo {
  id: number;
  username: string;
  email: string;
  avatar_url?: string;
}

export interface CategoryInfo {
  id: number;
  name: string;
  courseCount?: number;
}

// Kiểm tra xem người dùng có đang hỏi về thống kê không
export function isStatisticsQuery(query: string): boolean {
  const lowerQuery = query.toLowerCase();
  
  const statisticsPatterns = [
    // Hỏi về số lượng chung
    /bao nhiêu (học viên|sinh viên|học sinh|người học|student)/i,
    /bao nhiêu (giáo viên|giảng viên|thầy|cô|teacher)/i,
    /bao nhiêu (khóa học|khoá học|course)/i,
    /bao nhiêu (danh mục|category|loại)/i,
    // Hỏi về thống kê
    /thống kê|thong ke|statistics/i,
    /số lượng (học viên|giáo viên|khóa học|danh mục)/i,
    /tổng (học viên|giáo viên|khóa học|danh mục)/i,
    /có bao nhiêu/i,
    // Hỏi về website
    /website có (bao nhiêu|mấy)/i,
    /trang web có (bao nhiêu|mấy)/i,
    /hệ thống có (bao nhiêu|mấy)/i,
    /coursedemy có (bao nhiêu|mấy)/i,
    // Hỏi cụ thể
    /số (học viên|sinh viên|giáo viên|giảng viên|khóa học|danh mục)/i,
    /tổng số/i,
  ];
  
  return statisticsPatterns.some(pattern => pattern.test(lowerQuery));
}

// Lấy thống kê từ các API
export async function getWebsiteStatistics(): Promise<WebsiteStatistics | null> {
  try {
    // Gọi song song các API để lấy dữ liệu
    const [usersResponse, coursesResponse, categoriesResponse] = await Promise.all([
      fetch(`${API_URL}/user/all`).catch(() => null),
      fetch(`${API_URL}/courses/search`).catch(() => null),
      fetch(`${API_URL}/categories`).catch(() => null),
    ]);

    let totalStudents = 0;
    let totalTeachers = 0;
    let totalCourses = 0;
    let totalCategories = 0;
    let categories: CategoryInfo[] = [];
    let teachers: UserInfo[] = [];
    let students: UserInfo[] = [];

    // Xử lý users - đếm theo role và lấy danh sách chi tiết
    if (usersResponse && usersResponse.ok) {
      const users = await usersResponse.json();
      if (Array.isArray(users)) {
        // Lọc học viên (role = STUDENT hoặc role_id = 3)
        const studentsList = users.filter(
          (u: Record<string, unknown>) => 
            (u.role as string)?.toLowerCase() === 'student' || 
            (u.role_name as string)?.toLowerCase() === 'student' || 
            (u.role_id as number) === 3
        );
        totalStudents = studentsList.length;
        students = studentsList.map((u: Record<string, unknown>) => ({
          id: u.id as number,
          username: (u.username as string) || 'Chưa có tên',
          email: (u.email as string) || '',
          avatar_url: u.avatar_url as string,
        }));

        // Lọc giảng viên (role = TEACHER hoặc role_id = 2)
        const teachersList = users.filter(
          (u: Record<string, unknown>) => 
            (u.role as string)?.toLowerCase() === 'teacher' || 
            (u.role_name as string)?.toLowerCase() === 'teacher' || 
            (u.role_id as number) === 2
        );
        totalTeachers = teachersList.length;
        teachers = teachersList.map((u: Record<string, unknown>) => ({
          id: u.id as number,
          username: (u.username as string) || 'Chưa có tên',
          email: (u.email as string) || '',
          avatar_url: u.avatar_url as string,
        }));
      }
    }

    // Xử lý courses
    if (coursesResponse && coursesResponse.ok) {
      const data = await coursesResponse.json();
      if (data.totalElements) {
        totalCourses = data.totalElements;
      } else if (data.courses && Array.isArray(data.courses)) {
        totalCourses = data.courses.length;
      } else if (Array.isArray(data)) {
        totalCourses = data.length;
      }
    }

    // Xử lý categories
    if (categoriesResponse && categoriesResponse.ok) {
      const data = await categoriesResponse.json();
      if (Array.isArray(data)) {
        totalCategories = data.length;
        categories = data.map((cat: Record<string, unknown>) => ({
          id: cat.id as number,
          name: cat.name as string,
        }));
      }
    }

    return {
      totalStudents,
      totalTeachers,
      totalCourses,
      totalCategories,
      categories,
      teachers,
      students,
    };
  } catch (error) {
    console.error("Lỗi khi lấy thống kê website:", error);
    return null;
  }
}

// Format message thống kê
export function formatStatisticsMessage(stats: WebsiteStatistics): string {
  let message = "📊 Thống kê CourseDemy\n\n";
  
  message += `👨‍🎓 Học viên: ${stats.totalStudents.toLocaleString("vi-VN")} người\n`;
  message += `👨‍🏫 Giảng viên: ${stats.totalTeachers.toLocaleString("vi-VN")} người\n`;
  message += `📚 Khóa học: ${stats.totalCourses.toLocaleString("vi-VN")} khóa\n`;
  message += `📂 Danh mục: ${stats.totalCategories.toLocaleString("vi-VN")} danh mục\n`;
  
  if (stats.categories && stats.categories.length > 0) {
    message += "\n📁 Các danh mục khóa học:\n";
    stats.categories.slice(0, 8).forEach((cat, index) => {
      message += `  ${index + 1}. ${cat.name}\n`;
    });
    if (stats.categories.length > 8) {
      message += `  ... và ${stats.categories.length - 8} danh mục khác\n`;
    }
  }
  
  return message;
}
