import type { Metadata } from "next";
import "@/styles/globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { ReduxProvider } from "@/redux/provider";
import QueryProvider from "@/providers/query-provider";
import { Chatbot } from "@/chatbot/components/Chatbot";
import { Toaster } from "sonner";
import { AuthSessionProvider } from "@/providers/auth-session-provider";

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
          <AuthSessionProvider>
            <ReduxProvider>
              <QueryProvider>{children}</QueryProvider>
              <Chatbot />
              <Toaster
                richColors
                position="top-right"
                style={{ top: "70px" }}
              />
            </ReduxProvider>
          </AuthSessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
