import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DocsShell } from "@/components/docs-shell";
import { Steps, Step } from "fumadocs-ui/components/steps";
import { Callout } from "fumadocs-ui/components/callout";
import { getApiMetadata } from "@/lib/openapi";

export const dynamic = "force-dynamic";

export default async function GettingStartedPage(props: {
  searchParams: Promise<{ doc?: string }>;
}) {
  const searchParams = await props.searchParams;
  const docId = searchParams.doc;
  const api = await getApiMetadata(docId);
  const guide = api.docs.gettingStarted;
  const fallbackSteps = [
    {
      title: "Configure the base URL",
      description: "The primary server URL is taken from the first server entry in the OpenAPI specification.",
      code: `API_BASE_URL=${api.serverUrl}`,
    },
    {
      title: "Authenticate",
      description: api.authEndpoint
        ? `Use ${api.authEndpoint.method} ${api.authEndpoint.path} to obtain credentials or tokens for protected requests.`
        : "Use the authentication scheme defined by your OpenAPI file for protected requests.",
      code: "API_TOKEN=your_access_token",
    },
    {
      title: "Send a request",
      description: "Call one of the operations defined in the OpenAPI file.",
      code: `curl "$API_BASE_URL${api.sampleEndpoint?.path ?? ""}" \\\n  -X ${api.sampleEndpoint?.method ?? "GET"} \\\n  -H "Authorization: Bearer $API_TOKEN" \\\n  -H "Content-Type: application/json"`,
    },
  ];
  const steps = guide?.steps?.length ? guide.steps : fallbackSteps;
  const docQuery = `?doc=${api.docId}`;

  return (
    <DocsShell docId={api.docId}>
      <article className="max-w-4xl space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Getting Started • {api.title}</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{guide?.title}</h1>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            {guide?.description}
          </p>
        </div>

        <Callout type="info" title="Production Base URL">
          All API requests for {api.title} should be targeted at <code className="font-mono text-xs px-1 py-0.5 rounded bg-muted">{api.serverUrl}</code> unless testing in a local sandbox.
        </Callout>

        <div className="pt-4">
          <h2 className="text-xl font-semibold mb-6 text-foreground">Integration Steps</h2>
          <Steps>
            {steps.map((step) => (
              <Step key={step.title}>
                <h3 className="text-base font-semibold text-foreground">{step.title}</h3>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{step.description}</p>
                {step.code ? (
                  <div className="mt-3 overflow-x-auto rounded-lg border border-border bg-slate-950 p-4 font-mono text-xs text-slate-100 shadow-sm">
                    <pre><code>{step.code}</code></pre>
                  </div>
                ) : null}
              </Step>
            ))}
          </Steps>
        </div>

        <div className="pt-6">
          <Link
            href={`/docs/authentication${docQuery}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            Continue to Authentication Guide <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </article>
    </DocsShell>
  );
}
