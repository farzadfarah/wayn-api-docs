import type { Metadata } from "next";
import { Provider } from "@/app/provider";
import "./globals.css";
import "fumadocs-ui/style.css";

export const metadata: Metadata = {
  title: "7x Developer Portal & API Documentation",
  description:
    "Developer documentation and API specifications powered by 7x.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
