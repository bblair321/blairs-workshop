import Link from "next/link";
import { ModCard } from "@/components/mod-card";
import { getPublishedMods } from "@/lib/mods";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featured, recent] = await Promise.all([
    getPublishedMods({ featured: true }),
    getPublishedMods(),
  ]);

  const displayMods = featured.length > 0 ? featured : recent.slice(0, 6);

  return (
    <div>
      <section className="border-b border-zinc-200 bg-gradient-to-b from-violet-50 to-zinc-50 dark:border-zinc-800 dark:from-violet-950/30 dark:to-zinc-950">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
            Welcome to Blair&apos;s Workshop
          </h1>
          <p className="mt-4 max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
            PC game mods and Lua scripts I build and maintain. Free downloads
            today — premium mods may come later.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/mods"
              className="rounded-full bg-violet-600 px-6 py-3 font-medium text-white transition hover:bg-violet-500"
            >
              Browse all mods
            </Link>
            <Link
              href="/lua"
              className="rounded-full border border-zinc-300 px-6 py-3 font-medium transition hover:border-violet-400 dark:border-zinc-700"
            >
              Lua scripts
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">
            {featured.length > 0 ? "Featured mods" : "Latest mods"}
          </h2>
          <Link href="/mods" className="text-sm text-violet-600 hover:underline">
            View all →
          </Link>
        </div>
        {displayMods.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-300 p-12 text-center text-zinc-500 dark:border-zinc-700">
            <p>No mods published yet.</p>
            <Link href="/admin" className="mt-2 inline-block text-violet-600 hover:underline">
              Add your first mod in Admin →
            </Link>
          </div>
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
