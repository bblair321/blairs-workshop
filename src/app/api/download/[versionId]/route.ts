import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { canDownloadMod } from "@/lib/mod-access";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { getSignedDownloadUrl } from "@/lib/r2";
import { hashIp } from "@/lib/utils";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ versionId: string }> },
) {
  const { versionId } = await params;
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  const limit = rateLimit(`download:${ip}`, 30, 60_000);
  if (!limit.success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const version = await prisma.modVersion.findUnique({
    where: { id: versionId },
    include: { mod: true },
  });

  if (!version || !version.mod.isPublished) {
    return NextResponse.json({ error: "Version not found" }, { status: 404 });
  }

  const access = await canDownloadMod(version.modId);
  if (!access.allowed) {
    return NextResponse.json({ error: access.reason }, { status: 403 });
  }

  const url = new URL(request.url);
  const fileType = url.searchParams.get("file");
  const isInstaller = fileType === "installer";

  if (isInstaller && !version.installerKey) {
    return NextResponse.json({ error: "Installer not available" }, { status: 404 });
  }

  const key = isInstaller ? version.installerKey! : version.fileKey;
  const fileName = isInstaller ? version.installerName! : version.fileName;

  try {
    const signedUrl = await getSignedDownloadUrl(key, fileName);

    const session = await auth();
    await prisma.download.create({
      data: {
        modId: version.modId,
        versionId: version.id,
        ipHash: hashIp(ip),
        userAgent: request.headers.get("user-agent")?.slice(0, 500),
        userId: session?.user?.id ?? access.userId,
      },
    });

    return NextResponse.json({ url: signedUrl, expiresIn: 900 });
  } catch {
    return NextResponse.json(
      { error: "Storage not configured. Set R2 environment variables." },
      { status: 503 },
    );
  }
}
