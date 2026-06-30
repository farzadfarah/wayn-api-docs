"use client";

import { RootProvider } from "fumadocs-ui/provider/next";
import type { ReactNode } from "react";

export function Provider({ children }: { children: ReactNode }) {
  return (
    <RootProvider
      search={{
        enabled: true,
      }}
      theme={{
        attribute: "class",
        defaultTheme: "dark",
        forcedTheme: "dark",
        enableSystem: false,
        disableTransitionOnChange: true,
      }}
    >
      {children}
    </RootProvider>
  );
}
