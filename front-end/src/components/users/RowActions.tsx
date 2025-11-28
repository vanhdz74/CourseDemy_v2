"use client";

import { useState } from "react";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { toast } from "sonner";
import { useApi } from "@/hooks/useApi";
import FormDialog, { FieldConfig } from "../common/FormDialog";

export default function RowActions({ user, reload }: any) {
  const fields: FieldConfig[] = [
    { name: "username", label: "Username", required: true },
    { name: "email", label: "Email", required: true },
    { name: "phone_number", label: "Phone" },
    { name: "avatar_url", label: "Avatar URL" },
    {
      name: "role",
      label: "Vai trò",
      type: "select",
      options: [
        { label: "Admin", value: "ADMIN" },
        { label: "Teacher", value: "TEACHER" },
        { label: "Student", value: "STUDENT" },
      ],
    },
    { name: "facebook_link", label: "Facebook" },
    { name: "youtube_link", label: "Youtube" },
    { name: "is_active", label: "Active" },
  ];

  const { remove, put } = useApi();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openForm, setOpenForm] = useState(false);

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
        title="Chỉnh sửa người dùng"
        fields={fields}
        submitText="Cập nhật"
        defaultValues={user} // <-- Gán dữ liệu mặc định
        onClose={() => setOpenForm(false)}
        onSubmit={async (data) => {
          try {
            const res = await put(`/user/update/${user.id}`, data);
            toast.success("Cập nhật thành công");
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
        message="Bạn có chắc chắn muốn xóa người dùng này?"
        confirmText="Xóa"
        cancelText="Hủy"
        onConfirm={async () => {
          try {
            const data = await remove(`/user/${user.id}`);
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
