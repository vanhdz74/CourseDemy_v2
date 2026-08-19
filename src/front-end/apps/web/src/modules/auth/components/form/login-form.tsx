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
import { useI18n } from "@/modules/shared/i18n";

import { useState } from "react";

type LoginFormData = {
  email: string;
  password: string;
};

type FormErrors = Partial<Record<keyof LoginFormData, string>>;

type TFunction = (key: string) => string;

// Tạo type cho login, gửi lên submit
type LoginFormProps = Omit<React.ComponentProps<"form">, "onSubmit"> & {
  onSubmit?: (data: LoginFormData) => void | Promise<void>;
  isSubmitting?: boolean;
  serverError?: string;
};

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function normalizeLoginFormData(values: LoginFormData): LoginFormData {
  return {
    email: values.email.trim(),
    password: values.password.trim(),
  };
}

function validateField(name: keyof LoginFormData, value: string, t: TFunction) {
  const trimmedValue = value.trim();

  if (name === "email") {
    if (!trimmedValue) return t("auth.errors.emailRequired");
    if (!emailRegex.test(trimmedValue)) return t("auth.errors.emailInvalid");
  }

  if (name === "password" && !trimmedValue) {
    return t("auth.errors.passwordRequired");
  }

  return undefined;
}

function validateForm(values: LoginFormData, t: TFunction) {
  const nextErrors: FormErrors = {};

  (Object.keys(values) as Array<keyof LoginFormData>).forEach((name) => {
    const error = validateField(name, values[name], t);
    if (error) nextErrors[name] = error;
  });

  return nextErrors;
}

export function LoginForm({
  className,
  onSubmit,
  isSubmitting = false,
  serverError,
  ...props
}: LoginFormProps) {
  const { t } = useI18n();
  // Tạo form lưu
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof LoginFormData, boolean>>
  >({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.id as keyof LoginFormData;
    const { value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        const error = validateField(name, value, t);
        if (error) next[name] = error;
        else delete next[name];
        return next;
      });
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const name = e.target.id as keyof LoginFormData;
    const normalizedValue = e.target.value.trim();

    setTouched((prev) => ({ ...prev, [name]: true }));
    setFormData((prev) => ({ ...prev, [name]: normalizedValue }));

    setErrors((prev) => {
      const next = { ...prev };
      const error = validateField(name, normalizedValue, t);
      if (error) next[name] = error;
      else delete next[name];
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedData = normalizeLoginFormData(formData);
    const nextErrors = validateForm(normalizedData, t);

    setFormData(normalizedData);
    setErrors(nextErrors);
    setTouched({ email: true, password: true });

    if (Object.keys(nextErrors).length > 0) return;

    onSubmit?.(normalizedData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">{t("auth.loginTitle")}</h1>
          <p className="text-muted-foreground text-sm text-balance">
            {t("auth.loginDescription")}
          </p>
        </div>
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
            aria-describedby={errors.email ? "login-email-error" : undefined}
          />
          {errors.email && (
            <p id="login-email-error" className="text-sm text-destructive">
              {errors.email}
            </p>
          )}
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">{t("common.password")}</FieldLabel>
            <a
              href="/get-password"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              {t("auth.forgotPassword")}
            </a>
          </div>
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
                errors.password ? "login-password-error" : undefined
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
          {errors.password && (
            <p id="login-password-error" className="text-sm text-destructive">
              {errors.password}
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
            {isSubmitting ? t("auth.loggingIn") : t("auth.loginButton")}
          </Button>
        </Field>
        <FieldSeparator>{t("auth.orContinueWith")}</FieldSeparator>
        <Field>
          <Button variant="outline" type="button">
            {t("auth.loginWithGoogle")}
          </Button>
          <FieldDescription className="text-center">
            {t("auth.noAccount")}{" "}
            <a href="/register" className="underline underline-offset-4">
              {t("auth.registerLink")}
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
