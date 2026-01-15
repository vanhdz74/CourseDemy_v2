"use client";

import { useState } from "react";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { toast } from "sonner";
import { useApi } from "@/hooks/useApi";
import { FieldConfig } from "../common/FormDialog";

export default function RowActions({ user, reload, courseId }: any) {
  const fields: FieldConfig[] = [
    { name: "email", label: "Email", required: true },
  ];

  const { remove, put } = useApi();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openForm, setOpenForm] = useState(false);

  return (
    <div className="flex gap-2">
      <button
        onClick={() => setOpenConfirm(true)}
        className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
      >
        Xoá
      </button>

      {/* CONFIRM DELETE */}
      <ConfirmDialog
        open={openConfirm}
        title="Xác nhận xóa"
        message="Bạn có chắc chắn muốn xóa người dùng này khỏi khoá học?"
        confirmText="Xóa"
        cancelText="Hủy"
        onConfirm={async () => {
          try {
            const data = await remove(
              `/courses/${courseId}/students/${user.id}`
            );
            toast.success(data.message);
            reload();
          } catch (error: any) {
            // console.log(error.response?.data.error);
            // console.log(`/courses/${courseId}/students/${user.id}`);
            toast.error(error.response?.data.error);
          }
        }}
        onClose={() => setOpenConfirm(false)}
      />
    </div>
  );
}
