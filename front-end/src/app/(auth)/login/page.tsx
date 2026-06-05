"use client";

import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/form/login-form";
import { useEffect } from "react";
import { toast } from "sonner";
import AnimatedRectangles from "./AnimatedRectangles";
import { signIn, useSession } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const { status } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Xử lý đăng nhập
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/home");
    }
  }, [router, status]);

  const handleSubmit = async (data: { email: string; password: string }) => {
    setIsSubmitting(true);

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (!result?.ok || result.error) {
        toast.error("Email hoặc mật khẩu không đúng");
        return;
      }

      toast.success("Đăng nhập thành công!");
      router.refresh();
      router.push("/home");
    } catch {
      toast.error("Email hoặc mật khẩu không đúng");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
          </div>
        </div>
      </div>

      <div className="bg-muted relative hidden lg:block lg:">
        <AnimatedRectangles />
      </div>
    </div>
  );
}
