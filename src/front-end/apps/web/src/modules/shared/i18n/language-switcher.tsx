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
          className="h-10 w-10 rounded-full border border-border/80 bg-background/40 text-muted-foreground shadow-sm transition-all duration-300 hover:scale-105 hover:bg-accent/80 hover:text-foreground hover:border-primary/30 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45"
          aria-label={t("language.select")}
        >
          <Languages className="h-[1.1rem] w-[1.1rem]" />
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
