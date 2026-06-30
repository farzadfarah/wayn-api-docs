import { DocsShell } from "@/components/docs-shell";
import { getDocList, getApiMetadata } from "@/lib/openapi";
import { LandingPageClient } from "@/components/landing-page-client";

export const dynamic = "force-dynamic";

export default async function Home() {
  const docList = await getDocList();

  const docsWithMetadata = await Promise.all(
    docList.map(async (doc) => {
      const metadata = await getApiMetadata(doc.id);
      return {
        ...doc,
        metadata,
      };
    })
  );

  // Group documents by category, preserving the order of appearance
  const categoriesMap = new Map<string, typeof docsWithMetadata>();
  for (const doc of docsWithMetadata) {
    const category = doc.category || "API Specifications";
    if (!categoriesMap.has(category)) {
      categoriesMap.set(category, []);
    }
    categoriesMap.get(category)!.push(doc);
  }

  const categoriesList = Array.from(categoriesMap.entries()).map(([category, items]) => ({
    category,
    items: items.map(item => ({
      ...item,
      metadata: {
        version: item.metadata.version,
        endpoints: item.metadata.endpoints,
        tags: item.metadata.tags,
        shortDescription: item.metadata.shortDescription,
      }
    })),
  }));

  return (
    <DocsShell>
      <div className="mx-auto max-w-5xl space-y-12 py-4">
        {/* Header Hero Section */}

        <LandingPageClient initialCategories={categoriesList} />
      </div>
    </DocsShell>
  );
}
