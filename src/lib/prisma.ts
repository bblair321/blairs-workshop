import { PrismaPg } from "@prisma/adapter-pg";
import { ModCategory, PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  prismaSignature: string | undefined;
};

// Recreate client when generated enums change (e.g. after `prisma generate`)
const clientSignature = Object.keys(ModCategory).sort().join(",");

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

function getPrismaClient(): PrismaClient {
  if (
    !globalForPrisma.prisma ||
    globalForPrisma.prismaSignature !== clientSignature
  ) {
    globalForPrisma.prisma = createPrismaClient();
    globalForPrisma.prismaSignature = clientSignature;
  }
  return globalForPrisma.prisma;
}

export const prisma = getPrismaClient();
