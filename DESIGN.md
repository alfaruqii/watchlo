---
name: Watchlo
description: Archival Screening Room & Repertory Catalog for Cinema, Series, and Anime
colors:
  amber-projector: "#e09f3e"
  vermilion-seal: "#c84b31"
  obsidian-booth: "#0d0c0a"
  zone-sleeve-1: "#14120f"
  zone-sleeve-2: "#1c1915"
  zone-sleeve-3: "#26211c"
  warm-vellum: "#f2ece1"
  ash-vellum: "#b5ab9c"
  rule-hairline: "#2b2620"
  paper-archive: "#f2ece1"
  paper-zone-1: "#eae2d3"
  paper-zone-2: "#e2d8c5"
  paper-zone-3: "#d6c9b2"
  sumi-ink: "#141210"
  ochre-stamp: "#9a5b0d"
typography:
  display:
    fontFamily: "Bricolage Grotesque, MagnatBold, sans-serif"
    fontSize: "clamp(1.75rem, 3.8vw, 3.25rem)"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Bricolage Grotesque, MagnatBold, sans-serif"
    fontSize: "clamp(1.25rem, 2.2vw, 1.75rem)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Bricolage Grotesque, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Atkinson Hyperlegible, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "normal"
  label:
    fontFamily: "Azeret Mono, monospace"
    fontSize: "11px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.1em"
    fontFeature: "tnum"
  micro:
    fontFamily: "Azeret Mono, monospace"
    fontSize: "10px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.12em"
    fontFeature: "tnum"
rounded:
  none: "0px"
  xs: "2px"
  sm: "4px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
components:
  button-primary:
    backgroundColor: "{colors.amber-projector}"
    textColor: "{colors.obsidian-booth}"
    typography: "{typography.label}"
    rounded: "{rounded.xs}"
    padding: "10px 20px"
  button-outline:
    backgroundColor: "{colors.zone-sleeve-2}"
    textColor: "{colors.warm-vellum}"
    typography: "{typography.label}"
    rounded: "{rounded.xs}"
    padding: "10px 16px"
  card-sleeve:
    backgroundColor: "{colors.zone-sleeve-1}"
    textColor: "{colors.warm-vellum}"
    rounded: "{rounded.xs}"
    padding: "12px"
  chip-obi:
    backgroundColor: "{colors.zone-sleeve-2}"
    textColor: "{colors.warm-vellum}"
    typography: "{typography.label}"
    rounded: "{rounded.xs}"
    padding: "4px 10px"
---

# Design System: Watchlo

## Overview

**Creative North Star: "Criterion Spine & OBI Archive"**

Watchlo rejects the homogenized, black-and-red algorithmic streaming template in favor of a tactile, collector-grade archival screening room. Inspired by Criterion Collection numbered spines, Japanese LaserDisc OBI paper strips, MUBI Notebook dossiers, and 35mm contact-sheet exposure records, every surface treats films, series, and anime as curated physical editions rather than disposable content tiles.

The interface balances dual-polarity environments: **Obsidian Projection Booth** (`black` theme) for low-glare dark-room viewing and **Archival Paper** (`garden` theme) for daytime catalog reading. Information density is structured by exposed `1px` hairline ledger grids, tabular monospace catalog codes, and stepped tonal zone ramps instead of blurred glassmorphism or floating neon cards.

**Key Characteristics:**
- Numbered **Criterion Spine** vertical OBI strips on featured editions (`#001`–`#006`) paired with an interactive **Edition Reel** selector.
- Dual-polarity **Obsidian Projection Booth** (warm tungsten dark) and **Archival Paper** (unbleached vellum light) themes with zero pure `#000000` or `#FFFFFF` surfaces.
- Precision **1px hairline rules** and subtle L-shaped viewfinder corner brackets (`.obi-frame-corners`) framing key focal editions.
- **Tabular monospace ledger indices** (`Azeret Mono` with `tabular-nums`) for ratings, release years, episode counters, and catalog IDs.
- **Restrained physicality**: posters stay uncropped in `2:3` aspect sleeves (`object-cover`) above dedicated OBI footers so typography never collides with key art.

## Colors

Watchlo uses a warm tungsten and archival vellum palette engineered to eliminate eye strain in dark screening environments while preserving editorial print warmth in light mode.

### Primary
- **Amber Projector Lamp**: Primary interactive accent, active spine indicator, rating star fill, focus ring, and primary screening CTA fill. Used in Obsidian Projection Booth mode (`#e09f3e`) and deepened to **Ochre Stamp** (`#9a5b0d`) in Archival Paper mode for WCAG AA contrast.

### Secondary
- **Vermilion Hanko Seal**: Reserved for live broadcast indicators, air-status badges, destructive/error alerts, and curated highlight stamps (`#c84b31` in dark mode, `#b53820` in light mode).

