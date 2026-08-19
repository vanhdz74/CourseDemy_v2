"use client";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/modules/shared/components/ui/button";
import { useI18n } from "@/modules/shared/i18n";
import { cn } from "@/modules/shared/lib/utils";

type AuthCloseButtonProps = {
  className?: string;
};

export function AuthCloseButton({ className }: AuthCloseButtonProps) {
  const router = useRouter();
  const { t } = useI18n();

  const handleClose = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push("/home");
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={cn(
        "absolute right-4 top-4 z-10 rounded-full bg-background/80 text-muted-foreground shadow-sm backdrop-blur hover:text-foreground md:right-6 md:top-6",
        className
      )}
      onClick={handleClose}
      aria-label={t("auth.close")}
    >
      <X className="size-5" />
    </Button>
  );
}
