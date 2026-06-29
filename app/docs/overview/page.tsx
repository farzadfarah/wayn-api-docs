import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { DocsShell } from "@/components/docs-shell";
import { Badge } from "@/components/ui/badge";
import { Callout } from "fumadocs-ui/components/callout";
import { getApiMetadata } from "@/lib/openapi";

export const dynamic = "force-dynamic";

function SectionBody({ body }: { body?: string }) {
  if (!body) {
    return null;
  }

  return (
    <div className="space-y-4">
      {body.split(/\n\s*\n/).map((paragraph) => (
        <p key={paragraph} className="text-sm leading-7 text-foreground/90">
          {paragraph.trim()}
        </p>
      ))}
    </div>
  );
}

export default async function OverviewPage(props: {
  searchParams: Promise<{ doc?: string }>;
}) {
  const searchParams = await props.searchParams;
  const docId = searchParams.doc;
  const api = await getApiMetadata(docId);
  const overview = api.docs.overview;
  const hero = api.docs.hero;
  const sections = overview?.sections ?? [];
  const docQuery = `?doc=${api.docId}`;

  return (
    <DocsShell docId={api.docId}>
      <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_220px]">
        <article className="min-w-0 max-w-4xl space-y-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              {overview?.eyebrow} • {api.title}
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{overview?.title}</h1>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="bg-primary/10 text-primary border-primary/30 font-mono text-xs">
                {hero?.eyebrow || api.version}
              </Badge>
              <span className="font-mono text-xs text-muted-foreground">{api.endpoints.length} Operations Defined</span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">{hero?.description}</p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href={`/docs/getting-started${docQuery}`}
                className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-4 text-xs font-semibold text-primary-foreground shadow-xs hover:opacity-90 transition-opacity"
              >
                Start Integration <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={`/reference${docQuery}`}
                className="inline-flex h-9 items-center rounded-md border border-border px-4 text-xs font-semibold hover:bg-muted transition-colors"
              >
                Browse API Reference
              </Link>
            </div>
          </div>

          <Callout type="info" title="Quick Tip">
            Press <kbd className="font-mono text-xs bg-muted px-1 py-0.5 rounded">⌘K</kbd> anywhere in the documentation to quickly search endpoints, guides, and authentication methods across all specifications.
          </Callout>

          <div className="space-y-10 pt-4">
            {sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-24 space-y-3">
                <h2 className="text-2xl font-bold tracking-tight text-foreground border-b border-border/60 pb-2">{section.title}</h2>
                <div>
                  <SectionBody body={section.body} />
                  {section.items?.length ? (
                    <ul className="mt-4 space-y-3 text-sm leading-7">
                      {section.items.map((item) => (
                        <li key={`${item.label ?? item.description}-${item.endpoint ?? ""}`} className="flex gap-3 rounded-lg border border-border/40 bg-muted/30 p-3">
                          <Sparkles className="h-4 w-4 shrink-0 text-primary mt-1" />
                          <div>
                            {item.label ? <span className="font-semibold text-foreground">{item.label} </span> : null}
                            {item.endpoint ? (
                              <code className="mx-1 rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs font-semibold text-primary">
                                {item.endpoint}
                              </code>
                            ) : null}
                            {item.label || item.endpoint ? <span className="text-muted-foreground">- </span> : null}
                            <span className="text-muted-foreground">{item.description}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </section>
            ))}
          </div>
        </article>

        <aside className="hidden xl:block">
          <div className="sticky top-24 border-l border-border pl-5 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              On This Page
            </p>
            <nav className="space-y-1 text-sm">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="block rounded-md px-2 py-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {section.title}
                </a>
              ))}
            </nav>
          </div>
        </aside>
      </div>
    </DocsShell>
  );
}
