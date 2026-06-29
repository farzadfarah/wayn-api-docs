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

  return (
    <DocsShell>
      <div className="mx-auto max-w-5xl space-y-10 py-4">
        {/* Header Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Documentation Hub
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-foreground">
            API Documentation & Specifications
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Select an API document below to explore integration guides, authentication rules, and interactive OpenAPI specifications.
          </p>
        </div>

        {/* Documents Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {docsWithMetadata.map(({ id, title, description, metadata }) => (
            <Card
              key={id}
              className="group relative flex flex-col justify-between overflow-hidden border border-border/80 bg-card p-6 shadow-sm transition-all duration-200 hover:border-primary/50 hover:shadow-md"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                        {title}
                      </h2>
                      <p className="font-mono text-xs text-muted-foreground">ID: {id}</p>
                    </div>
                  </div>
                  <Badge className="font-mono text-xs border-primary/30 text-primary bg-primary/10">
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
                <Link
                  href={`/docs/overview?doc=${id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  Guides & Overview
                </Link>

                <Link
                  href={`/reference?doc=${id}`}
                  className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-4 text-xs font-semibold text-primary-foreground shadow-xs hover:opacity-90 transition-opacity"
                >
                  <Code2 className="h-4 w-4" />
                  View API Reference <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DocsShell>
  );
}
