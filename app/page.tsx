import Link from "next/link";
import { ArrowRight, BookOpen, Code2, FileText, Sparkles } from "lucide-react";
import { DocsShell } from "@/components/docs-shell";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getDocList, getApiMetadata } from "@/lib/openapi";

export const dynamic = "force-dynamic";

export default async function Home() {
  const docList = await getDocList();

  const docsWithMetadata = await Promise.all(
    docList.map(async (doc) => {
      const metadata = await getApiMetadata(doc.id);
      return {
        ...doc,
        metadata,
      };
    })
  );

  // Group documents by category, preserving the order of appearance
  const categoriesMap = new Map<string, typeof docsWithMetadata>();
  for (const doc of docsWithMetadata) {
    const category = doc.category || "API Specifications";
    if (!categoriesMap.has(category)) {
      categoriesMap.set(category, []);
    }
    categoriesMap.get(category)!.push(doc);
  }

  return (
    <DocsShell>
      <div className="mx-auto max-w-5xl space-y-12 py-4">
        {/* Header Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Documentation Hub
          </div>
        </div>

        {/* Categories Section - Shown First */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/80">
            API Categories
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {Array.from(categoriesMap.entries()).map(([category, items]) => {
              const categoryId = category.toLowerCase().replace(/\s+/g, "-");
              return (
                <a
                  key={category}
                  href={`#${categoryId}`}
                  className="group block rounded-xl border border-border/60 bg-card/40 p-5 transition-all duration-300 hover:border-primary/40 hover:bg-card/80 hover:shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {category}
                    </span>
                    <Badge className="font-mono text-[10px] text-muted-foreground px-2.5 py-0.5 border-border/60 bg-muted/20">
                      {items.length} {items.length === 1 ? "spec" : "specs"}
                    </Badge>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        {/* Category Sections with Cards */}
        {Array.from(categoriesMap.entries()).map(([category, items]) => {
          const categoryId = category.toLowerCase().replace(/\s+/g, "-");
          return (
            <div key={category} id={categoryId} className="space-y-6 scroll-mt-20">
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
                              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-white dark:bg-slate-900 p-1.5 shadow-xs transition-colors group-hover:border-primary/30">
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
          );
        })}
      </div>
    </DocsShell>
  );
}
