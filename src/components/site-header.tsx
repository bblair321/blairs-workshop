import Link from "next/link";

const links = [
  { href: "/mods", label: "Browse Mods" },
  { href: "/lua", label: "Lua Scripts" },
  { href: "/library", label: "My Library" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-bold tracking-tight">
          Blair&apos;s <span className="text-violet-600">Workshop</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium text-zinc-600 dark:text-zinc-300">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition hover:text-violet-600 dark:hover:text-violet-400"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="rounded-full bg-violet-600 px-4 py-2 text-white transition hover:bg-violet-500"
          >
            Sign In
          </Link>
        </nav>
      </div>
    </header>
  );
}
