import { ModCard } from "@/components/mod-card";
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Browse Mods</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          PC game mods and installers — filter by game or search below.
        </p>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        <a
          href="/mods"
          className={`rounded-full px-3 py-1 text-sm ${
            !params.game
              ? "bg-violet-600 text-white"
              : "border border-zinc-300 dark:border-zinc-700"
          }`}
        >
          All
        </a>
        {games.map((game) => (
          <a
            key={game}
            href={`/mods?game=${encodeURIComponent(game)}`}
            className={`rounded-full px-3 py-1 text-sm ${
              params.game?.toLowerCase() === game.toLowerCase()
                ? "bg-violet-600 text-white"
                : "border border-zinc-300 dark:border-zinc-700"
            }`}
          >
            {game}
          </a>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-zinc-500">No mods found.</p>
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
