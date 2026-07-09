import { ModCategory } from "@/generated/prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { DEFAULT_INSTALL_INSTRUCTIONS } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

const modSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).optional(),
  description: z.string().min(1),
  shortDescription: z.string().max(500).optional(),
  category: z.enum(["PC_GAME", "LUA", "TOOLS"]),
  game: z.string().max(100).optional(),
  installInstructions: z.string().optional(),
  luaSnippet: z.string().optional(),
  priceCents: z.number().int().min(0).default(0),
  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  coverImageUrl: z.string().url().optional().or(z.literal("")),
  tags: z.array(z.string()).default([]),
});

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const mods = await prisma.mod.findMany({
    include: {
      versions: { orderBy: { releasedAt: "desc" }, take: 1 },
      _count: { select: { downloads: true, purchases: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(mods);
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = modSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  const slug = data.slug?.trim() || slugify(data.title);

  const existing = await prisma.mod.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
  }

  const mod = await prisma.mod.create({
    data: {
      title: data.title,
      slug,
      description: data.description,
      shortDescription: data.shortDescription || null,
      category: ModCategory[data.category],
      game: data.game || null,
      installInstructions:
        data.installInstructions || DEFAULT_INSTALL_INSTRUCTIONS[data.category],
      luaSnippet: data.luaSnippet || null,
      priceCents: data.priceCents,
      isPublished: data.isPublished,
      isFeatured: data.isFeatured,
      coverImageUrl: data.coverImageUrl || null,
      tags: data.tags,
    },
  });

  return NextResponse.json(mod, { status: 201 });
}
