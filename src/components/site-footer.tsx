import Link from "next/link";
import { getContactEmail, SITE_NAME } from "@/lib/site";

export function SiteFooter() {
  const contactEmail = getContactEmail();

  return (
    <footer className="mt-auto border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {SITE_NAME}. Unofficial mods — install at your own
          risk.
        </p>
        <div className="flex gap-4">
          <Link href="/terms" className="hover:text-violet-600">
            Terms
          </Link>
          {contactEmail ? (
            <a href={`mailto:${contactEmail}`} className="hover:text-violet-600">
              Contact
            </a>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
