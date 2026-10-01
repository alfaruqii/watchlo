const SENSITIVE_KEYS = new Set([
  "CUSTOM_API_KEY",
  "WATCHLO_API_V0",
  "WATCHLO_API_V1",
  "WATCHLO_API_V2",
  "WATCHLO_ANIME_API",
  "INTERNAL_API_SECRET",
]);

export const getEnv = (env: string): string | undefined => {
  // Sensitive keys must never fall back to NEXT_PUBLIC_ prefixes to prevent exposing secrets in client bundles
  if (SENSITIVE_KEYS.has(env)) {
    return process.env[env];
  }
  return process.env[env] ?? process.env["NEXT_PUBLIC_" + env];
};
