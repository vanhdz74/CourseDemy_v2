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
import { Eye, EyeOff } from "lucide-react";
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

type SignupFormProps = Omit<React.ComponentProps<"form">, "onSubmit"> & {
  onSubmit?: (data: SignupFormData) => void | Promise<void>;
  isSubmitting?: boolean;
  serverError?: string;
};

export function SignupForm({
  className,
  onSubmit,
  isSubmitting = false,
  serverError,
  ...props
}: SignupFormProps) {
  const [formData, setFormData] = useState<SignupFormData>({
    username: "",
    email: "",
    password: "",
    retype_password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof SignupFormData, boolean>>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);

  // Regex kiểm tra email theo RFC
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Mật khẩu phải có chữ và số
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

  const validateField = (
    name: keyof SignupFormData,
    value: string,
    values: SignupFormData
  ) => {
    if (name === "username") {
      if (!value.trim()) return "Vui lòng nhập họ tên";
      if (value.trim().length < 2) return "Họ tên phải có ít nhất 2 ký tự";
    }

    if (name === "email") {
      if (!value.trim()) return "Vui lòng nhập email";
      if (!emailRegex.test(value.trim())) return "Email không hợp lệ";
    }

    if (name === "password") {
      if (!value) return "Vui lòng nhập mật khẩu";
      if (!passwordRegex.test(value)) {
        return "Mật khẩu phải từ 8 ký tự và chứa cả chữ và số";
      }
    }

    if (name === "retype_password") {
      if (!value) return "Vui lòng xác nhận mật khẩu";
      if (value !== values.password) return "Mật khẩu không khớp";
    }

    return undefined;
  };

  const validateForm = (values: SignupFormData) => {
    const newErrors: FormErrors = {};

    (Object.keys(values) as Array<keyof SignupFormData>).forEach((name) => {
      const error = validateField(name, values[name], values);
      if (error) newErrors[name] = error;
    });

    return newErrors;
  };

  // Khi thay đổi input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.id as keyof SignupFormData;
    const { value } = e.target;

    setTouched((prev) => ({ ...prev, [name]: true }));

    setFormData((prev) => {
      const next = { ...prev, [name]: value };

      setErrors((prevErrors) => {
        const nextErrors = { ...prevErrors };
        const fieldError = validateField(name, value, next);

        if (fieldError) nextErrors[name] = fieldError;
        else delete nextErrors[name];

        if (name === "password" && (touched.retype_password || next.retype_password)) {
          const retypeError = validateField(
            "retype_password",
            next.retype_password,
            next
          );
          if (retypeError) nextErrors.retype_password = retypeError;
          else delete nextErrors.retype_password;
        }

        return nextErrors;
      });

      return next;
    });
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const name = e.target.id as keyof SignupFormData;
    setTouched((prev) => ({ ...prev, [name]: true }));

    const error = validateField(name, formData[name], formData);
    setErrors((prev) => {
      const next = { ...prev };
      if (error) next[name] = error;
      else delete next[name];
      return next;
    });
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const nextErrors = validateForm(formData);
    setErrors(nextErrors);
    setTouched({
      username: true,
      email: true,
      password: true,
      retype_password: true,
    });
    if (Object.keys(nextErrors).length > 0) return;

    await onSubmit?.(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-6", className)}
      noValidate
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
            onBlur={handleBlur}
            aria-invalid={!!errors.username}
            aria-describedby={errors.username ? "username-error" : undefined}
          />
          {errors.username && (
            <p id="username-error" className="text-destructive text-sm">
              {errors.username}
            </p>
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
            onBlur={handleBlur}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : "email-description"}
          />
          <FieldDescription id="email-description">
            Chúng tôi sẽ sử dụng email của bạn để liên lạc với bạn.
          </FieldDescription>
          {errors.email && (
            <p id="email-error" className="text-destructive text-sm">
              {errors.email}
            </p>
          )}
        </Field>

        {/* Password */}
        <Field>
          <FieldLabel htmlFor="password">Mật khẩu</FieldLabel>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={!!errors.password}
              aria-describedby={
                errors.password ? "password-error" : "password-description"
              }
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </Button>
          </div>
          <FieldDescription id="password-description">
            Phải có ít nhất 8 ký tự, gồm chữ và số
          </FieldDescription>
          {errors.password && (
            <p id="password-error" className="text-destructive text-sm">
              {errors.password}
            </p>
          )}
        </Field>

        {/* Retype Password */}
        <Field>
          <FieldLabel htmlFor="retype_password">Xác nhận mật khẩu</FieldLabel>
          <div className="relative">
            <Input
              id="retype_password"
              type={showRetypePassword ? "text" : "password"}
              required
              value={formData.retype_password}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={!!errors.retype_password}
              aria-describedby={
                errors.retype_password ? "retype-password-error" : undefined
              }
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setShowRetypePassword((prev) => !prev)}
              aria-label={
                showRetypePassword
                  ? "Ẩn mật khẩu xác nhận"
                  : "Hiện mật khẩu xác nhận"
              }
            >
              {showRetypePassword ? <EyeOff /> : <Eye />}
            </Button>
          </div>
          {errors.retype_password && (
            <p id="retype-password-error" className="text-destructive text-sm">
              {errors.retype_password}
            </p>
          )}
        </Field>

        <Field>
          {serverError && (
            <p className="rounded-md border border-destructive/25 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {serverError}
            </p>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
          </Button>
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
