import { DocsShell } from "@/components/docs-shell";
import { Cards, Card } from "fumadocs-ui/components/card";
import { Callout } from "fumadocs-ui/components/callout";
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
      <article className="max-w-4xl space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Updates • {api.title}</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Release Notes & Changelog</h1>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Keep track of API updates, deprecation notices, breaking changes, and version releases.
          </p>
        </div>

        <Callout type="info" title="Automated Synchronization">
          Specification updates and endpoint modifications are automatically synced directly from remote storage into this portal.
        </Callout>

        <div className="pt-4">
          <Cards>
            {changes.map((change) => (
              <Card key={change.version} title={`${change.version} - ${change.title}`}>
                <p className="text-sm text-muted-foreground leading-6">{change.description}</p>
              </Card>
            ))}
          </Cards>
        </div>
      </article>
    </DocsShell>
  );
}
