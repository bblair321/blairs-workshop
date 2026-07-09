import Link from "next/link";
import { redirect } from "next/navigation";
import { ModCard } from "@/components/mod-card";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "My Library",
};

export default async function LibraryPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/library");
  }

  const purchases = await prisma.purchase.findMany({
    where: { userId: session.user.id },
    include: {
      mod: {
        include: {
          versions: { orderBy: { releasedAt: "desc" }, take: 1 },
        },
      },
    },
    orderBy: { purchasedAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold">My Library</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Mods you have purchased. Free mods are available from their mod pages.
      </p>

      {purchases.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-zinc-300 p-12 text-center dark:border-zinc-700">
          <p className="text-zinc-500">You have not purchased any mods yet.</p>
          <Link href="/mods" className="mt-4 inline-block text-violet-600 hover:underline">
            Browse mods →
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {purchases.map(({ mod }) => (
            <ModCard key={mod.id} mod={mod} />
          ))}
        </div>
      )}
    </div>
  );
}
