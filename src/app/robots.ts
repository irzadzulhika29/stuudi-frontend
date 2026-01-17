import { MetadataRoute } from "next";
import { siteConfig } from "@/shared/config/seo";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/api/", "/dashboard/", "/courses/"],
        },
        sitemap: `${siteConfig.url}/sitemap.xml`,
    };
}
