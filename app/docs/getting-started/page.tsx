import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DocsShell } from "@/components/docs-shell";
import { Card } from "@/components/ui/card";
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
      <article className="max-w-3xl">
        <p className="text-sm font-medium text-primary">Getting Started ({api.title})</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">{guide?.title}</h1>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">
          {guide?.description}
        </p>
        <div className="mt-8 space-y-6">
          {steps.map((step, index) => (
            <Card key={step.title} className="p-5">
              <h2 className="font-semibold">{index + 1}. {step.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.description}</p>
              {step.code ? (
                <pre className="mt-4 overflow-x-auto rounded-md bg-muted p-4 font-mono text-xs leading-6">{step.code}</pre>
              ) : null}
            </Card>
          ))}
        </div>
        <Link
          href={`/docs/authentication${docQuery}`}
          className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-primary"
        >
          Continue to authentication <ArrowRight className="h-4 w-4" />
        </Link>
      </article>
    </DocsShell>
  );
}
