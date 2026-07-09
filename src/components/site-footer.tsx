import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Blair&apos;s Workshop. Unofficial mods — install at your own risk.</p>
        <div className="flex gap-4">
          <Link href="/terms" className="hover:text-violet-600">
            Terms
          </Link>
          <a href="mailto:dmca@example.com" className="hover:text-violet-600">
            DMCA
          </a>
          <Link href="/admin" className="hover:text-violet-600">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
