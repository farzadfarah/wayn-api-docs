import { ApiReference } from "@/components/api-reference";
import { DocsShell } from "@/components/docs-shell";
import { getApiMetadata } from "@/lib/openapi";

export const dynamic = "force-dynamic";

export default async function ReferencePage(props: {
  searchParams: Promise<{ doc?: string }>;
}) {
  const searchParams = await props.searchParams;
  const docId = searchParams.doc;
  const api = await getApiMetadata(docId);

  return (
    <DocsShell docId={api.docId}>
      <div className="mb-6 max-w-3xl">
        <p className="text-sm font-medium text-primary">API Reference</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">{api.title} reference</h1>
        <p className="mt-2 text-sm text-muted-foreground">{api.shortDescription}</p>
      </div>
      <ApiReference specUrl={api.specUrl} />
    </DocsShell>
  );
}
