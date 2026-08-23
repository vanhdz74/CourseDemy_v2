"use client";

import DialogCustom from "@/modules/shared/components/common/dialog-custom";
import FormDialog from "@/modules/course/components/common/dialog-form";
import { Button } from "@/modules/shared/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/modules/shared/components/ui/context-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/modules/shared/components/ui/dropdown-menu";
import { useApi } from "@/modules/shared/hooks/useApi";
import { useAppSelector } from "@/modules/shared/store/hooks";
import { addRelativeSubLesson, updateSubLesson } from "@repo/api";
import { Lesson, SubLesson } from "@repo/contracts";
import {
  Check,
  ChevronDown,
  ChevronRight,
  EllipsisVertical,
  GripVertical,
  ListPlus,
  Pencil,
  PlayCircle,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/modules/shared/lib/utils";
import type { ReactNode } from "react";

interface LessonsCourseProps {
  onReload: () => void;
  lessons: Lesson[];
  openLessonIds: number[];
  selectedSubLessonId: number | null;
  status?: string;
  onToggleLesson: (lessonId: number) => void;
  onSelectSubLesson: (lessonId: number, subLessonId: number) => void;
}

type DialogAction = "addBefore" | "addAfter" | "update" | "delete" | "";

type DialogContent = {
  title: string;
  description: string;
  action: DialogAction;
};

type ApiMessage = {
  message?: string;
};

type EditableSubLesson = SubLesson & {
  lesson_id: number;
};

type SortableLessonProps = {
  lesson: Lesson;
  isDraggable: boolean;
  children: ReactNode;
};

type SortableSubLessonProps = {
  lessonId: number;
  subLesson: SubLesson;
  isDraggable: boolean;
  children: ReactNode;
};

type SortableData =
  | { type: "lesson"; lessonId: number }
  | { type: "sublesson"; lessonId: number; subLessonId: number };

const getErrorMessage = (error: unknown, fallback = "Đã xảy ra lỗi") => {
  if (error instanceof Error) return error.message;
  return fallback;
};

const SortableLesson = ({
  lesson,
  children,
  isDraggable,
}: SortableLessonProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: lesson.id,
      data: { type: "lesson", lessonId: lesson.id } satisfies SortableData,
    });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className="border-b border-border/80 bg-card last:border-b-0"
    >
      <div className="flex items-center">
        {isDraggable && (
          <button
            type="button"
            className="cursor-grab p-2 text-muted-foreground transition hover:text-foreground active:cursor-grabbing"
            {...attributes}
            {...listeners}
            aria-label="Kéo để sắp xếp phần học"
          >
            <GripVertical className="h-4 w-4" />
          </button>
        )}
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
};

const SortableSubLesson = ({
  lessonId,
  subLesson,
  children,
  isDraggable,
}: SortableSubLessonProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: `sublesson-${subLesson.id}`,
      data: {
        type: "sublesson",
        lessonId,
        subLessonId: subLesson.id,
      } satisfies SortableData,
    });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className="flex items-center gap-1"
    >
      {isDraggable && (
        <button
          type="button"
          className="cursor-grab p-1.5 text-muted-foreground transition hover:text-foreground active:cursor-grabbing"
          {...attributes}
          {...listeners}
          aria-label="Kéo để sắp xếp bài học"
        >
          <GripVertical className="h-3.5 w-3.5" />
        </button>
      )}
      <div className="flex-1">{children}</div>
    </div>
  );
};

