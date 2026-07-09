"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { formatFileSize } from "@/lib/utils";

type ModVersion = {
  id: string;
  version: string;
  changelog: string | null;
  fileName: string;
  fileSize: number;
  installerName: string | null;
  releasedAt: string;
};

type Mod = {
  id: string;
  slug: string;
  title: string;
  description: string;
  shortDescription: string | null;
  category: "PC_GAME" | "LUA";
  game: string | null;
  installInstructions: string;
  luaSnippet: string | null;
  priceCents: number;
  isPublished: boolean;
  isFeatured: boolean;
  coverImageUrl: string | null;
  tags: string[];
  versions: ModVersion[];
};

export default function EditModPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [mod, setMod] = useState<Mod | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const loadMod = useCallback(async () => {
    const res = await fetch(`/api/admin/mods/${id}`);
    if (!res.ok) {
      setError("Failed to load mod");
      setLoading(false);
      return;
    }
    setMod((await res.json()) as Mod);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    void loadMod();
  }, [loadMod]);

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!mod) return;
    setSaving(true);
    setError(null);
    setMessage(null);

    const form = new FormData(e.currentTarget);
    const tags = String(form.get("tags") ?? "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const res = await fetch(`/api/admin/mods/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.get("title"),
        slug: form.get("slug"),
        description: form.get("description"),
        shortDescription: form.get("shortDescription") || null,
        category: form.get("category"),
        game: form.get("game") || null,
        installInstructions: form.get("installInstructions"),
        luaSnippet: form.get("luaSnippet") || null,
        priceCents: Math.round(Number(form.get("priceDollars") ?? 0) * 100),
        isPublished: form.get("isPublished") === "on",
        isFeatured: form.get("isFeatured") === "on",
        coverImageUrl: form.get("coverImageUrl") || null,
        tags,
      }),
    });

    setSaving(false);

    if (!res.ok) {
      setError("Failed to save");
      return;
    }

    setMessage("Saved");
    await loadMod();
    router.refresh();
  }

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setUploading(true);
    setError(null);
    setMessage(null);

    const form = new FormData(e.currentTarget);
    const res = await fetch(`/api/admin/mods/${id}/versions`, {
      method: "POST",
      body: form,
    });

    setUploading(false);

    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      setError(data.error ?? "Upload failed");
      return;
    }

    setMessage("Version uploaded");
    e.currentTarget.reset();
    await loadMod();
  }

  async function handleDelete() {
    if (!confirm("Delete this mod and all files? This cannot be undone.")) return;

    const res = await fetch(`/api/admin/mods/${id}`, { method: "DELETE" });
    if (!res.ok) {
      setError("Failed to delete");
      return;
    }
    router.push("/admin");
  }

  if (loading) {
    return <div className="mx-auto max-w-2xl px-4 py-10">Loading…</div>;
  }

  if (!mod) {
    return <div className="mx-auto max-w-2xl px-4 py-10">Mod not found.</div>;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Link href="/admin" className="text-sm text-violet-600 hover:underline">
        ← Back to admin
      </Link>
      <div className="mt-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Edit mod</h1>
        <a
          href={`/mods/${mod.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-violet-600 hover:underline"
        >
          View public page →
        </a>
      </div>

      <form onSubmit={handleSave} className="mt-8 space-y-5">
        <Field label="Title" name="title" defaultValue={mod.title} required />
        <Field label="Slug" name="slug" defaultValue={mod.slug} required />
        <Field
          label="Short description"
          name="shortDescription"
          defaultValue={mod.shortDescription ?? ""}
        />
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            name="description"
            required
            rows={5}
            defaultValue={mod.description}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Category</label>
          <select
            name="category"
            defaultValue={mod.category}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
          >
            <option value="PC_GAME">PC Game Mod</option>
            <option value="LUA">Lua Script</option>
          </select>
        </div>
        <Field label="Game" name="game" defaultValue={mod.game ?? ""} />
        <div>
          <label className="block text-sm font-medium">Install instructions</label>
          <textarea
            name="installInstructions"
            rows={6}
            defaultValue={mod.installInstructions}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Lua snippet</label>
          <textarea
            name="luaSnippet"
            rows={6}
            defaultValue={mod.luaSnippet ?? ""}
            className="mt-1 w-full font-mono text-sm rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
        <Field
          label="Price (USD)"
          name="priceDollars"
          type="number"
          defaultValue={String(mod.priceCents / 100)}
        />
        <Field
          label="Cover image URL"
          name="coverImageUrl"
          defaultValue={mod.coverImageUrl ?? ""}
        />
        <Field
          label="Tags (comma-separated)"
          name="tags"
          defaultValue={mod.tags.join(", ")}
        />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="isPublished" defaultChecked={mod.isPublished} />
          Published
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="isFeatured" defaultChecked={mod.isFeatured} />
          Featured
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {message && <p className="text-sm text-emerald-600">{message}</p>}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-violet-600 px-6 py-2 font-medium text-white hover:bg-violet-500 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="rounded-lg border border-red-300 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950"
          >
            Delete mod
          </button>
        </div>
      </form>

      <section className="mt-12 border-t border-zinc-200 pt-10 dark:border-zinc-800">
        <h2 className="text-lg font-semibold">Upload new version</h2>
        <form onSubmit={handleUpload} className="mt-4 space-y-4">
          <Field label="Version" name="version" placeholder="1.0.0" required />
          <div>
            <label className="block text-sm font-medium">Changelog</label>
            <textarea
              name="changelog"
              rows={3}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Mod file (.zip, .lua, etc.)</label>
            <input
              name="file"
              type="file"
              required
              className="mt-1 w-full text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">
              Installer (optional .exe)
            </label>
            <input name="installer" type="file" className="mt-1 w-full text-sm" />
          </div>
          <button
            type="submit"
            disabled={uploading}
            className="rounded-lg bg-violet-600 px-6 py-2 font-medium text-white hover:bg-violet-500 disabled:opacity-50"
          >
            {uploading ? "Uploading…" : "Upload version"}
          </button>
        </form>

        {mod.versions.length > 0 && (
          <ul className="mt-8 divide-y divide-zinc-200 rounded-xl border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
            {mod.versions.map((v) => (
              <li key={v.id} className="px-4 py-3 text-sm">
                <p className="font-medium">
                  v{v.version} — {v.fileName} ({formatFileSize(v.fileSize)})
                </p>
                {v.installerName && (
                  <p className="text-zinc-500">Installer: {v.installerName}</p>
                )}
                {v.changelog && <p className="text-zinc-500">{v.changelog}</p>}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
      />
    </div>
  );
}
