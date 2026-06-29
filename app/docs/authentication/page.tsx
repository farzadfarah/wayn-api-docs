import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { DocsShell } from "@/components/docs-shell";
import { Callout } from "fumadocs-ui/components/callout";
import { Cards, Card } from "fumadocs-ui/components/card";
import { getApiMetadata } from "@/lib/openapi";

export const dynamic = "force-dynamic";

export default async function AuthenticationPage(props: {
  searchParams: Promise<{ doc?: string }>;
}) {
  const searchParams = await props.searchParams;
  const docId = searchParams.doc;
  const api = await getApiMetadata(docId);
  const auth = api.docs.authentication;
  const notes = auth?.notes?.length
    ? auth.notes
    : [
        {
          title: "Trusted Systems",
          description:
            "Call this API from trusted backend systems only. Do not expose credentials or access tokens in client-side browser bundles.",
        },
        {
          title: "Operational Support",
          description:
            "Log request correlation IDs and timestamps for troubleshooting, keeping authorization headers out of plain-text logs.",
        },
      ];
  const docQuery = `?doc=${api.docId}`;

  return (
    <DocsShell docId={api.docId}>
      <article className="max-w-4xl space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Security • {api.title}</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{auth?.title}</h1>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            {auth?.description}
          </p>
        </div>

        <Callout type="warn" title="Security Requirement">
          Always store client secrets in secure environment variables or key vaults. Never commit credentials to version control.
        </Callout>

        <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Authorization Header Format</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Include the access token in the standard HTTP <code className="font-mono text-xs px-1 py-0.5 rounded bg-muted">Authorization</code> header for all protected requests.
              </p>
            </div>
          </div>
          <div className="overflow-x-auto rounded-lg border border-border bg-slate-950 p-4 font-mono text-xs text-slate-100">
            <pre><code>{auth?.headerExample}</code></pre>
          </div>
        </div>

        <div className="pt-4">
          <h2 className="text-xl font-semibold mb-4 text-foreground">Security Best Practices</h2>
          <Cards>
            {notes.map((note) => (
              <Card key={note.title} title={note.title}>
                <p className="text-sm text-muted-foreground leading-6">{note.description}</p>
              </Card>
            ))}
          </Cards>
        </div>

        <div className="pt-6">
          <Link
            href={`/reference${docQuery}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            Explore Interactive API Reference <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </article>
    </DocsShell>
  );
}
