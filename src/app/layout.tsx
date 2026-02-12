import type { Metadata } from "next";
import "@/styles/globals.css";
import { ToastProvider } from "@/shared/components/ui/Toast";
import { AppProvider } from "@/shared/providers";

import { siteConfig } from "@/shared/config/seo";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: siteConfig.authors,
  creator: "Arteri Team",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@arteriproject",
  },
  icons: {
    icon: "/images/logo/ARTERI.webp",
    apple: "/images/logo/ARTERI.webp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col antialiased" suppressHydrationWarning>
        <AppProvider>
          <ToastProvider>{children}</ToastProvider>
        </AppProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: siteConfig.name,
              url: siteConfig.url,
              logo: `${siteConfig.url}/images/logo/ARTERI.webp`,
              description: siteConfig.description,
              sameAs: [
                "https://twitter.com/arteriproject",
                "https://facebook.com/arteriproject",
                "https://linkedin.com/company/arteriproject",
              ],
            }),
          }}
        />
      </body>
    </html>
  );
}
