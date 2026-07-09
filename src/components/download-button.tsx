"use client";

import { useState } from "react";
import type { ModVersion } from "@/generated/prisma/client";
import { formatFileSize } from "@/lib/utils";

type DownloadButtonProps = {
  version: ModVersion;
  modSlug: string;
  priceCents: number;
  ownsMod?: boolean;
};

export function DownloadButton({
  version,
  modSlug,
  priceCents,
  ownsMod = false,
}: DownloadButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDownload(fileType?: "installer") {
    setLoading(true);
    setError(null);

    try {
      const query = fileType ? "?file=installer" : "";
      const res = await fetch(`/api/download/${version.id}${query}`);
      const data = (await res.json()) as { url?: string; error?: string };

      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "Download failed");
      }

      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Download failed");
    } finally {
      setLoading(false);
    }
  }

  async function handlePurchase() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ modId: version.modId }),
      });
      const data = (await res.json()) as { url?: string; error?: string };

      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "Checkout failed");
      }

      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setLoading(false);
    }
  }

  const isPaid = priceCents > 0;
  const canDownload = !isPaid || ownsMod;

  return (
    <div className="flex flex-col gap-2">
      {canDownload ? (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleDownload()}
            disabled={loading}
            className="btn-primary"
          >
            {loading ? "Preparing…" : `Download v${version.version}`}
            <span className="ml-2 text-violet-200">
              ({formatFileSize(version.fileSize)})
            </span>
          </button>
          {version.installerKey && (
            <button
              type="button"
              onClick={() => handleDownload("installer")}
              disabled={loading}
              className="btn-secondary !border-violet-300 !text-violet-700 hover:!bg-violet-50 dark:!border-violet-700 dark:!text-violet-300 dark:hover:!bg-violet-950"
            >
              Download Installer
            </button>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={handlePurchase}
          disabled={loading}
          className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-400 disabled:opacity-50"
        >
          {loading ? "Redirecting…" : "Purchase to Download"}
        </button>
      )}
      {error && (
        <p className="text-sm text-red-600">
          {error}
          {error.includes("Sign in") && (
            <>
              {" "}
              <a href={`/login?callbackUrl=/mods/${modSlug}`} className="underline">
                Sign in
              </a>
            </>
          )}
        </p>
      )}
    </div>
  );
}
