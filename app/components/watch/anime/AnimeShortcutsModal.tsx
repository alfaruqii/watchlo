"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Command, X } from "lucide-react";

interface AnimeShortcutsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SHORTCUTS = [
  { key: "Space / K", label: "Play / Pause", desc: "Toggle playback" },
  { key: "← / J", label: "Rewind 10s", desc: "Jump back 10 seconds" },
  { key: "→ / L", label: "Forward 10s", desc: "Jump ahead 10 seconds" },
  { key: "S", label: "Skip Intro / Outro", desc: "Jump to exact end of OP/ED" },
  { key: "C", label: "Subtitles (CC)", desc: "Toggle subtitle track on/off" },
  { key: "N", label: "Next Reel", desc: "Advance to next episode" },
  { key: "P", label: "Prev Reel", desc: "Return to previous episode" },
  { key: "T", label: "Theater Stage", desc: "Toggle widescreen cinema mode" },
  { key: "I", label: "Picture-in-Picture", desc: "Float video outside browser" },
  { key: "F", label: "Fullscreen", desc: "Toggle full screen display" },
  { key: "M", label: "Mute Audio", desc: "Toggle sound on or off" },
  { key: "?", label: "Help Guide", desc: "Open this hotkey reference" },
];

export default function AnimeShortcutsModal({
  open,
  onOpenChange,
}: AnimeShortcutsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85vh] max-w-lg flex-col border border-hairline bg-surface-1 p-4 shadow-sleeve sm:p-6">
        <DialogHeader className="shrink-0 border-b border-hairline pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gold">
              <Command className="size-4" />
              <DialogTitle className="font-display text-base font-bold tracking-tight text-foreground sm:text-lg">
                Screening Room Hotkeys
              </DialogTitle>
            </div>
            <DialogClose asChild>
              <button
                type="button"
                className="rounded-xs p-1 text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
            </DialogClose>
          </div>
          <DialogDescription className="font-mono text-xs text-muted-foreground mt-1 text-left">
            Keyboard controls for quick cinema and reel navigation
          </DialogDescription>
        </DialogHeader>

        <div className="mt-3 grid grid-cols-1 gap-2 overflow-y-auto pr-1 sm:mt-4 sm:grid-cols-2">
          {SHORTCUTS.map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between gap-2 rounded-xs border border-hairline bg-surface-2/60 px-3 py-2"
            >
              <div className="min-w-0">
                <p className="font-display text-xs font-semibold text-foreground">
                  {item.label}
                </p>
                <p className="truncate font-mono text-[10px] text-muted-foreground">
                  {item.desc}
                </p>
              </div>
              <kbd className="shrink-0 rounded-xs border border-hairline bg-surface-3 px-2 py-0.5 font-mono text-[11px] font-bold text-gold">
                {item.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="mt-3 flex shrink-0 items-center justify-between border-t border-hairline pt-3 font-mono text-[10px] text-muted-foreground sm:mt-4">
          <span>Press ESC or tap X to dismiss</span>
          <span className="text-gold font-bold">WATCHLO // SPEC-V2</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
