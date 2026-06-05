"use client";

import ConfirmDialog from "@/components/common/ConfirmDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useApi } from "@/hooks/useApi";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";
import {
  ChevronDown,
  Loader2,
  MessageCircle,
  MessageSquareText,
  Reply,
  Send,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

dayjs.extend(relativeTime);
dayjs.locale("vi");

type CommentItem = {
  id: number;
  comment: string;
  parent_id: number | null;
  create_at?: string | Date | null;
  update_at?: string | Date | null;
  user_id?: number;
  user_name?: string;
  user_avatar?: string | null;
  sublesson_id: number;
  me?: number;
};

type CommentPayload = {
  comment: string;
  sublesson_id: number;
  parent_id: number | null;
};

const getInitials = (name?: string) => {
  if (!name) return "U";

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
};

const getErrorMessage = (error: unknown, fallback = "Đã xảy ra lỗi") => {
  if (error instanceof Error) return error.message;
  return fallback;
};

const QATab = ({ sublessonId }: { sublessonId: number }) => {
  const { post, get, remove } = useApi();
  const [qaList, setQaList] = useState<CommentItem[]>([]);
  const [questionText, setQuestionText] = useState("");
  const [replyTarget, setReplyTarget] = useState<CommentItem | null>(null);
  const [replyText, setReplyText] = useState("");
  const [openReplies, setOpenReplies] = useState<number[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<CommentItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSendingQuestion, setIsSendingQuestion] = useState(false);
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const getQAList = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const data = await get<CommentItem[]>(`/comments/sublesson/${sublessonId}`);
      setQaList(data || []);
    } catch (error: unknown) {
      setErrorMessage(getErrorMessage(error, "Không tải được hỏi đáp."));
    } finally {
      setIsLoading(false);
    }
  }, [get, sublessonId]);

  useEffect(() => {
    setQuestionText("");
    setReplyTarget(null);
    setReplyText("");
    setOpenReplies([]);
    getQAList();
  }, [getQAList]);

  const questions = useMemo(
    () =>
      qaList
        .filter((item) => item.parent_id === null)
        .sort(
          (a, b) =>
            new Date(b.create_at || 0).getTime() -
            new Date(a.create_at || 0).getTime(),
        ),
    [qaList],
  );

  const getReplies = (parentId: number) =>
    qaList
      .filter((comment) => comment.parent_id === parentId)
      .sort(
        (a, b) =>
          new Date(a.create_at || 0).getTime() -
          new Date(b.create_at || 0).getTime(),
      );

  const toggleReplies = (id: number) => {
    setOpenReplies((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const sendQuestion = async () => {
    const comment = questionText.trim();
    if (!comment || isSendingQuestion) return;

    setIsSendingQuestion(true);

    try {
      const created = await post<CommentItem, CommentPayload>("/comment", {
        comment,
        sublesson_id: sublessonId,
        parent_id: null,
      });

      setQaList((prev) => [created, ...prev]);
      setQuestionText("");
      toast.success("Đã gửi câu hỏi");
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Không gửi được câu hỏi."));
    } finally {
      setIsSendingQuestion(false);
    }
  };

  const sendReply = async () => {
    const comment = replyText.trim();
    if (!replyTarget || !comment || isSendingReply) return;

    setIsSendingReply(true);

    try {
      const created = await post<CommentItem, CommentPayload>("/comment", {
        comment,
        parent_id: replyTarget.id,
        sublesson_id: replyTarget.sublesson_id,
      });

      setQaList((prev) => [...prev, created]);
      setOpenReplies((prev) =>
        prev.includes(replyTarget.id) ? prev : [...prev, replyTarget.id],
      );
      setReplyTarget(null);
      setReplyText("");
      toast.success("Đã gửi trả lời");
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Không gửi được trả lời."));
    } finally {
      setIsSendingReply(false);
    }
  };

  const handleDeleteComment = async () => {
    if (!deleteTarget) return;

    try {
      await remove<CommentItem>(`/comment/${deleteTarget.id}`);
      setQaList((prev) =>
        prev.filter(
          (comment) =>
            comment.id !== deleteTarget.id &&
            comment.parent_id !== deleteTarget.id,
        ),
      );
      setDeleteTarget(null);
      toast.success("Đã xoá tin nhắn");
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Không xoá được tin nhắn."));
    }
  };

  const renderComment = (comment: CommentItem, level = 0) => {
    const replies = getReplies(comment.id);
    const isOpen = openReplies.includes(comment.id);
    const isReplying = replyTarget?.id === comment.id;
    const isNested = level > 0;

    return (
      <div
        key={comment.id}
        className={cn("relative", isNested && "pl-5 sm:pl-8")}
      >
        {isNested && (
          <span className="absolute left-1 top-0 h-full w-px bg-border sm:left-3" />
        )}

        <div className="flex items-start gap-3">
          <Avatar className="mt-0.5 size-9 border border-border bg-muted">
            <AvatarImage
              src={comment.user_avatar || undefined}
              alt={comment.user_name || "Người dùng"}
            />
            <AvatarFallback className="text-xs font-semibold text-muted-foreground">
              {getInitials(comment.user_name)}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <div className="rounded-xl border border-border bg-card px-4 py-3">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <p className="font-semibold text-foreground">
                  {comment.user_name || "Người dùng"}
                </p>
                <span className="text-xs text-muted-foreground">
                  {comment.create_at ? dayjs(comment.create_at).fromNow() : "Vừa xong"}
                </span>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-foreground">
                {comment.comment}
              </p>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-muted-foreground"
                onClick={() => {
                  setReplyTarget(comment);
                  setReplyText("");
                }}
              >
                <Reply className="h-4 w-4" />
                Trả lời
              </Button>

              {replies.length > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-primary"
                  onClick={() => toggleReplies(comment.id)}
                >
                  <ChevronDown
                    className={cn("h-4 w-4 transition", isOpen && "rotate-180")}
                  />
                  {isOpen ? "Ẩn phản hồi" : `Xem ${replies.length} phản hồi`}
                </Button>
              )}

              {comment.me === 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-muted-foreground hover:text-destructive"
                  onClick={() => setDeleteTarget(comment)}
                >
                  <Trash2 className="h-4 w-4" />
                  Xoá
                </Button>
              )}
            </div>

            {isReplying && (
              <div className="mt-3 rounded-xl border border-primary/20 bg-primary/5 p-3">
                <textarea
                  autoFocus
                  value={replyText}
                  onChange={(event) => setReplyText(event.target.value)}
                  onKeyDown={(event) => {
                    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
                      sendReply();
                    }
                  }}
                  placeholder={`Trả lời ${comment.user_name || "người dùng"}...`}
                  className="min-h-20 w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm leading-6 text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-3 focus:ring-primary/15"
                />
                <div className="mt-3 flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setReplyTarget(null);
                      setReplyText("");
                    }}
                  >
                    Hủy
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    disabled={!replyText.trim() || isSendingReply}
                    onClick={sendReply}
                  >
                    {isSendingReply ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    Gửi trả lời
                  </Button>
                </div>
              </div>
            )}

            {isOpen && replies.length > 0 && (
              <div className="mt-4 space-y-4">
                {replies.map((reply) => renderComment(reply, level + 1))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto mb-20 max-w-4xl space-y-6 text-left">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-sm font-medium text-primary">
            <MessageSquareText className="h-4 w-4" />
            Hỏi đáp bài học
          </div>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
            Trao đổi cùng lớp học
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Đặt câu hỏi theo bài đang học, trả lời sẽ được gom đúng luồng để dễ theo dõi.
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-muted-foreground">
          {qaList.length} thảo luận
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <textarea
          placeholder="Bạn đang vướng ở đâu trong bài học này?"
          className="min-h-24 w-full resize-none rounded-lg border border-border bg-background px-4 py-3 text-sm leading-6 text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-3 focus:ring-primary/15"
          value={questionText}
          onChange={(event) => setQuestionText(event.target.value)}
          onKeyDown={(event) => {
            if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
              sendQuestion();
            }
          }}
        />
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            Nhấn Ctrl + Enter để gửi nhanh.
          </p>
          <Button
            type="button"
            disabled={!questionText.trim() || isSendingQuestion}
            onClick={sendQuestion}
          >
            {isSendingQuestion ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            Gửi câu hỏi
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
          <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
          <p className="mt-3 text-sm">Đang tải thảo luận...</p>
        </div>
      ) : errorMessage ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-5 text-sm text-destructive">
          {errorMessage}
        </div>
      ) : questions.length === 0 ? (
        <div className="flex min-h-56 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/35 px-6 text-center">
          <MessageCircle className="h-10 w-10 text-muted-foreground" />
          <h3 className="mt-4 font-semibold text-foreground">
            Chưa có câu hỏi nào
          </h3>
          <p className="mt-1 max-w-md text-sm leading-6 text-muted-foreground">
            Hãy là người đầu tiên mở thảo luận cho bài học này.
          </p>
        </div>
      ) : (
        <div className="space-y-5">{questions.map((question) => renderComment(question))}</div>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Xoá tin nhắn?"
        message="Tin nhắn và các phản hồi trực tiếp sẽ bị xoá khỏi thảo luận."
        confirmText="Xoá tin nhắn"
        cancelText="Giữ lại"
        onConfirm={handleDeleteComment}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default QATab;
