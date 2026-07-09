import Link from "next/link";
import type { Mod, ModVersion } from "@/generated/prisma/client";
import { CATEGORY_LABELS } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";

type ModCardProps = {
  mod: Mod & { versions?: ModVersion[] };
};

const PLACEHOLDER_LABELS: Record<Mod["category"], string> = {
  PC_GAME: "Mod",
  LUA: "Lua",
  TOOLS: "Tool",
};

export function ModCard({ mod }: ModCardProps) {
  const latestVersion = mod.versions?.[0];

  return (
    <Link
      href={`/mods/${mod.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-lg hover:shadow-violet-500/5 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-violet-700"
    >
      <div className="relative flex h-40 items-center justify-center overflow-hidden bg-gradient-to-br from-violet-100 via-indigo-50 to-violet-50 dark:from-violet-950 dark:via-indigo-950 dark:to-violet-950">
        {mod.isFeatured && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-violet-600 px-2.5 py-0.5 text-xs font-semibold text-white shadow-sm">
            Featured
          </span>
        )}
        {mod.coverImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={mod.coverImageUrl}
            alt={mod.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <span className="text-sm font-semibold uppercase tracking-widest text-violet-400/70 dark:text-violet-500/50">
            {PLACEHOLDER_LABELS[mod.category]}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold leading-snug transition group-hover:text-violet-600 dark:group-hover:text-violet-400">
            {mod.title}
          </h3>
          <span
            className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              mod.priceCents === 0
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
            }`}
          >
            {formatPrice(mod.priceCents)}
          </span>
        </div>
        <p className="line-clamp-2 text-sm leading-relaxed text-zinc-500">
          {mod.shortDescription ?? mod.description}
        </p>
        <div className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-1 pt-1 text-xs text-zinc-400">
          <span className="rounded-md bg-zinc-100 px-1.5 py-0.5 dark:bg-zinc-800">
            {CATEGORY_LABELS[mod.category]}
          </span>
          {mod.game && <span>{mod.game}</span>}
          {latestVersion && <span>v{latestVersion.version}</span>}
        </div>
      </div>
    </Link>
  );
}
