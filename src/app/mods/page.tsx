import { Suspense } from "react";
import { EmptyState } from "@/components/empty-state";
import { ModCard } from "@/components/mod-card";
import { ModsSearch } from "@/components/mods-search";
import { PageHeader } from "@/components/page-header";
import { getGamesWithMods, getPublishedMods } from "@/lib/mods";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Browse Mods",
};

type SearchParams = Promise<{ game?: string; q?: string }>;

export default async function ModsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const mods = await getPublishedMods(
    params.game ? { game: params.game } : undefined,
  );
  const games = await getGamesWithMods();

  const filtered = params.q
    ? mods.filter(
        (m) =>
          m.title.toLowerCase().includes(params.q!.toLowerCase()) ||
          m.description.toLowerCase().includes(params.q!.toLowerCase()) ||
          m.tags.some((t) => t.toLowerCase().includes(params.q!.toLowerCase())),
      )
    : mods;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <PageHeader
        title="Browse Mods"
        description="PC game mods and installers — filter by game or search below."
      >
        <Suspense
          fallback={
            <div className="h-10 max-w-md animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
          }
        >
          <ModsSearch />
        </Suspense>
      </PageHeader>

      {games.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          <a
            href="/mods"
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium ${
              !params.game ? "pill-active" : "pill-inactive"
            }`}
          >
            All
          </a>
          {games.map((game) => (
            <a
              key={game}
              href={`/mods?game=${encodeURIComponent(game)}`}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium ${
                params.game?.toLowerCase() === game.toLowerCase()
                  ? "pill-active"
                  : "pill-inactive"
              }`}
            >
              {game}
            </a>
          ))}
        </div>
      )}

      {params.q && (
        <p className="mb-6 text-sm text-zinc-500">
          {filtered.length} result{filtered.length === 1 ? "" : "s"} for &ldquo;
          {params.q}&rdquo;
        </p>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          title="No mods found"
          description={
            params.q || params.game
              ? "Try a different search or clear your filters."
              : "Check back soon — new mods are added regularly."
          }
          action={
            params.q || params.game ? { href: "/mods", label: "Clear filters" } : undefined
          }
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((mod) => (
            <ModCard key={mod.id} mod={mod} />
          ))}
        </div>
      )}
    </div>
  );
}
