import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WAYN API Documentation",
  description:
    "Developer documentation for the WAYN API: authentication, verification, reach, notifications, and OpenAPI reference.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
