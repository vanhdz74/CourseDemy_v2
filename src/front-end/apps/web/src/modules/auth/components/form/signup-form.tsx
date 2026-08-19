"use client";

import { cn } from "@/modules/shared/lib/utils";
import { Button } from "@/modules/shared/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/modules/shared/components/ui/field";
import { Input } from "@/modules/shared/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useI18n } from "@/modules/shared/i18n";

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

function normalizeSignupFormData(values: SignupFormData): SignupFormData {
  return {
    username: values.username.trim(),
    email: values.email.trim(),
    password: values.password.trim(),
    retype_password: values.retype_password.trim(),
  };
}

export function SignupForm({
  className,
  onSubmit,
  isSubmitting = false,
  serverError,
  ...props
}: SignupFormProps) {
  const { t } = useI18n();
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
    const trimmedValue = value.trim();
    const normalizedValues = normalizeSignupFormData(values);

    if (name === "username") {
      if (!trimmedValue) return t("auth.errors.nameRequired");
      if (trimmedValue.length < 2) return t("auth.errors.nameMin");
    }

    if (name === "email") {
      if (!trimmedValue) return t("auth.errors.emailRequired");
      if (!emailRegex.test(trimmedValue)) return t("auth.errors.emailInvalid");
    }

    if (name === "password") {
      if (!trimmedValue) return t("auth.errors.passwordRequired");
      if (!passwordRegex.test(trimmedValue)) {
        return t("auth.errors.passwordRule");
      }
    }

    if (name === "retype_password") {
      if (!trimmedValue) return t("auth.errors.confirmPasswordRequired");
      if (trimmedValue !== normalizedValues.password) {
        return t("auth.errors.passwordMismatch");
      }
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

    setFormData((prev) => {
      const next = { ...prev, [name]: value };

      if (touched[name]) {
        setErrors((prevErrors) => {
          const nextErrors = { ...prevErrors };
          const fieldError = validateField(name, value, next);

          if (fieldError) nextErrors[name] = fieldError;
          else delete nextErrors[name];

          if (
            name === "password" &&
            (touched.retype_password || next.retype_password)
          ) {
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
      }

      return next;
    });
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const name = e.target.id as keyof SignupFormData;
    const normalizedValue = e.target.value.trim();

    setTouched((prev) => ({ ...prev, [name]: true }));
    setFormData((prev) => {
      const nextData = { ...prev, [name]: normalizedValue };

      setErrors((prevErrors) => {
        const nextErrors = { ...prevErrors };
        const error = validateField(name, normalizedValue, nextData);

        if (error) nextErrors[name] = error;
        else delete nextErrors[name];

        if (name === "password" && nextData.retype_password) {
          const retypeError = validateField(
            "retype_password",
            nextData.retype_password,
            nextData
          );
          if (retypeError) nextErrors.retype_password = retypeError;
          else delete nextErrors.retype_password;
        }

        return nextErrors;
      });

      return nextData;
    });
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const normalizedData = normalizeSignupFormData(formData);
    const nextErrors = validateForm(normalizedData);
    setFormData(normalizedData);
    setErrors(nextErrors);
    setTouched({
      username: true,
      email: true,
      password: true,
      retype_password: true,
    });
    if (Object.keys(nextErrors).length > 0) return;

    await onSubmit?.(normalizedData);
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
          <h1 className="text-2xl font-bold">{t("auth.registerTitle")}</h1>
          <p className="text-muted-foreground text-sm">
            {t("auth.registerDescription")}
          </p>
        </div>

        {/* Họ tên */}
        <Field>
          <FieldLabel htmlFor="username">{t("auth.name")}</FieldLabel>
          <Input
            id="username"
            type="text"
            placeholder={t("auth.namePlaceholder")}
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
          <FieldLabel htmlFor="email">{t("common.email")}</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder={t("auth.emailPlaceholder")}
            required
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : "email-description"}
          />
          <FieldDescription id="email-description">
            {t("auth.emailHelp")}
          </FieldDescription>
          {errors.email && (
            <p id="email-error" className="text-destructive text-sm">
              {errors.email}
            </p>
          )}
        </Field>

        {/* Password */}
        <Field>
          <FieldLabel htmlFor="password">{t("common.password")}</FieldLabel>
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
              aria-label={
                showPassword ? t("auth.hidePassword") : t("auth.showPassword")
              }
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </Button>
          </div>
          <FieldDescription id="password-description">
            {t("auth.passwordHelp")}
          </FieldDescription>
          {errors.password && (
            <p id="password-error" className="text-destructive text-sm">
              {errors.password}
            </p>
          )}
        </Field>

        {/* Retype Password */}
        <Field>
          <FieldLabel htmlFor="retype_password">
            {t("auth.confirmPassword")}
          </FieldLabel>
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
                  ? t("auth.hideConfirmPassword")
                  : t("auth.showConfirmPassword")
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
            {isSubmitting ? t("auth.registering") : t("auth.registerButton")}
          </Button>
        </Field>

        <FieldSeparator>{t("auth.continueWith")}</FieldSeparator>

        <Field>
          <Button variant="outline" type="button">
            {t("auth.registerWithGoogle")}
          </Button>
          <FieldDescription className="px-6 text-center">
            {t("auth.alreadyHaveAccount")}{" "}
            <Link href="/login">{t("auth.loginButton")}</Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
