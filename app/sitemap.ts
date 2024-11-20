import type { MetadataRoute } from "next";
import { readdirSync } from "fs";
import path from "path";

const contentDir = path.join(process.cwd(), "app/main/blog/content");

export const getBlogPosts = async (): Promise<MetadataRoute.Sitemap[0][]> => {
  const categories = readdirSync(contentDir);
  const posts = await Promise.all(
    categories.flatMap((category) => {
      const postFiles = readdirSync(path.join(contentDir, category));
      return postFiles.map(async (postFile) => {
        const { metadata } = await import(`@/app/main/blog/content/${category}/${postFile}`);
        return {
          url: `https://qryptic.io/blog/${category}/${postFile.replace(".mdx", "")}`,
          lastModified: new Date(metadata.updatedAt ? metadata.updatedAt : metadata.date),
          changeFrequency: "monthly" as const,
          priority: metadata.priority ?? 0.6,
        };
      });
    }),
  );

  return posts;
};

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  // get blog posts
  const posts: MetadataRoute.Sitemap[0][] = await getBlogPosts();

  return [
    {
      url: "https://qryptic.io",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://qryptic.io/pricing",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: "https://qryptic.io/contact",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.6,
    },
    {
      url: "https://qryptic.io/legal/privacy",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: "https://qryptic.io/legal/terms",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: "https://qryptic.io/blog",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...posts,
  ];
};

export default sitemap;
