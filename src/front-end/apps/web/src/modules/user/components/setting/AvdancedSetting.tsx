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

export default function AdvancedSetting() {
  const [language, setLanguage] = useState("vi");
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    async function fetchAdvanced() {
      const json = await getAdvancedSettings();
      setLanguage(json.language);
      setItemsPerPage(json.itemsPerPage);
    }
    fetchAdvanced();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap size={18} /> Advanced
        </CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        <div>
          <Label className="mb-2">Language</Label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger>
              <SelectValue placeholder="Select a language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vi">Tiếng Việt</SelectItem>
              <SelectItem value="en" disabled>
                English
              </SelectItem>
              <SelectItem value="jp" disabled>
                日本語
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="mb-2">Items per page</Label>
          <input
            type="range"
            min={5}
            max={50}
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
          />
          <div className="text-sm text-muted-foreground">
            {itemsPerPage} items per page
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
