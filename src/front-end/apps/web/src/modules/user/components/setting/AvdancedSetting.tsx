"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/modules/shared/components/ui/card";
import { Label } from "@/modules/shared/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/modules/shared/components/ui/select";
import { Zap } from "lucide-react";
import { getAdvancedSettings } from "@repo/api";
import { useI18n, type Locale } from "@/modules/shared/i18n";

export default function AdvancedSetting() {
  const { locale, setLocale, t } = useI18n();
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    async function fetchAdvanced() {
      const json = await getAdvancedSettings();
      setItemsPerPage(json.itemsPerPage);
    }
    fetchAdvanced();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap size={18} /> {t("settings.advanced")}
        </CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        <div>
          <Label className="mb-2">{t("language.label")}</Label>
          <Select
            value={locale}
            onValueChange={(value) => setLocale(value as Locale)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("settings.selectLanguage")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vi">{t("language.vietnamese")}</SelectItem>
              <SelectItem value="en">{t("language.english")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="mb-2">{t("settings.itemsPerPage")}</Label>
          <input
            type="range"
            min={5}
            max={50}
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
          />
          <div className="text-sm text-muted-foreground">
            {t("settings.itemsPerPageValue", { count: itemsPerPage })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
