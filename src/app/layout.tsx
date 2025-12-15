import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stuudi - Platform Pembelajaran & Olimpiade",
  description:
    "Platform adaptif berbasis gamifikasi untuk pelatihan tim modern dan penyelenggaraan olimpiade berskala masif.",
  keywords: [
    "pembelajaran",
    "olimpiade",
    "gamifikasi",
    "pelatihan",
    "pendidikan",
  ],
  authors: [{ name: "Stuudi Team" }],
  openGraph: {
    title: "Stuudi - Platform Pembelajaran & Olimpiade",
    description:
      "Platform adaptif berbasis gamifikasi untuk pelatihan tim modern dan penyelenggaraan olimpiade berskala masif.",
    type: "website",
    locale: "id_ID",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
