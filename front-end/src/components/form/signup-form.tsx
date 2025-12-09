"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";

// Type dữ liệu form
type SignupFormData = {
  username: string;
  email: string;
  password: string;
  retype_password: string;
};

// Lỗi form
type FormErrors = Partial<Record<keyof SignupFormData, string>>;

type SignupFormProps = React.ComponentProps<"form"> & {
  onSubmit?: (data: SignupFormData) => void;
};

export function SignupForm({ className, onSubmit, ...props }: SignupFormProps) {
  const [formData, setFormData] = useState<SignupFormData>({
    username: "",
    email: "",
    password: "",
    retype_password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // Regex kiểm tra email theo RFC
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Mật khẩu phải có chữ và số
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

  // Mock API check email tồn tại
  const checkEmailExists = async (email: string) => {
    await new Promise((res) => setTimeout(res, 300));
    return false; // Giả sử email chưa tồn tại
  };

  // Validate form
  const validate = async () => {
    const newErrors: FormErrors = {};

    // Họ tên
    if (!formData.username || formData.username.length < 2) {
      newErrors.username = "Họ tên phải có ít nhất 2 ký tự";
    }

    // Email
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    } else {
      const exists = await checkEmailExists(formData.email);
      if (exists) {
        newErrors.email = "Email đã tồn tại";
      }
    }

    // Mật khẩu
    if (!passwordRegex.test(formData.password)) {
      newErrors.password = "Mật khẩu phải từ 8 ký tự và chứa cả chữ và số";
    }

    // Xác nhận mật khẩu
    if (formData.retype_password !== formData.password) {
      newErrors.retype_password = "Mật khẩu không khớp";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Khi thay đổi input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));

    // Clear lỗi realtime
    setErrors((prev) => ({ ...prev, [id]: undefined }));
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isValid = await validate();
    if (!isValid) return;

    if (onSubmit) onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Đăng ký</h1>
          <p className="text-muted-foreground text-sm">
            Điền thông tin vào form bên dưới để tạo tài khoản
          </p>
        </div>

        {/* Họ tên */}
        <Field>
          <FieldLabel htmlFor="username">Họ tên</FieldLabel>
          <Input
            id="username"
            type="text"
            placeholder="John Doe"
            required
            value={formData.username}
            onChange={handleChange}
          />
          {errors.username && (
            <p className="text-red-500 text-sm">{errors.username}</p>
          )}
        </Field>

        {/* Email */}
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            value={formData.email}
            onChange={handleChange}
          />
          <FieldDescription>
            Chúng tôi sẽ sử dụng email của bạn để liên lạc với bạn.
          </FieldDescription>
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </Field>

        {/* Password */}
        <Field>
          <FieldLabel htmlFor="password">Mật khẩu</FieldLabel>
          <Input
            id="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
          />
          <FieldDescription>
            Phải có ít nhất 8 ký tự, gồm chữ và số
          </FieldDescription>
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}
        </Field>

        {/* Retype Password */}
        <Field>
          <FieldLabel htmlFor="retype_password">Xác nhận mật khẩu</FieldLabel>
          <Input
            id="retype_password"
            type="password"
            required
            value={formData.retype_password}
            onChange={handleChange}
          />
          {errors.retype_password && (
            <p className="text-red-500 text-sm">{errors.retype_password}</p>
          )}
        </Field>

        <Field>
          <Button type="submit">Tạo tài khoản</Button>
        </Field>

        <FieldSeparator>Tiếp tục với</FieldSeparator>

        <Field>
          <Button variant="outline" type="button">
            Đăng ký với Google
          </Button>
          <FieldDescription className="px-6 text-center">
            Bạn đã có tài khoản? <Link href="/login">Đăng nhập</Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
