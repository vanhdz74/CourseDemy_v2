import type { Metadata } from "next";
import "@/styles/globals.css";

import { ThemeProvider } from "@/providers/theme-provider";
import { ReduxProvider } from "@/modules/shared/store/provider";
import QueryProvider from "@/providers/query-provider";
import { Chatbot } from "@/modules/chatbot/components/Chatbot";
import { Toaster } from "sonner";
import { AuthSessionProvider } from "@/providers/auth-session-provider";
import { ApiClientProvider } from "@/providers/api-client-provider";
import { I18nProvider } from "@/modules/shared/i18n";

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
          <I18nProvider>
            <AuthSessionProvider>
              <ApiClientProvider>
                <ReduxProvider>
                  <QueryProvider>{children}</QueryProvider>

                  {/* Chat bot */}
                  <Chatbot />

                  {/* Toast */}
                  <Toaster
                    richColors
                    position="top-right"
                    style={{ top: "70px" }}
                  />
                </ReduxProvider>
              </ApiClientProvider>
            </AuthSessionProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
