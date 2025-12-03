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
  category_name?: String;
  beginLessonId?: number;
  update_at?: String;
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
