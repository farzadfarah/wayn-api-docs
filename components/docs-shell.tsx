import { Navbar } from "@/components/navbar";

export function DocsShell({ children, docId }: { children: React.ReactNode; docId?: string }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar docId={docId} />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
