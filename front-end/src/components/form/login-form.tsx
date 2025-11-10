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

import { useState } from "react";

// Tạo type cho login, gửi lên submit
type LoginFormProps = React.ComponentProps<"form"> & {
  onSubmit?: (data: { email: string; password: string }) => void;
};
export function LoginForm({ className, onSubmit, ...props }: LoginFormProps) {
  // Tạo form lưu
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
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
          <h1 className="text-2xl font-bold">Đăng nhập</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Nhập email của bạn bên dưới để đăng nhập
          </p>
        </div>
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
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Bạn quên mật khẩu?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
          />
        </Field>
        <Field>
          <Button type="submit">Đăng nhập</Button>
        </Field>
        <FieldSeparator>Hoặc tiếp tục với</FieldSeparator>
        <Field>
          <Button variant="outline" type="button">
            Đăng nhập với google
          </Button>
          <FieldDescription className="text-center">
            Không có tài khoản?{" "}
            <a href="/register" className="underline underline-offset-4">
              Đăng ký
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
