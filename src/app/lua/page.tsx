import { ModCard } from "@/components/mod-card";
import { getPublishedMods } from "@/lib/mods";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Lua Scripts",
  description: "Custom Lua scripts for games and runtimes.",
};

export default async function LuaPage() {
  const mods = await getPublishedMods({ category: "LUA" });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold">Lua Scripts</h1>
      <p className="mt-2 max-w-2xl text-zinc-600 dark:text-zinc-400">
        Custom Lua scripts with install paths and copy-paste snippets where
        applicable.
      </p>

      {mods.length === 0 ? (
        <p className="mt-8 text-zinc-500">No Lua scripts published yet.</p>
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
