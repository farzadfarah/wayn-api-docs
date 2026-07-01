"use client";

import { type ComponentProps, type ReactNode, useMemo, useState, useSyncExternalStore } from "react";
import { useSearchParams } from "next/navigation";
import { parse } from "yaml";
import { createOpenAPIPage } from "fumadocs-openapi/ui";
import { DefaultCollapsiblePanel } from "fumadocs-openapi/playground/client";
import type { OperationItem, WebhookItem } from "fumadocs-openapi";
import { ChevronDown, Info } from "lucide-react";

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
        <>
          <EndpointDescriptionLayout>
            <EndpointDescription>{slots.description}</EndpointDescription>
          </EndpointDescriptionLayout>
          <ResponsiveOperationLayout
            side={slots.apiExample}
            main={
              <>
                <ApiSection title="Request builder" tone="primary" className="api-request-builder">
                  {slots.header}
                  {slots.apiPlayground}
                </ApiSection>
                <ApiSection title="Reference details">
                  {slots.authSchemes}
                  {slots.parameters}
                  {slots.body}
                  {slots.responses}
                  {slots.callbacks}
                </ApiSection>
              </>
            }
          />
        </>
      );
    },
    renderWebhookLayout(slots) {
      return (
        <>
          <EndpointDescription>{slots.description}</EndpointDescription>
          <ResponsiveOperationLayout
            side={slots.requests}
            main={
              <>
                <ApiSection title="Webhook">
                  {slots.header}
                </ApiSection>
                <ApiSection title="Reference details">
                  {slots.authSchemes}
                  {slots.parameters}
                  {slots.body}
                  {slots.responses}
                  {slots.callbacks}
                </ApiSection>
              </>
            }
            reverseOnMobile
          />
        </>
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

function ApiSection({
  className = "",
  children,
  title,
  tone = "neutral",
}: {
  className?: string;
  children: ReactNode;
  title: string;
  tone?: "neutral" | "primary";
}) {
  if (!children) return null;

  return (
    <details className={`group mb-5 overflow-hidden rounded-md border border-border bg-card shadow-sm ${className}`} open>
      <summary
        className={[
          "flex cursor-pointer list-none items-center justify-between gap-3 border-b px-4 py-2.5 text-xs font-bold uppercase tracking-wide [&::-webkit-details-marker]:hidden",
          tone === "primary"
            ? "border-teal-500/20 bg-teal-50 text-teal-800 dark:border-cyan-400/20 dark:bg-cyan-950/25 dark:text-cyan-200"
            : "border-indigo-500/20 bg-indigo-50 text-indigo-800 dark:border-violet-400/20 dark:bg-violet-950/30 dark:text-violet-200",
        ].join(" ")}
      >
        <span>{title}</span>
        <ChevronDown
          className="size-4 shrink-0 transition-transform duration-200 group-open:rotate-180"
          aria-hidden="true"
        />
      </summary>
      <div className="min-w-0 p-3 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">{children}</div>
    </details>
  );
}

function EndpointDescriptionLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={[
        "api-operation-grid grid min-w-0 gap-x-6 gap-y-4",
        "grid-cols-1 @4xl:grid-cols-[minmax(0,1fr)_minmax(320px,400px)] @4xl:items-start",
      ].join(" ")}
    >
      <div className="min-w-0">{children}</div>
      <div className="hidden @4xl:block" aria-hidden="true" />
    </div>
  );
}

function EndpointDescription({ children }: { children: ReactNode }) {
  if (!children) return null;

  return (
    <section className="mb-5 overflow-hidden rounded-md border border-teal-500/30 bg-card text-foreground shadow-sm ring-1 ring-teal-500/10 dark:border-cyan-400/30 dark:ring-cyan-400/10">
      <div className="flex items-center gap-2 border-b border-teal-500/20 bg-teal-50 px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-teal-800 dark:border-cyan-400/20 dark:bg-cyan-950/25 dark:text-cyan-200">
        <Info className="size-4 shrink-0" aria-hidden="true" />
        <span>Overview</span>
      </div>
      <div className="bg-teal-50/45 px-4 py-3.5 dark:bg-cyan-950/15">
        <div className="border-l-4 border-teal-600 pl-3 dark:border-cyan-300">
          <div className="text-[0.9375rem] font-semibold leading-6 text-teal-950 dark:text-cyan-50 [&_p]:m-0 [&_p]:text-current">
            {children}
          </div>
        </div>
      </div>
    </section>
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

function toPascalCaseText(value: string) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .split(/[\s_\-/]+/)
    .filter(Boolean)
    .map((word) => {
      if (/^[A-Z0-9]+$/.test(word)) return word;
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
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
    let newValue = value;
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

      if (key === "summary" && typeof value === "string") {
        newValue = toPascalCaseText(value);
      }
    }
    cleaned[newKey] = cleanOpenApiSpec(newValue);
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
