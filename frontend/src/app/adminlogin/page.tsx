import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/backend";
import LoginForm from "./LoginForm";
import { getSettings } from "@/lib/data";
import Rings from "@/components/site/Rings";

export const metadata: Metadata = { title: "Admin login", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await getCurrentAdmin()) redirect("/admin");
  const s = await getSettings();
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-brand-50 via-white to-gold-50 px-4 py-12">
      <Rings className="absolute -top-24 -left-24 h-96 w-96" />
      <Rings className="absolute -right-24 -bottom-24 h-96 w-96" />
      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          {s.logo?.url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={s.logo.url} alt="" className="mx-auto mb-4 h-16 w-auto object-contain" />
          )}
          <h1 className="font-display text-3xl font-semibold text-ink">Admin login</h1>
          <p className="mt-1 text-muted">{s.siteName}</p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
