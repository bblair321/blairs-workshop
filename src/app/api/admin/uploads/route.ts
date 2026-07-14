import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { buildModFileKey, getSignedUploadUrl } from "@/lib/r2";

const presignSchema = z.object({
  modId: z.string().min(1),
  version: z.string().min(1).max(50),
  fileName: z.string().min(1).max(255),
  contentType: z.string().max(255).optional(),
  kind: z.enum(["file", "installer"]).default("file"),
});

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = presignSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { modId, version, fileName, contentType, kind } = parsed.data;

  const mod = await prisma.mod.findUnique({ where: { id: modId } });
  if (!mod) {
    return NextResponse.json({ error: "Mod not found" }, { status: 404 });
  }

  const key = buildModFileKey(
    modId,
    version,
    kind === "installer" ? `installer-${fileName}` : fileName,
  );

  try {
    const url = await getSignedUploadUrl(
      key,
      contentType || "application/octet-stream",
    );
    return NextResponse.json({ key, url });
  } catch {
    return NextResponse.json(
      { error: "Storage not configured. Set R2 environment variables." },
      { status: 503 },
    );
  }
}
