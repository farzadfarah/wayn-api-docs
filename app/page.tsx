import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DocsShell } from "@/components/docs-shell";
import { Badge } from "@/components/ui/badge";
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

export default function Home() {
  const api = getApiMetadata();
  const overview = api.docs.overview;
  const hero = api.docs.hero;
  const sections = overview?.sections ?? [];

  return (
    <DocsShell>
      <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_220px]">
        <article className="min-w-0 max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">
            {overview?.eyebrow}
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight">{overview?.title}</h1>
          <div className="mt-8 border-t border-border pt-8">
            <div className="rounded-lg border border-border bg-card p-5">
              <div className="flex flex-wrap items-center gap-3">
                <Badge>{hero?.eyebrow}</Badge>
                <span className="font-mono text-xs text-muted-foreground">{api.endpoints.length} operations</span>
              </div>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">{hero?.description}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href={hero?.primaryCta?.href ?? "/docs/getting-started"}
                  className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:opacity-90"
                >
                  {hero?.primaryCta?.label ?? "Start integration"} <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href={hero?.secondaryCta?.href ?? "/reference"}
                  className="inline-flex h-9 items-center rounded-md border border-border px-3 text-sm font-medium hover:bg-muted"
                >
                  {hero?.secondaryCta?.label ?? "Browse API reference"}
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-10 space-y-10">
            {sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-24">
                <h2 className="text-xl font-semibold tracking-tight">{section.title}</h2>
                <div className="mt-4">
                  <SectionBody body={section.body} />
                  {section.items?.length ? (
                    <ul className="mt-4 space-y-3 text-sm leading-7">
                      {section.items.map((item) => (
                        <li key={`${item.label ?? item.description}-${item.endpoint ?? ""}`} className="flex gap-3">
                          <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                          <span>
                            {item.label ? <span className="font-medium">{item.label}</span> : null}
                            {item.endpoint ? (
                              <code className="mx-2 rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs">
                                {item.endpoint}
                              </code>
                            ) : null}
                            {item.label || item.endpoint ? <span className="text-muted-foreground">- </span> : null}
                            <span className="text-foreground/90">{item.description}</span>
                          </span>
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
          <div className="sticky top-24 border-l border-border pl-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              On This Page
            </p>
            <nav className="space-y-1">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="block rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
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
