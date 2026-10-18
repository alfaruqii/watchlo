"use client";

import React, { useEffect, type JSX } from "react";
import { useThemeStore } from "../../store/themeStore";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ToggleThemeProps {
  variant?: "pill" | "icon";
  className?: string;
}

export const ToggleTheme = ({
  variant = "pill",
  className = "",
}: ToggleThemeProps): JSX.Element => {
  const { theme, setTheme } = useThemeStore();

  const handleToggle = () => {
    setTheme(theme === "black" ? "garden" : "black");
  };

  useEffect(() => {
    const localTheme = localStorage.getItem("theme") ?? "black";
    setTheme(localTheme);
  }, [setTheme]);

  if (variant === "icon") {
    return (
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={handleToggle}
        className={`size-8 rounded-sm text-foreground hover:bg-surface-3 hover:text-gold active:scale-95 ${className}`}
        aria-label={`Switch to ${theme === "black" ? "Paper (light)" : "Booth (dark)"} theme`}
        title={`Theme: ${theme === "black" ? "Booth (Dark)" : "Paper (Light)"}`}
      >
        {theme === "black" ? (
          <Sun className="size-4 text-gold transition-transform hover:rotate-45" strokeWidth={1.75} />
        ) : (
          <Moon className="size-4 text-gold transition-transform hover:-rotate-12" strokeWidth={1.75} />
        )}
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleToggle}
      className={`group flex h-9 items-center gap-2 rounded-sm border-hairline bg-surface-2 px-2.5 text-xs text-foreground hover:border-gold/60 hover:bg-surface-3 hover:text-gold xl:px-3 ${className}`}
      aria-label="Toggle theme"
      title={`Switch to ${theme === "black" ? "Paper (light)" : "Booth (dark)"} theme`}
    >
      {theme === "black" ? (
        <>
          <Sun className="size-3.5 text-gold transition-transform group-hover:rotate-45 shrink-0" strokeWidth={1.75} />
          <span className="hidden font-mono text-[10px] uppercase tracking-wider text-muted-foreground group-hover:text-foreground whitespace-nowrap xl:inline">
            Paper
          </span>
        </>
      ) : (
        <>
          <Moon className="size-3.5 text-gold transition-transform group-hover:-rotate-12 shrink-0" strokeWidth={1.75} />
          <span className="hidden font-mono text-[10px] uppercase tracking-wider text-muted-foreground group-hover:text-foreground whitespace-nowrap xl:inline">
            Booth
          </span>
        </>
      )}
    </Button>
  );
};
