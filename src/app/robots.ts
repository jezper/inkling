import type { MetadataRoute } from "next";

// Nedlagd tjänst: håll den utanför sökresultaten.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", disallow: "/" }],
  };
}
