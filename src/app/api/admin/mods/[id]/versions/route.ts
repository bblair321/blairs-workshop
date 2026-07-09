import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { buildModFileKey, uploadToR2 } from "@/lib/r2";

const versionSchema = z.object({
  version: z.string().min(1).max(50),
  changelog: z.string().optional(),
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

  const formData = await request.formData();
  const versionMeta = versionSchema.safeParse({
    version: formData.get("version"),
    changelog: formData.get("changelog") || undefined,
  });

  if (!versionMeta.success) {
    return NextResponse.json({ error: versionMeta.error.flatten() }, { status: 400 });
  }

  const mainFile = formData.get("file");
  if (!(mainFile instanceof File) || mainFile.size === 0) {
    return NextResponse.json({ error: "Main file is required" }, { status: 400 });
  }

  const installerFile = formData.get("installer");
  const { version, changelog } = versionMeta.data;

  const existing = await prisma.modVersion.findUnique({
    where: { modId_version: { modId, version } },
  });
  if (existing) {
    return NextResponse.json({ error: "Version already exists" }, { status: 409 });
  }

  const fileBuffer = Buffer.from(await mainFile.arrayBuffer());
  const fileKey = buildModFileKey(modId, version, mainFile.name);

  try {
    await uploadToR2(fileKey, fileBuffer, mainFile.type || "application/octet-stream");
  } catch {
    return NextResponse.json(
      { error: "Failed to upload file. Check R2 configuration." },
      { status: 503 },
    );
  }

  let installerKey: string | null = null;
  let installerName: string | null = null;
  let installerSize: number | null = null;

  if (installerFile instanceof File && installerFile.size > 0) {
    const installerBuffer = Buffer.from(await installerFile.arrayBuffer());
    installerKey = buildModFileKey(modId, version, `installer-${installerFile.name}`);
    installerName = installerFile.name;
    installerSize = installerFile.size;

    try {
      await uploadToR2(
        installerKey,
        installerBuffer,
        installerFile.type || "application/octet-stream",
      );
    } catch {
      return NextResponse.json(
        { error: "Failed to upload installer. Check R2 configuration." },
        { status: 503 },
      );
    }
  }

  const modVersion = await prisma.modVersion.create({
    data: {
      modId,
      version,
      changelog: changelog || null,
      fileKey,
      fileName: mainFile.name,
      fileSize: mainFile.size,
      fileMimeType: mainFile.type || null,
      installerKey,
      installerName,
      installerSize,
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
