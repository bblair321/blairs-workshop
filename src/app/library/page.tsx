import { redirect } from "next/navigation";
import { EmptyState } from "@/components/empty-state";
import { ModCard } from "@/components/mod-card";
import { PageHeader } from "@/components/page-header";
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
      <PageHeader
        title="My Library"
        description="Mods you have purchased. Free mods are available from their mod pages."
      />

      {purchases.length === 0 ? (
        <EmptyState
          title="Your library is empty"
          description="Purchased mods will appear here. Free mods can be downloaded directly from their pages."
          action={{ href: "/mods", label: "Browse mods" }}
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {purchases.map(({ mod }) => (
            <ModCard key={mod.id} mod={mod} />
          ))}
        </div>
      )}
    </div>
  );
}
