export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  courseResults?: CourseResult[];
}

export interface CourseResult {
  id: number;
  title: string;
  description: string;
  price: number;
  teacher_name: string;
  img: string;
}

export interface QueryAnalysis {
  isSearchingCourse: boolean;
  courseKeyword?: string;
  originalQuery: string;
  isGeneralQuestion?: boolean; // Câu hỏi chung chung cần hỏi lại
}

export interface GeminiResponse {
  text: string;
  isSearchingCourse: boolean;
  courseKeyword?: string;
}

