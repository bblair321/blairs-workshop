import Link from "next/link";
import { ModCard } from "@/components/mod-card";
import { EmptyState } from "@/components/empty-state";
import { getPublishedMods } from "@/lib/mods";

export const dynamic = "force-dynamic";

const CATEGORIES = [
  {
    href: "/mods",
    title: "PC Game Mods",
    description: "Gameplay tweaks, overhauls, and content packs.",
    icon: "🎮",
  },
  {
    href: "/fivem",
    title: "FiveM Scripts",
    description: "Server resources with snippets and install steps.",
    icon: "📜",
  },
  {
    href: "/tools",
    title: "Modding Tools",
    description: "Installers, patchers, and workflow utilities.",
    icon: "🔧",
  },
] as const;

export default async function HomePage() {
  const [featured, recent] = await Promise.all([
    getPublishedMods({ featured: true }),
    getPublishedMods(),
  ]);

  const displayMods = featured.length > 0 ? featured : recent.slice(0, 6);

  return (
    <div>
      <section className="relative overflow-hidden border-b border-zinc-200 bg-gradient-to-b from-violet-50 via-white to-zinc-50 dark:border-zinc-800 dark:from-violet-950/40 dark:via-zinc-950 dark:to-zinc-950">
        <div className="hero-grid absolute inset-0 opacity-60" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:py-24">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700 dark:border-violet-800 dark:bg-violet-950/50 dark:text-violet-300">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
            Free downloads · More mods coming soon
          </p>
          <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Welcome to Blair&apos;s Workshop
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
            PC game mods, FiveM scripts, and modding tools I build and maintain.
            Everything you need in one place.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/mods" className="btn-primary !px-6 !py-3">
              Browse all mods
            </Link>
            <Link href="/fivem" className="btn-secondary !px-6 !py-3">
              FiveM scripts
            </Link>
            <Link href="/tools" className="btn-secondary !px-6 !py-3">
              Tools
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
          Browse by category
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className="group rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-violet-700"
            >
              <span className="text-2xl" aria-hidden>
                {cat.icon}
              </span>
              <h3 className="mt-3 font-semibold group-hover:text-violet-600 dark:group-hover:text-violet-400">
                {cat.title}
              </h3>
              <p className="mt-1 text-sm text-zinc-500">{cat.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">
            {featured.length > 0 ? "Featured mods" : "Latest mods"}
          </h2>
          <Link
            href="/mods"
            className="text-sm font-medium text-violet-600 transition hover:text-violet-500"
          >
            View all →
          </Link>
        </div>
        {displayMods.length === 0 ? (
          <EmptyState
            title="Mods coming soon"
            description="New PC game mods, FiveM scripts, and tools will appear here as they're published."
            action={{ href: "/mods", label: "Browse catalog" }}
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {displayMods.map((mod) => (
              <ModCard key={mod.id} mod={mod} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
