"use client";

import Link from "next/link";
import { Film, ShieldAlert, ArrowUpRight, BookOpen, Compass } from "lucide-react";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      data-testid="footer-container"
      className="mt-20 border-t border-hairline bg-surface-1 px-4 pt-10 pb-20 text-muted-foreground sm:px-6 sm:pb-12 lg:px-10"
    >
      <div className="mx-auto max-w-[1680px]">
        {/* Main Grid: Brand Dossier & Categorized Navigation */}
        <div className="grid grid-cols-1 gap-8 border-b border-hairline pb-8 md:grid-cols-12 md:gap-10">
          {/* Brand & System Status */}
          <div className="flex flex-col gap-3 md:col-span-6 lg:col-span-7">
            <div className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-widest text-foreground">
              <Film className="size-3.5 shrink-0 text-gold" strokeWidth={1.75} />
              <span>WATCHLO ARCHIVE // REPERTORY SCREENING ROOM</span>
            </div>
            <p className="max-w-[65ch] text-xs leading-relaxed text-muted-foreground sm:text-sm">
              Archival media discovery and screening room for cinema, television series,
              anime, and manga. Built for direct playback with multi-provider streams,
              AniSkip timecode skipping, and high-contrast solid surfaces.
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-2.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground/80">
              <span className="inline-flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                INDEX ONLINE
              </span>
              <span className="text-hairline">•</span>
              <span>TMDB &amp; ANILIST</span>
              <span className="text-hairline">•</span>
              <span>AD-FREE INTERFACE</span>
            </div>
          </div>

          {/* Repertory Catalog Links */}
          <div className="flex flex-col gap-2.5 md:col-span-3 lg:col-span-2">
            <p className="flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-widest text-foreground">
              <Compass className="size-3.5 text-gold" strokeWidth={1.75} />
              <span>REPERTORY</span>
            </p>
            <ul className="flex flex-col gap-2 font-mono text-xs">
              <li>
                <Link
                  href="/"
                  className="transition-colors hover:text-gold"
                >
                  Cinema &amp; TV
                </Link>
              </li>
              <li>
                <Link
                  href="/anime"
                  className="transition-colors hover:text-gold"
                >
                  Anime Series
                </Link>
              </li>
              <li>
                <Link
                  href="/manga"
                  className="transition-colors hover:text-gold"
                >
                  Manga Shelf
                </Link>
              </li>
            </ul>
          </div>

          {/* Screening Dossier & Documentation Links */}
          <div className="flex flex-col gap-2.5 md:col-span-3 lg:col-span-3">
            <p className="flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-widest text-foreground">
              <BookOpen className="size-3.5 text-gold" strokeWidth={1.75} />
              <span>SCREENING DOSSIER</span>
            </p>
            <ul className="flex flex-col gap-2 font-mono text-xs">
              <li>
                <Link
                  href="/docs"
                  className="inline-flex items-center gap-1.5 transition-colors hover:text-gold"
                >
                  <ShieldAlert className="size-3 shrink-0 text-gold" strokeWidth={1.75} />
                  <span>Playback Guide &amp; DNS</span>
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/alfaruqii/watchlo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 transition-colors hover:text-gold"
                >
                  <span>GitHub Repository</span>
                  <ArrowUpRight className="size-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Responsible Screening Notice */}
        <div className="border-b border-hairline/60 py-3.5">
          <p className="text-[11px] leading-relaxed text-muted-foreground/80">
            <strong className="mr-1.5 font-mono font-semibold uppercase tracking-wider text-gold">
              ARCHIVE NOTICE:
            </strong>
            Watchlo is an experimental, non-commercial catalog index. Video files and stream mirrors are retrieved from independent third-party providers. Please browse responsibly.
          </p>
        </div>

        {/* Bottom Colophon Bar */}
        <div className="flex flex-col gap-3 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[11px] text-muted-foreground tabular-nums">
            COPYRIGHT © {currentYear} WATCHLO // CREATED BY{" "}
            <a
              href="https://github.com/alfaruqii"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-foreground underline underline-offset-2 hover:text-gold"
            >
              ALFARUQI
            </a>
          </p>

          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/75">
            <span>WARM OBSIDIAN</span>
            <span>•</span>
            <span>ZERO GLASSMORPHISM</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
