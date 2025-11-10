"use client";

import { SignupForm } from "@/components/form/signup-form";

export default function RegisterPage() {
  const handleRegister = async (data: {
    username: string;
    email: string;
    password: string;
    retype_password: string;
  }) => {
    const payload = {
      ...data,
      role: "STUDENT",
      is_active: 1,
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Đăng ký thất bại");

      alert("Đăng ký thành công! Hãy đăng nhập.");
      window.location.href = "/login";
    } catch (err: any) {
      alert(`Lỗi: ${err.message}`);
    }
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            {/* Gửi onSubmit dạng event */}
            <SignupForm onSubmit={handleRegister} />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img
          src="/placeholder.svg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
