import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { DocsShell } from "@/components/docs-shell";
import { Card } from "@/components/ui/card";
import { getApiMetadata } from "@/lib/openapi";

export const dynamic = "force-dynamic";

export default function AuthenticationPage() {
  const api = getApiMetadata();
  const auth = api.docs.authentication;
  const notes = auth?.notes?.length
    ? auth.notes
    : [
        {
          title: "Trusted systems",
          description:
            "Call this API from trusted backend systems only. Do not expose credentials in browser bundles.",
        },
        {
          title: "Operational support",
          description:
            "Log request IDs and timestamps for troubleshooting, but keep authorization headers out of plain-text logs.",
        },
      ];

  return (
    <DocsShell>
      <article className="max-w-3xl">
        <p className="text-sm font-medium text-primary">Authentication</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">{auth?.title}</h1>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">
          {auth?.description}
        </p>
        <Card className="mt-8 p-5">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-1 h-5 w-5 text-primary" />
            <div>
              <h2 className="font-semibold">Header format</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Send the access token as a bearer credential. Include the
                request ID or correlation ID when reporting integration issues to support.
              </p>
            </div>
          </div>
          <pre className="mt-4 overflow-x-auto rounded-md bg-muted p-4 font-mono text-xs">
{auth?.headerExample}
          </pre>
        </Card>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {notes.map((note) => (
            <Card key={note.title} className="p-5">
              <h2 className="font-semibold">{note.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{note.description}</p>
            </Card>
          ))}
        </div>
        <Link
          href="/reference"
          className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-primary"
        >
          Explore endpoints <ArrowRight className="h-4 w-4" />
        </Link>
      </article>
    </DocsShell>
  );
}
