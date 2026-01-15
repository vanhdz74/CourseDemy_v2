"use client";

import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useApi } from "@/hooks/useApi";
import FormDialog from "@/components/common/FormDialog";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { toast } from "sonner";
import { fa } from "zod/v4/locales";

dayjs.extend(relativeTime);

const QATab = ({ sublessonId }: { sublessonId: number }) => {
  const { post, get, remove } = useApi();
  const [isDelete, setIsDelete] = useState(false);

  // load qa list
  const [qaList, setQaList] = useState<any[]>([]);

  const getQAList = async () => {
    const data = await get(`/comments/sublesson/${sublessonId}`);
    setQaList(data);
  };

  useEffect(() => {
    getQAList();
  }, [sublessonId]);

  // form gửi câu hỏi
  const [sendForm, setSendForm] = useState("");

  const handleSendQ = async (parentId: number | null) => {
    await post(`/comment`, {
      comment: sendForm,
      sublesson_id: sublessonId,
      parent_id: parentId,
    });

    getQAList();
  };

  // Xoá comment
  const handleDeleteComment = async (commentId: number) => {
    try {
      const data = await remove(`/comment/${commentId}`);
      // console.log(`/comment/${commentId}`);

      // XÓA KHỎI LIST
      setQaList((prev) => prev.filter((c) => c.id !== commentId));

      setIsDelete(false);
      toast.success("Tin nhắn đã xoá");
    } catch (error: any) {
      toast.error("Lỗi");
    }
  };

  // Reply
  const [replyTarget, setReplyTarget] = useState<any | null>(null);
  const [replyText, setReplyText] = useState("");
  const [openReplies, setOpenReplies] = useState<number[]>([]); // id comment đang được mở

  const questions = qaList.filter((item) => item.parent_id === null);

  const getReplies = (parentId: number) =>
    qaList
      .filter((c) => c.parent_id === parentId)
      .sort((a, b) => Number(a.create_at) - Number(b.create_at));

  const toggleReplies = (id: number) => {
    setOpenReplies((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleReply = (comment: any) => {
    setReplyTarget(comment);
    setReplyText("");
  };

  // Gửi comment trả lời câu hỏi
  const sendReply = async () => {
    if (!replyTarget || replyText.trim() === "") return;

    const body = {
      comment: replyText,
      parent_id: replyTarget.id,
      sublesson_id: replyTarget.sublesson_id,
    };

    const newReply = await post(`/comment`, body);

    // console.log(newReply);

    setQaList([...qaList, newReply]);
    setReplyTarget(null);
    setReplyText("");
  };

  // --- RENDER COMMENT FACEBOOK STYLE ---
  const renderComment = (comment: any, level = 0) => {
    const replies = getReplies(comment.id);
    const isOpen = openReplies.includes(comment.id);

    return (
      <div
        key={`c-${comment.id}-${Math.random()}`}
        className={`mt-5 ml-${level * 6}`}
      >
        <div className="flex items-start gap-3">
          <img
            src={comment.user_avatar || "/default.png"}
            className="w-9 h-9 rounded-full border"
          />

          <div className="flex-1">
            {/* Bubble + Name */}
            <div className="bg-gray-100 p-3 rounded-2xl border border-gray-200 inline-block shadow-sm">
              <p className="font-semibold text-gray-900">{comment.user_name}</p>
              <p className="text-gray-700">{comment.comment}</p>
            </div>

            {/* Time + Reply */}
            <div className="flex items-center gap-4 mt-1 ml-2 text-xs text-gray-500">
              <span>{dayjs(comment.create_at).fromNow()}</span>

              <button
                onClick={() => handleReply(comment)}
                className="font-semibold hover:text-blue-600"
              >
                Trả lời
              </button>

              {comment.me === 1 && (
                <>
                  <button
                    onClick={() => {
                      setIsDelete(true);
                      // console.log(comment.id);
                    }}
                    className="font-semibold hover:text-blue-600"
                  >
                    Thu hồi ({comment.id})
                  </button>
                  <ConfirmDialog
                    open={isDelete}
                    message={"Tin nhắn sẽ bị xoá"}
                    onConfirm={() => handleDeleteComment(comment.id)}
                    onClose={() => setIsDelete(false)}
                  />
                </>
              )}
            </div>

            {/* ------ NÚT XEM PHẢN HỒI (cho mọi cấp) ------ */}
            {replies.length > 0 && !isOpen && (
              <button
                onClick={() => toggleReplies(comment.id)}
                className="text-sm text-blue-600 font-semibold ml-2 mt-2"
              >
                Xem {replies.length} phản hồi
              </button>
            )}

            {/* ------ REPLIES ------ */}
            {isOpen && replies.length > 0 && (
              <div className="ml-2 mt-2 space-y-3">
                {replies.map((rep) => renderComment(rep, level + 1))}

                <button
                  onClick={() => toggleReplies(comment.id)}
                  className="text-sm text-blue-600 font-semibold ml-3"
                >
                  Ẩn phản hồi
                </button>
              </div>
            )}

            {/* ------ REPLY BOX ------ */}
            {replyTarget && replyTarget.id === comment.id && (
              <div className="mt-2 ml-2">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Trả lời ${comment.user_name}...`}
                  className="w-full p-3 border rounded-xl bg-white focus:ring-2 focus:ring-blue-500"
                  rows={2}
                />

                <div className="flex mt-2 gap-3">
                  <button
                    onClick={() => setReplyTarget(null)}
                    className="px-3 py-1.5 text-gray-600 border rounded-lg hover:bg-gray-100"
                  >
                    Hủy
                  </button>

                  <button
                    onClick={sendReply}
                    className="px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Gửi
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // --- UI OUTPUT ---
  return (
    <div className="max-w-3xl mx-auto text-left space-y-10 mb-20">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Hỏi & Đáp</h2>
        <p className="text-gray-600 mt-1">Đặt câu hỏi và nhận hỗ trợ.</p>
      </div>

      <div className="space-y-6">{questions.map((q) => renderComment(q))}</div>

      {/* Form đặt câu hỏi */}
      <div className="p-5 border border-gray-200 rounded-xl shadow-sm bg-gray-50 space-y-3">
        <h3 className="font-semibold text-lg">Đặt câu hỏi</h3>

        <textarea
          placeholder="Nhập câu hỏi tại đây..."
          className="w-full p-3 border rounded-xl bg-white focus:ring-2 focus:ring-blue-500"
          rows={3}
          value={sendForm}
          onChange={(e) => setSendForm(e.target.value)}
        />

        <button
          onClick={() => {
            handleSendQ(null);
            setSendForm("");
          }}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
        >
          Gửi câu hỏi
        </button>
      </div>
    </div>
  );
};

export default QATab;
