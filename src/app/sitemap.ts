import { MetadataRoute } from "next";
import { siteConfig } from "@/shared/config/seo";

export default function sitemap(): MetadataRoute.Sitemap {
    const routes = [
        "",
        "/login",
        "/register",
        "/tentang-kami",
        "/faq",
        "/bantuan",
    ].map((route) => ({
        url: `${siteConfig.url}${route}`,
        lastModified: new Date().toISOString(),
        changeFrequency: "daily" as const,
        priority: route === "" ? 1 : 0.8,
    }));

    return [...routes];
}
