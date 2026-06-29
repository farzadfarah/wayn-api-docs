import { DocsShell } from "@/components/docs-shell";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getApiMetadata } from "@/lib/openapi";

export const dynamic = "force-dynamic";

export default async function ChangelogPage(props: {
  searchParams: Promise<{ doc?: string }>;
}) {
  const searchParams = await props.searchParams;
  const docId = searchParams.doc;
  const api = await getApiMetadata(docId);
  const changes = api.docs.changelog?.length ? api.docs.changelog : [
    {
      version: api.version,
      title: `${api.title} specification loaded`,
      description: `${api.endpoints.length} operations and ${api.tags.length || "no"} tags are currently available from the specification source.`,
    },
    {
      version: "OpenAPI",
      title: "Reference generated from source",
      description:
        "The API Reference page embeds Scalar and reads the OpenAPI YAML file.",
    },
  ];

  return (
    <DocsShell docId={api.docId}>
      <article className="max-w-3xl">
        <p className="text-sm font-medium text-primary">Changelog ({api.title})</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">What changed</h1>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">
          Keep developers informed about API changes, documentation updates, and
          migration notes.
        </p>
        <div className="mt-8 space-y-4">
          {changes.map((change) => (
            <Card key={change.version} className="p-5">
              <div className="flex flex-wrap items-center gap-3">
                <Badge>{change.version}</Badge>
                <h2 className="font-semibold">{change.title}</h2>
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{change.description}</p>
            </Card>
          ))}
        </div>
      </article>
    </DocsShell>
  );
}
