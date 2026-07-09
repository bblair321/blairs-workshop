import Link from "next/link";
import { notFound } from "next/navigation";
import { DownloadButton } from "@/components/download-button";
import { auth } from "@/lib/auth";
import { CATEGORY_LABELS } from "@/lib/constants";
import { userOwnsMod } from "@/lib/mod-access";
import { getModBySlug } from "@/lib/mods";
import { formatFileSize, formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ purchased?: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const mod = await getModBySlug(slug);
  if (!mod) return { title: "Mod not found" };
  return {
    title: mod.title,
    description: mod.shortDescription ?? mod.description.slice(0, 160),
  };
}

export default async function ModDetailPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { purchased } = await searchParams;
  const mod = await getModBySlug(slug);

  if (!mod) notFound();

  const session = await auth();
  const ownsMod =
    mod.priceCents > 0 && session?.user?.id
      ? await userOwnsMod(session.user.id, mod.id)
      : false;

  const latestVersion = mod.versions[0];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-zinc-500">
        <Link href="/mods" className="transition hover:text-violet-600">
          Mods
        </Link>
        <span aria-hidden>/</span>
        <span className="text-zinc-700 dark:text-zinc-300">{mod.title}</span>
      </nav>

      {purchased === "1" && (
        <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200">
          Purchase successful! You can now download this mod.
        </div>
      )}

      {mod.coverImageUrl && (
        <div className="mb-8 overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={mod.coverImageUrl}
            alt={mod.title}
            className="aspect-[21/9] w-full object-cover"
          />
        </div>
      )}

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
          {CATEGORY_LABELS[mod.category]}
        </span>
        {mod.game && <span className="text-sm text-zinc-500">{mod.game}</span>}
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            mod.priceCents === 0
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
              : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
          }`}
        >
          {formatPrice(mod.priceCents)}
        </span>
        {mod.isFeatured && (
          <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-semibold text-violet-700 dark:bg-violet-950 dark:text-violet-300">
            Featured
          </span>
        )}
      </div>

      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{mod.title}</h1>
      {mod.shortDescription && (
        <p className="mt-3 text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
          {mod.shortDescription}
        </p>
      )}

      {latestVersion && (
        <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="font-semibold">Download</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Latest: v{latestVersion.version} · {formatFileSize(latestVersion.fileSize)}
          </p>
          <div className="mt-4">
            <DownloadButton
              version={latestVersion}
              modSlug={mod.slug}
              priceCents={mod.priceCents}
              ownsMod={ownsMod}
            />
          </div>
        </div>
      )}

      <section className="prose mt-10 dark:prose-invert">
        <h2>Description</h2>
        <div className="whitespace-pre-wrap leading-relaxed">{mod.description}</div>
      </section>

      {mod.luaSnippet && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold">Lua snippet</h2>
          <pre className="mt-3 overflow-x-auto rounded-xl bg-zinc-900 p-4 text-sm text-zinc-100">
            <code>{mod.luaSnippet}</code>
          </pre>
        </section>
      )}

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Install instructions</h2>
        <div className="mt-3 whitespace-pre-wrap rounded-2xl border border-zinc-200 bg-white p-6 text-sm leading-relaxed dark:border-zinc-800 dark:bg-zinc-900">
          {mod.installInstructions}
        </div>
      </section>

      {mod.versions.length > 1 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold">All versions</h2>
          <ul className="mt-4 divide-y divide-zinc-200 overflow-hidden rounded-2xl border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
            {mod.versions.map((version) => (
              <li
                key={version.id}
                className="flex flex-col gap-3 bg-white p-4 dark:bg-zinc-900 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium">v{version.version}</p>
                  {version.changelog && (
                    <p className="text-sm text-zinc-500">{version.changelog}</p>
                  )}
                  <p className="text-xs text-zinc-400">
                    {formatFileSize(version.fileSize)} ·{" "}
                    {version.releasedAt.toLocaleDateString()}
                  </p>
                </div>
                <DownloadButton
                  version={version}
                  modSlug={mod.slug}
                  priceCents={mod.priceCents}
                  ownsMod={ownsMod}
                />
              </li>
            ))}
          </ul>
        </section>
      )}

      {mod.tags.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {mod.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
