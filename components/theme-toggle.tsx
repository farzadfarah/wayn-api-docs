"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

type Theme = "light" | "dark" | "system";

function resolveTheme(theme: Theme) {
  if (theme === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  return theme;
}

function applyTheme(theme: Theme) {
  const resolved = resolveTheme(theme);
  document.documentElement.classList.toggle("dark", resolved === "dark");
  document.documentElement.style.colorScheme = resolved;
}

export function ThemeToggle({ className }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<Theme>("system");

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("theme") as Theme | null;
    const initialTheme =
      storedTheme === "light" || storedTheme === "dark" || storedTheme === "system"
        ? storedTheme
        : "system";

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(initialTheme);
    applyTheme(initialTheme);
    setMounted(true);

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if ((window.localStorage.getItem("theme") ?? "system") === "system") {
        applyTheme("system");
      }
    };

    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  const nextTheme = theme === "dark" ? "light" : theme === "light" ? "system" : "dark";
  const Icon = !mounted ? Monitor : theme === "dark" ? Moon : theme === "light" ? Sun : Monitor;

  function updateTheme() {
    window.localStorage.setItem("theme", nextTheme);
    setTheme(nextTheme);
    applyTheme(nextTheme);
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label="Toggle color theme"
      title={`Theme: ${theme}. Click to switch to ${nextTheme}.`}
      onClick={updateTheme}
      className={cn("h-9 w-9 text-foreground hover:bg-muted transition-colors", className)}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );
}
