import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function userOwnsMod(userId: string, modId: string): Promise<boolean> {
  const purchase = await prisma.purchase.findUnique({
    where: {
      userId_modId: { userId, modId },
    },
  });
  return Boolean(purchase);
}

export async function canDownloadMod(modId: string): Promise<{
  allowed: boolean;
  reason?: string;
  userId?: string;
}> {
  const mod = await prisma.mod.findUnique({
    where: { id: modId },
    select: { id: true, priceCents: true, isPublished: true },
  });

  if (!mod || !mod.isPublished) {
    return { allowed: false, reason: "Mod not found" };
  }

  if (mod.priceCents === 0) {
    return { allowed: true };
  }

  const session = await auth();
  if (!session?.user?.id) {
    return { allowed: false, reason: "Sign in and purchase this mod to download" };
  }

  const owns = await userOwnsMod(session.user.id, mod.id);
  if (!owns) {
    return { allowed: false, reason: "Purchase required" };
  }

  return { allowed: true, userId: session.user.id };
}
