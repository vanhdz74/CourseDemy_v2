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
  // level: number;
  beginLessonId?: number;
}
