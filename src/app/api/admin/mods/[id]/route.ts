import { ModCategory } from "@/generated/prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { DEFAULT_INSTALL_INSTRUCTIONS } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { deleteFromR2 } from "@/lib/r2";
import { slugify } from "@/lib/utils";

const updateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  slug: z.string().min(1).max(200).optional(),
  description: z.string().min(1).optional(),
  shortDescription: z.string().max(500).optional().nullable(),
  category: z.enum(["PC_GAME", "LUA", "TOOLS"]).optional(),
  game: z.string().max(100).optional().nullable(),
  installInstructions: z.string().optional(),
  luaSnippet: z.string().optional().nullable(),
  priceCents: z.number().int().min(0).optional(),
  isPublished: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  coverImageUrl: z.string().url().optional().nullable().or(z.literal("")),
  tags: z.array(z.string()).optional(),
});

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const mod = await prisma.mod.findUnique({
    where: { id },
    include: {
      versions: { orderBy: { releasedAt: "desc" } },
      _count: { select: { downloads: true, purchases: true } },
    },
  });

  if (!mod) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(mod);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  if (data.slug) {
    const conflict = await prisma.mod.findFirst({
      where: { slug: data.slug, NOT: { id } },
    });
    if (conflict) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }
  }

  const mod = await prisma.mod.update({
    where: { id },
    data: {
      ...data,
      category: data.category ? ModCategory[data.category] : undefined,
      slug: data.slug ?? (data.title ? slugify(data.title) : undefined),
      coverImageUrl:
        data.coverImageUrl === "" ? null : data.coverImageUrl ?? undefined,
      installInstructions:
        data.installInstructions ??
        (data.category
          ? DEFAULT_INSTALL_INSTRUCTIONS[data.category]
          : undefined),
    },
  });

  return NextResponse.json(mod);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const mod = await prisma.mod.findUnique({
    where: { id },
    include: { versions: true },
  });

  if (!mod) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  for (const version of mod.versions) {
    await deleteFromR2(version.fileKey);
    if (version.installerKey) await deleteFromR2(version.installerKey);
  }

  await prisma.mod.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
