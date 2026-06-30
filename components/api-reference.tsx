"use client";

import { type ComponentProps, type ReactNode, useMemo, useState, useSyncExternalStore } from "react";
import { useSearchParams } from "next/navigation";
import { parse } from "yaml";
import { createOpenAPIPage } from "fumadocs-openapi/ui";
import { DefaultCollapsiblePanel } from "fumadocs-openapi/playground/client";
import type { OperationItem, WebhookItem } from "fumadocs-openapi";

function subscribeToTheme(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });

  return () => observer.disconnect();
}

function getThemeSnapshot() {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

const OpenAPIPage = createOpenAPIPage({
  playground: {
    components: {
      CollapsiblePanel: ExpandedCollapsiblePanel,
    },
  },
  content: {
    renderPageLayout(slots) {
      return (
        <div className="flex flex-col gap-24 text-sm @container">
          {slots.operations?.map((operation) => (
            <section key={`${operation.item.method}:${operation.item.path}`} className="scroll-mt-20">
              {operation.children}
            </section>
          ))}
          {slots.webhooks?.map((webhook) => (
            <section key={`${webhook.item.method}:${webhook.item.name}`} className="scroll-mt-20">
              {webhook.children}
            </section>
          ))}
        </div>
      );
    },
    renderOperationLayout(slots) {
      return (
        <ResponsiveOperationLayout
          side={null}
          main={
            <>
              {slots.header}
              {slots.apiPlayground}
              {slots.apiExample}
              {slots.description}
              {slots.authSchemes}
              {slots.parameters}
              {slots.body}
              {slots.responses}
              {slots.callbacks}
            </>
          }
        />
      );
    },
    renderWebhookLayout(slots) {
      return (
        <ResponsiveOperationLayout
          side={slots.requests}
          main={
            <>
              {slots.header}
              {slots.description}
              {slots.authSchemes}
              {slots.parameters}
              {slots.body}
              {slots.responses}
              {slots.callbacks}
            </>
          }
          reverseOnMobile
        />
      );
    },
  },
});

function ExpandedCollapsiblePanel({
  open,
  onOpenChange,
  defaultOpen = true,
  ...props
}: ComponentProps<typeof DefaultCollapsiblePanel>) {
  const [isOpen, setIsOpen] = useState(open || defaultOpen);

  return (
    <DefaultCollapsiblePanel
      {...props}
      open={isOpen}
      onOpenChange={(nextOpen) => {
        setIsOpen(nextOpen);
        onOpenChange?.(nextOpen);
      }}
    />
  );
}

type OpenAPIPageBundledDocument = Extract<
  ComponentProps<typeof OpenAPIPage>,
  { payload: { bundled: unknown } }
>["payload"]["bundled"];

function ResponsiveOperationLayout({
  main,
  side,
  reverseOnMobile = false,
}: {
  main: ReactNode;
  side: ReactNode;
  reverseOnMobile?: boolean;
}) {
  return (
    <div
      className={[
        "api-operation-grid grid min-w-0 gap-x-6 gap-y-4",
        "grid-cols-1 @4xl:grid-cols-[minmax(0,1fr)_minmax(320px,400px)] @4xl:items-start",
        reverseOnMobile ? "[&>.api-example-panel]:order-first @4xl:[&>.api-example-panel]:order-last" : "",
      ].join(" ")}
    >
      <div className="min-w-0">{main}</div>
      {side ? (
        <aside className="api-example-panel min-w-0 @4xl:sticky @4xl:top-[calc(var(--fd-docs-row-1,2rem)+1rem)]">
          {side}
        </aside>
      ) : null}
    </div>
  );
}

type JsonObject = Record<string, unknown>;

const HTTP_METHODS = ["get", "post", "put", "patch", "delete", "head", "options"] as const;
type HttpMethod = (typeof HTTP_METHODS)[number];

function isJsonObject(value: unknown): value is JsonObject {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function cleanOpenApiSpec(obj: unknown): unknown {
  if (!obj || typeof obj !== "object") {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(cleanOpenApiSpec);
  }
  const cleaned: JsonObject = {};
  for (const [key, value] of Object.entries(obj)) {
    let newKey = key;
    if (typeof key === "string") {
      const isMediaType =
        key.startsWith("application/") ||
        key.startsWith("text/") ||
        key.startsWith("multipart/") ||
        key.startsWith("image/") ||
        key.startsWith("audio/") ||
        key.startsWith("video/") ||
        key.startsWith("model/") ||
        key.startsWith("font/") ||
        key === "*/*";

      if (isMediaType) {
        const lowerKey = key.trim().toLowerCase();
        const supported = [
          "application/json",
          "application/x-www-form-urlencoded",
          "multipart/form-data"
        ];
        if (!supported.includes(lowerKey)) {
          if (lowerKey.includes("form")) {
            newKey = "multipart/form-data";
          } else {
            newKey = "application/json";
          }
        }
      }
    }
    cleaned[newKey] = cleanOpenApiSpec(value);
  }
  return cleaned;
}

function isHttpMethod(value: string): value is HttpMethod {
  return (HTTP_METHODS as readonly string[]).includes(value.toLowerCase());
}

export function ApiReference({
  specContent = "",
}: {
  specUrl?: string;
  specContent?: string;
}) {
  const colorMode = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, () => "dark");
  const searchParams = useSearchParams();
  const selectedEndpointKey = searchParams.get("endpoint");

  const parsedDoc = useMemo(() => {
    if (!specContent) return null;
    try {
      const raw = parse(specContent);
      return cleanOpenApiSpec(raw) as OpenAPIPageBundledDocument;
    } catch (e) {
      console.error("Error parsing spec content:", e);
      return null;
    }
  }, [specContent]);

  const activeOperations = useMemo(() => {
    if (!parsedDoc || !isJsonObject(parsedDoc.paths)) return undefined;
    if (!selectedEndpointKey) {
      const ops: OperationItem[] = [];
      for (const [path, pathItem] of Object.entries(parsedDoc.paths)) {
        if (!isJsonObject(pathItem)) continue;
        for (const method of Object.keys(pathItem)) {
          if (isHttpMethod(method)) {
            ops.push({
              method: method.toLowerCase() as HttpMethod,
              path: path,
            });
          }
        }
      }
      return ops;
    }
    try {
      const [method, ...pathParts] = selectedEndpointKey.split("::");
      const path = pathParts.join("::");
      if (!isHttpMethod(method) || !path) return undefined;
      return [
        {
          method: method.toLowerCase() as HttpMethod,
          path: path,
        },
      ];
    } catch {
      return undefined;
    }
  }, [parsedDoc, selectedEndpointKey]);

  const activeWebhooks = useMemo(() => {
    if (!parsedDoc || !isJsonObject(parsedDoc.webhooks)) return undefined;
    if (!selectedEndpointKey) {
      const hooks: WebhookItem[] = [];
      for (const [name, pathItem] of Object.entries(parsedDoc.webhooks)) {
        if (!isJsonObject(pathItem)) continue;
        for (const method of Object.keys(pathItem)) {
          if (isHttpMethod(method)) {
            hooks.push({
              method: method.toLowerCase() as HttpMethod,
              name: name,
            });
          }
        }
      }
      return hooks;
    }
    return undefined;
  }, [parsedDoc, selectedEndpointKey]);

  if (!parsedDoc) {
    return (
      <div className="h-96 rounded-xl border border-border bg-card animate-pulse flex items-center justify-center text-muted-foreground text-sm">
        Loading API Reference...
      </div>
    );
  }

  return (
    <div className="reference-openapi w-full min-w-0 not-prose">
      <OpenAPIPage
        key={`${selectedEndpointKey}-${colorMode}`}
        document="api-spec"
        operations={activeOperations}
        webhooks={activeWebhooks}
        showTitle={!selectedEndpointKey}
        showDescription
        payload={{
          bundled: parsedDoc,
          proxyUrl: "/api/proxy",
        }}
      />
    </div>
  );
}
