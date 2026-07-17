import { EmptyState } from "@/components/empty-state";
import { ModCard } from "@/components/mod-card";
import { PageHeader } from "@/components/page-header";
import { getPublishedMods } from "@/lib/mods";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "FiveM Scripts",
  description: "FiveM resources and Lua scripts for your GTA V roleplay server.",
};

export default async function FiveMPage() {
  const mods = await getPublishedMods({ category: "LUA" });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <PageHeader
        title="FiveM Scripts"
        description="FiveM resources and Lua scripts with install steps for your server."
      />

      {mods.length === 0 ? (
        <EmptyState
          title="No FiveM scripts yet"
          description="FiveM scripts will appear here once published."
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
