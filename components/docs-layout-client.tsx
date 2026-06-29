"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  BookOpen,
  Code2,
  FileText,
  Layers,
  Search,
  ChevronDown,
  Sparkles,
  KeyRound,
  History,
  Rocket,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import type { ApiMetadata, ApiEndpoint } from "@/lib/openapi";

const methodColors: Record<string, { bg: string; text: string; border: string }> = {
  GET: {
    bg: "bg-emerald-500/10 dark:bg-emerald-500/20",
    text: "text-emerald-700 dark:text-emerald-400",
    border: "border-emerald-500/30",
  },
  POST: {
    bg: "bg-blue-500/10 dark:bg-blue-500/20",
    text: "text-blue-700 dark:text-blue-400",
    border: "border-blue-500/30",
  },
  PUT: {
    bg: "bg-amber-500/10 dark:bg-amber-500/20",
    text: "text-amber-700 dark:text-amber-400",
    border: "border-amber-500/30",
  },
  DELETE: {
    bg: "bg-rose-500/10 dark:bg-rose-500/20",
    text: "text-rose-700 dark:text-rose-400",
    border: "border-rose-500/30",
  },
  PATCH: {
    bg: "bg-purple-500/10 dark:bg-purple-500/20",
    text: "text-purple-700 dark:text-purple-400",
    border: "border-purple-500/30",
  },
};

