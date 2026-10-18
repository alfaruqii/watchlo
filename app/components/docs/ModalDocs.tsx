"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldAlert, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const ModalDocs = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [dontAskAgain, setDontAskAgain] = useState<boolean>(false);
  const pathname = usePathname();

  useEffect(() => {
    const storedValue = localStorage.getItem("dontAskAgain");
    const shouldNotShow = JSON.parse(storedValue || "false");
    setDontAskAgain(shouldNotShow);

    if (pathname === "/" && !shouldNotShow) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [pathname]);

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleCheckboxChange = () => {
    const newState = !dontAskAgain;
    setDontAskAgain(newState);
    localStorage.setItem("dontAskAgain", JSON.stringify(newState));
  };

  if (!isOpen || pathname !== "/") return null;

  return (
    <aside
      role="region"
      aria-label="Screening room playback notice"
      className="border-b border-hairline bg-surface-2/90 px-4 py-2.5 sm:px-6 lg:px-10"
    >
      <div className="mx-auto flex max-w-[1680px] flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 text-xs sm:text-sm">
          <ShieldAlert
            className="size-4 shrink-0 text-gold"
            strokeWidth={1.75}
          />
          <p className="text-foreground">
            <span className="mr-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-gold">
              SCREENING NOTE:
            </span>
            For the cleanest ad-free playback &amp; DNS setup, read the{" "}
            <Link
              href="/docs"
              className="font-semibold text-gold underline underline-offset-4 hover:opacity-85"
            >
              Playback Dossier (Docs)
            </Link>{" "}
            before starting.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <div className="flex shrink-0 items-center gap-2">
            <Checkbox
              checked={dontAskAgain}
              onCheckedChange={handleCheckboxChange}
              id="dont-ask-again"
            />
            <Label
              htmlFor="dont-ask-again"
              className="cursor-pointer whitespace-nowrap font-mono text-[11px] text-muted-foreground"
            >
              Don&apos;t ask me again
            </Label>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={closeModal}
            className="h-7 shrink-0 gap-1 px-2 font-mono text-[11px]"
          >
            <span>Dismiss</span>
            <X className="size-3.5" strokeWidth={1.75} />
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default ModalDocs;