### Neutral
- **Obsidian Projection Booth**: Primary dark canvas ground with warm carbon undertones (`#0d0c0a`).
- **Zone Sleeve Ramp (Zones I–III)**: Stepped tonal elevation planes for card sleeves, ledger headers, and interactive hover states (`#14120f`, `#1c1915`, `#26211c`).
- **Warm Vellum & Ash Vellum**: Primary reading ink (`#f2ece1`) and secondary metadata ink (`#b5ab9c`) in dark mode.
- **Archival Paper & Sumi Ink**: Unbleached cotton-rag light mode ground (`#f2ece1`) stepped through warm paper zones (`#eae2d3`, `#e2d8c5`, `#d6c9b2`) with deep **Sumi Ink** (`#141210`) typography.
- **Rule Hairline**: Exposed `1px` structural grid dividers (`#2b2620` in dark mode, `#cec2ae` in light mode).

### Named Rules
**The No-Netflix-Red Rule.** Pure `#000000` backgrounds and `#E50914` crimson primary buttons are strictly forbidden. Primary calls-to-action always use Amber Projector Lamp (`#e09f3e`) with dark ink text.

**The Warm Ground Rule.** Both dark and light grounds carry a deliberate warm yellow-ochre undertone (`~35°–40°` hue). Cold blue-slate dark modes (`#0f172a`) and sterile `#ffffff` white backgrounds are never used.

## Typography

**Display Font:** Bricolage Grotesque (with local MagnatBold and sans-serif fallback)
**Body Font:** Atkinson Hyperlegible (with system-ui fallback)
**Label/Mono Font:** Azeret Mono (monospace)

**Character:** Expressive, high-contrast editorial display headlines paired with hyper-legible humanist body copy and precision technical monospace for archival cataloging.

### Hierarchy
- **Display** (700 weight, `clamp(1.75rem, 3.8vw, 3.25rem)`, `1.08` line-height): Featured Hero Edition titles and primary Dossier titles (`<h1>`).
- **Headline** (700 weight, `clamp(1.25rem, 2.2vw, 1.75rem)`, `1.15` line-height): Catalog section headers (`<h2>`) such as *Now Screening*, *Serialized Television*, and *Curator's Intermission*.
- **Title** (600 weight, `0.9375rem`, `1.25` line-height): Poster sleeve titles (`<h3>`) and episode/season ledger titles.
- **Body** (400 weight, `0.9375rem`, `1.65` line-height): Synopses, reviews, and documentation prose constrained to `60ch–72ch` measure.
- **Label** (600 weight, `11px` / `0.6875rem`, `0.1em` letter-spacing, uppercase): Spine numbers, catalog IDs (`WLO-ID`), ratings, release years, and episode counters with `font-variant-numeric: tabular-nums`.
- **Micro** (600 weight, `10px` / `0.625rem`, `0.12em` letter-spacing, uppercase): OBI field headers (`CRITERION SPINE`, `CATALOG ID`, `RELEASE YEAR`), keyboard shortcut kbd tags (`CTRL K`), and compact badge prefixes.

### Named Rules
**The Heading-First Rule.** Headings (`<h1>`, `<h2>`, `<h3>`) lead their containers or follow only a compact inline catalog badge—never a stacked multi-line uppercase eyebrow above the heading.

**The Tabular Index Rule.** Every numeric readout—ratings (`8.4 / 10`), spine indices (`#001`), release years (`2024`), and episode numbers (`EP 01`)—must render in `Azeret Mono` with `tabular-nums`.

## Layout

Watchlo is organized as a full-bleed archival ledger bounded by `max-w-[1600px]` centered containers (`px-4 sm:px-6 lg:px-10`) with exposed `1px solid` hairline borders dividing major functional zones.

- **Hero Screening Stage:** 12-column desktop grid (`md:grid-cols-12`) divided into a 2-column vertical **Criterion Spine** OBI metadata strip on the left, a 7-column widescreen `16:9` key-art stage in the center, and a 3-column interactive **Edition Reel** (`#01`–`#06`) selector on the right.
- **Catalog Sleeve Grids:** Responsive CSS Grid (`grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6`) with `16px–20px` gaps (`gap-4 sm:gap-5`).
- **Editorial Rhythm:** Uniform card grids are broken up by a full-width **Curator's Intermission** horizontal plate between the Cinema and Serialized Television rails.
- **Dossier Detail View:** Widescreen `21:9` backdrop header followed by a 12-column asymmetric split: a 3-column physical poster sleeve + technical specification table on the left, and a 9-column synopsis, genre index, trailer/episode ledger, and review archive on the right.

## Elevation & Depth

Watchlo conveys hierarchy primarily through **stepped tonal zones** (`--background` → `--surface-1` → `--surface-2` → `--surface-3`) and crisp `1px` hairline borders rather than heavy drop shadows or frosted-glass blurs.

### Shadow Vocabulary
- **Sleeve Lift** (`box-shadow: 0 14px 34px -10px rgba(0, 0, 0, 0.55)` in dark mode; `0 12px 28px -10px rgba(20, 18, 16, 0.16)` in light mode): Applied to physical poster sleeves on hover (`-translate-y-0.5`) and modal dialog frames.

