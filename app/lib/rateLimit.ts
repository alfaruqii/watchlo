import { NextRequest, NextResponse } from "next/server";

interface WindowEntry {
  count: number;
  reset: number;
}

interface ClientEntry {
  short: WindowEntry;
  long: WindowEntry;
}

const SHORT_WINDOW_MS = 60_000;
const SHORT_MAX = 90;
const LONG_WINDOW_MS = 600_000;
const LONG_MAX = 800;
const MAX_TRACKED_CLIENTS = 20_000;
const PRUNE_INTERVAL_MS = 30_000;

const clients = new Map<string, ClientEntry>();
let lastPrune = 0;

function pruneExpiredClients(now: number) {
  lastPrune = now;
  clients.forEach((entry, key) => {
    if (entry.short.reset <= now && entry.long.reset <= now) {
      clients.delete(key);
    }
  });
}

function tickWindow(win: WindowEntry, now: number, windowMs: number, max: number): number {
  if (now >= win.reset) {
    win.count = 0;
    win.reset = now + windowMs;
  }
  if (win.count >= max) {
    return Math.ceil((win.reset - now) / 1000);
  }
  win.count += 1;
  return 0;
}

export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}

export function checkRateLimit(ip: string): {
  allowed: boolean;
  retryAfterSeconds: number;
} {
  const now = Date.now();

  if (now - lastPrune > PRUNE_INTERVAL_MS || clients.size > MAX_TRACKED_CLIENTS) {
    pruneExpiredClients(now);
  }

  let entry = clients.get(ip);
  if (!entry) {
    entry = {
      short: { count: 0, reset: 0 },
      long: { count: 0, reset: 0 },
    };
    clients.set(ip, entry);
  }

  const shortRetry = tickWindow(entry.short, now, SHORT_WINDOW_MS, SHORT_MAX);
  if (shortRetry > 0) {
    return { allowed: false, retryAfterSeconds: shortRetry };
  }

  const longRetry = tickWindow(entry.long, now, LONG_WINDOW_MS, LONG_MAX);
  if (longRetry > 0) {
    return { allowed: false, retryAfterSeconds: longRetry };
  }

  return { allowed: true, retryAfterSeconds: 0 };
}

const BLOCKED_REFERRERS = ["dildoe-games.pages.dev"];

export function isBlockedReferrer(request: NextRequest): boolean {
  const referer = request.headers.get("referer");
  if (!referer) return false;
  const normalized = referer.toLowerCase();
  return BLOCKED_REFERRERS.some((host) => normalized.includes(host));
}

export function blockedReferrerResponse(): NextResponse {
  return NextResponse.json(
    { error: "Forbidden" },
    { status: 403, headers: { "Cache-Control": "no-store" } }
  );
}

export function rateLimitResponse(retryAfterSeconds: number): NextResponse {
  return NextResponse.json(
    { error: "Too many requests", retryAfter: retryAfterSeconds },
    { status: 429, headers: { "Retry-After": String(retryAfterSeconds), "Cache-Control": "no-store" } }
  );
}

export function isLocalTraffic(request: NextRequest): boolean {
  const host = (request.headers.get("x-forwarded-host") || request.headers.get("host") || "")
    .split(":")[0]
    .toLowerCase();
  return (
    process.env.NODE_ENV === "development" ||
    host === "localhost" ||
    host === "127.0.0.1"
  );
}
