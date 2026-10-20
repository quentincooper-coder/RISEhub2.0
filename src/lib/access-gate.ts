const encoder = new TextEncoder();
export const COOKIE_NAME = "risehub2_access";
export const SESSION_SECONDS = 60 * 60 * 24 * 7;

function config() {
  return {
    password: process.env.RISEHUB_ACCESS_PASSWORD,
    secret: process.env.RISEHUB_SESSION_SECRET,
  };
}

export function isAccessConfigured(): boolean {
  const { password, secret } = config();
  return Boolean(password && secret && secret.length >= 32);
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function signingKey() {
  const { secret } = config();
  if (!secret || !isAccessConfigured()) throw new Error("RISE Hub access is not configured");
  return crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

export async function verifyPassword(candidate: string): Promise<boolean> {
  const { password } = config();
  if (!password || !isAccessConfigured()) return false;
  const expected = await crypto.subtle.digest("SHA-256", encoder.encode(password));
  const received = await crypto.subtle.digest("SHA-256", encoder.encode(candidate));
  return bytesToHex(new Uint8Array(expected)) === bytesToHex(new Uint8Array(received));
}

export async function createSession(): Promise<string> {
  const expiry = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  const payload = String(expiry);
  const signature = await crypto.subtle.sign("HMAC", await signingKey(), encoder.encode(payload));
  return payload + "." + bytesToHex(new Uint8Array(signature));
}

export async function verifySession(value: string | undefined): Promise<boolean> {
  if (!value || !isAccessConfigured()) return false;
  const [expiryText, signatureHex, extra] = value.split(".");
  if (extra !== undefined || !expiryText || !signatureHex || !/^\d{10}$/.test(expiryText) || !/^[a-f0-9]{64}$/.test(signatureHex)) return false;
  const expiry = Number(expiryText);
  if (!Number.isSafeInteger(expiry) || expiry <= Date.now() / 1000 || expiry > Date.now() / 1000 + SESSION_SECONDS) return false;
  const signature = new Uint8Array(signatureHex.match(/../g)!.map((part) => parseInt(part, 16)));
  return crypto.subtle.verify("HMAC", await signingKey(), signature, encoder.encode(expiryText));
}