### Named Rules
**The Stepped Zone Rule.** Surfaces sit flat within their `1px` hairline cells at rest. Depth is articulated by stepping one tonal zone lighter (`surface-1` to `surface-2`) on interaction, reserving `shadow-sleeve` strictly for physical poster sleeves and the command-palette modal.

## Shapes

The form language is architectural and print-derived: crisp `2px` (`rounded-sm`) corners on buttons, badges, and poster sleeves, paired with exposed `1px solid` hairline borders.

- **Poster Sleeves:** Strictly `2:3` vertical aspect ratio (`aspect-[2/3]`) with an uncropped image top and a solid `surface-1` OBI strip footer separated by a `1px` hairline border.
- **Viewfinder Corner Brackets (`.obi-frame-corners`):** Precision `10px × 10px` L-shaped Amber Gold corner brackets (`1.5px` stroke) framing the Hero Screening Stage and active focal frames.
- **No Circular Pill Blobs:** Interactive controls and genre tags use `2px` architectural corners (`rounded-sm`) rather than full `9999px` pill radii.

## Components

### Buttons
- **Shape:** Crisp `2px` radius (`rounded-sm`) with uppercase `Azeret Mono` tracking (`0.1em`).
- **Primary:** Amber Projector Lamp fill (`#e09f3e`) with dark Obsidian Booth ink (`#0d0c0a`), `10px 20px` padding, transitioning to `90%` brightness on hover.
- **Outline / Secondary:** Zone Sleeve 2 background (`#1c1915`) with `1px solid` hairline border (`#2b2620`), shifting border and text to Amber Projector Lamp on hover.
- **Focus:** `2px solid` Amber Projector Lamp outline with `2px` offset (`:focus-visible`).

### Chips
- **Style:** Used for Genre Index tags and Catalog Spine badges. Rendered in `Azeret Mono` (`11px`), `4px 10px` padding, `1px solid` hairline border over `surface-2`.
- **State:** Hovering shifts the border to Amber Projector Lamp (`#e09f3e`) and background to `surface-3`.

### Cards / Containers
- **Corner Style:** `2px` radius (`rounded-sm`) with `overflow-hidden`.
- **Background:** `surface-1` (`#14120f` dark / `#eae2d3` light).
- **Shadow Strategy:** Flat at rest with a `1px solid` hairline border; lifts `-2px` (`-translate-y-0.5`) with `shadow-sleeve` and an Amber Gold border tint on hover.
- **Internal Padding:** `12px` (`p-3`) inside the bottom OBI strip footer, housing a top metadata row (`FORMAT` + `★ SCORE`) and a 2-line clamped title below.

### Inputs / Fields
- **Style:** Command-palette search input inside `ModalSearch` uses a full-width ledger header bar (`h-12`), transparent background over `surface-2`, and `1px solid` bottom hairline rule.
- **Focus:** Caret and active search icon illuminate in Amber Projector Lamp (`#e09f3e`).

### Navigation
- **Style:** Sticky top Archival Masthead (`h-16`, `border-b border-hairline`, `bg-background/95 backdrop-blur-md`) featuring the Watchlo catalog mark + `ARC-01` badge on the left, numbered section links (`01 / Cinema & TV`, `02 / Anime Archive`, `03 / Index & Docs`) in the center, and the `CTRL K` catalog search trigger + `Paper / Booth` polarity switch on the right.

### Criterion Spine & Edition Reel (Signature Component)
- **Structure:** The Hero Screening Stage pairs a left-hand vertical **Criterion Spine** column (`CRITERION SPINE #001`, `CATALOG ID WLO-…`, `RELEASE YEAR`, `ARCHIVE RATING`) with a right-hand interactive **Edition Reel** list (`#01`–`#06`) that lets viewers switch featured screenings directly or step through with tabular prev/next controls.

## Do's and Don'ts

### Do:
- **Do** keep all poster artwork inside `aspect-[2/3]` sleeves with the title and rating housed in the solid OBI footer below the image.
- **Do** format every catalog number, rating, year, and episode index in `Azeret Mono` (`font-mono tabular-nums`).
- **Do** maintain both `html[data-theme="black"]` (Obsidian Projection Booth) and `html[data-theme="garden"]` (Archival Paper) whenever introducing new semantic surfaces.
- **Do** provide graceful fallback states when upstream third-party providers (TMDB, AniList, Gogoanime, Consumet) time out or return empty lists.

### Don't:
- **Don't** use Netflix-style `#000000` backgrounds, `#E50914` red primary buttons, or auto-expanding hover video cards that shift neighboring layout cells.
- **Don't** stack uppercase kicker/eyebrow labels directly above `<h1>`, `<h2>`, or `<h3>` headings.
- **Don't** overlay multi-line titles or paragraphs directly across unmasked poster key art where bright backgrounds destroy legibility.
- **Don't** block initial page load with a forced modal popup; keep archival notices quiet and dismissible in the masthead flow.
