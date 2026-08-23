"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/modules/shared/components/ui/card";
import { Label } from "@/modules/shared/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/modules/shared/components/ui/select";
import { Zap } from "lucide-react";
import { useI18n, type Locale } from "@/modules/shared/i18n";

export default function AdvancedSetting() {
  const { locale, setLocale, t } = useI18n();
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Tải cấu hình tĩnh từ localStorage thay vì gọi API lỗi
    const savedItemsPerPage = Number(localStorage.getItem("coursedemy.items-per-page")) || 10;
    setItemsPerPage(savedItemsPerPage);
  }, []);

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setItemsPerPage(value);
    localStorage.setItem("coursedemy.items-per-page", String(value));
  };

  if (!mounted) return null;

  return (
    <Card className="border-border/80 bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Zap className="h-5 w-5 text-primary" /> {t("settings.advanced")}
        </CardTitle>
        <CardDescription>
          Cấu hình nâng cao cho nhà phát triển, ngôn ngữ hiển thị và bộ lọc danh sách.
        </CardDescription>
      </CardHeader>

      <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2 md:items-start pt-2">
        {/* Ngôn ngữ hiển thị */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-foreground">{t("language.label")}</Label>
          <Select
            value={locale}
            onValueChange={(value) => setLocale(value as Locale)}
          >
            <SelectTrigger className="w-full bg-background border-border">
              <SelectValue placeholder={t("settings.selectLanguage")} />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="vi">{t("language.vietnamese")}</SelectItem>
              <SelectItem value="en">{t("language.english")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Số mục hiển thị mỗi trang */}
        <div className="space-y-3.5">
          <div className="flex justify-between items-center">
            <Label className="text-sm font-semibold text-foreground">{t("settings.itemsPerPage")}</Label>
            <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              {itemsPerPage}
            </span>
          </div>
          <input
            type="range"
            min={5}
            max={50}
            step={5}
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none focus:ring-2 focus:ring-primary/45 my-1"
          />
          <div className="text-[11px] text-muted-foreground leading-normal">
            {t("settings.itemsPerPageValue", { count: itemsPerPage })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
