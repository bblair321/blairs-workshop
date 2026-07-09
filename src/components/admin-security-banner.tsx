import { isDefaultAdminPassword } from "@/lib/site";

export function AdminSecurityBanner() {
  if (!isDefaultAdminPassword()) return null;

  return (
    <div className="mb-6 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
      Your admin password is still the default. Change <code>ADMIN_PASSWORD</code> in{" "}
      <code>.env</code> and restart the dev server.
    </div>
  );
}
