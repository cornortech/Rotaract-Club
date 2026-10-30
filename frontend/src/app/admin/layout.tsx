import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/backend";
import { getSettings } from "@/lib/data";
import AdminShell from "@/components/admin/AdminShell";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/adminlogin");
  const s = await getSettings();
  return (
    <AdminShell email={admin.email} siteName={s.siteName} logo={s.logo?.url}>
      {children}
    </AdminShell>
  );
}
