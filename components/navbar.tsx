import { NavbarClient } from "@/components/navbar-client";
import { getApiMetadata } from "@/lib/openapi";

export function Navbar() {
  const api = getApiMetadata();

  return (
    <NavbarClient
      title={api.title}
      version={api.version}
      logoUrl={api.logoUrl}
      overviewSections={api.docs.overview?.sections ?? []}
      endpoints={api.endpoints}
    />
  );
}

