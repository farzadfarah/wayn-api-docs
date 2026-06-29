import { Suspense } from "react";
import { NavbarClient } from "@/components/navbar-client";
import { getApiMetadata } from "@/lib/openapi";

export async function Navbar({ docId }: { docId?: string }) {
  const api = await getApiMetadata(docId);

  return (
    <Suspense fallback={<div className="h-14 bg-blue-600 dark:bg-slate-900 border-b border-blue-700 dark:border-slate-800" />}>
      <NavbarClient
        docId={api.docId}
        docList={api.docList}
        title={api.title}
        version={api.version}
        logoUrl={api.logoUrl}
        overviewSections={api.docs.overview?.sections ?? []}
        endpoints={api.endpoints}
      />
    </Suspense>
  );
}
