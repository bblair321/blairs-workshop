"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function ModsSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    const trimmed = query.trim();
    if (trimmed) {
      params.set("q", trimmed);
    } else {
      params.delete("q");
    }
    const qs = params.toString();
    router.push(qs ? `/mods?${qs}` : "/mods");
  }

  return (
    <form onSubmit={handleSubmit} className="relative max-w-md">
      <label htmlFor="mods-search" className="sr-only">
        Search mods
      </label>
      <input
        id="mods-search"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by title, tag, or description…"
        className="input-field pr-10"
      />
      <button
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-zinc-400 transition hover:bg-zinc-100 hover:text-violet-600 dark:hover:bg-zinc-800"
        aria-label="Search"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-4 w-4"
          aria-hidden
        >
          <path
            fillRule="evenodd"
            d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </form>
  );
}
