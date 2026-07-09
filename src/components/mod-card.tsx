import Link from "next/link";
import type { Mod, ModVersion } from "@/generated/prisma/client";
import { CATEGORY_LABELS } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";

type ModCardProps = {
  mod: Mod & { versions?: ModVersion[] };
};

export function ModCard({ mod }: ModCardProps) {
  const latestVersion = mod.versions?.[0];

  return (
    <Link
      href={`/mods/${mod.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white transition hover:border-violet-300 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-violet-700"
    >
      <div className="flex h-36 items-center justify-center bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-950 dark:to-indigo-950">
        {mod.coverImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={mod.coverImageUrl}
            alt={mod.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-4xl opacity-40">
            {mod.category === "LUA" ? "Lua" : "Mod"}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold group-hover:text-violet-600 dark:group-hover:text-violet-400">
            {mod.title}
          </h3>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
              mod.priceCents === 0
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
            }`}
          >
            {formatPrice(mod.priceCents)}
          </span>
        </div>
        <p className="line-clamp-2 text-sm text-zinc-500">
          {mod.shortDescription ?? mod.description}
        </p>
        <div className="mt-auto flex flex-wrap gap-2 text-xs text-zinc-400">
          <span>{CATEGORY_LABELS[mod.category]}</span>
          {mod.game && <span>· {mod.game}</span>}
          {latestVersion && <span>· v{latestVersion.version}</span>}
        </div>
      </div>
    </Link>
  );
}
