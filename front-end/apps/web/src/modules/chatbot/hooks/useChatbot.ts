"use client";

import { useState, useCallback, useRef } from "react";
import { ChatMessage, CourseResult } from "../types/chatbot.types";
import { getGeminiResponseStream, cleanMarkdownText } from "../services/geminiService";
import { searchCourses, searchCoursesByTeacher, formatCourseResultsMessage, formatTeacherCourseResultsMessage } from "../services/courseSearchService";
import {
  isWeatherQuery,
  extractCityFromQuery,
  getCurrentWeather,
  getWeatherByLocation,
  formatWeatherMessage,
} from "../services/weatherService";
import {
  isRoadmapQuery,
  extractSkillFromRoadmapQuery,
  generateLearningRoadmap,
  getSearchKeywordsFromRoadmap,
} from "../services/roadmapService";
import {
  isStatisticsQuery,
  getWebsiteStatistics,
  formatStatisticsMessage,
} from "../services/statisticsService";
import {
  getWeatherErrorMessage,
  getStatisticsErrorMessage,
  getRoadmapErrorMessage,
  getRoadmapHelpMessage,
  getGeneralErrorMessage,
} from "../services/randomMessages";
import {
  preprocessQuery,
  shouldUseAIPreprocessing,
  NLPAnalysis,
} from "../services/nlpPreprocessor";

