"use client";

import dynamic from "next/dynamic";
import { ThemeProvider } from "@/components/theme-provider";
import { ReduxProvider } from "@/redux/provider";
import { Toaster } from "sonner";
import { AuthSessionProvider } from "@/providers/auth-session-provider";

const Chatbot = dynamic(
  () => import("@/chatbot/components/Chatbot").then((mod) => mod.Chatbot),
  {
    ssr: false,
    loading: () => null,
  }
);

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthSessionProvider>
        <ReduxProvider>
          {children}
          <Chatbot />
          <Toaster richColors position="top-right" style={{ top: "70px" }} />
        </ReduxProvider>
      </AuthSessionProvider>
    </ThemeProvider>
  );
}
