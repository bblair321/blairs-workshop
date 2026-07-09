import { notFound } from "next/navigation";
import { EmptyState } from "@/components/empty-state";
import { ModCard } from "@/components/mod-card";
import { PageHeader } from "@/components/page-header";
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
      <PageHeader
        title={`${decoded} Mods`}
        description={`All published mods for ${decoded}.`}
      />

      {mods.length === 0 ? (
        <EmptyState
          title="No mods for this game yet"
          description="Check back later or browse other games."
          action={{ href: "/mods", label: "Browse all mods" }}
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mods.map((mod) => (
            <ModCard key={mod.id} mod={mod} />
          ))}
        </div>
      )}
    </div>
  );
}
