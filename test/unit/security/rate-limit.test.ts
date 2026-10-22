/**
 * @jest-environment node
 */

import type { NextRequest } from "next/server";
import {
  checkRateLimit,
  isBlockedReferrer,
  getClientIp,
} from "@/lib/rateLimit";

const NEXT_REQUEST_VALID_KEYS = [
  "x-forwarded-for",
  "x-real-ip",
  "referer",
  "host",
] as const;

function makeFakeRequest(headers: Record<string, string> = {}): NextRequest {
  return {
    headers: {
      get: (key: string) => headers[key.toLowerCase()] ?? null,
    },
    nextUrl: new URL("http://localhost/"),
    cookies: {
      get: () => undefined,
    },
  } as unknown as NextRequest;
}

function uniqueIp(index: number): string {
  return `203.0.113.${index}`;
}

describe("Rate Limit Utility", () => {
  it("allows requests within the burst limit", () => {
    const ip = uniqueIp(1);
    for (let i = 0; i < 20; i++) {
      expect(checkRateLimit(ip).allowed).toBe(true);
    }
  });

  it("blocks requests exceeding the short window burst limit", () => {
    const ip = uniqueIp(2);
    for (let i = 0; i < 90; i++) {
      checkRateLimit(ip);
    }
    const result = checkRateLimit(ip);
    expect(result.allowed).toBe(false);
    expect(result.retryAfterSeconds).toBeGreaterThan(0);
    expect(result.retryAfterSeconds).toBeLessThanOrEqual(60);
  });

  it("blocks a separate IP hitting the sustained window independently", () => {
    const ip = uniqueIp(3);
    for (let i = 0; i < 800; i++) {
      checkRateLimit(ip);
    }
    expect(checkRateLimit(ip).allowed).toBe(false);
    expect(checkRateLimit(uniqueIp(4)).allowed).toBe(true);
  });

  it("blocks a burst-heavy client well before the sustained window", () => {
    const ip = uniqueIp(5);
    let blocked = false;
    for (let i = 0; i < 200; i++) {
      if (!checkRateLimit(ip).allowed) {
        blocked = true;
        break;
      }
    }
    expect(blocked).toBe(true);
  });
});

describe("Referrer Blocklist", () => {
  it("blocks the known abusive referrer host", () => {
    const request = makeFakeRequest({
      referer: "https://dildoe-games.pages.dev/some-page",
    });
    expect(isBlockedReferrer(request)).toBe(true);
  });

  it("blocks case-insensitive and path variations", () => {
    const root = makeFakeRequest({
      referer: "HTTPS://DILDOE-GAMES.PAGES.DEV/",
    });
    expect(isBlockedReferrer(root)).toBe(true);
  });

  it("allows legitimate search engine referrers", () => {
    const google = makeFakeRequest({ referer: "https://www.google.com/" });
    const bing = makeFakeRequest({ referer: "https://www.bing.com/search?q=x" });
    const none = makeFakeRequest({});
    expect(isBlockedReferrer(google)).toBe(false);
    expect(isBlockedReferrer(bing)).toBe(false);
    expect(isBlockedReferrer(none)).toBe(false);
  });

  it("allows the site's own domain", () => {
    const self = makeFakeRequest({
      referer: "https://watchlovercel.app/anime",
    });
    expect(isBlockedReferrer(self)).toBe(false);
  });
});

describe("Client IP Extraction", () => {
  it("uses the first entry of x-forwarded-for", () => {
    const request = makeFakeRequest({
      "x-forwarded-for": "198.51.100.7, 10.0.0.1",
    });
    expect(getClientIp(request)).toBe("198.51.100.7");
  });

  it("falls back to x-real-ip when x-forwarded-for is absent", () => {
    const request = makeFakeRequest({ "x-real-ip": "198.51.100.9" });
    expect(getClientIp(request)).toBe("198.51.100.9");
  });

  it("returns unknown when no IP headers are present", () => {
    const request = makeFakeRequest({});
    expect(getClientIp(request)).toBe("unknown");
  });
});

describe("Request Header Contract", () => {
  it("fakes proxy the same header keys the middleware relies on", () => {
    expect(NEXT_REQUEST_VALID_KEYS).toEqual(
      expect.arrayContaining(["x-forwarded-for", "referer", "host"])
    );
  });
});
