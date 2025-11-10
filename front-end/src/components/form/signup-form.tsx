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

// Type định nghĩa dữ liệu form
type SignupFormData = {
  username: string;
  email: string;
  password: string;
  retype_password: string;
};

// Type props (giống như LoginForm)
type SignupFormProps = React.ComponentProps<"form"> & {
  onSubmit?: (data: SignupFormData) => void;
};

export function SignupForm({ className, onSubmit, ...props }: SignupFormProps) {
  // Lưu dữ liệu form trong state
  const [formData, setFormData] = useState<SignupFormData>({
    username: "",
    email: "",
    password: "",
    retype_password: "",
  });

  // Khi người dùng nhập
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Khi submit form
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
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
          <p className="text-muted-foreground text-sm text-balance">
            Điền thông tin vào form bên dưới để tạo tài khoản
          </p>
        </div>

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
        </Field>

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
            Chúng tôi sẽ sử dụng email của bạn để liên lạc với bạn. Đừng chia sẻ
            với bất kỳ ai
          </FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="password">Mật khẩu</FieldLabel>
          <Input
            id="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
          />
          <FieldDescription>Phải có ít nhất 8 ký tự</FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="retype_password">Xác nhận mật khẩu</FieldLabel>
          <Input
            id="retype_password"
            type="password"
            required
            value={formData.retype_password}
            onChange={handleChange}
          />
          <FieldDescription>Vui lòng xác nhận mật khẩu</FieldDescription>
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
