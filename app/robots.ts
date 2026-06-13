import type { MetadataRoute } from "next";

import { BASE_URL } from "@/lib/seo";



export default function robots(): MetadataRoute.Robots {

  return {

    rules: {

      userAgent: "*",

      allow: "/",

      disallow: ["/match-reference.html", "/prompt-tool.html"],

    },

    sitemap: `${BASE_URL}/sitemap.xml`,

  };

}


