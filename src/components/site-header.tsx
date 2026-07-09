import { auth } from "@/lib/auth";
import { SiteHeaderNav } from "@/components/site-header-nav";

export async function SiteHeader() {
  const session = await auth();
  return <SiteHeaderNav user={session?.user ?? null} />;
}
