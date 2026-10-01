"use client";
import { useEffect } from "react";
import { useModalStore } from "@/store/modalStore";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ToggleSearchProps {
  variant?: "pill" | "icon";
  className?: string;
}

export function ToggleSearch({
  variant = "pill",
  className = "",
}: ToggleSearchProps) {
  const { isOpen, openModal, closeModal } = useModalStore();

  const handleToggle = () => {
    if (isOpen) {
      closeModal();
    } else {
      openModal();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) closeModal();
        else openModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, openModal, closeModal]);

  if (variant === "icon") {
    return (
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={handleToggle}
        aria-label="Search catalog (Ctrl+K)"
        title="Search catalog (Ctrl+K)"
        className={`size-8 rounded-sm text-foreground hover:bg-surface-3 hover:text-gold active:scale-95 ${className}`}
      >
        <Search className="size-4 text-gold" strokeWidth={1.75} />
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleToggle}
      aria-label="Search catalog (Ctrl+K)"
      className={`group flex h-9 items-center gap-2 rounded-sm border-hairline bg-surface-2 px-2.5 text-xs text-foreground hover:border-gold/60 hover:bg-surface-3 hover:text-gold xl:gap-2.5 xl:px-3 ${className}`}
    >
      <Search
        className="size-3.5 text-gold transition-transform group-hover:scale-105 shrink-0"
        strokeWidth={1.75}
      />
      <span className="font-display text-xs text-muted-foreground group-hover:text-foreground whitespace-nowrap">
        <span className="xl:hidden">Search</span>
        <span className="hidden xl:inline">Search Catalog</span>
      </span>
      <kbd className="hidden 2xl:inline-block rounded-sm border border-hairline bg-surface-1 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground tabular-nums">
        CTRL K
      </kbd>
    </Button>
  );
}

export default ToggleSearch;
