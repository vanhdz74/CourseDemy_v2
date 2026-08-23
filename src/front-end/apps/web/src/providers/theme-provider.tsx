"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  React.useEffect(() => {
    // Khởi tạo các cấu hình tĩnh từ localStorage
    const savedFontSize = localStorage.getItem("coursedemy.font-size") || "base";
    const fontSizeMap: Record<string, string> = {
      sm: "14px",
      base: "16px",
      lg: "18px",
      xl: "20px",
    };
    if (fontSizeMap[savedFontSize]) {
      document.documentElement.style.fontSize = fontSizeMap[savedFontSize];
    }
  }, []);

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
