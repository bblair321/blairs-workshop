import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminSignOut } from "@/components/admin-sign-out";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const mods = await prisma.mod.findMany({
    include: {
      _count: { select: { versions: true, downloads: true, purchases: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin</h1>
        <div className="flex gap-3">
          <Link
            href="/admin/mods/new"
            className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500"
          >
            New mod
          </Link>
          <AdminSignOut />
        </div>
      </div>

      <div className="mt-8 overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Versions</th>
              <th className="px-4 py-3 font-medium">Downloads</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {mods.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-zinc-500">
                  No mods yet.{" "}
                  <Link href="/admin/mods/new" className="text-violet-600 hover:underline">
                    Create one
                  </Link>
                </td>
              </tr>
            ) : (
              mods.map((mod) => (
                <tr key={mod.id}>
                  <td className="px-4 py-3 font-medium">{mod.title}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        mod.isPublished
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-zinc-200 text-zinc-600 dark:bg-zinc-800"
                      }`}
                    >
                      {mod.isPublished ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3">{formatPrice(mod.priceCents)}</td>
                  <td className="px-4 py-3">{mod._count.versions}</td>
                  <td className="px-4 py-3">{mod._count.downloads}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/mods/${mod.id}`}
                      className="text-violet-600 hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
