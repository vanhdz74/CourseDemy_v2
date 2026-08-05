"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/modules/shared/components/ui/dialog";
import { Button } from "@/modules/shared/components/ui/button";
import { Input } from "@/modules/shared/components/ui/input";
import { useEffect, useState } from "react";

export interface FieldConfig {
  name: string;
  label: string;
  type?: "text" | "select" | "number"; // Thêm select nếu có
  placeholder?: string;
  required?: boolean;
  options?: { label: string; value: string | number }[]; // Chỉ dùng cho select
}

export type FormValue = string | number;
export type FormValues = Record<string, FormValue>;

interface FormDialogProps {
  open: boolean;
  title?: string;
  fields: FieldConfig[];
  submitText?: string;
  defaultValues?: FormValues; // <-- thêm dòng này
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: (data: FormValues) => void | Promise<void>;
}

export default function FormDialog({
  open,
  title = "Nhập thông tin",
  fields,
  submitText = "Xác nhận",
  defaultValues = {}, // <-- thêm
  isSubmitting = false,
  onClose,
  onSubmit,
}: FormDialogProps) {
  const [form, setForm] = useState<FormValues>({});
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

  const handleSubmit = async () => {
    if (!validate()) return;
    await onSubmit(form);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-2xl border-border bg-card">
        <DialogHeader>
          <DialogTitle className="text-left text-xl font-semibold tracking-tight">
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {fields.map((field) => (
            <div key={field.name} className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                {field.label}
              </label>

              {field.type === "select" && field.options ? (
                <select
                  value={form[field.name] ?? ""}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm shadow-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
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
                <p className="text-xs text-destructive">
                  {errors[field.name]}
                </p>
              )}
            </div>
          ))}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Đang xử lý..." : submitText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
