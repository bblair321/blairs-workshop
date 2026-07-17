"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DEFAULT_INSTALL_INSTRUCTIONS } from "@/lib/constants";

export default function NewModPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<"PC_GAME" | "LUA" | "TOOLS">("PC_GAME");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const tags = String(form.get("tags") ?? "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const res = await fetch("/api/admin/mods", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.get("title"),
        slug: form.get("slug") || undefined,
        description: form.get("description"),
        shortDescription: form.get("shortDescription") || undefined,
        category: form.get("category"),
        game: form.get("game") || undefined,
        installInstructions:
          form.get("installInstructions") ||
          DEFAULT_INSTALL_INSTRUCTIONS[category],
        luaSnippet: form.get("luaSnippet") || undefined,
        priceCents: Math.round(Number(form.get("priceDollars") ?? 0) * 100),
        isPublished: form.get("isPublished") === "on",
        isFeatured: form.get("isFeatured") === "on",
        coverImageUrl: form.get("coverImageUrl") || undefined,
        tags,
      }),
    });

    const data = (await res.json()) as { id?: string; error?: string };

    if (!res.ok || !data.id) {
      setError(typeof data.error === "string" ? data.error : "Failed to create mod");
      setLoading(false);
      return;
    }

    router.push(`/admin/mods/${data.id}`);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Link href="/admin" className="text-sm text-violet-600 hover:underline">
        ← Back to admin
      </Link>
      <h1 className="mt-4 text-2xl font-bold">New mod</h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <Field label="Title" name="title" required />
        <Field label="Slug (optional)" name="slug" placeholder="auto-generated from title" />
        <Field label="Short description" name="shortDescription" />
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            name="description"
            required
            rows={5}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Category</label>
          <select
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as "PC_GAME" | "LUA" | "TOOLS")}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
          >
            <option value="PC_GAME">PC Game Mod</option>
            <option value="LUA">FiveM Script</option>
            <option value="TOOLS">Tool</option>
          </select>
        </div>
        <Field label="Game (optional)" name="game" placeholder="e.g. Skyrim, FiveM" />
        <div>
          <label className="block text-sm font-medium">Install instructions</label>
          <textarea
            name="installInstructions"
            rows={6}
            placeholder={DEFAULT_INSTALL_INSTRUCTIONS[category]}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
        {category === "LUA" && (
          <div>
            <label className="block text-sm font-medium">Code snippet (optional)</label>
            <textarea
              name="luaSnippet"
              rows={6}
              className="mt-1 w-full font-mono text-sm rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
            />
          </div>
        )}
        <Field label="Price (USD, 0 = free)" name="priceDollars" type="number" defaultValue="0" />
        <Field label="Cover image URL (optional)" name="coverImageUrl" />
        <Field label="Tags (comma-separated)" name="tags" placeholder="gameplay, ui, quality-of-life" />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="isPublished" />
          Publish immediately
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="isFeatured" />
          Feature on homepage
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-violet-600 px-6 py-2 font-medium text-white hover:bg-violet-500 disabled:opacity-50"
        >
          {loading ? "Creating…" : "Create mod"}
        </button>
      </form>
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
