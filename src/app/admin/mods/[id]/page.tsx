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
  category: "PC_GAME" | "LUA" | "TOOLS";
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
  const [mainFileName, setMainFileName] = useState<string | null>(null);
  const [installerFileName, setInstallerFileName] = useState<string | null>(null);

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

  // Files go straight from the browser to R2 via presigned URLs;
  // Vercel functions cap request bodies at ~4.5 MB, so they can't proxy mod files.
  async function uploadFileToStorage(
    file: File,
    version: string,
    kind: "file" | "installer",
  ) {
    const contentType = file.type || "application/octet-stream";
    const presignRes = await fetch("/api/admin/uploads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        modId: id,
        version,
        fileName: file.name,
        contentType,
        kind,
      }),
    });
    const presignData = (await presignRes.json()) as {
      key?: string;
      url?: string;
      error?: string;
    };
    if (!presignRes.ok || !presignData.key || !presignData.url) {
      throw new Error(
        typeof presignData.error === "string"
          ? presignData.error
          : "Failed to prepare upload",
      );
    }

    const putRes = await fetch(presignData.url, {
      method: "PUT",
      headers: { "Content-Type": contentType },
      body: file,
    });
    if (!putRes.ok) {
      throw new Error("Upload to storage failed");
    }

    return {
      key: presignData.key,
      name: file.name,
      size: file.size,
      type: file.type || null,
    };
  }

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    setUploading(true);
    setError(null);
    setMessage(null);

    try {
      const form = new FormData(formEl);
      const version = String(form.get("version") ?? "").trim();
      const changelog = String(form.get("changelog") ?? "");
      const mainFile = form.get("file");
      const installerFile = form.get("installer");

      if (!version || !(mainFile instanceof File) || mainFile.size === 0) {
        throw new Error("Version and mod file are required");
      }

      const uploadedFile = await uploadFileToStorage(mainFile, version, "file");
      const uploadedInstaller =
        installerFile instanceof File && installerFile.size > 0
          ? await uploadFileToStorage(installerFile, version, "installer")
          : null;

      const res = await fetch(`/api/admin/mods/${id}/versions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          version,
          changelog: changelog || undefined,
          file: uploadedFile,
          installer: uploadedInstaller,
        }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(
          typeof data.error === "string" ? data.error : "Upload failed",
        );
      }

      setMessage("Version uploaded");
      formEl.reset();
      setMainFileName(null);
      setInstallerFileName(null);
      await loadMod();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
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
            <option value="LUA">FiveM Script</option>
            <option value="TOOLS">Tool</option>
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
          <label className="block text-sm font-medium">Code snippet</label>
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

      <section className="mt-12 rounded-2xl border-2 border-violet-200 bg-violet-50/50 p-6 dark:border-violet-900 dark:bg-violet-950/20">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-violet-900 dark:text-violet-100">
            Upload new version
          </h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Add a mod file for players to download. Zip, Lua, or other archives work.
          </p>
        </div>

        <form onSubmit={handleUpload} className="space-y-5">
          <Field label="Version" name="version" placeholder="1.0.0" required />
          <div>
            <label className="block text-sm font-medium">Changelog</label>
            <textarea
              name="changelog"
              rows={3}
              placeholder="What changed in this version?"
              className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
            />
          </div>

          <FilePicker
            name="file"
            label="Mod file"
            hint=".zip, .lua, .7z, etc."
            required
            selectedName={mainFileName}
            onFileSelect={setMainFileName}
          />

          <FilePicker
            name="installer"
            label="Installer (optional)"
            hint=".exe installer if you have one"
            selectedName={installerFileName}
            onFileSelect={setInstallerFileName}
          />

          <button
            type="submit"
            disabled={uploading || !mainFileName}
            className="w-full rounded-xl bg-violet-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            {uploading ? "Uploading…" : "Upload version"}
          </button>
        </form>

        {mod.versions.length > 0 && (
          <div className="mt-8">
            <h3 className="mb-3 text-sm font-medium text-zinc-500">Previous versions</h3>
            <ul className="divide-y divide-zinc-200 rounded-xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900">
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
          </div>
        )}
      </section>
    </div>
  );
}

function FilePicker({
  name,
  label,
  hint,
  required,
  selectedName,
  onFileSelect,
}: {
  name: string;
  label: string;
  hint: string;
  required?: boolean;
  selectedName: string | null;
  onFileSelect: (name: string | null) => void;
}) {
  const inputId = `file-${name}`;

  return (
    <div>
      <label htmlFor={inputId} className="block text-sm font-medium">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <div className="mt-2">
        <input
          id={inputId}
          name={name}
          type="file"
          required={required}
          className="sr-only"
          onChange={(e) => onFileSelect(e.target.files?.[0]?.name ?? null)}
        />
        <label
          htmlFor={inputId}
          className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-violet-300 bg-white px-6 py-8 text-center transition hover:border-violet-500 hover:bg-violet-50 dark:border-violet-700 dark:bg-zinc-900 dark:hover:border-violet-500 dark:hover:bg-violet-950/40"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 text-violet-600 dark:bg-violet-900 dark:text-violet-300" aria-hidden>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12" />
            </svg>
          </span>
          <span className="mt-2 text-base font-semibold text-violet-700 dark:text-violet-300">
            {selectedName ? "Change file" : "Choose file"}
          </span>
          <span className="mt-1 text-sm text-zinc-500">{hint}</span>
          {selectedName && (
            <span className="mt-3 rounded-full bg-violet-100 px-3 py-1 text-sm font-medium text-violet-800 dark:bg-violet-900 dark:text-violet-200">
              {selectedName}
            </span>
          )}
        </label>
      </div>
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
