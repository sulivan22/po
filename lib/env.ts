const required = [
  "AUTH_SECRET",
  "AUTH_GOOGLE_ID",
  "AUTH_GOOGLE_SECRET",
  "AUTH_APPLE_ID",
  "AUTH_APPLE_SECRET",
  "AUTH_APPLE_TEAM_ID",
  "AUTH_APPLE_KEY_ID",
  "MONGODB_URI",
  "MONGODB_DB",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "NEXT_PUBLIC_APP_URL"
] as const;

type EnvKey = (typeof required)[number];

function readEnv(key: EnvKey): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

export function getEnv() {
  return Object.fromEntries(required.map((key) => [key, readEnv(key)])) as Record<EnvKey, string>;
}
