"use client";

import { Menu, X, BookOpen, Code2, MessageSquare } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function MobileNav({ title = "WAYN API" }: { title?: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="md:hidden text-white hover:bg-white/20"
        aria-label="Open navigation"
        onClick={() => setOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>
      {open ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            aria-label="Close navigation overlay"
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-80 max-w-[86vw] border-r border-border bg-background p-5 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <span className="font-semibold text-foreground">{title} Docs</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Close navigation"
                onClick={() => setOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <nav className="space-y-2" onClick={() => setOpen(false)}>
              <Link
                href="/"
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-semibold transition-colors",
                  pathname === "/" || pathname.startsWith("/docs")
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <BookOpen className="h-4 w-4" />
                Guides
              </Link>
              <Link
                href="/reference"
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-semibold transition-colors",
                  pathname === "/reference"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Code2 className="h-4 w-4" />
                &lt;&gt; API Reference
              </Link>
              <Link
                href="/changelog"
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-semibold transition-colors",
                  pathname === "/changelog"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <MessageSquare className="h-4 w-4" />
                Discussions
              </Link>
            </nav>
          </div>
        </div>
      ) : null}
    </>
  );
}


