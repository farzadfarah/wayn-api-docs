"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  BookOpen,
  Layers,
  Search,
  ChevronDown,
  KeyRound,
  History,
  Rocket,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ApiMetadata, ApiEndpoint } from "@/lib/openapi";

const methodColors: Record<string, { bg: string; text: string; border: string }> = {
  GET: {
    bg: "bg-emerald-500/10 dark:bg-emerald-500/20",
    text: "text-emerald-600 dark:text-emerald-500",
    border: "border-emerald-500/30",
  },
  POST: {
    bg: "bg-blue-500/10 dark:bg-blue-500/20",
    text: "text-blue-600 dark:text-blue-500",
    border: "border-blue-500/30",
  },
  PUT: {
    bg: "bg-amber-500/10 dark:bg-amber-500/20",
    text: "text-amber-600 dark:text-amber-500",
    border: "border-amber-500/30",
  },
  DELETE: {
    bg: "bg-rose-500/10 dark:bg-rose-500/20",
    text: "text-rose-600 dark:text-rose-500",
    border: "border-rose-500/30",
  },
  PATCH: {
    bg: "bg-purple-500/10 dark:bg-purple-500/20",
    text: "text-purple-600 dark:text-purple-500",
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLandingPage = pathname === "/";
  const activeDocId = api.docId;
  const activeEndpoint = searchParams.get("endpoint");
  const docQuery = `?doc=${activeDocId}`;
  const mainLogoUrl = "https://stapps.blob.core.windows.net/cn-epgcms-stg/assets/logo_trademark_72e0639f5d.svg";

  useEffect(() => {
    document.documentElement.classList.add("docs-shell-lock-scroll");
    document.body.classList.add("docs-shell-lock-scroll");
    window.scrollTo(0, 0);

    const sidebar = document.getElementById("layout-sidebar");
    const handleNativeSidebarWheel = (event: WheelEvent) => {
      const nav = sidebar?.querySelector("nav");
      if (!sidebar?.contains(event.target as Node) || !nav) return;

      nav.scrollTop += event.deltaY;
      event.preventDefault();
      event.stopPropagation();
      window.scrollTo(0, 0);
    };

    sidebar?.addEventListener("wheel", handleNativeSidebarWheel, { passive: false });

    return () => {
      sidebar?.removeEventListener("wheel", handleNativeSidebarWheel);
      document.documentElement.classList.remove("docs-shell-lock-scroll");
      document.body.classList.remove("docs-shell-lock-scroll");
    };
  }, []);

  const handleDocChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    if (selectedId === "hub") {
      router.push("/");
    } else {
      router.push(`${pathname === "/" ? "/docs/overview" : pathname}?doc=${selectedId}`);
    }
  };

  const handleSidebarWheel = (event: React.WheelEvent<HTMLElement>) => {
    const nav = event.currentTarget.querySelector("nav");
    if (!nav) return;

    nav.scrollTop += event.deltaY;
    event.preventDefault();
    event.stopPropagation();
    window.scrollTo(0, 0);
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

  const activeEpObj = useMemo(() => {
    if (!activeEndpoint) return null;
    try {
      const decoded = decodeURIComponent(activeEndpoint);
      const [method, ...pathParts] = decoded.split("::");
      const path = pathParts.join("::");
      const normMethod = (method || "").toUpperCase();
      const normPath = (path || "").toLowerCase().replace(/\/$/, "");
      return api.endpoints.find(
        (ep) =>
          ep.method.toUpperCase() === normMethod &&
          ep.path.toLowerCase().replace(/\/$/, "") === normPath,
      );
    } catch {
      return null;
    }
  }, [activeEndpoint, api.endpoints]);

  const guideLinks = [
    { label: "Overview", href: `/docs/overview${docQuery}`, icon: BookOpen },
    { label: "Quick Start", href: `/docs/getting-started${docQuery}`, icon: Rocket },
    { label: "Authentication", href: `/docs/authentication${docQuery}`, icon: KeyRound },
    { label: "Changelog", href: `/changelog${docQuery}`, icon: History },
  ];

  const renderSidebarContent = (onItemClick?: () => void) => (
    <>
      {/* Sidebar Header: Branding & Doc Selector */}
      <div className="p-4 border-b border-border/60 space-y-3">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            onClick={onItemClick}
            className="flex items-center gap-2 font-bold text-lg hover:opacity-90 transition-opacity"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={mainLogoUrl} alt="7x" className="h-6 w-auto object-contain bg-foreground/10 p-1 rounded" />
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              Docs
            </span>
          </Link>
          {onItemClick && (
            <button
              type="button"
              onClick={onItemClick}
              className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/60 md:hidden"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {api.docList.length > 0 && (
          <div className="relative flex items-center">
            <select
              value={activeDocId}
              onChange={(e) => {
                handleDocChange(e);
                onItemClick?.();
              }}
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
      <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-4 space-y-6 text-xs">
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
                onClick={onItemClick}
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
              onClick={onItemClick}
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
              <p className="px-2 pt-3 pb-1 text-xs font-semibold text-foreground/90">
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
                    onClick={onItemClick}
                    className={cn(
                      "flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-xs transition-all duration-150 border",
                      isSelected
                        ? "bg-card border-primary/50 text-foreground font-medium shadow-xs ring-1 ring-primary/30"
                        : "border-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                    )}
                  >
                    <span className="truncate flex-1 text-[11.5px]">
                      {ep.summary.toLowerCase().startsWith(ep.method.toLowerCase() + " ")
                        ? ep.summary.slice(ep.method.length + 1)
                        : ep.summary}
                    </span>
                    <span
                      className={cn(
                        "text-[11px] font-bold uppercase tracking-wider shrink-0 font-mono transition-colors",
                        color.text,
                      )}
                    >
                      {ep.method}
                    </span>
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="mt-auto shrink-0 p-3 border-t border-border/60 flex items-center justify-between bg-muted/30">
        <Link
          href="/"
          onClick={onItemClick}
          className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <Layers className="h-3.5 w-3.5" />
          Doc Hub
        </Link>
      </div>
    </>
  );

  return (
    <div className="flex h-dvh min-h-dvh overflow-hidden bg-background text-foreground antialiased">
      {/* Desktop Left Fixed Sidebar */}
      {!isLandingPage && (
        <aside
          id="layout-sidebar"
          className="w-64 lg:w-72 shrink-0 border-r border-border/70 bg-card flex-col h-dvh min-h-dvh sticky top-0 z-30 overflow-hidden"
          onWheel={handleSidebarWheel}
        >
          {renderSidebarContent()}
        </aside>
      )}

      {/* Mobile Drawer / Sheet */}
      {!isLandingPage && mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Slide-out Sidebar Panel */}
          <aside className="relative flex w-80 max-w-[85vw] flex-col bg-card border-r border-border shadow-2xl h-full z-10 animate-in slide-in-from-left duration-200">
            {renderSidebarContent(() => setMobileMenuOpen(false))}
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-dvh overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-14 shrink-0 border-b border-border/60 bg-card/40 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between z-20">
          <div className="flex items-center gap-3 min-w-0">
            <Link 
              href={!isLandingPage ? `/docs/overview?doc=${api.docId}` : "/"} 
              className="flex items-center gap-2 font-bold text-base hover:opacity-90 transition-opacity shrink-0"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={(!isLandingPage && api.logoUrl) ? api.logoUrl : mainLogoUrl} 
                alt={(!isLandingPage && api.title) ? api.title : "7x"} 
                className="h-6 w-auto object-contain bg-foreground/10 p-1 rounded" 
              />
            </Link>
            {!isLandingPage && (
              <>
                <span className="text-muted-foreground/40 font-light text-xs hidden sm:inline">/</span>
                <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-muted-foreground flex-wrap">
                  <span className="text-foreground font-semibold">{api.title}</span>
                  {pathname === "/reference" ? (
                    activeEndpoint ? (
                      <>
                        <span className="text-muted-foreground/40 font-light">/</span>
                        <span className="text-primary font-medium">{activeEpObj?.tag || "Operations"}</span>
                        <span className="text-muted-foreground/40 font-light">/</span>
                        <span className="font-mono text-foreground font-semibold bg-muted/60 px-2 py-0.5 rounded border border-border">
                          {activeEpObj?.path || activeEndpoint.split("::")[1]}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-muted-foreground/40 font-light">/</span>
                        <span className="text-foreground font-medium">API Reference</span>
                      </>
                    )
                  ) : (
                    <>
                      <span className="text-muted-foreground/40 font-light">/</span>
                      <span className="capitalize text-foreground font-medium">
                        {pathname.split("/").pop()?.replace("-", " ") || "Docs"}
                      </span>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {!isLandingPage && (
              <span className="font-mono text-xs px-2 py-0.5 rounded border border-primary/30 bg-primary/10 text-primary font-semibold hidden sm:inline-block">
                {api.version || "v1"}
              </span>
            )}
            {!isLandingPage && (
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/60 transition-colors"
                aria-label="Toggle navigation menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            )}
          </div>
        </header>

        {/* Main Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10">
          <div className={cn("w-full space-y-6", pathname !== "/reference" && "mx-auto max-w-5xl")}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
