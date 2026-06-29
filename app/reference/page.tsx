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
      </div>
      <ApiReference />
    </DocsShell>
  );
}
