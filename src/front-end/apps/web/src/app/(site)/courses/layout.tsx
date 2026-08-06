"use client";

import { ReactNode } from "react";

export default function layout({ children }: { children: ReactNode }) {
  return (
    <div className="py-[var(--paddingBody)] min-h-[calc(100vh)]">
      {children}
    </div>
  );
}
