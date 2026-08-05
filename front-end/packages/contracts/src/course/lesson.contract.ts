export type Lesson = {
  id: number;
  title: string;
  order_index?: number | null;
  // sub_lessons sẽ được thêm sau khi fetch sublessons
  sub_lessons?: SubLesson[];
};

export type SubLesson = {
  id: number;
  title: string;
  video_url?: string | null;
  duration?: string | null;
  order_index?: number | null;
};
