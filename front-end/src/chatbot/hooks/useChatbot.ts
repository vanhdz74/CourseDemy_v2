"use client";

import { useState, useCallback } from "react";
import { ChatMessage, CourseResult } from "../types/chatbot.types";
import { analyzeQuery, getGeminiResponse } from "../services/geminiService";
import { searchCourses, formatCourseResultsMessage } from "../services/courseSearchService";

export function useChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
      const analysis = await analyzeQuery(userMessage);

      if (analysis.isGeneralQuestion) {
        const generalResponse = "Bạn muốn học kỹ năng gì cụ thể nhỉ? Ví dụ như:\n- Lập trình (Python, JavaScript, React...)\n- Thiết kế (UI/UX, Photoshop...)\n- Marketing\n- Ngoại ngữ\n- Hoặc bất kỳ kỹ năng nào khác\n\nHãy cho mình biết bạn quan tâm đến lĩnh vực nào nhé! 😊";
        
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: generalResponse,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } else if (analysis.isSearchingCourse && analysis.courseKeyword) {
        const courses = await searchCourses(analysis.courseKeyword);

        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: formatCourseResultsMessage(courses, analysis.courseKeyword),
          timestamp: new Date(),
          courseResults: courses.slice(0, 5),
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        const conversationHistory = messages
          .slice(-10)
          .map((msg) => ({
            role: msg.role,
            content: msg.content,
          }));

        const geminiResponse = await getGeminiResponse(userMessage, conversationHistory);

        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: geminiResponse,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error("Lỗi khi xử lý tin nhắn:", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Xin lỗi, tôi gặp lỗi khi xử lý câu hỏi của bạn. Vui lòng thử lại sau.",
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

