"use client";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { GripVertical } from "lucide-react";
import { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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
import { useApi } from "@/hooks/useApi";

interface LessonsCourseProps {
  onReload: () => void;
  lessons: any[];
  openLessonIds: number[];
  selectedSubLessonId: number | null;
  onToggleLesson: (lessonId: number) => void;
  onSelectSubLesson: (lessonId: number, subLessonId: number) => void;
}

const SortableLesson = ({ lesson, children, isDraggable }: any) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: lesson.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="border-b py-3 px-3">
      <div className="flex items-center">
        {/* Drag handle chỉ khi isDraggable */}
        {isDraggable && (
          <div {...listeners} {...attributes} className="cursor-move px-2">
            <GripVertical />
          </div>
        )}
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
};

const LessonsCourse = ({
  onReload,
  lessons,
  selectedSubLessonId,
  openLessonIds,
  onToggleLesson,
  onSelectSubLesson,
}: LessonsCourseProps) => {
  const course = useAppSelector((state) => state.course);
  const [lessonList, setLessonList] = useState<any[]>(lessons);

  useEffect(() => {
    setLessonList(lessons);
  }, [lessons]);

  // Form nhập liệu lesson mới
  const [newLessonForm, setNewLessonForm] = useState({
    show: false,
    title: "",
  });

  const { token, user } = useAppSelector((state) => state.auth);
  const { remove, put, post } = useApi();

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState({
    title: "",
    description: "",
    action: "",
  });
  const [selectedSubLesson, setSelectedSubLesson] = useState<any>(null);

  // edit trực tiếp phần title lesson
  const [editingLessonId, setEditingLessonId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>("");

  // DND Sensor với delay 150ms
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    })
  );

  const handleActionClick = (action: string, sub: any, lessonId: number) => {
    console.log(action, sub, lessonId);
    setSelectedSubLesson({ ...sub, lesson_id: lessonId });

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

    if (action === "delete") {
      setDialogContent({
        title: "Xoá bài học",
        description: `Hành động này không thể hoàn tác. Xoá "${sub.title}"?`,
        action,
      });
      setConfirmDialogOpen(true);
    }
  };

  const handleConfirm = async () => {
    try {
      const res = await remove(`sublesson/${selectedSubLessonId}`);
      toast.success(res.message || "Xoá bài học thành công");
      setConfirmDialogOpen(false);
      onReload();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // Gửi request yêu cầu về các phương thức
  const handleFormSubmit = async (data: any) => {
    try {
      let url = "";
      let method = "POST";

      if (dialogContent.action === "update") {
        url = `${process.env.NEXT_PUBLIC_API_URL}/sublesson/update/${selectedSubLesson?.id}`;
        method = "PUT";
      } else if (
        dialogContent.action === "addBefore" ||
        dialogContent.action === "addAfter"
      ) {
        const insertAfter = dialogContent.action === "addAfter";
        const lessonId = selectedSubLesson?.lesson_id;
        url = `${process.env.NEXT_PUBLIC_API_URL}/lesson/${lessonId}/sublesson/add-relative?referenceSubLessonId=${selectedSubLesson?.id}&insertAfter=${insertAfter}`;
        method = "POST";
      }

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: data.title, video_url: data.video_url }),
      });

      if (!res.ok) throw new Error("Thao tác thất bại");

      const result = await res.json();
      toast.success(result.message || "Thêm bài học thành công!");
      setFormDialogOpen(false);
      onReload();
    } catch (err: any) {
      toast.error(err.message || "Đã xảy ra lỗi");
    }
  };

  // Update khi sắp xếp các lesson
  const updateLessonOrder = async (newLessons: any[]) => {
    // body du lieu gui len server
    const body = newLessons.map((l, index) => ({
      id: l.id,
      order_index: index + 1,
    }));
    // console.log(body);
    try {
      const data = await put("/lesson/reorder", body);
      toast.success(data.message);
      onReload();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  // Check user role
  const isDraggable = user?.role && user.role !== "STUDENT";

  return (
    <>
      <h2 className="text-lg font-semibold border-b px-4 pb-4">
        Nội dung khoá học
      </h2>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={(e) => {
          const { active, over } = e;
          if (!over || active.id === over.id) return;
          const oldIndex = lessonList.findIndex((l) => l.id === active.id);
          const newIndex = lessonList.findIndex((l) => l.id === over.id);
          const newLessons = arrayMove(lessonList, oldIndex, newIndex);

          console.log(newLessons);
          setLessonList(newLessons);
          updateLessonOrder(newLessons);
        }}
      >
        <SortableContext
          items={lessonList.map((l) => l.id)}
          strategy={verticalListSortingStrategy}
        >
          {lessonList.map((lesson) => {
            const isOpen = openLessonIds.includes(lesson.id);
            return (
              <SortableLesson
                key={lesson.id}
                lesson={lesson}
                isDraggable={isDraggable}
              >
                <div
                  onClick={() => onToggleLesson(lesson.id)}
                  className="cursor-pointer"
                >
                  <ContextMenu>
                    <ContextMenuTrigger>
                      <div className="flex justify-between">
                        {editingLessonId === lesson.id ? (
                          <input
                            autoFocus
                            className="font-semibold border-b px-1 py-0.5 text-blue-600"
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            onBlur={async () => {
                              setEditingLessonId(null); // exit edit mode khi mất focus
                            }}
                            onKeyDown={async (e) => {
                              if (e.key === "Enter") {
                                try {
                                  await put(`/lesson/${lesson.id}`, {
                                    title: editingTitle,
                                  });
                                  onReload();
                                  setEditingLessonId(null);
                                } catch (err: any) {
                                  toast.error(err.message);
                                }
                              }
                            }}
                          />
                        ) : (
                          <h3
                            className={`font-semibold ${
                              isOpen ? "text-blue-600" : ""
                            }`}
                            onDoubleClick={() => {
                              setEditingLessonId(lesson.id);
                              setEditingTitle(lesson.title);
                            }}
                          >
                            Phần {lesson.order_index}: {lesson.title}
                          </h3>
                        )}

                        <span>{isOpen ? "▲" : "▼"}</span>
                      </div>
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                      <ContextMenuItem
                        onClick={async () => {
                          console.log(lesson.id);
                          await remove(`/lesson/${lesson.id}`);
                          onReload();
                        }}
                      >
                        Xoá
                      </ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>

                  {isOpen && (
                    <>
                      {lesson.sub_lessons && lesson.sub_lessons.length > 0 ? (
                        // Có sub lesson
                        <ul className="mt-2 space-y-1">
                          {lesson.sub_lessons.map((sub: any) => (
                            <li
                              key={sub.id}
                              onClick={() =>
                                onSelectSubLesson(lesson.id, sub.id)
                              }
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

                              {/* Menu */}
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  {user?.role === "ADMIN" ||
                                    (user?.role === "TEACHER" && (
                                      <Button variant="ghost" size="icon">
                                        <EllipsisVertical />
                                      </Button>
                                    ))}
                                </DropdownMenuTrigger>

                                <DropdownMenuContent>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleActionClick(
                                        "addBefore",
                                        sub,
                                        lesson.id
                                      )
                                    }
                                  >
                                    Thêm bài học phía trước
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleActionClick(
                                        "addAfter",
                                        sub,
                                        lesson.id
                                      )
                                    }
                                  >
                                    Thêm bài học phía sau
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleActionClick(
                                        "update",
                                        sub,
                                        lesson.id
                                      )
                                    }
                                  >
                                    Cập nhật bài học
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleActionClick(
                                        "delete",
                                        sub,
                                        lesson.id
                                      )
                                    }
                                  >
                                    Xoá bài học
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        // Không có sub lesson
                        <div className="mt-2 p-3 bg-gray-50 rounded-lg border">
                          <p className="text-sm text-gray-500 italic mb-2">
                            Chưa có bài học nào trong phần này
                          </p>
                          <Button
                            onClick={async () => {
                              await post(`/sublesson/lesson/${lesson.id}`, {
                                title: "Bài học mới",
                                order_index: 1,
                              });
                              console.log("1");
                              await onReload();
                            }}
                          >
                            + Tạo bài học mới
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </SortableLesson>
            );
          })}
        </SortableContext>
      </DndContext>

      <div
        className={`text-center p-4 ${
          user?.role === "STUDENT" ? "hidden" : ""
        }`}
      >
        <Button
          onClick={() => setNewLessonForm((prev) => ({ ...prev, show: true }))}
        >
          Thêm phần mới
        </Button>
      </div>

      {/* Mở form nếu ấn thêm*/}
      {newLessonForm.show && (
        <div className="border-b py-3 px-3 bg-gray-50">
          <input
            type="text"
            placeholder="Tiêu đề bài học"
            value={newLessonForm.title}
            onChange={(e) =>
              setNewLessonForm((prev) => ({ ...prev, title: e.target.value }))
            }
            className="w-full mb-2 px-2 py-1 border rounded"
          />
          <div className="flex gap-2">
            <Button
              onClick={async () => {
                await post(`/lesson/course/${course.courseId}`, {
                  title: newLessonForm.title,
                });
                onReload();
                setNewLessonForm({ show: false, title: "" });
              }}
            >
              Lưu
            </Button>
            <Button
              variant="ghost"
              onClick={() => setNewLessonForm({ show: false, title: "" })}
            >
              Hủy
            </Button>
          </div>
        </div>
      )}

      <DialogCustom
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        title={dialogContent.title}
        description={dialogContent.description}
        onConfirm={handleConfirm}
      />

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
