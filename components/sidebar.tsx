"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ChevronDown, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DocsOverviewSection, ApiEndpoint } from "@/lib/openapi";

export function Sidebar({
  className,
  overviewSections = [],
  endpoints = [],
  title = "WAYN API",
}: {
  className?: string;
  overviewSections?: DocsOverviewSection[];
  endpoints?: ApiEndpoint[];
  title?: string;
}) {
  const pathname = usePathname();

  const getMethodBadgeColor = (method: string) => {
    switch (method.toUpperCase()) {
      case "POST":
        return "text-blue-600 dark:text-blue-500";
      case "GET":
        return "text-emerald-600 dark:text-emerald-500";
      case "PUT":
        return "text-amber-600 dark:text-amber-500";
      case "DELETE":
        return "text-rose-600 dark:text-rose-500";
      default:
        return "text-slate-600 dark:text-slate-500";
    }
  };

  return (
    <aside className={cn("flex flex-col gap-6 text-sm", className)}>
      {/* JUMP TO Search Header */}
      <div className="relative flex items-center rounded-md border border-blue-500/40 bg-background px-3 py-1.5 shadow-2xs">
        <Search className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          JUMP TO
        </span>
        <kbd className="ml-auto rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
          CTRL-/
        </kbd>
      </div>

      {/* Main Navigation Sections */}
      <div className="space-y-6">
        <div>
          <div className="mb-2 flex items-center justify-between px-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <span>{title}</span>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <nav className="space-y-0.5">
            <Link
              href="/"
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-xs font-semibold transition-colors",
                pathname === "/"
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <BookOpen className="h-3.5 w-3.5" />
              Overview & Guides
            </Link>
            {overviewSections.map((section) => (
              <Link
                key={section.id}
                href={`/#${section.id}`}
                className="flex items-center justify-between rounded-md px-3 py-1.5 pl-7 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <span className="truncate">{section.title}</span>
              </Link>
            ))}
          </nav>
        </div>

        {endpoints.length > 0 && (
          <div>
            <div className="mb-2 flex items-center justify-between px-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <span>Public APIs</span>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <nav className="space-y-1">
              {endpoints.slice(0, 8).map((endpoint) => (
                <Link
                  key={`${endpoint.method}-${endpoint.path}`}
                  href="/reference"
                  className="flex items-center justify-between rounded-md px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <span className="truncate font-medium">{endpoint.summary}</span>
                  <span
                    className={cn(
                      "ml-2 shrink-0 font-mono text-[9.5px] font-bold uppercase tracking-wider transition-colors",
                      getMethodBadgeColor(endpoint.method),
                    )}
                  >
                    {endpoint.method}
                  </span>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>

      {/* Powered by readme footer */}
      <div className="mt-auto pt-6 border-t border-border/60 text-xs text-muted-foreground/80 flex items-center gap-1.5 px-2">
        <span>Powered by</span>
        <span className="font-semibold tracking-tight text-foreground/80 flex items-center gap-1">
          📖 readme
        </span>
      </div>
    </aside>
  );
}

