"use client";

import { SignupForm } from "@/modules/auth/components/form/signup-form";
import AnimatedRectangles from "../login/AnimatedRectangles";
import { register } from "@repo/api";
import { isAxiosError } from "axios";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthCloseButton } from "@/modules/auth/components/auth-close-button";
import { useI18n } from "@/modules/shared/i18n";

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleRegister = async (data: {
    username: string;
    email: string;
    password: string;
    retype_password: string;
  }) => {
    setIsSubmitting(true);
    setServerError("");

    const payload = {
      ...data,
      role: "STUDENT",
    };

    try {
      await register(payload);
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (!result?.ok || result.error) {
        setServerError(t("auth.registerAutoLoginFailed"));
        return;
      }

      router.refresh();
      router.push("/home");
    } catch (err: unknown) {
      setServerError(getRegisterErrorMessage(err, t("auth.registerFailed")));
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
            <SignupForm
              onSubmit={handleRegister}
              isSubmitting={isSubmitting}
              serverError={serverError}
            />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <AnimatedRectangles />
      </div>
    </div>
  );
}

function getRegisterErrorMessage(error: unknown, fallback: string) {
  if (!isAxiosError(error)) {
    return error instanceof Error ? error.message : fallback;
  }

  const data = error.response?.data as
    | {
        message?: string;
        errors?: unknown;
      }
    | undefined;

  if (Array.isArray(data?.errors) && data.errors.length > 0) {
    return data.errors.join(", ");
  }

  return data?.message || error.message || fallback;
}
