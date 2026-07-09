import Link from "next/link";
import { getContactEmail, SITE_NAME } from "@/lib/site";

export function SiteFooter() {
  const contactEmail = getContactEmail();

  return (
    <footer className="mt-auto border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-md text-sm text-zinc-500">
            <p className="font-medium text-zinc-700 dark:text-zinc-300">
              © {new Date().getFullYear()} {SITE_NAME}
            </p>
            <p className="mt-2 leading-relaxed">
              Unofficial PC game mods, Lua scripts, and tools. Not affiliated with
              game publishers. Install at your own risk — back up your saves.
            </p>
          </div>

          <nav
            className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-zinc-500"
            aria-label="Legal and contact"
          >
            <Link href="/terms" className="hover:text-violet-600 dark:hover:text-violet-400">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-violet-600 dark:hover:text-violet-400">
              Privacy
            </Link>
            <Link
              href="/terms#dmca"
              className="hover:text-violet-600 dark:hover:text-violet-400"
            >
              DMCA
            </Link>
            {contactEmail ? (
              <a
                href={`mailto:${contactEmail}`}
                className="hover:text-violet-600 dark:hover:text-violet-400"
              >
                {contactEmail}
              </a>
            ) : null}
          </nav>
        </div>
      </div>
    </footer>
  );
}
