import { EmptyState } from "@/components/empty-state";
import { ModCard } from "@/components/mod-card";
import { PageHeader } from "@/components/page-header";
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
      <PageHeader
        title="Lua Scripts"
        description="Custom Lua scripts with install paths and copy-paste snippets where applicable."
      />

      {mods.length === 0 ? (
        <EmptyState
          title="No Lua scripts yet"
          description="Lua scripts will appear here once published."
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
