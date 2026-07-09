export const SITE_NAME = "Blair's Workshop";

export function getContactEmail(): string | null {
  const email = process.env.CONTACT_EMAIL?.trim();
  return email || null;
}

export function isDefaultAdminPassword(): boolean {
  const password = process.env.ADMIN_PASSWORD;
  return !password || password === "change-me-admin-password";
}
