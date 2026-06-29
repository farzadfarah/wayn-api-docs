import { Suspense } from "react";
import { ApiReference } from "@/components/api-reference";
import { DocsShell } from "@/components/docs-shell";
import { getApiMetadata } from "@/lib/openapi";

export const dynamic = "force-dynamic";

export default async function ReferencePage(props: {
  searchParams: Promise<{ doc?: string; endpoint?: string }>;
}) {
  const searchParams = await props.searchParams;
  const docId = searchParams.doc;
  const api = await getApiMetadata(docId);

  return (
    <DocsShell docId={api.docId}>
      <Suspense fallback={<div className="h-96 rounded-xl border border-border bg-card animate-pulse" />}>
        <ApiReference
          specUrl={api.specUrl}
          specContent={api.specContent}
        />
      </Suspense>
    </DocsShell>
  );
}
