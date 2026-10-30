import Link from "next/link";
import Rings from "@/components/site/Rings";

export const metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-brand-50 to-white px-6 text-center">
      <Rings className="absolute top-1/2 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2" />
      <div className="relative">
        <p className="font-display text-8xl font-semibold text-brand">404</p>
        <h1 className="h-display mt-4 text-3xl">This page took a different path</h1>
        <p className="mx-auto mt-3 max-w-md text-muted">The page you are looking for doesn’t exist or has moved.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-primary">Back to home</Link>
          <Link href="/contact" className="btn-outline">Contact us</Link>
        </div>
      </div>
    </main>
  );
}
