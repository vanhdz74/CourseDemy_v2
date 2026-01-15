"use client";

import { useState, useRef, useEffect } from "react";
import { useChatbot } from "../hooks/useChatbot";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Send, MessageCircle, Loader2, ExternalLink, Route, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { setCourse } from "@/features/course/courseSlice";

// Danh sách câu hỏi gợi ý theo category
const SUGGESTED_QUESTIONS = {
  course: [
    { emoji: "📚", text: "Tìm khóa học Python" },
    { emoji: "💻", text: "Khóa học lập trình web" },
    { emoji: "📱", text: "Có khóa học React Native không?" },
    { emoji: "👨‍🏫", text: "Khóa học của thầy Minh" },
  ],
  knowledge: [
    { emoji: "🤔", text: "JavaScript là gì?" },
    { emoji: "⚡", text: "So sánh React và Vue" },
    { emoji: "🔧", text: "API hoạt động như thế nào?" },
    { emoji: "📊", text: "Database SQL khác NoSQL thế nào?" },
  ],
  recommendation: [
    { emoji: "🎯", text: "Nên học ngôn ngữ gì để làm web?" },
    { emoji: "📱", text: "Muốn làm app mobile thì học gì?" },
    { emoji: "🤖", text: "Học gì để làm AI?" },
    { emoji: "🚀", text: "Người mới nên bắt đầu từ đâu?" },
  ],
  tutorial: [
    { emoji: "📝", text: "Cách tạo React app" },
    { emoji: "🔨", text: "Hướng dẫn cài đặt Node.js" },
    { emoji: "🌐", text: "Làm sao deploy website lên Vercel?" },
    { emoji: "📦", text: "Cách dùng Git cơ bản" },
  ],
  roadmap: [
    { emoji: "🗺️", text: "Lộ trình học Frontend" },
    { emoji: "🛤️", text: "Roadmap học Backend" },
    { emoji: "📈", text: "Lộ trình từ zero đến junior" },
  ],
  other: [
    { emoji: "🌤️", text: "Thời tiết Hà Nội" },
    { emoji: "📊", text: "Thống kê website" },
    { emoji: "👋", text: "Xin chào!" },
  ],
};

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const { messages, isLoading, sendMessage, clearMessages } = useChatbot();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      } else {
        scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
      }
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const message = inputValue.trim();
    setInputValue("");
    await sendMessage(message);
  };

  // Xử lý click vào câu hỏi gợi ý
  const handleSuggestedQuestion = async (question: string) => {
    if (isLoading) return;
    await sendMessage(question);
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all hover:scale-110 hover:shadow-xl"
          aria-label="Mở chatbot"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[400px] max-w-[calc(100vw-2rem)]">
          <Card className="flex h-[600px] flex-col shadow-2xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b pb-3 flex-shrink-0">
              <CardTitle className="text-lg font-semibold">Trợ lý AI</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearMessages}
                  className="h-8 w-8"
                  title="Xóa lịch sử"
                >
                  <X className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8"
                  title="Đóng"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="flex flex-1 flex-col gap-4 p-4 overflow-hidden min-h-0">
              <div className="flex-1 min-h-0 overflow-hidden">
                <ScrollArea className="h-full" ref={scrollAreaRef}>
                  <div className="flex flex-col gap-4 pr-4">
                  {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center gap-3 py-4 text-center">
                      {/* Header */}
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-6 w-6 text-primary" />
                        <p className="text-base font-semibold">
                          Xin chào! Tôi là trợ lý AI 🤖
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Click vào câu hỏi bên dưới hoặc nhập câu hỏi của bạn
                      </p>
                      
                      {/* Suggested Questions by Category */}
                      <div className="w-full mt-2 space-y-3">
                        {/* Tìm khóa học */}
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1.5 text-left">📚 Tìm khóa học</p>
                          <div className="flex flex-wrap gap-1.5">
                            {SUGGESTED_QUESTIONS.course.map((q, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleSuggestedQuestion(q.text)}
                                disabled={isLoading}
                                className="text-xs px-2.5 py-1.5 rounded-full bg-blue-50 hover:bg-blue-100 dark:bg-blue-950 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 transition-colors disabled:opacity-50"
                              >
                                {q.emoji} {q.text}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Đề xuất công nghệ */}
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1.5 text-left">🎯 Đề xuất công nghệ</p>
                          <div className="flex flex-wrap gap-1.5">
                            {SUGGESTED_QUESTIONS.recommendation.map((q, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleSuggestedQuestion(q.text)}
                                disabled={isLoading}
                                className="text-xs px-2.5 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950 dark:hover:bg-emerald-900 text-emerald-700 dark:text-emerald-300 transition-colors disabled:opacity-50"
                              >
                                {q.emoji} {q.text}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Hỏi kiến thức */}
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1.5 text-left">🤔 Hỏi kiến thức</p>
                          <div className="flex flex-wrap gap-1.5">
                            {SUGGESTED_QUESTIONS.knowledge.map((q, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleSuggestedQuestion(q.text)}
                                disabled={isLoading}
                                className="text-xs px-2.5 py-1.5 rounded-full bg-purple-50 hover:bg-purple-100 dark:bg-purple-950 dark:hover:bg-purple-900 text-purple-700 dark:text-purple-300 transition-colors disabled:opacity-50"
                              >
                                {q.emoji} {q.text}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Hướng dẫn */}
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1.5 text-left">📝 Hướng dẫn</p>
                          <div className="flex flex-wrap gap-1.5">
                            {SUGGESTED_QUESTIONS.tutorial.map((q, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleSuggestedQuestion(q.text)}
                                disabled={isLoading}
                                className="text-xs px-2.5 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 dark:bg-amber-950 dark:hover:bg-amber-900 text-amber-700 dark:text-amber-300 transition-colors disabled:opacity-50"
                              >
                                {q.emoji} {q.text}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Khác */}
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1.5 text-left">✨ Khác</p>
                          <div className="flex flex-wrap gap-1.5">
                            {[...SUGGESTED_QUESTIONS.roadmap, ...SUGGESTED_QUESTIONS.other].map((q, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleSuggestedQuestion(q.text)}
                                disabled={isLoading}
                                className="text-xs px-2.5 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors disabled:opacity-50"
                              >
                                {q.emoji} {q.text}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex w-full",
                        message.role === "user" ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[80%] rounded-lg px-4 py-2",
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        )}
                      >
                        {/* Weather Card Display - Show only card without text */}
                        {message.weatherData ? (
                          <div className="rounded-xl border border-sky-200 dark:border-sky-800 bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 dark:from-sky-950 dark:via-blue-950 dark:to-indigo-950 p-4 shadow-sm">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <h4 className="font-bold text-lg text-sky-900 dark:text-sky-100">
                                  {message.weatherData.city}
                                </h4>
                                <p className="text-xs text-sky-600 dark:text-sky-400">
                                  {message.weatherData.country}
                                </p>
                              </div>
                              <div className="text-5xl drop-shadow-md">{message.weatherData.icon}</div>
                            </div>

                            {/* Temperature */}
                            <div className="text-center mb-4">
                              <div className="text-6xl font-extrabold text-sky-900 dark:text-sky-100 tracking-tight">
                                {message.weatherData.temperature}°
                              </div>
                              <p className="text-sm text-sky-700 dark:text-sky-300 capitalize mt-1">
                                {message.weatherData.description}
                              </p>
                              <p className="text-xs text-sky-500 dark:text-sky-400 mt-1">
                                Cảm giác {message.weatherData.feelsLike}°C
                              </p>
                            </div>

                            {/* Weather Details Grid */}
                            <div className="grid grid-cols-3 gap-2 text-xs">
                              <div className="flex flex-col items-center bg-white/60 dark:bg-black/20 rounded-lg p-2">
                                <span className="text-lg mb-1">💧</span>
                                <span className="text-sky-600 dark:text-sky-400">Độ ẩm</span>
                                <span className="font-semibold text-sky-900 dark:text-sky-100">{message.weatherData.humidity}%</span>
                              </div>
                              <div className="flex flex-col items-center bg-white/60 dark:bg-black/20 rounded-lg p-2">
                                <span className="text-lg mb-1">💨</span>
                                <span className="text-sky-600 dark:text-sky-400">Gió</span>
                                <span className="font-semibold text-sky-900 dark:text-sky-100">{message.weatherData.windSpeed} km/h</span>
                              </div>
                              <div className="flex flex-col items-center bg-white/60 dark:bg-black/20 rounded-lg p-2">
                                <span className="text-lg mb-1">👁️</span>
                                <span className="text-sky-600 dark:text-sky-400">Tầm nhìn</span>
                                <span className="font-semibold text-sky-900 dark:text-sky-100">{message.weatherData.visibility} km</span>
                              </div>
                            </div>

                            {/* Sunrise & Sunset */}
                            <div className="flex justify-between mt-3 pt-3 border-t border-sky-200 dark:border-sky-800 text-xs">
                              <div className="flex items-center gap-1">
                                <span>🌅</span>
                                <span className="text-sky-600 dark:text-sky-400">{message.weatherData.sunrise}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span>🌇</span>
                                <span className="text-sky-600 dark:text-sky-400">{message.weatherData.sunset}</span>
                              </div>
                            </div>
                          </div>
                        ) : message.roadmapData ? (
                          /* Roadmap Card Display */
                          <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-emerald-950 dark:via-green-950 dark:to-teal-950 p-4 shadow-sm">
                            {/* Header */}
                            <div className="flex items-center gap-2 mb-3">
                              <Route className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                              <h4 className="font-bold text-lg text-emerald-900 dark:text-emerald-100">
                                Lộ trình học {message.roadmapData.skill}
                              </h4>
                            </div>

                            {/* Overview */}
                            <p className="text-sm text-emerald-700 dark:text-emerald-300 mb-2">
                              {message.roadmapData.overview}
                            </p>
                            <p className="text-xs text-emerald-600 dark:text-emerald-400 mb-4">
                              ⏱️ Thời gian ước tính: {message.roadmapData.totalDuration}
                            </p>

                            {/* Steps */}
                            <div className="space-y-3 mb-4">
                              {message.roadmapData.steps.map((step) => (
                                <div
                                  key={step.step}
                                  className="relative pl-6 pb-3 border-l-2 border-emerald-300 dark:border-emerald-700 last:border-l-0"
                                >
                                  <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-emerald-500 text-white text-xs flex items-center justify-center font-bold">
                                    {step.step}
                                  </div>
                                  <div className="bg-white/60 dark:bg-black/20 rounded-lg p-3">
                                    <div className="flex justify-between items-start mb-1">
                                      <h5 className="font-semibold text-sm text-emerald-900 dark:text-emerald-100">
                                        {step.title}
                                      </h5>
                                      <span className="text-xs text-emerald-600 dark:text-emerald-400 whitespace-nowrap ml-2">
                                        {step.duration}
                                      </span>
                                    </div>
                                    <p className="text-xs text-emerald-700 dark:text-emerald-300 mb-2">
                                      {step.description}
                                    </p>
                                    <div className="flex flex-wrap gap-1">
                                      {step.skills.map((skill, idx) => (
                                        <span
                                          key={idx}
                                          className="text-xs bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full"
                                        >
                                          {skill}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Tips */}
                            <div className="bg-white/60 dark:bg-black/20 rounded-lg p-3">
                              <h5 className="font-semibold text-sm text-emerald-900 dark:text-emerald-100 mb-2">
                                💡 Mẹo học tập
                              </h5>
                              <ul className="space-y-1">
                                {message.roadmapData.tips.map((tip, idx) => (
                                  <li key={idx} className="text-xs text-emerald-700 dark:text-emerald-300 flex gap-2">
                                    <span>•</span>
                                    <span>{tip}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Related Courses Header */}
                            {message.courseResults && message.courseResults.length > 0 && (
                              <div className="mt-4 pt-3 border-t border-emerald-200 dark:border-emerald-800">
                                <h5 className="font-semibold text-sm text-emerald-900 dark:text-emerald-100 mb-2">
                                  📚 Khóa học đề xuất
                                </h5>
                              </div>
                            )}
                          </div>
                        ) : message.statisticsData ? (
                          /* Statistics Card Display */
                          <div className="rounded-xl border border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50 dark:from-purple-950 dark:via-violet-950 dark:to-indigo-950 p-4 shadow-sm min-w-[280px]">
                            {/* Header */}
                            <div className="flex items-center gap-2 mb-4">
                              <span className="text-2xl">📊</span>
                              <h4 className="font-bold text-lg text-purple-900 dark:text-purple-100">
                                Thống kê CourseDemy
                              </h4>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-3 mb-4">
                              <div className="flex flex-col items-center bg-white/60 dark:bg-black/20 rounded-xl p-3 shadow-sm">
                                <span className="text-2xl mb-1">👨‍🎓</span>
                                <span className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                                  {message.statisticsData.totalStudents.toLocaleString("vi-VN")}
                                </span>
                                <span className="text-xs text-purple-600 dark:text-purple-400">Học viên</span>
                              </div>
                              <div className="flex flex-col items-center bg-white/60 dark:bg-black/20 rounded-xl p-3 shadow-sm">
                                <span className="text-2xl mb-1">👨‍🏫</span>
                                <span className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                                  {message.statisticsData.totalTeachers.toLocaleString("vi-VN")}
                                </span>
                                <span className="text-xs text-purple-600 dark:text-purple-400">Giảng viên</span>
                              </div>
                              <div className="flex flex-col items-center bg-white/60 dark:bg-black/20 rounded-xl p-3 shadow-sm">
                                <span className="text-2xl mb-1">📚</span>
                                <span className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                                  {message.statisticsData.totalCourses.toLocaleString("vi-VN")}
                                </span>
                                <span className="text-xs text-purple-600 dark:text-purple-400">Khóa học</span>
                              </div>
                              <div className="flex flex-col items-center bg-white/60 dark:bg-black/20 rounded-xl p-3 shadow-sm">
                                <span className="text-2xl mb-1">📂</span>
                                <span className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                                  {message.statisticsData.totalCategories.toLocaleString("vi-VN")}
                                </span>
                                <span className="text-xs text-purple-600 dark:text-purple-400">Danh mục</span>
                              </div>
                            </div>

                            {/* Categories List */}
                            {message.statisticsData.categories && message.statisticsData.categories.length > 0 && (
                              <div className="bg-white/60 dark:bg-black/20 rounded-lg p-3 mb-3">
                                <h5 className="font-semibold text-sm text-purple-900 dark:text-purple-100 mb-2 flex items-center gap-1">
                                  📁 Danh mục khóa học
                                </h5>
                                <div className="flex flex-wrap gap-1.5">
                                  {message.statisticsData.categories.slice(0, 8).map((cat) => (
                                    <span
                                      key={cat.id}
                                      className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full"
                                    >
                                      {cat.name}
                                    </span>
                                  ))}
                                  {message.statisticsData.categories.length > 8 && (
                                    <span className="text-xs text-purple-500 dark:text-purple-400 px-2 py-1">
                                      +{message.statisticsData.categories.length - 8} khác
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Teachers List */}
                            {message.statisticsData.teachers && message.statisticsData.teachers.length > 0 && (
                              <div className="bg-white/60 dark:bg-black/20 rounded-lg p-3 mb-3">
                                <h5 className="font-semibold text-sm text-purple-900 dark:text-purple-100 mb-2 flex items-center gap-1">
                                  👨‍🏫 Danh sách giảng viên ({message.statisticsData.teachers.length})
                                </h5>
                                <div className="space-y-2">
                                  {message.statisticsData.teachers.map((teacher, idx) => (
                                    <div
                                      key={teacher.id}
                                      className="flex items-center gap-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg p-2"
                                    >
                                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-200 dark:bg-purple-800 flex items-center justify-center text-sm font-bold text-purple-700 dark:text-purple-300">
                                        {teacher.avatar_url ? (
                                          <img src={teacher.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" />
                                        ) : (
                                          idx + 1
                                        )}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-purple-900 dark:text-purple-100 truncate">
                                          {teacher.username}
                                        </p>
                                        <p className="text-xs text-purple-600 dark:text-purple-400 truncate">
                                          {teacher.email}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Students List */}
                            {message.statisticsData.students && message.statisticsData.students.length > 0 && (
                              <div className="bg-white/60 dark:bg-black/20 rounded-lg p-3">
                                <h5 className="font-semibold text-sm text-purple-900 dark:text-purple-100 mb-2 flex items-center gap-1">
                                  👨‍🎓 Danh sách học viên ({message.statisticsData.students.length})
                                </h5>
                                <div className="space-y-2 max-h-40 overflow-y-auto">
                                  {message.statisticsData.students.slice(0, 10).map((student, idx) => (
                                    <div
                                      key={student.id}
                                      className="flex items-center gap-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg p-2"
                                    >
                                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-200 dark:bg-indigo-800 flex items-center justify-center text-sm font-bold text-indigo-700 dark:text-indigo-300">
                                        {student.avatar_url ? (
                                          <img src={student.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" />
                                        ) : (
                                          idx + 1
                                        )}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-purple-900 dark:text-purple-100 truncate">
                                          {student.username}
                                        </p>
                                        <p className="text-xs text-purple-600 dark:text-purple-400 truncate">
                                          {student.email}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                  {message.statisticsData.students.length > 10 && (
                                    <p className="text-xs text-center text-purple-500 dark:text-purple-400 pt-1">
                                      ... và {message.statisticsData.students.length - 10} học viên khác
                                    </p>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="whitespace-pre-wrap text-sm">
                            {message.content}
                            {message.isStreaming && (
                              <span className="inline-block w-2 h-4 ml-1 bg-current animate-pulse rounded-sm" />
                            )}
                          </p>
                        )}

                        {message.courseResults && message.courseResults.length > 0 && (
                          <div className="mt-3 space-y-3 border-t pt-3">
                            {message.courseResults.map((course) => (
                              <button
                                key={course.id}
                                onClick={() => {
                                  dispatch(setCourse({ courseId: course.id, courseTitle: course.title }));
                                  router.push(`/course-detail/${course.id}`);
                                  setIsOpen(false);
                                }}
                                className="w-full rounded-lg border bg-background p-3 text-left transition-all hover:border-primary hover:bg-accent hover:shadow-md"
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-sm line-clamp-2 mb-1">
                                      {course.title}
                                    </h4>
                                    <p className="text-xs text-muted-foreground mb-1">
                                      Giảng viên: {course.teacher_name}
                                    </p>
                                    <p className="text-sm font-medium text-primary">
                                      {course.price.toLocaleString("vi-VN")} VNĐ
                                    </p>
                                  </div>
                                  <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="rounded-lg bg-muted px-4 py-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    </div>
                  )}
                  </div>
                </ScrollArea>
              </div>

              <form onSubmit={handleSubmit} className="flex gap-2 flex-shrink-0">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Nhập câu hỏi của bạn..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button type="submit" disabled={isLoading || !inputValue.trim()} size="icon">
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}

