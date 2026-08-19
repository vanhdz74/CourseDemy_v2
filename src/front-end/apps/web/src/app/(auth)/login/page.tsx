"use client";

import { useRouter } from "next/navigation";
import { LoginForm } from "@/modules/auth/components/form/login-form";
import { useEffect } from "react";
import AnimatedRectangles from "./AnimatedRectangles";
import { signIn, useSession } from "next-auth/react";
import { useState } from "react";
import { AuthCloseButton } from "@/modules/auth/components/auth-close-button";
import { useI18n } from "@/modules/shared/i18n";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useI18n();
  const { status } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  // Xử lý đăng nhập
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/home");
    }
  }, [router, status]);

  const handleSubmit = async (data: { email: string; password: string }) => {
    setIsSubmitting(true);
    setServerError("");

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (!result?.ok || result.error) {
        setServerError(t("auth.loginInvalid"));
        return;
      }

      router.refresh();
      router.push("/home");
    } catch {
      setServerError(t("auth.loginInvalid"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative grid min-h-svh lg:grid-cols-2">
      <AuthCloseButton />
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              serverError={serverError}
            />
          </div>
        </div>
      </div>

      {/* Hình minh hoạ */}
      <div className="bg-muted relative hidden lg:block lg:">
        <AnimatedRectangles />
      </div>
    </div>
  );
}
