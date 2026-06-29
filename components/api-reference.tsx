"use client";

import { ApiReferenceReact } from "@scalar/api-reference-react";
import { useSyncExternalStore } from "react";
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

export function ApiReference({ specUrl = "/openapi.yaml" }: { specUrl?: string }) {
  const colorMode = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, () => "light");

  return (
    <div
      className={cn(
        "scalar-app overflow-hidden rounded-lg border border-border bg-card",
        colorMode === "dark" ? "dark-mode" : "light-mode",
      )}
    >
      <ApiReferenceReact
        key={`${colorMode}-${specUrl}`}
        configuration={
          {
            url: specUrl,
            hideModels: true,
            hideSearch: true,
            hideClientButton: true,
            showSidebar: true,
            showDeveloperTools: "localhost",
            showToolbar: "localhost",
            operationTitleSource: "summary",
            theme: colorMode === "dark" ? "moon" : "default",
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
            documentDownloadType: "both",
            hideTestRequestButton: false,
            showOperationId: false,
            hideDarkModeToggle: true,
            withDefaultFonts: true,
            defaultOpenFirstTag: true,
            defaultOpenAllTags: false,
            expandAllModelSections: false,
            expandAllResponses: false,
            expandAllSchemaProperties: false,
            orderSchemaPropertiesBy: "alpha",
            orderRequiredPropertiesFirst: true,
            _integration: "react",
            hideDownloadButton: false,
            defaultHttpClient: {
              targetKey: "node",
              clientKey: "fetch",
            },
            modelsSectionLabel: "Models",
          } as any
        }
      />
    </div>
  );
}
