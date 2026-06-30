"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BookOpen, Code2, FileText } from "lucide-react";
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

export function LandingPageClient({ initialCategories }: LandingPageClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const totalSpecsCount = initialCategories.reduce((acc, cat) => acc + cat.items.length, 0);

  const filteredCategories = selectedCategory === "all"
    ? initialCategories
    : initialCategories.filter(cat => cat.category === selectedCategory);

  return (
    <div className="space-y-12">
      {/* Categories Filter Selector */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/80">
          API Categories
        </h2>
        <div className="flex flex-wrap gap-3">
          {/* All Categories Button */}
          <button
            onClick={() => setSelectedCategory("all")}
            className={cn(
              "px-5 py-3 rounded-xl border text-xs font-semibold transition-all duration-300 shadow-xs flex items-center justify-between gap-3 cursor-pointer",
              selectedCategory === "all"
                ? "border-primary bg-primary/10 text-primary shadow-xs ring-1 ring-primary/20"
                : "border-border/60 bg-card/40 text-foreground/90 hover:border-primary/40 hover:bg-card/80"
            )}
          >
            <span>All Categories</span>
            <Badge
              className={cn(
                "font-mono text-[10px] px-2 py-0 border shrink-0",
                selectedCategory === "all"
                  ? "border-primary/30 bg-primary/20 text-primary"
                  : "border-border/60 bg-muted/20 text-muted-foreground"
              )}
            >
              {totalSpecsCount} {totalSpecsCount === 1 ? "spec" : "specs"}
            </Badge>
          </button>

          {/* Individual Category Buttons */}
          {initialCategories.map(({ category, items }) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                "px-5 py-3 rounded-xl border text-xs font-semibold transition-all duration-300 shadow-xs flex items-center justify-between gap-3 cursor-pointer",
                selectedCategory === category
                  ? "border-primary bg-primary/10 text-primary shadow-xs ring-1 ring-primary/20"
                  : "border-border/60 bg-card/40 text-foreground/90 hover:border-primary/40 hover:bg-card/80"
              )}
            >
              <span>{category}</span>
              <Badge
                className={cn(
                  "font-mono text-[10px] px-2 py-0 border shrink-0",
                  selectedCategory === category
                    ? "border-primary/30 bg-primary/20 text-primary"
                    : "border-border/60 bg-muted/20 text-muted-foreground"
                )}
              >
                {items.length} {items.length === 1 ? "spec" : "specs"}
              </Badge>
            </button>
          ))}
        </div>
      </div>

      {/* Category Sections with Cards */}
      <div className="space-y-12">
        {filteredCategories.map(({ category, items }) => (
          <div key={category} className="space-y-6">
            <div className="flex items-center gap-2 border-b border-border/60 pb-3">
              <div className="h-5 w-1 rounded-full bg-blue-600 dark:bg-blue-500" />
              <h2 className="text-xl font-bold tracking-tight text-foreground/95">
                {category}
              </h2>
              <Badge className="ml-2 font-mono text-[10px] text-muted-foreground px-2 py-0 border-border/60 bg-muted/20">
                {items.length} {items.length === 1 ? "spec" : "specs"}
              </Badge>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {items.map(({ id, title, description, logoUrl, metadata }) => (
                <Link
                  key={id}
                  href={`/reference?doc=${id}`}
                  className="block h-full"
                >
                  <Card className="group relative flex h-full flex-col justify-between overflow-hidden border border-border/80 bg-card p-6 shadow-sm transition-all duration-200 hover:border-primary/50 hover:shadow-md cursor-pointer">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          {logoUrl ? (
                            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center transition-colors">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={logoUrl} alt={title} className="h-full w-full object-contain" />
                            </div>
                          ) : (
                            <div className="grid h-10 w-10 place-items-center rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900 shrink-0">
                              <FileText className="h-5 w-5" />
                            </div>
                          )}
                          <div>
                            <h3 className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                              {title}
                            </h3>
                          </div>
                        </div>
                        <Badge className="font-mono text-xs border-primary/30 text-primary bg-primary/10 shrink-0">
                          {metadata.version || "v1"}
                        </Badge>
                      </div>

                      <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
                        {description || metadata.shortDescription}
                      </p>

                      <div className="flex flex-wrap items-center gap-2 pt-2">
                        <span className="inline-flex items-center rounded-md bg-muted px-2.5 py-1 font-mono text-xs font-medium text-foreground/80">
                          {metadata.endpoints.length} Operations
                        </span>
                        {metadata.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center rounded-md bg-muted/60 px-2 py-0.5 text-xs text-muted-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-8 pt-4 border-t border-border/60 flex items-center justify-between gap-3">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                        <Code2 className="h-3.5 w-3.5" />
                        Open API Reference
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                        <BookOpen className="h-3.5 w-3.5" />
                        Guides available
                      </span>
                    </div>

                    <div className="pointer-events-none absolute inset-0 rounded-lg ring-0 ring-primary/20 transition-all duration-200 group-hover:ring-2" />
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
