"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { loginUserThunk } from "@/features/auth/authThunks";

import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/form/login-form";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();

  const dispatch = useAppDispatch();
  const { token } = useAppSelector((state) => state.auth);

  // Xử lý đăng nhập
  useEffect(() => {
    if (token) {
      router.push("/home");
    }
  }, [token]);

  const handleSubmit = async (data: { email: string; password: string }) => {
    const result = await dispatch(loginUserThunk(data));

    if (loginUserThunk.rejected.match(result)) {
      toast.error(result.payload as string);
    } else {
      toast.success("Đăng nhập thành công!");
    }
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm onSubmit={handleSubmit} />
          </div>
        </div>
      </div>

      <div className="bg-muted relative hidden lg:block">
        <img
          src="/placeholder.svg"
          alt="Login background"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
