"use client";

import { useMemo, useSyncExternalStore } from "react";
import { useSearchParams } from "next/navigation";
import { ApiReferenceReact } from "@scalar/api-reference-react";
import { parse, stringify } from "yaml";
import { cn } from "@/lib/utils";
import "@scalar/api-reference-react/style.css";

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

export function ApiReference({
  specUrl = "",
  specContent = "",
}: {
  specUrl?: string;
  specContent?: string;
  endpoints?: any[];
  tags?: string[];
}) {
  const colorMode = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, () => "light");
  const searchParams = useSearchParams();
  const selectedEndpointKey = searchParams.get("endpoint");

  const cacheBustUrl = specUrl
    ? specUrl.includes("?")
      ? `${specUrl}&t=${Date.now()}`
      : `${specUrl}?t=${Date.now()}`
    : "";

  const activeSpecContent = useMemo(() => {
    if (!selectedEndpointKey || !specContent) {
      return specContent;
    }
    try {
      const doc = parse(specContent);
      if (doc && doc.paths) {
        const [method, ...pathParts] = selectedEndpointKey.split("::");
        const path = pathParts.join("::");
        const targetPathObj = doc.paths[path];
        if (targetPathObj) {
          const lowerMethod = method.toLowerCase();
          const targetOp = targetPathObj[lowerMethod];
          if (targetOp) {
            const singleOp = { ...targetOp };
            delete singleOp.tags;
            doc.paths = {
              [path]: {
                [lowerMethod]: singleOp,
              },
            };
            delete doc.servers;
            delete doc.tags;
            if (doc.info) {
              doc.info.title = singleOp.summary || path;
              delete doc.info.description;
            }
            delete doc["x-docs"];
            return stringify(doc);
          }
        }
      }
    } catch (e) {
      console.error("Error filtering spec content:", e);
    }
    return specContent;
  }, [specContent, selectedEndpointKey]);

  // When an endpoint is selected, do not pass `url` so Scalar only uses our filtered spec content
  const scalarUrl = selectedEndpointKey ? undefined : cacheBustUrl;

  const endpointSpecificCss = selectedEndpointKey
    ? `
      .scalar-app [class*="introduction"],
      .scalar-app [class*="server"],
      .scalar-app [class*="download"],
      .scalar-app [class*="client-libraries"],
      .scalar-app [class*="tag-header"],
      .scalar-app [class*="tag-section"],
      .scalar-app [class*="operations-overview"],
      .scalar-app [class*="operations-list"],
      .scalar-app [class*="operations_"],
      .scalar-app [class*="operations-"],
      .scalar-app [class*="section-header"] {
        display: none !important;
      }
    `
    : "";

  return (
    <div className="w-full rounded-xl border border-border bg-card overflow-hidden shadow-sm">
      <div
        className={cn(
          "scalar-app overflow-hidden w-full",
          colorMode === "dark" ? "dark-mode" : "light-mode",
        )}
      >
        <ApiReferenceReact
          key={`${colorMode}-${selectedEndpointKey}-${activeSpecContent.length}`}
          configuration={
            {
              url: scalarUrl,
              spec: activeSpecContent ? { content: activeSpecContent } : scalarUrl ? { url: scalarUrl } : undefined,
              content: activeSpecContent || undefined,
              hideModels: true,
              hideSearch: true,
              hideClientButton: true,
              showSidebar: false,
              showDeveloperTools: "localhost",
              showToolbar: "localhost",
              theme: "none",
              customCss: `
                .scalar-app {
                  --scalar-radius: 8px !important;
                  --scalar-color-accent: #2563eb !important;
                  --scalar-sidebar-width: 0px !important;
                  width: 100% !important;
                  max-width: 100% !important;
                }
                .scalar-app [class*="sidebar"] {
                  display: none !important;
                  width: 0 !important;
                }
                .scalar-app,
                .scalar-app > *,
                .scalar-app [class*="references-rendered"],
                .scalar-app [class*="references-layout"],
                .scalar-app main,
                .scalar-app [class*="section-content"],
                .scalar-app [class*="narrow-references"],
                .scalar-app [class*="page-content"],
                .scalar-app [class*="content-wrapper"] {
                  margin-left: 0 !important;
                  margin-right: 0 !important;
                  padding-left: 0 !important;
                  max-width: 100% !important;
                  width: 100% !important;
                }
                .dark .scalar-app, .scalar-app.dark-mode {
                  --scalar-background-1: #0b0f17 !important;
                  --scalar-background-2: #111827 !important;
                  --scalar-background-3: #1f2937 !important;
                  --scalar-color-1: #f3f4f6 !important;
                  --scalar-color-2: #9ca3af !important;
                  --scalar-color-accent: #3b82f6 !important;
                  --scalar-border-color: #1f2937 !important;
                }
                button[type="submit"], [class*="send-button"], [class*="try-it"], .scalar-button-primary {
                  background-color: #2563eb !important;
                  color: #ffffff !important;
                  font-weight: 600 !important;
                  border-radius: 8px !important;
                }
                ${endpointSpecificCss}
              `,
              persistAuth: false,
              proxyUrl: "https://proxy.scalar.com",
              externalUrls: {
                dashboardUrl: "https://dashboard.scalar.com",
                registryUrl: "https://registry.scalar.com",
                proxyUrl: "https://proxy.scalar.com",
                apiBaseUrl: "https://api.scalar.com",
              },
              default: false,
              layout: "modern",
              isEditable: false,
              documentDownloadType: selectedEndpointKey ? "none" : "both",
              hideTestRequestButton: false,
              showOperationId: false,
              hideDarkModeToggle: true,
              withDefaultFonts: true,
              defaultOpenFirstTag: true,
              defaultOpenAllTags: true,
              expandAllModelSections: false,
              expandAllResponses: false,
              expandAllSchemaProperties: false,
              orderSchemaPropertiesBy: "alpha",
              orderRequiredPropertiesFirst: true,
              _integration: "react",
              hideDownloadButton: !!selectedEndpointKey,
              defaultHttpClient: {
                targetKey: "node",
                clientKey: "fetch",
              },
              modelsSectionLabel: "Models",
            } as any
          }
        />
      </div>
    </div>
  );
}
