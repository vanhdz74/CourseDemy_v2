// Các thuộc tính hiện lên trên khoá học
export interface Course {
  id: number;
  img: string;
  title: string;
  description: string;
  teacher_name: string;
  completeSpeed?: number;
  star?: number;
  price: number;
  quantity?: number;
  level?: number;
  category_name?: string;
  category_id?: number;
  beginLessonId?: number;
  update_at?: string | number;
  course_img: string;
}

export interface CourseDetail {
  course: Course;
  id: number;
  content: string;
  request: string;
  description: string;
  course_include: string;
}
