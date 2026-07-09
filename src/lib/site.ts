export const SITE_NAME = "Blair's Workshop";

/** Shown on legal pages; bump when terms or privacy policy change. */
export const LEGAL_LAST_UPDATED = "July 9, 2026";

export function getContactEmail(): string | null {
  const email = process.env.CONTACT_EMAIL?.trim();
  return email || null;
}

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? "https://blairsworkshop.com";
}

export function isDefaultAdminPassword(): boolean {
  const password = process.env.ADMIN_PASSWORD;
  return !password || password === "change-me-admin-password";
}
