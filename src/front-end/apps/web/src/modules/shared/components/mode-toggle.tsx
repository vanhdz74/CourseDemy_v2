"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/modules/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/modules/shared/components/ui/dropdown-menu";
import { useI18n } from "@/modules/shared/i18n";

export function ModeToggle() {
  const { setTheme } = useTheme();
  const { t } = useI18n();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="h-10 w-10 rounded-full border border-border/80 bg-background/40 text-muted-foreground shadow-sm transition-all duration-300 hover:scale-105 hover:bg-accent/80 hover:text-foreground hover:border-primary/30 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45">
          <Sun className="h-[1.1rem] w-[1.1rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.1rem] w-[1.1rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">{t("theme.toggle")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="mt-[10px]">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          {t("theme.light")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          {t("theme.dark")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          {t("theme.system")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
