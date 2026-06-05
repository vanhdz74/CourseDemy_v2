"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Sun } from "lucide-react";
import { getAppearanceSettings } from "@/services/settings";

export default function AppearanceSetting() {
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
          <Sun size={18} /> Appearance
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <div>
          <Label>Theme</Label>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {["light", "dark", "system"].map((m) => (
              <button
                key={m}
                onClick={() => setAppearance(m)}
                className={`p-3 rounded-lg border ${
                  appearance === m ? "ring-2 ring-indigo-300" : ""
                }`}
              >
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label>Auto-play previews</Label>
          <div className="flex items-center justify-between mt-2">
            <div className="text-sm text-muted-foreground">
              Tự phát video/preview khi cuộn
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
