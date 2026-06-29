import { Suspense } from "react";
import { DocsLayoutClient } from "@/components/docs-layout-client";
import { getApiMetadata } from "@/lib/openapi";

export async function DocsShell({ children, docId }: { children: React.ReactNode; docId?: string }) {
  const api = await getApiMetadata(docId);

  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <DocsLayoutClient api={api}>{children}</DocsLayoutClient>
    </Suspense>
  );
}
