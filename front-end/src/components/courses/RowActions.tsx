"use client";

import { useEffect, useState } from "react";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { toast } from "sonner";
import { useApi } from "@/hooks/useApi";
import FormDialog, { FieldConfig } from "../common/FormDialog";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/utils";

export default function RowActions({ course, reload }: any) {
  const [categories, setCategories] = useState([]);
  const { get, remove, put } = useApi();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openForm, setOpenForm] = useState(false);

  const router = useRouter();

  const getCategory = async () => {
    const data = await get("/categories");
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
      name: "category_name",
      label: "Tên danh mục",
      type: "select",
      options: [
        ...categories.map((cate: any) => ({
          label: cate.name,
          value: cate.name,
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
        defaultValues={course} // <-- Gán dữ liệu mặc định
        onClose={() => setOpenForm(false)}
        onSubmit={async (data) => {
          console.log(data);
          try {
            const res = await put(`/course/${course.id}`, data);
            toast.success(data.message || "Cập nhật thành công");
            reload(); // <---- refresh bảng
          } catch (err: any) {
            toast.error(err.message || "Lỗi hệ thống");
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
            const data = await remove(`/course/${course.id}`);
            toast.success(data.message);
            reload();
          } catch (err: any) {
            toast.error(err);
          }
        }}
        onClose={() => setOpenConfirm(false)}
      />
    </div>
  );
}
