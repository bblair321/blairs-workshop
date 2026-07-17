import type { MetadataRoute } from "next";
import { getGamesWithMods, getPublishedMods } from "@/lib/mods";
import { getSiteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/mods",
    "/fivem",
    "/tools",
    "/terms",
    "/privacy",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  const [mods, games] = await Promise.all([
    getPublishedMods(),
    getGamesWithMods(),
  ]);

  const modRoutes: MetadataRoute.Sitemap = mods.map((mod) => ({
    url: `${baseUrl}/mods/${mod.slug}`,
    lastModified: mod.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const gameRoutes: MetadataRoute.Sitemap = games.map((game) => ({
    url: `${baseUrl}/games/${encodeURIComponent(game)}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...modRoutes, ...gameRoutes];
}