export function useChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const streamingIdRef = useRef<string | null>(null);

  const sendMessage = useCallback(async (userMessage: string) => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: userMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // ========== BƯỚC 1: NLP PREPROCESSING ==========
      // Phân tích ngôn ngữ đầu vào bằng AI để hiểu chính xác ý định người dùng
      let nlpResult: NLPAnalysis | null = null;
      
      if (shouldUseAIPreprocessing(userMessage)) {
        console.log("🔍 Using AI NLP preprocessing...");
        nlpResult = await preprocessQuery(userMessage);
        console.log("📊 NLP Analysis:", nlpResult);
      }

      // ========== BƯỚC 2: XỬ LÝ THEO INTENT ==========
      
      // Check if user is asking about weather
      const isWeather = nlpResult?.primaryIntent === "ask_weather" || isWeatherQuery(userMessage);
      if (isWeather) {
        const cityName = nlpResult?.entities.location || extractCityFromQuery(userMessage);
        let weatherData;

        if (cityName) {
          weatherData = await getCurrentWeather(cityName);
        } else {
          weatherData = await getWeatherByLocation();
        }

        if (weatherData) {
          const assistantMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: formatWeatherMessage(weatherData),
            timestamp: new Date(),
            weatherData: {
              city: weatherData.city,
              country: weatherData.country,
              temperature: weatherData.temperature,
              feelsLike: weatherData.feelsLike,
              humidity: weatherData.humidity,
              description: weatherData.description,
              icon: weatherData.icon,
              windSpeed: weatherData.windSpeed,
              visibility: weatherData.visibility,
              pressure: weatherData.pressure,
              sunrise: weatherData.sunrise,
              sunset: weatherData.sunset,
            },
          };
          setMessages((prev) => [...prev, assistantMessage]);
        } else {
          const errorMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: getWeatherErrorMessage(cityName || undefined),
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, errorMessage]);
        }
        setIsLoading(false);
        return;
      }

      // Check if user is asking about website statistics
      const isStats = nlpResult?.primaryIntent === "ask_statistics" || isStatisticsQuery(userMessage);
      if (isStats) {
        const stats = await getWebsiteStatistics();

        if (stats) {
          const assistantMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: formatStatisticsMessage(stats),
            timestamp: new Date(),
            statisticsData: {
              totalStudents: stats.totalStudents,
              totalTeachers: stats.totalTeachers,
              totalCourses: stats.totalCourses,
              totalCategories: stats.totalCategories,
              categories: stats.categories,
              teachers: stats.teachers,
              students: stats.students,
            },
          };
          setMessages((prev) => [...prev, assistantMessage]);
        } else {
          const errorMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: getStatisticsErrorMessage(),
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, errorMessage]);
        }
        setIsLoading(false);
        return;
      }

      // Check if user is asking about learning roadmap
      const isRoadmap = nlpResult?.primaryIntent === "ask_roadmap" || isRoadmapQuery(userMessage);
      if (isRoadmap) {
        const skill = nlpResult?.entities.skill || extractSkillFromRoadmapQuery(userMessage);

        if (skill) {
          const roadmap = await generateLearningRoadmap(skill);

          if (roadmap) {
            // Tìm các khóa học liên quan
            const searchKeywords = getSearchKeywordsFromRoadmap(roadmap);
            let relatedCourses: CourseResult[] = [];

            // Tìm khóa học theo từ khóa đầu tiên (skill chính)
            for (const keyword of searchKeywords.slice(0, 2)) {
              const courses = await searchCourses(keyword);
              relatedCourses = [...relatedCourses, ...courses];
            }

            // Loại bỏ trùng lặp theo id
            const uniqueCourses = relatedCourses.filter(
              (course, index, self) => index === self.findIndex((c) => c.id === course.id)
            );

            const assistantMessage: ChatMessage = {
              id: (Date.now() + 1).toString(),
              role: "assistant",
              content: "",
              timestamp: new Date(),
              roadmapData: roadmap,
              courseResults: uniqueCourses.slice(0, 5),
            };

            setMessages((prev) => [...prev, assistantMessage]);
          } else {
            const errorMessage: ChatMessage = {
              id: (Date.now() + 1).toString(),
              role: "assistant",
              content: getRoadmapErrorMessage(skill),
              timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
          }
        } else {
          const helpMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: getRoadmapHelpMessage(),
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, helpMessage]);
        }
        setIsLoading(false);
        return;
      }

      // ========== BƯỚC 3: XỬ LÝ CÁC INTENT PHỨC TẠP HƠN ==========
      // Sử dụng kết quả NLP để xử lý chính xác hơn

      // Tìm khóa học theo giáo viên
      if (nlpResult?.primaryIntent === "search_by_teacher" && nlpResult.entities.teacherName) {
        const courses = await searchCoursesByTeacher(nlpResult.entities.teacherName);

        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: cleanMarkdownText(formatTeacherCourseResultsMessage(courses, nlpResult.entities.teacherName)),
          timestamp: new Date(),
          courseResults: courses.slice(0, 5),
        };

        setMessages((prev) => [...prev, assistantMessage]);
        setIsLoading(false);
        return;
      }

      // Tìm khóa học theo chủ đề
      if (nlpResult?.primaryIntent === "search_course" && (nlpResult.entities.courseTopic || nlpResult.entities.technology)) {
        const keyword = nlpResult.entities.courseTopic || nlpResult.entities.technology || "";
        const courses = await searchCourses(keyword);

        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: cleanMarkdownText(formatCourseResultsMessage(courses, keyword)),
          timestamp: new Date(),
          courseResults: courses.slice(0, 5),
        };

        setMessages((prev) => [...prev, assistantMessage]);
        setIsLoading(false);
        return;
      }

      // Greeting - Chào hỏi đơn giản
      if (nlpResult?.primaryIntent === "greeting") {
        const greetings = [
          "Xin chào! 👋 Tôi là trợ lý AI của CourseDemy. Tôi có thể giúp bạn tìm khóa học, giải đáp thắc mắc về lập trình, hoặc đề xuất lộ trình học tập. Bạn cần hỗ trợ gì?",
          "Chào bạn! 😊 Rất vui được gặp bạn! Tôi có thể hỗ trợ bạn tìm khóa học, trả lời câu hỏi về công nghệ, hoặc gợi ý lộ trình học. Hãy cho tôi biết bạn cần gì nhé!",
          "Hello! 🎉 Tôi sẵn sàng giúp đỡ bạn. Bạn có thể hỏi tôi về khóa học, kiến thức lập trình, hoặc xem thời tiết. Bạn muốn bắt đầu từ đâu?",
        ];
        const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
        
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: randomGreeting,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setIsLoading(false);
        return;
      }

      // ========== BƯỚC 4: STREAMING RESPONSE CHO CÁC CÂU HỎI CÒN LẠI ==========
      // Sử dụng câu hỏi đã được chuẩn hóa từ NLP (nếu có) để AI trả lời tốt hơn
      const queryToProcess = nlpResult?.normalizedQuery || userMessage;
      
      const conversationHistory = messages
        .slice(-10)
        .map((msg) => ({
          role: msg.role,
          content: msg.content,
        }));

      const streamingId = (Date.now() + 1).toString();
      streamingIdRef.current = streamingId;
      
      const streamingMessage: ChatMessage = {
        id: streamingId,
        role: "assistant",
        content: "",
        timestamp: new Date(),
        isStreaming: true,
      };
      
      setMessages((prev) => [...prev, streamingMessage]);

      // Streaming response với query đã chuẩn hóa
      await getGeminiResponseStream(
        queryToProcess,
        conversationHistory,
        (_chunk: string, fullText: string) => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === streamingId
                ? { ...msg, content: fullText }
                : msg
            )
          );
        }
      );

      // Đánh dấu hoàn thành streaming
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === streamingId
            ? { ...msg, isStreaming: false }
            : msg
        )
      );
      streamingIdRef.current = null;
    } catch (error) {
      console.error("Lỗi khi xử lý tin nhắn:", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getGeneralErrorMessage(),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
  };
}

