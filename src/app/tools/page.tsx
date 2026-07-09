import { EmptyState } from "@/components/empty-state";
import { ModCard } from "@/components/mod-card";
import { PageHeader } from "@/components/page-header";
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
      <PageHeader
        title="Tools"
        description="Mod managers, installers, patchers, and other utilities for PC games and modding workflows."
      />

      {mods.length === 0 ? (
        <EmptyState
          title="No tools published yet"
          description="Modding utilities and installers will show up here."
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
