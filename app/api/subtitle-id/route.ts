import { NextRequest, NextResponse } from "next/server";

// In-memory cache for translated Indonesian WebVTT files
const translatedVttCache = new Map<string, string>();
const MAX_CACHE_ENTRIES = 40;

function polishAnimeIndonesian(text: string): string {
  return text
    .replace(/\bmilik Anda\b/gi, "milikmu")
    .replace(/\bdiri Anda\b/gi, "dirimu")
    .replace(/\buntuk Anda\b/gi, "untukmu")
    .replace(/\bkepada Anda\b/gi, "padamu")
    .replace(/\bpada Anda\b/gi, "padamu")
    .replace(/\bdengan Anda\b/gi, "denganmu")
    .replace(/\bmilik saya\b/gi, "milikku")
    .replace(/\bdiri saya\b/gi, "diriku")
    .replace(/\buntuk saya\b/gi, "untukku")
    .replace(/\bkepada saya\b/gi, "padaku")
    .replace(/\bpada saya\b/gi, "padaku")
    .replace(/\bdengan saya\b/gi, "denganku")
    .replace(/(^|[.!?]\s+|["'“‘(\-]\s*)(Saya|saya)\b/g, "$1Aku")
    .replace(/\b(Saya|saya)\b/g, "aku")
    .replace(/(^|[.!?]\s+|["'“‘(\-]\s*)(Anda|anda)\b/g, "$1Kau")
    .replace(/\b(Anda|anda)\b/g, "kau")
    .replace(/\bApakah kau\b/g, "Apa kau")
    .replace(/\bapakah kau\b/g, "apa kau")
    .replace(/\bTidak dapat\b/g, "Tidak bisa")
    .replace(/\btidak dapat\b/g, "tidak bisa")
    .replace(/\bKau dapat\b/g, "Kau bisa")
    .replace(/\bkau dapat\b/g, "kau bisa")
    .replace(/\bAku dapat\b/g, "Aku bisa")
    .replace(/\baku dapat\b/g, "aku bisa")
    .replace(/\bMengapa\b/g, "Kenapa")
    .replace(/\bmengapa\b/g, "kenapa");
}

async function translateBatchToId(lines: string[]): Promise<string[]> {
  if (lines.length === 0) return [];
  const joined = lines.join("\n");
  try {
    const res = await fetch(
      "https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=en&tl=id",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        },
        body: "q=" + encodeURIComponent(joined),
      }
    );
    if (!res.ok) return lines;
    const data = await res.json();
    const translatedFull = Array.isArray(data)
      ? typeof data[0] === "string"
        ? data[0]
        : Array.isArray(data[0])
          ? data[0].map((p: unknown[]) => p?.[0] ?? "").join("")
          : ""
      : "";
    if (!translatedFull) return lines;
    const split = String(translatedFull).split("\n");
    return lines.map((orig, idx) =>
      split[idx] ? polishAnimeIndonesian(split[idx].trim()) : orig
    );
  } catch {
    return lines;
  }
}

function isSafeUrl(rawUrl: string, origin: string): boolean {
  try {
    const parsed = new URL(rawUrl);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return false;
    }
    const originParsed = new URL(origin);
    // Allow requests to the current server origin (e.g. /api/subtitles)
    if (parsed.origin === originParsed.origin) {
      return true;
    }
    const hostname = parsed.hostname.toLowerCase();
    if (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "0.0.0.0" ||
      hostname === "::1" ||
      hostname === "169.254.169.254" ||
      hostname.endsWith(".internal") ||
      hostname.endsWith(".local") ||
      /^10\./.test(hostname) ||
      /^192\.168\./.test(hostname) ||
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(hostname)
    ) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");
  if (!url) {
    return new NextResponse("WEBVTT\n\n", {
      status: 400,
      headers: { "Content-Type": "text/vtt; charset=utf-8" },
    });
  }

  // Resolve relative URLs to origin if needed
  const resolvedUrl = url.startsWith("/")
    ? new URL(url, request.nextUrl.origin).toString()
    : url;

  if (!isSafeUrl(resolvedUrl, request.nextUrl.origin)) {
    return new NextResponse("WEBVTT\n\n", {
      status: 400,
      headers: { "Content-Type": "text/vtt; charset=utf-8" },
    });
  }

  // Return cached translation if available
  const cached = translatedVttCache.get(url);
  if (cached) {
    return new NextResponse(cached, {
      status: 200,
      headers: {
        "Content-Type": "text/vtt; charset=utf-8",
        "Cache-Control": "public, max-age=86400",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  try {
    const upstreamRes = await fetch(resolvedUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      },
    });

    if (!upstreamRes.ok) {
      return new NextResponse("WEBVTT\n\n", {
        status: 502,
        headers: { "Content-Type": "text/vtt; charset=utf-8" },
      });
    }

    const rawVtt = await upstreamRes.text();
    const blocks = rawVtt.replace(/\r\n/g, "\n").split("\n\n");

    interface CueItem {
      blockIdx: number;
      headerLines: string;
      cleanText: string;
      isItalic: boolean;
    }

    const cues: CueItem[] = [];

    for (let i = 0; i < blocks.length; i++) {
      const lines = blocks[i].split("\n");
      const tsIdx = lines.findIndex((l) => l.includes("-->"));
      if (tsIdx !== -1) {
        const headerLines = lines.slice(0, tsIdx + 1).join("\n");
        const rawBody = lines.slice(tsIdx + 1).join(" ").trim();
        const isItalic = /^<i>[\s\S]*<\/i>$/i.test(rawBody);
        const rawText = rawBody
          .replace(/<[^>]+>/g, "")
          .replace(/\s+/g, " ")
          .trim();
        if (rawText) {
          cues.push({
            blockIdx: i,
            headerLines,
            cleanText: rawText,
            isItalic,
          });
        }
      }
    }

    // Batch into groups of 85 cues and translate in parallel
    const BATCH_SIZE = 85;
    const batches: CueItem[][] = [];
    for (let i = 0; i < cues.length; i += BATCH_SIZE) {
      batches.push(cues.slice(i, i + BATCH_SIZE));
    }

    await Promise.all(
      batches.map(async (batch) => {
        const translatedLines = await translateBatchToId(
          batch.map((c) => c.cleanText)
        );
        batch.forEach((cue, idx) => {
          const lineText = translatedLines[idx] || cue.cleanText;
          const formattedText = cue.isItalic ? `<i>${lineText}</i>` : lineText;
          blocks[cue.blockIdx] = `${cue.headerLines}\n${formattedText}`;
        });
      })
    );

    const finalVtt = blocks.join("\n\n");

    if (translatedVttCache.size >= MAX_CACHE_ENTRIES) {
      const oldestKey = translatedVttCache.keys().next().value;
      if (oldestKey) translatedVttCache.delete(oldestKey);
    }
    translatedVttCache.set(url, finalVtt);

    return new NextResponse(finalVtt, {
      status: 200,
      headers: {
        "Content-Type": "text/vtt; charset=utf-8",
        "Cache-Control": "public, max-age=86400",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Failed to translate VTT to Indonesian:", error);
    return new NextResponse("WEBVTT\n\n", {
      status: 500,
      headers: { "Content-Type": "text/vtt; charset=utf-8" },
    });
  }
}
