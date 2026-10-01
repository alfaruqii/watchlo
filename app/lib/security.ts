import { NextRequest, NextResponse } from "next/server";

// Secret key used for signing internal request tokens
const SECRET_SEED =
  process.env.INTERNAL_API_SECRET ||
  process.env.CUSTOM_API_KEY ||
  "watchlo-shield-internal-v1";

const COOKIE_NAME = "wl_token";
const TOKEN_MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

// Helper to get CryptoKey
async function getCryptoKey(): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    enc.encode(SECRET_SEED),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

// Convert ArrayBuffer to hex string
function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Generate signed session token: timestamp.signature
export async function generateInternalToken(): Promise<string> {
  const timestamp = Date.now().toString();
  const key = await getCryptoKey();
  const enc = new TextEncoder();
  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    enc.encode(`watchlo:${timestamp}`)
  );
  const sigHex = toHex(signatureBuffer);
  return `${timestamp}.${sigHex}`;
}

// Verify session token
export async function verifyInternalToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [timestampStr, providedSig] = parts;
  const timestamp = parseInt(timestampStr, 10);
  if (isNaN(timestamp)) return false;

  // Check expiration (24h)
  const now = Date.now();
  if (now - timestamp > TOKEN_MAX_AGE_MS || timestamp > now + 60000) {
    return false;
  }

  const key = await getCryptoKey();
  const enc = new TextEncoder();
  const expectedSigBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    enc.encode(`watchlo:${timestampStr}`)
  );
  const expectedSig = toHex(expectedSigBuffer);

  return expectedSig === providedSig;
}

// Extract host from headers
function getExpectedHost(request: NextRequest): string {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const host = forwardedHost || request.headers.get("host") || "";
  return host.split(":")[0].toLowerCase();
}

/**
 * Validates that an incoming /api/* request is legitimate, originated from Watchlo,
 * and not being leeched by external websites or unauthorized scripts.
 */
export async function validateApiAccess(request: NextRequest): Promise<
  | { allowed: true }
  | { allowed: false; response: NextResponse }
> {
  const host = getExpectedHost(request);
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const secFetchSite = request.headers.get("sec-fetch-site");

  // 1. Block explicit cross-site browser requests (Fetch Metadata)
  if (secFetchSite === "cross-site") {
    return {
      allowed: false,
      response: NextResponse.json(
        { error: "Forbidden: Cross-origin API access denied" },
        { status: 403 }
      ),
    };
  }

  // 2. Block mismatched Origin header
  if (origin) {
    try {
      const originUrl = new URL(origin);
      if (originUrl.hostname.toLowerCase() !== host) {
        return {
          allowed: false,
          response: NextResponse.json(
            { error: "Forbidden: Origin not permitted" },
            { status: 403 }
          ),
        };
      }
    } catch {
      return {
        allowed: false,
        response: NextResponse.json({ error: "Invalid origin" }, { status: 403 }),
      };
    }
  }

  // 3. Block mismatched Referer header
  if (referer) {
    try {
      const refererUrl = new URL(referer);
      if (refererUrl.hostname.toLowerCase() !== host) {
        return {
          allowed: false,
          response: NextResponse.json(
            { error: "Forbidden: Referer not permitted" },
            { status: 403 }
          ),
        };
      }
    } catch {
      return {
        allowed: false,
        response: NextResponse.json({ error: "Invalid referer" }, { status: 403 }),
      };
    }
  }

  // 4. In development, allow localhost without requiring strict token for easier DX
  const isLocalDev =
    process.env.NODE_ENV === "development" ||
    host === "localhost" ||
    host === "127.0.0.1";

  if (isLocalDev && (!referer || referer.includes("localhost") || referer.includes("127.0.0.1"))) {
    return { allowed: true };
  }

  // 5. Verify the signed internal token cookie
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const isTokenValid = await verifyInternalToken(token);

  if (!isTokenValid) {
    return {
      allowed: false,
      response: NextResponse.json(
        { error: "Forbidden: Valid session signature required" },
        { status: 403 }
      ),
    };
  }

  return { allowed: true };
}

export { COOKIE_NAME };
