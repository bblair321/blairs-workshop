import { notFound } from "next/navigation";
import { ModCard } from "@/components/mod-card";
import { getPublishedMods } from "@/lib/mods";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ game: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { game } = await params;
  const decoded = decodeURIComponent(game);
  return { title: `${decoded} Mods` };
}

export default async function GameModsPage({ params }: PageProps) {
  const { game } = await params;
  const decoded = decodeURIComponent(game);
  const mods = await getPublishedMods({ game: decoded });

  if (mods.length === 0) {
    const allMods = await getPublishedMods();
    const hasAnyGame = allMods.some(
      (m) => m.game?.toLowerCase() === decoded.toLowerCase(),
    );
    if (!hasAnyGame) notFound();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold">{decoded} Mods</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        All published mods for {decoded}.
      </p>

      {mods.length === 0 ? (
        <p className="mt-8 text-zinc-500">No mods for this game yet.</p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mods.map((mod) => (
            <ModCard key={mod.id} mod={mod} />
          ))}
        </div>
      )}
    </div>
  );
}
