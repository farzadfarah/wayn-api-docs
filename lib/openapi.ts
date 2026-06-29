import { parse } from "yaml";

export type DocItem = {
  id: string;
  title: string;
  description: string;
  url: string;
};

type OpenApiOperation = {
  summary?: string;
  description?: string;
  operationId?: string;
  tags?: string[];
};

type OpenApiDocument = {
  info?: {
    title?: string;
    version?: string;
    description?: string;
  };
  servers?: Array<{ url?: string; description?: string }>;
  paths?: Record<string, Record<string, OpenApiOperation>>;
  "x-docs"?: DocsContent;
};

export type ApiEndpoint = {
  method: string;
  path: string;
  summary: string;
  tag?: string;
};

export type ApiMetadata = {
  docId: string;
  specUrl: string;
  specContent?: string;
  docList: DocItem[];
  title: string;
  version: string;
  description: string;
  shortDescription: string;
  serverUrl: string;
  logoUrl?: string;
  endpoints: ApiEndpoint[];
  tags: string[];
  authEndpoint?: ApiEndpoint;
  sampleEndpoint?: ApiEndpoint;
  docs: DocsContent;
};

export type DocsLink = {
  label: string;
  href: string;
};

export type DocsStep = {
  title: string;
  description: string;
  code?: string;
};

export type DocsNote = {
  title: string;
  description: string;
};

export type DocsChange = {
  version: string;
  title: string;
  description: string;
};

export type DocsOverviewItem = {
  label?: string;
  endpoint?: string;
  description: string;
};

export type DocsOverviewSection = {
  id: string;
  title: string;
  body?: string;
  items?: DocsOverviewItem[];
};

export type DocsContent = {
  logoUrl?: string;
  hero?: {
    eyebrow?: string;
    title?: string;
    description?: string;
    primaryCta?: DocsLink;
    secondaryCta?: DocsLink;
  };
  overview?: {
    eyebrow?: string;
    title?: string;
    sections?: DocsOverviewSection[];
  };
  gettingStarted?: {
    title?: string;
    description?: string;
    steps?: DocsStep[];
  };
  authentication?: {
    title?: string;
    description?: string;
    headerExample?: string;
    notes?: DocsNote[];
  };
  changelog?: DocsChange[];
};

const HTTP_METHODS = new Set([
  "get",
  "post",
  "put",
  "patch",
  "delete",
  "head",
  "options",
]);

const INDEX_URL = "https://stsproddgtl01.blob.core.windows.net/cn-public/readme/index.json";

function firstParagraph(value?: string) {
  return (
    value
      ?.replace(/\r/g, "")
      .split(/\n\s*\n/)
      .map((part) => part.trim())
      .find(Boolean) ?? "Explore guides, authentication, changelog notes, and the complete API reference."
  );
}

function operationSummary(method: string, route: string, operation?: OpenApiOperation) {
  return (
    operation?.summary ||
    operation?.operationId ||
    `${method.toUpperCase()} ${route}`
  );
}

export async function getDocList(): Promise<DocItem[]> {
  try {
    const fetchUrl = `${INDEX_URL}?t=${Date.now()}`;
    const res = await fetch(fetchUrl, {
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
      },
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data as DocItem[];
      }
    }
  } catch (err) {
    console.error(`Failed to fetch index.json from ${INDEX_URL}:`, err);
  }

  return [];
}

export async function getApiMetadata(docId?: string): Promise<ApiMetadata> {
  const docList = await getDocList();
  const currentDoc = docList.find((d) => d.id === docId) ?? docList[0];

  let source = "";
  let specUrl = currentDoc?.url ?? "";

  if (currentDoc?.url && (currentDoc.url.startsWith("http://") || currentDoc.url.startsWith("https://"))) {
    try {
      const fetchUrl = currentDoc.url.includes("?")
        ? `${currentDoc.url}&t=${Date.now()}`
        : `${currentDoc.url}?t=${Date.now()}`;
      const res = await fetch(fetchUrl, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
        },
      });
      if (res.ok) {
        source = await res.text();
      }
    } catch (err) {
      console.error(`Error fetching spec from ${currentDoc.url}:`, err);
    }
  }

  const document = (source ? parse(source) : {}) as OpenApiDocument;

  const endpoints = Object.entries(document.paths ?? {}).flatMap(([route, operations]) =>
    Object.entries(operations ?? {})
      .filter(([method]) => HTTP_METHODS.has(method.toLowerCase()))
      .map(([method, operation]) => ({
        method: method.toUpperCase(),
        path: route,
        summary: operationSummary(method, route, operation),
        tag: operation.tags?.[0],
      })),
  );

  const tags = Array.from(new Set(endpoints.map((endpoint) => endpoint.tag).filter(Boolean))) as string[];
  const authEndpoint = endpoints.find((endpoint) =>
    [endpoint.path, endpoint.summary, endpoint.tag].join(" ").toLowerCase().includes("auth"),
  );
  const sampleEndpoint =
    endpoints.find((endpoint) => endpoint.method === "POST" && endpoint !== authEndpoint) ??
    endpoints.find((endpoint) => endpoint !== authEndpoint) ??
    endpoints[0];
  const title = document.info?.title ?? currentDoc?.title ?? "API Documentation";
  const version = document.info?.version ?? "latest";
  const description = document.info?.description ?? currentDoc?.description ?? "";
  const shortDescription = firstParagraph(document.info?.description ?? currentDoc?.description);
  const serverUrl = document.servers?.find((server) => server.url)?.url ?? "https://api.example.com";
  const docs = document["x-docs"] ?? {};

  const activeDocId = currentDoc?.id ?? docId ?? "default";

  return {
    docId: activeDocId,
    specUrl,
    specContent: source,
    docList,
    title,
    version,
    description,
    shortDescription,
    serverUrl,
    logoUrl: docs.logoUrl,
    endpoints,
    tags,
    authEndpoint,
    sampleEndpoint,
    docs: {
      ...docs,
      hero: {
        eyebrow: `${title} ${version}`,
        title,
        description: shortDescription,
        primaryCta: { label: "Start integration", href: `/docs/getting-started?doc=${activeDocId}` },
        secondaryCta: { label: "Browse API reference", href: `/reference?doc=${activeDocId}` },
        ...docs.hero,
      },
      overview: {
        eyebrow: "Getting Started",
        title: "Overview",
        sections: [
          {
            id: "overview",
            title,
            body: shortDescription,
          },
          {
            id: "endpoints",
            title: "Endpoints",
            items: endpoints.slice(0, 6).map((endpoint) => ({
              label: endpoint.summary,
              endpoint: `${endpoint.method} ${endpoint.path}`,
              description: endpoint.tag ? `Tagged as ${endpoint.tag}.` : "Defined in the OpenAPI file.",
            })),
          },
        ],
        ...docs.overview,
      },
      gettingStarted: {
        title: `Start your ${title} integration`,
        description:
          "Configure the base URL, authenticate, and make your first request.",
        ...docs.gettingStarted,
      },
      authentication: {
        title: `Authenticate ${title} requests`,
        description: authEndpoint
          ? `Use ${authEndpoint.method} ${authEndpoint.path} for authentication, then send the returned credential with protected API requests.`
          : "Use the authentication model defined in your OpenAPI file, then send credentials with protected API requests.",
        headerExample: "Authorization: Bearer YOUR_API_TOKEN",
        ...docs.authentication,
      },
    },
  };
}
