"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

export interface FieldConfig {
  name: string;
  label: string;
  type?: "text" | "select" | "number"; // Thêm select nếu có
  placeholder?: string;
  required?: boolean;
  options?: { label: string; value: any }[]; // Chỉ dùng cho select
}

interface FormDialogProps {
  open: boolean;
  title?: string;
  fields: FieldConfig[];
  submitText?: string;
  defaultValues?: Record<string, any>; // <-- thêm dòng này
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export default function FormDialog({
  open,
  title = "Nhập thông tin",
  fields,
  submitText = "Xác nhận",
  defaultValues = {}, // <-- thêm
  onClose,
  onSubmit,
}: FormDialogProps) {
  const [form, setForm] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Set giá trị form mỗi khi mở dialog hoặc defaultValues thay đổi
  useEffect(() => {
    if (open) {
      setForm(defaultValues || {});
      setErrors({});
    }
  }, [open, defaultValues]);

  const handleChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    fields.forEach((field) => {
      if (field.required && !form[field.name]) {
        newErrors[field.name] = `${field.label} không được để trống`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit(form);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {fields.map((field) => (
            <div key={field.name} className="space-y-1">
              <label className="text-sm font-medium">{field.label}</label>

              {field.type === "select" && field.options ? (
                <select
                  value={form[field.name] ?? ""}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  className="w-full border rounded px-2 py-1"
                >
                  <option value="">-- Chọn {field.label} --</option>
                  {field.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <Input
                  type={field.type || "text"}
                  placeholder={field.placeholder}
                  value={form[field.name] ?? ""}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                />
              )}

              {errors[field.name] && (
                <p className="text-xs text-red-500">{errors[field.name]}</p>
              )}
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={handleSubmit}>{submitText}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
