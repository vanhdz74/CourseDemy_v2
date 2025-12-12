"use client";

import { useState, useRef, useEffect } from "react";
import { useChatbot } from "../hooks/useChatbot";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Send, MessageCircle, Loader2, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { setCourse } from "@/features/course/courseSlice";

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
                    <div className="flex flex-col items-center justify-center gap-2 py-8 text-center text-muted-foreground">
                      <MessageCircle className="h-12 w-12" />
                      <p className="text-sm">
                        Xin chào! Tôi có thể giúp bạn tìm khóa học hoặc trả lời câu hỏi.
                      </p>
                      <p className="text-xs">Ví dụ: "Tôi muốn học Python" hoặc "Khóa học React"</p>
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
                        <p className="whitespace-pre-wrap text-sm">{message.content}</p>

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

