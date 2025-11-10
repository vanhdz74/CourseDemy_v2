"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import DialogCustom from "@/components/common/dialog-custom";
import FormDialog from "@/components/common/dialog-form";
import { toast } from "sonner";
import { useAppSelector } from "@/redux/hooks";

interface LessonsCourseProps {
  lessons: any[];
  openLessonIds: number[];
  selectedSubLessonId: number | null;
  onToggleLesson: (lessonId: number) => void;
  onSelectSubLesson: (lessonId: number, subLessonId: number) => void;
}

const LessonsCourse = ({
  lessons,
  selectedSubLessonId,
  openLessonIds,
  onToggleLesson,
  onSelectSubLesson,
}: LessonsCourseProps) => {
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState({
    title: "",
    description: "",
    action: "",
  });

  const { token, user } = useAppSelector((state) => state.auth);
  const [selectedSubLesson, setSelectedSubLesson] = useState<any>(null);

  const handleActionClick = (action: string, sub: any) => {
    setSelectedSubLesson(sub);

    if (["addBefore", "addAfter", "update"].includes(action)) {
      setDialogContent({
        title:
          action === "addBefore"
            ? "Thêm bài học phía trước"
            : action === "addAfter"
            ? "Thêm bài học phía sau"
            : "Cập nhật bài học",
        description: "",
        action,
      });
      setFormDialogOpen(true);
      return;
    }

    // Xóa thì mới dùng dialog xác nhận
    if (action === "delete") {
      setDialogContent({
        title: "Xoá bài học",
        description: `Hành động này không thể hoàn tác. Xoá "${sub.title}"?`,
        action,
      });
      setConfirmDialogOpen(true);
    }
  };

  const handleConfirm = () => {
    console.log("Thực hiện hành động:", dialogContent.action);
    setConfirmDialogOpen(false);
  };

  // Submit
  const handleFormSubmit = async (data: any) => {
    console.log("Dữ liệu sau upload:", data);

    try {
      // Giả sử bạn có API thêm bài học mới
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/sublesson/update/${selectedSubLessonId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: data.title,
            video_url: data.video_url,
            // bạn có thể thêm field khác như order_index, lesson_id ...
          }),
        }
      );

      if (!res.ok) throw new Error("Lưu bài học thất bại");

      const result = await res.json();

      toast.success("Thêm bài học thành công!");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi lưu bài học!");
    }

    setFormDialogOpen(false);
  };

  return (
    <>
      <h2 className="text-lg font-semibold border-b px-4 pb-4">
        Nội dung khoá học
      </h2>

      {lessons.map((lesson) => {
        const isOpen = openLessonIds.includes(lesson.id);

        return (
          <div key={lesson.id} className="border-b py-3 px-3">
            <div
              onClick={() => onToggleLesson(lesson.id)}
              className="hover:bg-[#f2f2f2] cursor-pointer"
            >
              <div className="flex justify-between">
                <h3
                  className={`font-semibold ${isOpen ? "text-blue-600" : ""}`}
                >
                  Phần {lesson.order_index}: {lesson.title}
                </h3>
                <span>{isOpen ? "▲" : "▼"}</span>
              </div>
            </div>

            {isOpen && lesson.sub_lessons && (
              <ul className="mt-2 space-y-1">
                {lesson.sub_lessons.map((sub: any) => (
                  <li
                    key={sub.id}
                    onClick={() => onSelectSubLesson(lesson.id, sub.id)}
                    className={`flex justify-between items-center px-3 py-1 rounded-md cursor-pointer ${
                      selectedSubLessonId === sub.id
                        ? "bg-blue-100 text-blue-600 font-medium"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div>▶</div>
                      <div>
                        <h2>{sub.title}</h2>
                        <p className="text-sm text-[#594848]">
                          {sub.duration} phút
                        </p>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <EllipsisVertical />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => handleActionClick("addBefore", sub)}
                        >
                          Thêm bài học phía trước
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleActionClick("addAfter", sub)}
                        >
                          Thêm bài học phía sau
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleActionClick("update", sub)}
                        >
                          Cập nhật bài học
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleActionClick("delete", sub)}
                        >
                          Xoá bài học
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}

      <div
        className={`text-center p-4 ${
          user?.role === "STUDENT" ? "hidden" : ""
        }`}
      >
        <Button>Thêm bài học</Button>
      </div>

      {/* Dialog xác nhận */}
      <DialogCustom
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        title={dialogContent.title}
        description={dialogContent.description}
        onConfirm={handleConfirm}
      />

      {/* Dialog form thêm bài */}
      <FormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        title={dialogContent.title}
        onSubmit={handleFormSubmit}
        sublessonId={selectedSubLesson?.id}
      />
    </>
  );
};

export default LessonsCourse;
