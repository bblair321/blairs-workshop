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
      {purchased === "1" && (
        <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200">
          Purchase successful! You can now download this mod.
        </div>
      )}

      <div className="mb-2 flex flex-wrap items-center gap-2 text-sm text-zinc-500">
        <span>{CATEGORY_LABELS[mod.category]}</span>
        {mod.game && <span>· {mod.game}</span>}
        <span>· {formatPrice(mod.priceCents)}</span>
      </div>

      <h1 className="text-3xl font-bold">{mod.title}</h1>
      {mod.shortDescription && (
        <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
          {mod.shortDescription}
        </p>
      )}

      {latestVersion && (
        <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
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
        <div className="whitespace-pre-wrap">{mod.description}</div>
      </section>

      {mod.luaSnippet && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold">Lua snippet</h2>
          <pre className="mt-3 overflow-x-auto rounded-lg bg-zinc-900 p-4 text-sm text-zinc-100">
            <code>{mod.luaSnippet}</code>
          </pre>
        </section>
      )}

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Install instructions</h2>
        <div className="mt-3 whitespace-pre-wrap rounded-xl border border-zinc-200 bg-white p-6 text-sm leading-relaxed dark:border-zinc-800 dark:bg-zinc-900">
          {mod.installInstructions}
        </div>
      </section>

      {mod.versions.length > 1 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold">All versions</h2>
          <ul className="mt-4 divide-y divide-zinc-200 rounded-xl border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
            {mod.versions.map((version) => (
              <li
                key={version.id}
                className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
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
              className="rounded-full bg-zinc-200 px-3 py-1 text-xs dark:bg-zinc-800"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
