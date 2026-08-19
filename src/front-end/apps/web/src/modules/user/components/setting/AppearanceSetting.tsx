"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/modules/shared/components/ui/card";
import { Label } from "@/modules/shared/components/ui/label";
import { Switch } from "@/modules/shared/components/ui/switch";
import { Sun } from "lucide-react";
import { getAppearanceSettings } from "@repo/api";
import { useI18n } from "@/modules/shared/i18n";

export default function AppearanceSetting() {
  const { t } = useI18n();
  const [appearance, setAppearance] = useState("system");
  const [autoPlay, setAutoPlay] = useState(false);

  useEffect(() => {
    async function fetchAppearance() {
      const json = await getAppearanceSettings();
      setAppearance(json.appearance);
      setAutoPlay(json.autoPlay);
    }
    fetchAppearance();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sun size={18} /> {t("settings.appearance")}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <div>
          <Label>{t("settings.theme")}</Label>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {["light", "dark", "system"].map((m) => (
              <button
                key={m}
                onClick={() => setAppearance(m)}
                className={`p-3 rounded-lg border ${
                  appearance === m ? "ring-2 ring-indigo-300" : ""
                }`}
              >
                {t(`theme.${m}`)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label>{t("settings.autoplayPreviews")}</Label>
          <div className="flex items-center justify-between mt-2">
            <div className="text-sm text-muted-foreground">
              {t("settings.autoplayPreviewsDescription")}
            </div>
            <Switch
              checked={autoPlay}
              onCheckedChange={(val) => setAutoPlay(Boolean(val))}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
