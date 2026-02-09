import { MetadataRoute } from "next";
import { siteConfig } from "@/shared/config/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/login", "/produk", "/tentang-kami"].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : route === "/login" ? 0.9 : 0.7,
  }));

  return [...routes];
}
