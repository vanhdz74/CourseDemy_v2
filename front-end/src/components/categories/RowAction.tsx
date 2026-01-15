"use client";

import { useEffect, useState } from "react";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { toast } from "sonner";
import { useApi } from "@/hooks/useApi";
import FormDialog, { FieldConfig } from "../common/FormDialog";

export default function RowActions({ category, reload }: any) {
  const { remove, put } = useApi();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openForm, setOpenForm] = useState(false);

  const fields: FieldConfig[] = [
    { name: "name", label: "Tiêu đề", required: true },
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

      {/* FORM DIALOG */}
      <FormDialog
        open={openForm}
        title="Chỉnh sửa danh mục"
        fields={fields}
        submitText="Cập nhật"
        defaultValues={category} // <-- Gán dữ liệu mặc định
        onClose={() => setOpenForm(false)}
        onSubmit={async (data) => {
          // console.log(data);
          try {
            const res = await put(`/category`, data);
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
        message="Bạn có chắc chắn muốn xóa danh mục này?"
        confirmText="Xóa"
        cancelText="Hủy"
        onConfirm={async () => {
          try {
            const data = await remove(`/category/${category.id}`);
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
