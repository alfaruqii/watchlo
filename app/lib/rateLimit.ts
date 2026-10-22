import { NextRequest, NextResponse } from "next/server";

interface WindowEntry {
  count: number;
  reset: number;
}

interface ClientEntry {
  short: WindowEntry;
  long: WindowEntry;
}

interface LimiterLimits {
  shortMax: number;
  shortWindowMs: number;
  longMax: number;
  longWindowMs: number;
}

const GLOBAL_LIMITS: LimiterLimits = {
  shortMax: 90,
  shortWindowMs: 60_000,
  longMax: 800,
  longWindowMs: 600_000,
};

const MAX_TRACKED_CLIENTS = 20_000;
const PRUNE_INTERVAL_MS = 30_000;

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

class RateLimiter {
  private clients = new Map<string, ClientEntry>();
  private lastPrune = 0;

  constructor(private limits: LimiterLimits) {}

  check(ip: string): { allowed: boolean; retryAfterSeconds: number } {
    const now = Date.now();

    if (now - this.lastPrune > PRUNE_INTERVAL_MS || this.clients.size > MAX_TRACKED_CLIENTS) {
      this.prune(now);
    }

    let entry = this.clients.get(ip);
    if (!entry) {
      entry = {
        short: { count: 0, reset: 0 },
        long: { count: 0, reset: 0 },
      };
      this.clients.set(ip, entry);
    }

    const shortRetry = tickWindow(entry.short, now, this.limits.shortWindowMs, this.limits.shortMax);
    if (shortRetry > 0) {
      return { allowed: false, retryAfterSeconds: shortRetry };
    }

    const longRetry = tickWindow(entry.long, now, this.limits.longWindowMs, this.limits.longMax);
    if (longRetry > 0) {
      return { allowed: false, retryAfterSeconds: longRetry };
    }

    return { allowed: true, retryAfterSeconds: 0 };
  }

  private prune(now: number) {
    this.lastPrune = now;
    this.clients.forEach((entry, key) => {
      if (entry.short.reset <= now && entry.long.reset <= now) {
        this.clients.delete(key);
      }
    });
  }
}

const globalLimiter = new RateLimiter(GLOBAL_LIMITS);

const ROUTE_LIMITS: Array<{ prefix: string; limiter: RateLimiter }> = [
  {
    prefix: "/api/subtitle-id",
    limiter: new RateLimiter({
      shortMax: 10,
      shortWindowMs: 60_000,
      longMax: 60,
      longWindowMs: 600_000,
    }),
  },
];

export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}

export function checkRateLimit(ip: string): {
  allowed: boolean;
  retryAfterSeconds: number;
} {
  return globalLimiter.check(ip);
}

export function checkRouteRateLimit(
  pathname: string,
  ip: string
): { matched: boolean; allowed: boolean; retryAfterSeconds: number } {
  for (const route of ROUTE_LIMITS) {
    if (pathname.startsWith(route.prefix)) {
      const result = route.limiter.check(ip);
      return { matched: true, ...result };
    }
  }
  return { matched: false, allowed: true, retryAfterSeconds: 0 };
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
