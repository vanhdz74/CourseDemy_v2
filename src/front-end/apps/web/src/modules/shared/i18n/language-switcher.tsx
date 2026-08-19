"use client";

import { Check, Languages } from "lucide-react";

import { Button } from "@/modules/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/modules/shared/components/ui/dropdown-menu";

import { localeLabels, locales } from "./messages";
import { useI18n } from "./i18n-provider";

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          aria-label={t("language.select")}
        >
          <Languages className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="mt-[10px] min-w-40">
        {locales.map((item) => (
          <DropdownMenuItem
            key={item}
            onClick={() => setLocale(item)}
            className="justify-between"
          >
            {localeLabels[item]}
            {locale === item && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
