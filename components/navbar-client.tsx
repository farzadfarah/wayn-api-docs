"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Code2, BookOpen, MessageSquare } from "lucide-react";
import { MobileNav } from "@/components/mobile-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import type { DocsOverviewSection, ApiEndpoint } from "@/lib/openapi";

export function NavbarClient({
  title,
  version,
  logoUrl,
  overviewSections = [],
  endpoints = [],
}: {
  title: string;
  version: string;
  logoUrl?: string;
  overviewSections?: DocsOverviewSection[];
  endpoints?: ApiEndpoint[];
}) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 bg-blue-600 dark:bg-slate-900 border-b border-blue-700 dark:border-slate-800 text-white shadow-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <MobileNav title={title} />
        
        <Link href="/" className="flex shrink-0 items-center gap-2.5 font-bold text-white">
          {logoUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={logoUrl} alt={title} className="h-7 w-auto object-contain bg-white/10 p-1 rounded" />
          ) : (
            <span className="grid h-7 w-7 place-items-center rounded bg-white/20 font-mono text-xs font-black tracking-wider text-white">
              AYN
            </span>
          )}
          <span className="truncate text-base font-bold tracking-tight">{title}</span>
        </Link>

        <span className="hidden rounded bg-white/20 px-2 py-0.5 font-mono text-xs font-medium text-white/90 sm:inline-block">
          {version}
        </span>

        <nav className="hidden items-center gap-1.5 md:flex ml-2">
          <Link
            href="/"
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors",
              pathname === "/" || pathname.startsWith("/docs")
                ? "bg-white/20 text-white shadow-xs"
                : "text-white/80 hover:bg-white/10 hover:text-white",
            )}
          >
            <BookOpen className="h-3.5 w-3.5" />
            Guides
          </Link>
          <Link
            href="/reference"
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors",
              pathname === "/reference"
                ? "bg-white/20 text-white shadow-xs"
                : "text-white/80 hover:bg-white/10 hover:text-white",
            )}
          >
            <Code2 className="h-3.5 w-3.5" />
            &lt;&gt; API Reference
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <div className="text-white">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
