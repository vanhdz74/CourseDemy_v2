import type { Metadata } from "next";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { ReduxProvider } from "@/redux/provider";
import { Chatbot } from "@/chatbot/components/Chatbot";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  icons: [
    { rel: "icon", url: "/logo/favicon.png" },
    { rel: "shortcut icon", url: "/t2tLogo.png" },
  ],
  title: "CourseDemy",
  description: "Bán khoá học lập trình - UI",
};

// Rootlayout
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ReduxProvider>
            {children}
            <Chatbot />
            <Toaster richColors position="top-right" style={{ top: "70px" }} />
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
