const mainLogoUrl =
  "https://stapps.blob.core.windows.net/cn-epgcms-stg/assets/logo_trademark_72e0639f5d.svg";

export default function Loading() {
  return (
    <main className="relative grid min-h-[70vh] w-full place-items-center overflow-hidden bg-background px-6">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="relative flex w-full max-w-sm flex-col items-center text-center">
        <div className="relative mb-7 flex h-24 w-24 items-center justify-center rounded-2xl border border-border/80 bg-card shadow-lg shadow-foreground/5">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 via-transparent to-accent/40" />
          <div className="absolute -inset-1 rounded-[1.35rem] border border-primary/10" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={mainLogoUrl}
            alt="7x"
            className="relative h-11 w-auto object-contain"
          />
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold text-foreground">Loading developer portal</p>
          <p className="text-xs leading-5 text-muted-foreground">
            Preparing the API reference and documentation.
          </p>
        </div>

        <div className="mt-7 h-1 w-44 overflow-hidden rounded-full bg-muted">
          <div className="h-full w-1/2 animate-[loading-slide_1.2s_ease-in-out_infinite] rounded-full bg-primary" />
        </div>
      </div>
    </main>
  );
}