export function DocsLayoutClient({
  api,
  children,
}: {
  api: ApiMetadata;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");

  const isLandingPage = pathname === "/";
  const activeDocId = api.docId;
  const activeEndpoint = searchParams.get("endpoint");
  const docQuery = `?doc=${activeDocId}`;
  const mainLogoUrl = "https://stapps.blob.core.windows.net/cn-epgcms-stg/assets/logo_trademark_72e0639f5d.svg";

  const handleDocChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    if (selectedId === "hub") {
      router.push("/");
    } else {
      router.push(`${pathname === "/" ? "/docs/overview" : pathname}?doc=${selectedId}`);
    }
  };

  const filteredEndpoints = useMemo(() => {
    if (!searchQuery.trim()) return api.endpoints;
    const q = searchQuery.toLowerCase();
    return api.endpoints.filter(
      (ep) =>
        ep.summary.toLowerCase().includes(q) ||
        ep.path.toLowerCase().includes(q) ||
        ep.method.toLowerCase().includes(q) ||
        (ep.tag && ep.tag.toLowerCase().includes(q)),
    );
  }, [api.endpoints, searchQuery]);

  const groupedEndpoints = useMemo(() => {
    const map: Record<string, ApiEndpoint[]> = {};
    for (const ep of filteredEndpoints) {
      const tag = ep.tag || "General Operations";
      if (!map[tag]) map[tag] = [];
      map[tag].push(ep);
    }
    return map;
  }, [filteredEndpoints]);

  const guideLinks = [
    { label: "Overview", href: `/docs/overview${docQuery}`, icon: BookOpen },
    { label: "Quick Start", href: `/docs/getting-started${docQuery}`, icon: Rocket },
    { label: "Authentication", href: `/docs/authentication${docQuery}`, icon: KeyRound },
    { label: "Changelog", href: `/changelog${docQuery}`, icon: History },
  ];

  return (
    <div className="flex min-h-screen bg-background text-foreground antialiased">
      {/* Left Fixed Sidebar - Fumadocs Style (Only show when inside documentation pages) */}
      {!isLandingPage && (
        <aside className="w-64 lg:w-72 shrink-0 border-r border-border/70 bg-card/60 backdrop-blur-md flex flex-col h-screen sticky top-0 z-30">
          {/* Sidebar Header: Branding & Doc Selector */}
          <div className="p-4 border-b border-border/60 space-y-3">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2 font-bold text-lg hover:opacity-90 transition-opacity">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={mainLogoUrl} alt="7x" className="h-6 w-auto object-contain bg-foreground/10 p-1 rounded" />
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  Docs
                </span>
              </Link>
            </div>

            {api.docList.length > 0 && (
              <div className="relative flex items-center">
                <select
                  value={activeDocId}
                  onChange={handleDocChange}
                  className="w-full appearance-none bg-muted/60 hover:bg-muted text-foreground text-xs font-semibold py-2 pl-3 pr-8 rounded-lg cursor-pointer border border-border focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors"
                >
                  <option value="hub">📋 Document Hub</option>
                  <optgroup label="API Specifications">
                    {api.docList.map((doc) => (
                      <option key={doc.id} value={doc.id}>
                        {doc.title}
                      </option>
                    ))}
                  </optgroup>
                </select>
                <ChevronDown className="absolute right-2.5 h-3.5 w-3.5 pointer-events-none text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Search Bar */}
          <div className="px-4 py-3 border-b border-border/40">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Filter endpoints..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-md border border-border/80 bg-background/80 pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {/* Navigation Content */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6 text-xs">
            {/* Guides Section */}
            <div className="space-y-1">
              <p className="px-2 pb-1 text-[11px] font-bold text-muted-foreground/70 uppercase tracking-wider">
                Guides & Documentation
              </p>
              {guideLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href.split("?")[0];
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg px-2.5 py-2 font-medium transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary font-semibold border border-primary/20"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Endpoints Section */}
            <div className="space-y-3 pt-2 border-t border-border/40">
              <div className="flex items-center justify-between px-2">
                <p className="text-[11px] font-bold text-muted-foreground/70 uppercase tracking-wider">
                  API Operations
                </p>
                <Link
                  href={`/reference${docQuery}`}
                  className={cn(
                    "text-[10px] font-medium px-1.5 py-0.5 rounded transition-colors",
                    pathname === "/reference" && !activeEndpoint
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground bg-muted",
                  )}
                >
                  All Operations
                </Link>
              </div>

              {Object.entries(groupedEndpoints).map(([tagGroup, epList]) => (
                <div key={tagGroup} className="space-y-1">
                  <p className="px-2 pt-2 text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider">
                    {tagGroup}
                  </p>
                  {epList.map((ep) => {
                    const epKey = `${ep.method}::${ep.path}`;
                    const isSelected = pathname === "/reference" && activeEndpoint === epKey;
                    const href = `/reference${docQuery}&endpoint=${encodeURIComponent(epKey)}`;
                    const color = methodColors[ep.method] || {
                      bg: "bg-muted",
                      text: "text-foreground",
                      border: "border-border",
                    };

                    return (
                      <Link
                        key={epKey}
                        href={href}
                        className={cn(
                          "flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs transition-all duration-150 border",
                          isSelected
                            ? "bg-card border-primary/50 text-foreground font-medium shadow-xs ring-1 ring-primary/30"
                            : "border-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                        )}
                      >
                        <span
                          className={cn(
                            "px-1.5 py-0.5 rounded text-[9px] font-mono font-bold border shrink-0",
                            color.bg,
                            color.text,
                            color.border,
                          )}
                        >
                          {ep.method}
                        </span>
                        <span className="truncate flex-1 text-[11.5px]">{ep.summary}</span>
                      </Link>
                    );
                  })}
                </div>
              ))}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-3 border-t border-border/60 flex items-center justify-between bg-muted/30">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              <Layers className="h-3.5 w-3.5" />
              Doc Hub
            </Link>
            <ThemeToggle />
          </div>
        </aside>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-14 shrink-0 border-b border-border/60 bg-card/40 backdrop-blur-md px-6 flex items-center justify-between z-20">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 font-bold text-base hover:opacity-90 transition-opacity">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={mainLogoUrl} alt="7x" className="h-6 w-auto object-contain bg-foreground/10 p-1 rounded" />
            </Link>
            {!isLandingPage && (
              <>
                <span className="text-muted-foreground/40 font-light text-xs">/</span>
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <span className="text-foreground font-semibold">{api.title}</span>
                  <span>/</span>
                  <span className="capitalize">
                    {pathname === "/reference"
                      ? activeEndpoint
                        ? activeEndpoint.split("::")[1] || "Reference"
                        : "API Reference"
                      : pathname.split("/").pop()?.replace("-", " ") || "Docs"}
                  </span>
                </div>
              </>
            )}
          </div>
          <div className="flex items-center gap-3">
            {!isLandingPage && (
              <span className="font-mono text-xs px-2 py-0.5 rounded border border-primary/30 bg-primary/10 text-primary font-semibold">
                {api.version || "v1"}
              </span>
            )}
            <ThemeToggle />
          </div>
        </header>

        {/* Main Body */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className={cn("w-full space-y-6", pathname !== "/reference" && "mx-auto max-w-5xl")}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
