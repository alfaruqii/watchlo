/*
THESIS: Watchlo is an archival collector's screening room uniting cinema, television, and anime, refusing Netflix's pure-black red-accented algorithmic carousels.
OWN-WORLD: Criterion Spine & OBI Archive (#0D0C0A obsidian carbon, #F2ECE1 archival cream, #E09F3E tungsten gold, #C84B31 vermilion seal) with stepped tonal zones, vertical OBI metadata spines, safe-area corner brackets, and tabular-nums catalog numbering.
STORY: Visitors immediately recognize a curated physical-edition repertory catalog, inspect rich release metadata without clutter, and enter multi-provider playback in one click.
FIRST VIEWPORT: Asymmetric widescreen collector's showcase with a vertical OBI spine column on the left, high-contrast 35mm still and Bricolage Grotesque display title in the center, and primary Enter Screening Room action plus interactive edition switcher.
FORM: Criterion Spine & OBI Archive, candidate 5 on the grounded list, seed key 27bdd4fa.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
*/
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import localFont from "next/font/local";
import {
  Bricolage_Grotesque,
  Atkinson_Hyperlegible,
  Azeret_Mono,
} from "next/font/google";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/Footer";
import ModalSearch from "./components/search/ModalSearch";
import ModalDocs from "./components/docs/ModalDocs";
import "./globals.css";
import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "700", "800"],
});

const atkinson = Atkinson_Hyperlegible({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "700"],
});

const azeretMono = Azeret_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
});

const magnatBold = localFont({
  src: "./fonts/MagnatBold.woff",
  variable: "--font-magnatBold",
  weight: "700",
});

export const metadata: Metadata = {
  title: "Watchlo — Archival Screening Room & Repertory Catalog",
  description:
    "Curated Movies, TV Series, and Anime screening room with instant multi-provider playback.",
};

const DIRECTION_CONTRACT_COMMENT = `<!--
THESIS: Watchlo is an archival collector's screening room uniting cinema, television, and anime, refusing Netflix's pure-black red-accented algorithmic carousels.
OWN-WORLD: Criterion Spine & OBI Archive (#0D0C0A obsidian carbon, #F2ECE1 archival cream, #E09F3E tungsten gold, #C84B31 vermilion seal) with stepped tonal zones, vertical OBI metadata spines, safe-area corner brackets, and tabular-nums catalog numbering.
STORY: Visitors immediately recognize a curated physical-edition repertory catalog, inspect rich release metadata without clutter, and enter multi-provider playback in one click.
FIRST VIEWPORT: Asymmetric widescreen collector's showcase with a vertical OBI spine column on the left, high-contrast 35mm still and Bricolage Grotesque display title in the center, and primary Enter Screening Room action plus interactive edition switcher.
FORM: Criterion Spine & OBI Archive, candidate 5 on the grounded list, seed key 27bdd4fa.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
-->`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="black">
      <body
        className={`${atkinson.variable} ${bricolage.variable} ${azeretMono.variable} ${magnatBold.variable} min-h-screen bg-background font-sans text-foreground antialiased selection:bg-gold selection:text-[#0d0c0a]`}
      >
        <div
           hidden
          aria-hidden="true"
          dangerouslySetInnerHTML={{ __html: DIRECTION_CONTRACT_COMMENT }}
        />
        <Navbar />
        <ModalSearch />
        <ModalDocs />
        <main className="mx-auto max-w-[1680px]">{children}</main>
        <Analytics />
        <SpeedInsights />
        <Footer />
      </body>
    </html>
  );
}
