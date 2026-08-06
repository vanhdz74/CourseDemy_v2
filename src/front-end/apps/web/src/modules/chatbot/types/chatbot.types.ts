export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  courseResults?: CourseResult[];
  weatherData?: WeatherInfo;
  roadmapData?: RoadmapInfo;
  statisticsData?: StatisticsInfo;
  isStreaming?: boolean; // Đang streaming response
}

export interface StatisticsInfo {
  totalStudents: number;
  totalTeachers: number;
  totalCourses: number;
  totalCategories: number;
  categories?: { id: number; name: string }[];
  teachers?: { id: number; username: string; email: string; avatar_url?: string }[];
  students?: { id: number; username: string; email: string; avatar_url?: string }[];
}

export interface RoadmapInfo {
  skill: string;
  overview: string;
  totalDuration: string;
  steps: {
    step: number;
    title: string;
    description: string;
    duration: string;
    skills: string[];
  }[];
  tips: string[];
}

export interface WeatherInfo {
  city: string;
  country: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  description: string;
  icon: string;
  windSpeed: number;
  visibility: number;
  pressure: number;
  sunrise: string;
  sunset: string;
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

