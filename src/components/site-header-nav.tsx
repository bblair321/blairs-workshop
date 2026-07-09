"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type SiteHeaderNavProps = {
  user: { name?: string | null; email?: string | null } | null;
};

const NAV_LINKS = [
  { href: "/mods", label: "Browse Mods" },
  { href: "/lua", label: "Lua Scripts" },
  { href: "/tools", label: "Tools" },
  { href: "/library", label: "My Library" },
] as const;

export function SiteHeaderNav({ user }: SiteHeaderNavProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/85 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/85">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5">
        <Link
          href="/"
          onClick={closeMenu}
          className="text-lg font-bold tracking-tight transition hover:opacity-80"
        >
          Blair&apos;s <span className="text-violet-600">Workshop</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const active =
              pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-violet-600 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-violet-400"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <span className="max-w-[140px] truncate text-sm text-zinc-500">
                {user.name ?? user.email}
              </span>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="btn-secondary !py-2"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link href="/login" className="btn-primary !py-2">
              Sign In
            </Link>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="rounded-lg p-2 text-zinc-600 transition hover:bg-zinc-100 md:hidden dark:text-zinc-300 dark:hover:bg-zinc-900"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden>
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden>
              <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </button>
      </div>

      {menuOpen && (
        <nav
          id="mobile-nav"
          className="border-t border-zinc-200 px-4 py-4 md:hidden dark:border-zinc-800"
        >
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => {
              const active =
                pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className={`rounded-lg px-3 py-2.5 text-sm font-medium ${
                    active
                      ? "bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300"
                      : "text-zinc-600 dark:text-zinc-300"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="mt-3 border-t border-zinc-200 pt-3 dark:border-zinc-800">
              {user ? (
                <div className="flex flex-col gap-2">
                  <span className="px-3 text-sm text-zinc-500">
                    {user.name ?? user.email}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      closeMenu();
                      signOut({ callbackUrl: "/" });
                    }}
                    className="btn-secondary w-full text-center"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="btn-primary block w-full text-center"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
