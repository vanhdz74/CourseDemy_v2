"use client";

import { useEffect, useState } from "react";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { toast } from "sonner";
import { useApi } from "@/hooks/useApi";
import FormDialog, { FieldConfig } from "../common/FormDialog";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/utils";
import { Category } from "@/types/categoryType";
import { Course } from "@/types/courseType";

type CourseActionProps = {
  course: Course;
  reload: () => void;
};

type ApiError = {
  message?: string;
  response?: {
    data?: {
      message?: string;
    };
  };
};

function getErrorMessage(error: unknown) {
  const apiError = error as ApiError;
  return apiError.response?.data?.message || apiError.message || "Lỗi hệ thống";
}

export default function RowActions({ course, reload }: CourseActionProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const { get, remove, put } = useApi();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openForm, setOpenForm] = useState(false);

  const router = useRouter();

  const getCategory = async () => {
    const data = await get<Category[]>("/categories");
    setCategories(data);
  };

  useEffect(() => {
    getCategory();
  }, []);

  const fields: FieldConfig[] = [
    { name: "title", label: "Tiêu đề", required: true },
    { name: "description", label: "Mô tả", required: true },
    {
      name: "teacher_id",
      label: "Giảng viên phụ trách ( id )",
      required: true,
    },
    { name: "price", label: "Giá tiền", type: "number" },
    {
      name: "category_id",
      label: "Tên danh mục",
      type: "select",
      options: [
        ...categories.map((cate) => ({
          label: cate.name,
          value: cate.id,
        })),
      ],
    },
  ];

  return (
    <div className="flex gap-2">
      <button
        onClick={() => {
          setOpenForm(true);
        }}
        className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
      >
        Sửa
      </button>

      <button
        onClick={() => setOpenConfirm(true)}
        className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
      >
        Xoá
      </button>

      <button
        onClick={() => {
          router.push(`/course-detail/${slugify(course.title)}`);
        }}
        className="px-3 py-1 rounded bg-yellow-300 text-white hover:bg-red-600"
      >
        Đi đến
      </button>

      {/* FORM DIALOG */}
      <FormDialog
        open={openForm}
        title="Chỉnh sửa người dùng"
        fields={fields}
        submitText="Cập nhật"
        defaultValues={{
          ...course,
          category_id: course.category_id ?? "",
        }}
        onClose={() => setOpenForm(false)}
        onSubmit={async (data) => {
          try {
            const categoryId = Number(data.category_id);
            if (!categories.some((category) => category.id === categoryId)) {
              toast.error("Danh mục đã chọn không tồn tại trong danh sách hiện tại.");
              return;
            }

            const response = await put<{ message?: string }>(`/course/${course.id}`, {
              ...data,
              category_id: categoryId,
              teacher_id: Number(data.teacher_id),
            });
            toast.success(response.message || "Cập nhật thành công");
            reload(); // <---- refresh bảng
          } catch (err: unknown) {
            toast.error(getErrorMessage(err));
          }
        }}
      />

      {/* CONFIRM DELETE */}
      <ConfirmDialog
        open={openConfirm}
        title="Xác nhận xóa"
        message="Bạn có chắc chắn muốn xóa khoá học này?"
        confirmText="Xóa"
        cancelText="Hủy"
        onConfirm={async () => {
          try {
            const data = await remove<{ message?: string }>(`/course/${course.id}`);
            toast.success(data.message);
            reload();
          } catch (err: unknown) {
            toast.error(getErrorMessage(err));
          }
        }}
        onClose={() => setOpenConfirm(false)}
      />
    </div>
  );
}
