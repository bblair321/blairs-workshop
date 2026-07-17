import Link from "next/link";
import { getContactEmail, SITE_NAME } from "@/lib/site";

const FOOTER_LINKS = [
  { href: "/mods", label: "Mods" },
  { href: "/fivem", label: "FiveM Scripts" },
  { href: "/tools", label: "Tools" },
  { href: "/library", label: "Library" },
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
] as const;

export function SiteFooter() {
  const contactEmail = getContactEmail();

  return (
    <footer className="mt-auto border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          <div className="max-w-sm">
            <p className="text-base font-semibold">
              Blair&apos;s <span className="text-violet-600">Workshop</span>
            </p>
            <p className="mt-2 text-sm leading-relaxed text-zinc-500">
              PC game mods, FiveM scripts, and modding tools. Unofficial content —
              install at your own risk.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-10 gap-y-6 text-sm">
            <div>
              <p className="mb-2 font-medium text-zinc-700 dark:text-zinc-300">Browse</p>
              <ul className="space-y-1.5 text-zinc-500">
                {FOOTER_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="transition hover:text-violet-600 dark:hover:text-violet-400"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            {contactEmail && (
              <div>
                <p className="mb-2 font-medium text-zinc-700 dark:text-zinc-300">Contact</p>
                <a
                  href={`mailto:${contactEmail}`}
                  className="text-zinc-500 transition hover:text-violet-600 dark:hover:text-violet-400"
                >
                  {contactEmail}
                </a>
                <p className="mt-2">
                  <Link
                    href="/terms#dmca"
                    className="text-zinc-500 transition hover:text-violet-600 dark:hover:text-violet-400"
                  >
                    DMCA
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>

        <p className="mt-8 border-t border-zinc-200 pt-6 text-xs text-zinc-400 dark:border-zinc-800">
          © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
