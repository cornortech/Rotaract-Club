import type { Metadata, Viewport } from "next";
import "@fontsource-variable/plus-jakarta-sans";
import "@fontsource-variable/fraunces";
import "./globals.css";
import { getSettings } from "@/lib/data";
import { siteUrl } from "@/lib/utils";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  const og = s.seo.ogImage?.url || s.heroImage?.url;
  return {
    metadataBase: new URL(siteUrl()),
    title: { default: s.seo.title || s.siteName, template: `%s | ${s.siteName}` },
    description: s.seo.description,
    keywords: s.seo.keywords?.split(",").map((k) => k.trim()).filter(Boolean),
    applicationName: s.siteName,
    authors: [{ name: s.siteName }],
    creator: s.siteName,
    alternates: { canonical: "/" },
    icons: s.logo?.url ? { icon: s.logo.url, apple: s.logo.url } : undefined,
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: s.siteName,
      title: s.seo.title || s.siteName,
      description: s.seo.description,
      url: "/",
      images: og ? [{ url: og, width: 1200, height: 630, alt: s.siteName }] : undefined,
    },
    twitter: { card: "summary_large_image", title: s.seo.title || s.siteName, description: s.seo.description, images: og ? [og] : undefined },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
    formatDetection: { telephone: false },
  };
}

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Enables the reveal-on-scroll animation only when JS runs */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
