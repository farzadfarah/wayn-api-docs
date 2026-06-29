import { ApiReference } from "@/components/api-reference";
import { DocsShell } from "@/components/docs-shell";
import { getApiMetadata } from "@/lib/openapi";

export const dynamic = "force-dynamic";

export default function ReferencePage() {
  const api = getApiMetadata();

  return (
    <DocsShell>
      <div className="mb-6 max-w-3xl">
        <p className="text-sm font-medium text-primary">API Reference</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">{api.title} reference</h1>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">
          Browse {api.endpoints.length} operations loaded from the OpenAPI
          document. Scalar loads the source directly from
          <code className="mx-1 rounded bg-muted px-1.5 py-1 font-mono text-sm">/openapi.yaml</code>.
        </p>
      </div>
      <ApiReference />
    </DocsShell>
  );
}