const LessonsCourse = ({
  onReload,
  lessons,
  openLessonIds,
  selectedSubLessonId,
  status = "view",
  onToggleLesson,
  onSelectSubLesson,
}: LessonsCourseProps) => {
  const course = useAppSelector((state) => state.course);
  const { data: session } = useSession();
  const user = session?.user;
  const { get, remove, put, post } = useApi();

  const [lessonList, setLessonList] = useState<Lesson[]>(lessons);
  const [newLessonForm, setNewLessonForm] = useState({ show: false, title: "" });
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState<DialogContent>({
    title: "",
    description: "",
    action: "",
  });
  const [selectedSubLesson, setSelectedSubLesson] =
    useState<EditableSubLesson | null>(null);
  const [editingLessonId, setEditingLessonId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  const role = (user?.role || "").toUpperCase().replace("ROLE_", "");
  const canManage = role === "ADMIN" || role === "TEACHER" || status === "edit";
  const totalSubLessons = useMemo(
    () =>
      lessonList.reduce(
        (total, lesson) => total + (lesson.sub_lessons?.length || 0),
        0,
      ),
    [lessonList],
  );

  useEffect(() => {
    setLessonList(lessons);
  }, [lessons]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    }),
  );

  const handleActionClick = async (
    action: DialogAction,
    subLesson: SubLesson,
    lessonId: number,
  ) => {
    let nextSubLesson = subLesson;

    if (action === "update") {
      try {
        nextSubLesson = await get<SubLesson>(`/sublesson/${subLesson.id}`);
      } catch (error: unknown) {
        toast.error(getErrorMessage(error, "Không tải được thông tin bài học"));
        return;
      }
    }

    setSelectedSubLesson({ ...nextSubLesson, lesson_id: lessonId });

    if (action === "addBefore" || action === "addAfter" || action === "update") {
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

    setDialogContent({
      title: "Xoá bài học",
      description: `Hành động này không thể hoàn tác. Xoá "${subLesson.title}"?`,
      action,
    });
    setConfirmDialogOpen(true);
  };

  const handleConfirm = async () => {
    if (!selectedSubLesson) return;

    try {
      const response = await remove<ApiMessage>(`sublesson/${selectedSubLesson.id}`);
      toast.success(response.message || "Xoá bài học thành công");
      setConfirmDialogOpen(false);
      onReload();
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleFormSubmit = async (
    data: Partial<Pick<SubLesson, "title" | "video_url">>,
  ) => {
    if (!selectedSubLesson) return;

    try {
      if (dialogContent.action === "update") {
        const result = await updateSubLesson(selectedSubLesson.id, data);
        toast.success(result.message || "Cập nhật bài học thành công");
      }

      if (dialogContent.action === "addBefore" || dialogContent.action === "addAfter") {
        if (!data.title) {
          toast.error("Vui lòng nhập tên bài học.");
          return;
        }

        const result = await addRelativeSubLesson({
          lessonId: selectedSubLesson.lesson_id,
          referenceSubLessonId: selectedSubLesson.id,
          insertAfter: dialogContent.action === "addAfter",
          payload: { title: data.title, video_url: data.video_url },
        });
        toast.success(result.message || "Thêm bài học thành công");
      }

      setFormDialogOpen(false);
      onReload();
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    }
  };

  const updateLessonOrder = async (newLessons: Lesson[]) => {
    const body = newLessons.map((lesson, index) => ({
      id: lesson.id,
      order_index: index + 1,
    }));

    try {
      const response = await put<ApiMessage, typeof body>("/lesson/reorder", body);
      toast.success(response.message || "Đã cập nhật thứ tự phần học");
      onReload();
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    }
  };

  const updateSubLessonOrder = async (newSubLessons: SubLesson[]) => {
    const body = newSubLessons.map((subLesson, index) => ({
      id: subLesson.id,
      order_index: index + 1,
    }));

    try {
      const response = await put<ApiMessage, typeof body>("/sublesson/reorder", body);
      toast.success(response.message || "Đã cập nhật thứ tự bài học");
      onReload();
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeData = active.data.current as SortableData | undefined;
    const overData = over.data.current as SortableData | undefined;

    if (activeData?.type === "lesson") {
      const oldIndex = lessonList.findIndex((lesson) => lesson.id === active.id);
      const newIndex = lessonList.findIndex((lesson) => lesson.id === over.id);
      const newLessons = arrayMove(lessonList, oldIndex, newIndex);

      setLessonList(newLessons);
      updateLessonOrder(newLessons);
      return;
    }

    if (
      activeData?.type === "sublesson" &&
      overData?.type === "sublesson" &&
      activeData.lessonId === overData.lessonId
    ) {
      const lessonIndex = lessonList.findIndex(
        (lesson) => lesson.id === activeData.lessonId,
      );
      const subLessons = lessonList[lessonIndex]?.sub_lessons || [];
      const oldIndex = subLessons.findIndex(
        (subLesson) => subLesson.id === activeData.subLessonId,
      );
      const newIndex = subLessons.findIndex(
        (subLesson) => subLesson.id === overData.subLessonId,
      );

      if (lessonIndex < 0 || oldIndex < 0 || newIndex < 0) return;

      const newSubLessons = arrayMove(subLessons, oldIndex, newIndex);
      const newLessons = lessonList.map((lesson) =>
        lesson.id === activeData.lessonId
          ? { ...lesson, sub_lessons: newSubLessons }
          : lesson,
      );

      setLessonList(newLessons);
      updateSubLessonOrder(newSubLessons);
    }
  };

  const saveLessonTitle = async (lessonId: number) => {
    const title = editingTitle.trim();
    if (!title) {
      toast.error("Tiêu đề phần học không được để trống.");
      return;
    }

    try {
      await put<ApiMessage, { title: string }>(`/lesson/${lessonId}`, { title });
      setEditingLessonId(null);
      onReload();
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    }
  };

  const createLesson = async () => {
    const title = newLessonForm.title.trim();
    if (!title) {
      toast.error("Vui lòng nhập tiêu đề phần học.");
      return;
    }

    try {
      await post<ApiMessage, { title: string }>(`/lesson/course/${course.courseId}`, {
        title,
      });
      setNewLessonForm({ show: false, title: "" });
      onReload();
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="sticky top-0 z-10 border-b border-border bg-card/95 px-4 py-4 backdrop-blur">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Nội dung khoá học
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {lessonList.length} phần, {totalSubLessons} bài học
            </p>
          </div>

          {canManage && (
            <Button
              size="icon-sm"
              variant="outline"
              aria-label="Thêm phần mới"
              onClick={() => setNewLessonForm((prev) => ({ ...prev, show: true }))}
            >
              <Plus className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={lessonList.map((lesson) => lesson.id)}
          strategy={verticalListSortingStrategy}
        >
          {lessonList.map((lesson) => {
            const isOpen = openLessonIds.includes(lesson.id);
            const subLessons = lesson.sub_lessons || [];

            return (
              <SortableLesson
                key={lesson.id}
                lesson={lesson}
                isDraggable={Boolean(canManage)}
              >
                <ContextMenu>
                  <ContextMenuTrigger asChild>
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => onToggleLesson(lesson.id)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          onToggleLesson(lesson.id);
                        }
                      }}
                      className="flex w-full cursor-pointer items-start justify-between gap-3 rounded-lg px-2 py-2 text-left transition hover:bg-accent"
                    >
                      <div className="min-w-0 flex-1">
                        {editingLessonId === lesson.id ? (
                          <div
                            className="flex gap-2"
                            onClick={(event) => event.stopPropagation()}
                          >
                            <input
                              autoFocus
                              className="h-9 min-w-0 flex-1 rounded-md border border-input bg-background px-3 text-sm font-medium outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
                              value={editingTitle}
                              onChange={(event) => setEditingTitle(event.target.value)}
                              onKeyDown={(event) => {
                                if (event.key === "Enter") saveLessonTitle(lesson.id);
                                if (event.key === "Escape") setEditingLessonId(null);
                              }}
                            />
                            <Button
                              type="button"
                              size="icon-sm"
                              onClick={() => saveLessonTitle(lesson.id)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <>
                            <p
                              className={cn(
                                "line-clamp-2 text-sm font-semibold text-foreground",
                                isOpen && "text-primary",
                              )}
                              onDoubleClick={(event) => {
                                if (!canManage) return;
                                event.stopPropagation();
                                setEditingLessonId(lesson.id);
                                setEditingTitle(lesson.title);
                              }}
                            >
                              Phần {lesson.order_index ?? "-"}: {lesson.title}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {subLessons.length} bài học
                            </p>
                          </>
                        )}
                      </div>
                      {isOpen ? (
                        <ChevronDown className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                      )}
                    </div>
                  </ContextMenuTrigger>

                  {canManage && (
                    <ContextMenuContent>
                      <ContextMenuItem
                        onClick={() => {
                          setEditingLessonId(lesson.id);
                          setEditingTitle(lesson.title);
                        }}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Đổi tên phần học
                      </ContextMenuItem>
                      <ContextMenuItem
                        onClick={async () => {
                          try {
                            await remove<ApiMessage>(`/lesson/${lesson.id}`);
                            toast.success("Đã xoá phần học");
                            onReload();
                          } catch (error: unknown) {
                            toast.error(getErrorMessage(error));
                          }
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Xoá phần học
                      </ContextMenuItem>
                    </ContextMenuContent>
                  )}
                </ContextMenu>

                {isOpen && (
                  <div className="mt-2 space-y-1 pb-1">
                    {subLessons.length > 0 ? (
                      <SortableContext
                        items={subLessons.map((subLesson) => `sublesson-${subLesson.id}`)}
                        strategy={verticalListSortingStrategy}
                      >
                        {subLessons.map((subLesson) => {
                          const isSelected = selectedSubLessonId === subLesson.id;

                          return (
                            <SortableSubLesson
                              key={subLesson.id}
                              lessonId={lesson.id}
                              subLesson={subLesson}
                              isDraggable={Boolean(canManage)}
                            >
                              <div
                                role="button"
                                tabIndex={0}
                                onClick={() => onSelectSubLesson(lesson.id, subLesson.id)}
                                onKeyDown={(event) => {
                                  if (event.key === "Enter" || event.key === " ") {
                                    event.preventDefault();
                                    onSelectSubLesson(lesson.id, subLesson.id);
                                  }
                                }}
                                className={cn(
                                  "group flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-left transition",
                                  isSelected
                                    ? "bg-primary text-primary-foreground"
                                    : "hover:bg-accent hover:text-accent-foreground",
                                )}
                              >
                                <PlayCircle
                                  className={cn(
                                    "h-4 w-4 shrink-0",
                                    isSelected
                                      ? "text-primary-foreground"
                                      : "text-muted-foreground group-hover:text-accent-foreground",
                                  )}
                                />
                                <div className="min-w-0 flex-1">
                                  <p className="line-clamp-2 text-sm font-medium">
                                    {subLesson.title}
                                  </p>
                                  <p
                                    className={cn(
                                      "mt-0.5 text-xs",
                                      isSelected
                                        ? "text-primary-foreground/80"
                                        : "text-muted-foreground",
                                    )}
                                  >
                                    {subLesson.duration || "Đang cập nhật"} phút
                                  </p>
                                </div>

                                {canManage && (
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        type="button"
                                        variant={isSelected ? "secondary" : "ghost"}
                                        size="icon-sm"
                                        onClick={(event) => event.stopPropagation()}
                                        aria-label="Mở tuỳ chọn bài học"
                                      >
                                        <EllipsisVertical className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleActionClick(
                                            "addBefore",
                                            subLesson,
                                            lesson.id,
                                          )
                                        }
                                      >
                                        <ListPlus className="mr-2 h-4 w-4" />
                                        Thêm phía trước
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleActionClick(
                                            "addAfter",
                                            subLesson,
                                            lesson.id,
                                          )
                                        }
                                      >
                                        <ListPlus className="mr-2 h-4 w-4" />
                                        Thêm phía sau
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleActionClick("update", subLesson, lesson.id)
                                        }
                                      >
                                        <Pencil className="mr-2 h-4 w-4" />
                                        Cập nhật bài học
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleActionClick("delete", subLesson, lesson.id)
                                        }
                                      >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Xoá bài học
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                )}
                              </div>
                            </SortableSubLesson>
                          );
                        })}
                      </SortableContext>
                    ) : (
                      <div className="rounded-lg border border-dashed border-border bg-muted/40 p-4">
                        <p className="text-sm font-medium text-foreground">
                          Chưa có bài học trong phần này
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Tạo bài học đầu tiên để học viên có thể bắt đầu.
                        </p>
                        {canManage && (
                          <Button
                            size="sm"
                            className="mt-3"
                            onClick={async () => {
                              try {
                                await post<ApiMessage, { title: string; order_index: number }>(
                                  `/sublesson/lesson/${lesson.id}`,
                                  {
                                    title: "Bài học mới",
                                    order_index: 1,
                                  },
                                );
                                onReload();
                              } catch (error: unknown) {
                                toast.error(getErrorMessage(error));
                              }
                            }}
                          >
                            <Plus className="h-4 w-4" />
                            Tạo bài học
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </SortableLesson>
            );
          })}
        </SortableContext>
      </DndContext>

      {newLessonForm.show && (
        <div className="border-b border-border bg-muted/30 p-4">
          <label className="text-sm font-medium text-foreground" htmlFor="lesson-title">
            Tiêu đề phần học
          </label>
          <input
            id="lesson-title"
            type="text"
            placeholder="Ví dụ: Giới thiệu và cài đặt môi trường"
            value={newLessonForm.title}
            onChange={(event) =>
              setNewLessonForm((prev) => ({ ...prev, title: event.target.value }))
            }
            className="mt-2 h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
          />
          <div className="mt-3 flex gap-2">
            <Button size="sm" onClick={createLesson}>
              <Check className="h-4 w-4" />
              Lưu
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setNewLessonForm({ show: false, title: "" })}
            >
              <X className="h-4 w-4" />
              Hủy
            </Button>
          </div>
        </div>
      )}

      {lessonList.length === 0 && (
        <div className="p-4">
          <div className="rounded-xl border border-dashed border-border bg-muted/40 p-6 text-center">
            <p className="text-sm font-medium text-foreground">Chưa có phần học</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Thêm phần mới để bắt đầu xây dựng nội dung khóa học.
            </p>
            {canManage && (
              <Button
                size="sm"
                className="mt-4"
                onClick={() => setNewLessonForm({ show: true, title: "" })}
              >
                <Plus className="mr-1.5 h-4 w-4" />
                Thêm phần học đầu tiên
              </Button>
            )}
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
        defaultValues={
          dialogContent.action === "update" && selectedSubLesson
            ? {
                title: selectedSubLesson.title,
                video_url: selectedSubLesson.video_url,
              }
            : undefined
        }
        sublessonId={selectedSubLesson?.id}
      />
    </div>
  );
};

export default LessonsCourse;
