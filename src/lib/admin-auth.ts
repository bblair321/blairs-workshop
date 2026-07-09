import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const ADMIN_COOKIE = "mod_admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

function getAdminSecret(): string {
  return process.env.ADMIN_PASSWORD ?? "";
}

function signPayload(payload: string): string {
  return createHmac("sha256", getAdminSecret()).update(payload).digest("hex");
}

export async function createAdminSession(): Promise<void> {
  const expiresAt = Date.now() + SESSION_MAX_AGE * 1000;
  const payload = `admin:${expiresAt}`;
  const signature = signPayload(payload);
  const token = Buffer.from(`${payload}:${signature}`).toString("base64url");

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const secret = getAdminSecret();
  if (!secret) return false;

  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!token) return false;

  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const [role, expiresAtStr, signature] = decoded.split(":");
    if (role !== "admin" || !expiresAtStr || !signature) return false;

    const expiresAt = Number(expiresAtStr);
    if (Number.isNaN(expiresAt) || Date.now() > expiresAt) return false;

    const expected = signPayload(`${role}:${expiresAtStr}`);
    const sigBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expected);
    if (sigBuffer.length !== expectedBuffer.length) return false;

    return timingSafeEqual(sigBuffer, expectedBuffer);
  } catch {
    return false;
  }
}

export function verifyAdminPassword(password: string): boolean {
  const expected = getAdminSecret();
  if (!expected) return false;

  const a = Buffer.from(password);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;

  return timingSafeEqual(a, b);
}
