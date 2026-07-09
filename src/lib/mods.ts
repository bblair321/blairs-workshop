import type { ModCategory } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export async function getPublishedMods(options?: {
  category?: ModCategory;
  game?: string;
  featured?: boolean;
}) {
  return prisma.mod.findMany({
    where: {
      isPublished: true,
      ...(options?.category ? { category: options.category } : {}),
      ...(options?.game ? { game: { equals: options.game, mode: "insensitive" } } : {}),
      ...(options?.featured ? { isFeatured: true } : {}),
    },
    include: {
      versions: { orderBy: { releasedAt: "desc" }, take: 1 },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getModBySlug(slug: string) {
  return prisma.mod.findFirst({
    where: { slug, isPublished: true },
    include: {
      versions: { orderBy: { releasedAt: "desc" } },
    },
  });
}

export async function getGamesWithMods() {
  const mods = await prisma.mod.findMany({
    where: { isPublished: true, game: { not: null } },
    select: { game: true },
    distinct: ["game"],
  });
  return mods.map((m) => m.game!).filter(Boolean).sort();
}
