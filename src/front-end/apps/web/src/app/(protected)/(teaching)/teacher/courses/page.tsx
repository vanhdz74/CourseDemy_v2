"use client";

import CourseDisplay from "@/modules/course/components/common/CourseDisplay";
import FormDialog, {
  FieldConfig,
  FormValues,
} from "@/modules/shared/components/common/FormDialog";
import { Button } from "@/modules/shared/components/ui/button";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { BookOpen, PlusCircle, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { api } from "@repo/api";
import { queryKeys } from "@repo/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type ApiError = {
  response?: {
    data?: {
      error?: string;
      errors?: unknown;
      message?: string;
    };
  };
};

function getApiErrorMessage(error: unknown) {
  const apiError = error as ApiError;
  const message =
    apiError.response?.data?.message ||
    apiError.response?.data?.error ||
    (error instanceof Error ? error.message : "Không tạo được khoá học");
  const detail = apiError.response?.data?.errors;

  if (typeof detail === "string" && detail.trim()) {
    return `${message}: ${detail}`;
  }

  if (detail && typeof detail === "object") {
    const detailText = Object.entries(detail as Record<string, unknown>)
      .map(([key, value]) => `${key}=${String(value)}`)
      .join(", ");

    if (detailText) {
      return `${message}: ${detailText}`;
    }
  }

  return message;
}

const TeacherCourseManagement = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const userId = Number(user?.id);
  const hasUserId = Number.isFinite(userId) && userId > 0;
  const queryClient = useQueryClient();
  const [openCreateModal, setOpenCreateModal] = useState(false);

  const { data: categories = [] } = useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: api.courses.getCategories,
  });

  const createCourseMutation = useMutation({
    mutationFn: api.courses.createCourse,
  });

  const courseListUrl = useMemo(
    () => `${api.endpoints.courses.search}?teacher_id=${userId}`,
    [userId],
  );

  const fields = useMemo<FieldConfig[]>(
    () => [
      {
        name: "title",
        label: "Tên khóa học",
        placeholder: "Ví dụ: React cơ bản cho người mới",
        required: true,
      },
      {
        name: "description",
        label: "Mô tả ngắn",
        placeholder: "Tóm tắt nội dung khóa học",
        required: true,
      },
      {
        name: "price",
        label: "Giá bán",
        type: "number",
        placeholder: "Ví dụ: 499000",
        required: true,
      },
      {
        name: "category_id",
        label: "Danh mục",
        type: "select",
        required: true,
        options: categories.map((category) => ({
          label: category.name,
          value: category.id,
        })),
      },
    ],
    [categories],
  );

  const createCourseDefaultValues = useMemo<FormValues>(
    () => ({
      title: "",
      description: "",
      price: "",
      category_id: "",
    }),
    [],
  );

  const handleAddCourse = async (data: FormValues) => {
    if (!hasUserId) {
      toast.error("Không xác định được giảng viên đang đăng nhập.");
      return;
    }

    const categoryId = Number(data.category_id);
    if (!Number.isFinite(categoryId) || categoryId <= 0) {
      toast.error("Vui lòng chọn danh mục hợp lệ.");
      return;
    }

    if (!categories.some((category) => category.id === categoryId)) {
      toast.error("Danh mục đã chọn không tồn tại trong danh sách hiện tại.");
      return;
    }

    const payload = {
      title: String(data.title || "").trim(),
      description: String(data.description || "").trim(),
      teacher_id: userId,
      price: String(data.price || 0),
      category_id: categoryId,
      level: 0,
      quantity: 0,
    };
    console.log(payload);

    try {
      await createCourseMutation.mutateAsync(payload);
      toast.success("Tạo khoá học thành công!");
      setOpenCreateModal(false);
      await queryClient.invalidateQueries({ queryKey: queryKeys.courses.all });
    } catch (error: unknown) {
      toast.error(`Lỗi: ${getApiErrorMessage(error)}`);
    }
  };

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-sm font-medium text-accent-foreground">
              <BookOpen className="h-4 w-4" />
              Teacher workspace
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              Quản lý khoá học
            </h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Tạo khóa học mới, chỉnh sửa nội dung và theo dõi danh sách khóa
              học đang phụ trách.
            </p>
          </div>

          <Button
            onClick={() => setOpenCreateModal(true)}
            disabled={!hasUserId}
            className="w-full md:w-auto"
          >
            <PlusCircle className="h-4 w-4" />
            Thêm khoá học
          </Button>
        </div>
      </section>

      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
        <div className="mb-5 flex flex-col gap-2 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Danh sách khóa học
            </h2>
            <p className="text-sm text-muted-foreground">
              Các khóa học được tải trực tiếp từ hệ thống.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5" />
            Cập nhật theo dữ liệu mới nhất
          </div>
        </div>

        {hasUserId ? (
          <CourseDisplay apiUrl={courseListUrl} />
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-muted/40 p-8 text-center text-sm text-muted-foreground">
            Đang tải thông tin giảng viên...
          </div>
        )}
      </div>

      <FormDialog
        open={openCreateModal}
        title="Tạo khóa học mới"
        fields={fields}
        submitText="Tạo khóa học"
        defaultValues={createCourseDefaultValues}
        isSubmitting={createCourseMutation.isPending}
        onClose={() => {
          if (!createCourseMutation.isPending) setOpenCreateModal(false);
        }}
        onSubmit={handleAddCourse}
      />
    </div>
  );
};

export default TeacherCourseManagement;
