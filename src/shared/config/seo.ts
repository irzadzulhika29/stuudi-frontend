export const siteConfig = {
  name: "Arteri",
  description:
    "Platform adaptif berbasis gamifikasi untuk pelatihan tim modern dan penyelenggaraan olimpiade berskala masif.",
  url: process.env.NEXT_PUBLIC_BASE_URL || "https://arteri.project",
  ogImage: "/images/og-image.jpg",
  keywords: [
    "pembelajaran",
    "olimpiade",
    "gamifikasi",
    "pelatihan",
    "pendidikan",
    "arteri",
    "tim modern",
    "kompetisi online",
  ],
  authors: [
    {
      name: "Arteri Team",
      url: process.env.NEXT_PUBLIC_BASE_URL || "https://arteri.project",
    },
  ],
};

export type SiteConfig = typeof siteConfig;
