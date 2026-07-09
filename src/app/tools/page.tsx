import { ModCard } from "@/components/mod-card";
import { getPublishedMods } from "@/lib/mods";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Tools",
  description: "Modding tools, installers, and utilities.",
};

export default async function ToolsPage() {
  const mods = await getPublishedMods({ category: "TOOLS" });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold">Tools</h1>
      <p className="mt-2 max-w-2xl text-zinc-600 dark:text-zinc-400">
        Mod managers, installers, patchers, and other utilities for PC games and
        modding workflows.
      </p>

      {mods.length === 0 ? (
        <p className="mt-8 text-zinc-500">No tools published yet.</p>
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
