import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

const uploadedFileSchema = z.object({
  key: z.string().min(1),
  name: z.string().min(1).max(255),
  size: z.number().int().min(1),
  type: z.string().max(255).nullable().optional(),
});

const versionSchema = z.object({
  version: z.string().min(1).max(50),
  changelog: z.string().optional(),
  file: uploadedFileSchema,
  installer: uploadedFileSchema.nullable().optional(),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: modId } = await params;
  const mod = await prisma.mod.findUnique({ where: { id: modId } });
  if (!mod) {
    return NextResponse.json({ error: "Mod not found" }, { status: 404 });
  }

  const body = await request.json();
  const parsed = versionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { version, changelog, file, installer } = parsed.data;

  const keyPrefix = `mods/${modId}/${version}/`;
  if (!file.key.startsWith(keyPrefix) || (installer && !installer.key.startsWith(keyPrefix))) {
    return NextResponse.json({ error: "File key does not match this mod version" }, { status: 400 });
  }

  const existing = await prisma.modVersion.findUnique({
    where: { modId_version: { modId, version } },
  });
  if (existing) {
    return NextResponse.json({ error: "Version already exists" }, { status: 409 });
  }

  const modVersion = await prisma.modVersion.create({
    data: {
      modId,
      version,
      changelog: changelog || null,
      fileKey: file.key,
      fileName: file.name,
      fileSize: file.size,
      fileMimeType: file.type || null,
      installerKey: installer?.key ?? null,
      installerName: installer?.name ?? null,
      installerSize: installer?.size ?? null,
    },
  });

  return NextResponse.json(modVersion, { status: 201 });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: modId } = await params;
  const versions = await prisma.modVersion.findMany({
    where: { modId },
    orderBy: { releasedAt: "desc" },
  });

  return NextResponse.json(versions);
}
