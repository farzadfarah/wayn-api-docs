"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  BookOpen,
  Code2,
  FileText,
  Search,
  Zap,
  ArrowRight,
  Layers,
  Globe,
  Shield,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type DocItemWithMetadata = {
  id: string;
  title: string;
  description: string;
  url: string;
  category?: string;
  logoUrl?: string;
  metadata: {
    version: string;
    endpoints: any[];
    tags: string[];
    shortDescription: string;
  };
};

type LandingPageClientProps = {
  initialCategories: Array<{
    category: string;
    items: DocItemWithMetadata[];
  }>;
};

/* ------------------------------------------------------------------ */
/*  Category icon mapping                                              */
/* ------------------------------------------------------------------ */
const categoryIcons: Record<string, React.ElementType> = {
  default: Layers,
};

function getCategoryIcon(category: string) {
  return categoryIcons[category] ?? categoryIcons.default;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export function LandingPageClient({ initialCategories }: LandingPageClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const totalSpecsCount = initialCategories.reduce(
    (acc, cat) => acc + cat.items.length,
    0,
  );

  const totalEndpoints = initialCategories.reduce(
    (acc, cat) =>
      acc + cat.items.reduce((a, item) => a + item.metadata.endpoints.length, 0),
    0,
  );

  /* Filter by category then by search query */
  const filteredCategories = useMemo(() => {
    const byCategory =
      selectedCategory === "all"
        ? initialCategories
        : initialCategories.filter((cat) => cat.category === selectedCategory);

    if (!searchQuery.trim()) return byCategory;

    const q = searchQuery.toLowerCase();
    return byCategory
      .map((cat) => ({
        ...cat,
        items: cat.items.filter(
          (item) =>
            item.title.toLowerCase().includes(q) ||
            (item.description || item.metadata.shortDescription)
              .toLowerCase()
              .includes(q) ||
            item.metadata.tags.some((t) => t.toLowerCase().includes(q)),
        ),
      }))
      .filter((cat) => cat.items.length > 0);
  }, [initialCategories, selectedCategory, searchQuery]);

  return (
    <div className="space-y-10">
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-card via-card to-secondary/30 px-8 py-10 md:px-12 md:py-14">
        {/* Decorative gradient orbs */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/[0.07] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-primary/[0.05] blur-3xl" />

        <div className="relative z-10 max-w-2xl space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.08] px-3.5 py-1 text-xs font-semibold text-primary">
            <Zap className="h-3 w-3" />
            Developer Portal
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            7x API Documentation{" "}
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              Hub
            </span>
          </h1>

          <p className="max-w-lg text-sm leading-relaxed text-muted-foreground md:text-base">
            Explore interactive API references, integration guides, and code
            examples — everything you need to build on our platform.
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap gap-6 pt-2">
            {[
              { icon: FileText, label: "API Specs", value: totalSpecsCount },
              { icon: Code2, label: "Endpoints", value: totalEndpoints },
              {
                icon: Layers,
                label: "Categories",
                value: initialCategories.length,
              },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-2.5">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-lg font-bold leading-none text-foreground">
                    {value}
                  </p>
                  <p className="text-[11px] text-muted-foreground">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Search + Filters ─────────────────────────────────────── */}
      <div className="space-y-5">
        {/* Search bar */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
          <input
            type="text"
            placeholder="Search APIs by name, tag, or description…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-border/70 bg-card/60 py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none ring-0 transition-all duration-200 focus:border-primary/50 focus:bg-card focus:ring-2 focus:ring-primary/15"
          />
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2">
          {/* All */}
          <button
            onClick={() => setSelectedCategory("all")}
            className={cn(
              "group inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-xs font-semibold transition-all duration-200 cursor-pointer",
              selectedCategory === "all"
                ? "border-primary/40 bg-primary/10 text-primary shadow-sm shadow-primary/10 ring-1 ring-primary/20"
                : "border-border/60 bg-card/50 text-muted-foreground hover:border-primary/30 hover:bg-card/80 hover:text-foreground",
            )}
          >
            <Globe className="h-3.5 w-3.5" />
            All
            <Badge
              className={cn(
                "ml-0.5 font-mono text-[10px] px-1.5 py-0 border",
                selectedCategory === "all"
                  ? "border-primary/30 bg-primary/20 text-primary"
                  : "border-border/60 bg-muted/30 text-muted-foreground",
              )}
            >
              {totalSpecsCount}
            </Badge>
          </button>

          {initialCategories.map(({ category, items }) => {
            const Icon = getCategoryIcon(category);
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  "group inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-xs font-semibold transition-all duration-200 cursor-pointer",
                  selectedCategory === category
                    ? "border-primary/40 bg-primary/10 text-primary shadow-sm shadow-primary/10 ring-1 ring-primary/20"
                    : "border-border/60 bg-card/50 text-muted-foreground hover:border-primary/30 hover:bg-card/80 hover:text-foreground",
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {category}
                <Badge
                  className={cn(
                    "ml-0.5 font-mono text-[10px] px-1.5 py-0 border",
                    selectedCategory === category
                      ? "border-primary/30 bg-primary/20 text-primary"
                      : "border-border/60 bg-muted/30 text-muted-foreground",
                  )}
                >
                  {items.length}
                </Badge>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Category Sections ────────────────────────────────────── */}
      <div className="space-y-14">
        {filteredCategories.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-16 text-center text-muted-foreground">
            <Search className="h-8 w-8 opacity-40" />
            <p className="text-sm">
              No APIs match{" "}
              <span className="font-semibold text-foreground">
                &ldquo;{searchQuery}&rdquo;
              </span>
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="mt-1 text-xs font-medium text-primary hover:underline cursor-pointer"
            >
              Clear filters
            </button>
          </div>
        )}

        {filteredCategories.map(({ category, items }) => {
          const Icon = getCategoryIcon(category);
          return (
            <section key={category} className="space-y-6">
              {/* Section header */}
              <div className="flex items-center gap-3">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-lg font-bold tracking-tight text-foreground">
                    {category}
                  </h2>
                  <Badge className="font-mono text-[10px] px-2 py-0 border-border/60 bg-muted/30 text-muted-foreground">
                    {items.length} {items.length === 1 ? "spec" : "specs"}
                  </Badge>
                </div>
                <div className="ml-auto h-px flex-1 bg-gradient-to-r from-border/60 to-transparent" />
              </div>

              {/* Cards grid */}
              <div className="grid gap-5 md:grid-cols-2">
                {items.map(({ id, title, description, logoUrl, metadata }, idx) => (
                  <Link
                    key={id}
                    href={`/reference?doc=${id}`}
                    className="block h-full"
                    style={{
                      animationDelay: `${idx * 60}ms`,
                      animationFillMode: "backwards",
                    }}
                  >
                    <Card className="group relative flex h-full flex-col justify-between overflow-hidden border border-border/70 bg-card p-0 shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/[0.04] hover:-translate-y-0.5 cursor-pointer">
                      {/* Gradient top accent */}
                      <div className="h-[3px] w-full bg-gradient-to-r from-primary/60 via-primary/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                      <div className="flex flex-1 flex-col p-6 pt-5">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-3">
                            {logoUrl ? (
                              <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-muted/30 p-1.5 transition-colors group-hover:border-primary/30 group-hover:bg-primary/[0.06]">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={logoUrl}
                                  alt={title}
                                  className="h-full w-full object-contain"
                                />
                              </div>
                            ) : (
                              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-primary/20 bg-primary/[0.08] text-primary transition-colors group-hover:bg-primary/15">
                                <FileText className="h-5 w-5" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <h3 className="text-base font-bold tracking-tight text-foreground group-hover:text-primary transition-colors duration-200 truncate">
                                {title}
                              </h3>
                              <div className="flex items-center gap-2 mt-0.5">
                                <Badge className="font-mono text-[10px] px-1.5 py-0 border-primary/30 bg-primary/10 text-primary">
                                  {metadata.version || "v1"}
                                </Badge>
                                <span className="text-[11px] text-muted-foreground/70">
                                  {metadata.endpoints.length} endpoint
                                  {metadata.endpoints.length !== 1 ? "s" : ""}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="mb-4 text-[13px] leading-relaxed text-muted-foreground line-clamp-2">
                          {description || metadata.shortDescription}
                        </p>

                        {/* Tags */}
                        {metadata.tags.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5 mb-auto">
                            {metadata.tags.slice(0, 4).map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex items-center rounded-md bg-muted/50 px-2 py-0.5 text-[11px] font-medium text-muted-foreground/80 border border-border/40"
                              >
                                {tag}
                              </span>
                            ))}
                            {metadata.tags.length > 4 && (
                              <span className="text-[11px] text-muted-foreground/50">
                                +{metadata.tags.length - 4}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="border-t border-border/50 bg-muted/[0.15] px-6 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                            <Code2 className="h-3 w-3" />
                            API Reference
                          </span>
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                            <BookOpen className="h-3 w-3" />
                            Guides
                          </span>
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/40 transition-all duration-200 group-hover:text-primary group-hover:translate-x-0.5" />
                      </div>

                      {/* Hover ring overlay */}
                      <div className="pointer-events-none absolute inset-0 rounded-lg ring-0 ring-primary/20 transition-all duration-300 group-hover:ring-1" />
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
