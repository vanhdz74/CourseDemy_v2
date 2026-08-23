"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/modules/shared/components/ui/card";
import { Label } from "@/modules/shared/components/ui/label";
import { Switch } from "@/modules/shared/components/ui/switch";
import { Sun, Monitor, Moon, Type } from "lucide-react";
import { useTheme } from "next-themes";
import { useI18n } from "@/modules/shared/i18n";
import { cn } from "@/modules/shared/lib/utils";

const fontSizes = [
  { key: "sm", labelKey: "settings.fontSizeSm" },
  { key: "base", labelKey: "settings.fontSizeBase" },
  { key: "lg", labelKey: "settings.fontSizeLg" },
  { key: "xl", labelKey: "settings.fontSizeXl" },
];

export default function AppearanceSetting() {
  const { t } = useI18n();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [fontSize, setFontSize] = useState("base");

  useEffect(() => {
    setMounted(true);
    
    // Tải cấu hình tĩnh từ localStorage
    const savedAutoplay = localStorage.getItem("coursedemy.autoplay") === "true";
    const savedFontSize = localStorage.getItem("coursedemy.font-size") || "base";
    
    setAutoPlay(savedAutoplay);
    setFontSize(savedFontSize);
  }, []);

  const handleAutoplayChange = (checked: boolean) => {
    setAutoPlay(checked);
    localStorage.setItem("coursedemy.autoplay", JSON.stringify(checked));
  };

  const handleFontSizeChange = (size: string) => {
    setFontSize(size);
    localStorage.setItem("coursedemy.font-size", size);
    
    const fontSizeMap: Record<string, string> = {
      sm: "14px",
      base: "16px",
      lg: "18px",
      xl: "20px",
    };
    if (fontSizeMap[size]) {
      document.documentElement.style.fontSize = fontSizeMap[size];
    }
  };

  if (!mounted) return null;

  return (
    <Card className="border-border/80 bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Sun className="h-5 w-5 text-primary" /> {t("settings.appearance")}
        </CardTitle>
        <CardDescription>
          Tùy chỉnh chủ đề giao diện, cỡ chữ hiển thị và hành vi trình duyệt.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Chủ đề giao diện */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-foreground">{t("settings.theme")}</Label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { mode: "light", icon: Sun },
              { mode: "dark", icon: Moon },
              { mode: "system", icon: Monitor },
            ].map(({ mode, icon: Icon }) => {
              const isActive = theme === mode;

              return (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setTheme(mode)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-3.5 rounded-xl border text-sm font-medium transition-all duration-300 active:scale-95",
                    isActive
                      ? "border-primary bg-primary/5 text-primary ring-2 ring-primary/20"
                      : "border-border bg-background/50 text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <Icon className="h-4.5 w-4.5" />
                  <span>{t(`theme.${mode}`)}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Cỡ chữ hiển thị (Cài đặt tĩnh) */}
        <div className="space-y-3 pt-4 border-t border-border/40">
          <div>
            <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Type className="h-4.5 w-4.5 text-primary" />
              {t("settings.fontSize")}
            </Label>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t("settings.fontSizeDesc")}
            </p>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {fontSizes.map(({ key, labelKey }) => {
              const isActive = fontSize === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleFontSizeChange(key)}
                  className={cn(
                    "p-2.5 rounded-xl border text-xs font-semibold tracking-wide transition-all duration-300 active:scale-95",
                    isActive
                      ? "border-primary bg-primary/5 text-primary ring-2 ring-primary/20"
                      : "border-border bg-background/50 text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  {t(labelKey)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tự phát Video Preview */}
        <div className="flex items-center justify-between pt-4 border-t border-border/40">
          <div className="space-y-1">
            <Label className="text-sm font-semibold text-foreground">
              {t("settings.autoplayPreviews")}
            </Label>
            <div className="text-xs text-muted-foreground max-w-md">
              {t("settings.autoplayPreviewsDescription")}
            </div>
          </div>
          <Switch
            checked={autoPlay}
            onCheckedChange={handleAutoplayChange}
            className="data-[state=checked]:bg-primary"
          />
        </div>
      </CardContent>
    </Card>
  );
}
